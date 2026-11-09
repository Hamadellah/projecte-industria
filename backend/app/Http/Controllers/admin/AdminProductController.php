<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->get('page', 1);
        $stockMin = $request->get('stock_min', 'all');
        $cacheKey = "admin_products_page_{$page}_stock_{$stockMin}";

        // Cache dyal la liste dyal les produits f admin l-mouddat 60 minutes
        $products = Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = Product::with(['category', 'supplier', 'productImages', 'productSpecifications'])->latest();

            // Filtrer b quantity wla status ila t-lbo
            if ($request->filled('stock_min')) {
                $query->where('stock_quantity', '>=', $request->stock_min);
            }

            return $query->paginate(20);
        });

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name' => 'required|string|max:150',
            'reference' => 'required|string|max:100|unique:products',
            'slug' => 'required|string|max:150|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'is_active' => 'boolean',
            // Validation dyal les fichiers dyal l-images
            'images' => 'nullable|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Kol image khassa tkoun fichier s-hih
            'specifications' => 'nullable|array',
            'specifications.*.name' => 'required|string|max:100',
            'specifications.*.value' => 'required|string|max:255',
        ]);

        $product = DB::transaction(function () use ($request, $validated) {
            // Ncreew l-produit b l-informations okhra (bla images f direct)
            $productData = collect($validated)->except(['images', 'specifications'])->toArray();
            $product = Product::create($productData);

            // Traitement w stockage dyal les images lli t-uploadaw k files
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $imageFile) {
                    // N-stokiw l-image f public storage (storage/app/public/products)
                    $path = $imageFile->store('products', 'public');

                    $product->productImages()->create([
                        'image_path' => $path,
                        'is_main' => $index === 0 ? true : false, // La première image tkon hiya l-principale
                        'position' => $index + 1,
                    ]);
                }
            }

            if (! empty($validated['specifications'])) {
                $product->productSpecifications()->createMany($validated['specifications']);
            }

            return $product->load(['category', 'supplier', 'productImages', 'productSpecifications']);
        });

        // Vider l-cache dyal les produits w l-dashboard stats
        $this->clearProductCaches();

        return response()->json($product, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name' => 'sometimes|string|max:150',
            'reference' => 'sometimes|string|max:100|unique:products,reference,' . $id,
            'slug' => 'sometimes|string|max:150|unique:products,slug,' . $id,
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'is_active' => 'boolean',
            // Optional images f l-update
            'images' => 'nullable|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        DB::transaction(function () use ($request, $product, $validated) {
            $productData = collect($validated)->except(['images'])->toArray();
            $product->update($productData);

            // Ila t-uploadaw images jdidad f l-update
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $imageFile) {
                    $path = $imageFile->store('products', 'public');

                    $product->productImages()->create([
                        'image_path' => $path,
                        'is_main' => false,
                        'position' => $product->productImages()->count() + $index + 1,
                    ]);
                }
            }
        });

        // Vider l-cache dyal les produits w l-dashboard stats
        $this->clearProductCaches();

        return response()->json($product->load(['category', 'supplier', 'productImages', 'productSpecifications']));
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        
        // Optionnel: n-ms7o les fichiers dyal l-images mn storage mli t-ms7 l-produit
        foreach ($product->productImages as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $product->delete();

        // Vider l-cache dyal les produits w l-dashboard stats
        $this->clearProductCaches();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * Helper function bach t-ms7 ga3 l-cache li m-rbtab b products w dashboard stats.
     */
    private function clearProductCaches(): void
    {
        Cache::forget('admin_dashboard_stats');
        Cache::flush(); 
    }
}