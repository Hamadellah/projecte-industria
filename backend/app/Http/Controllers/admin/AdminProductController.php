<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

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
            'supplier_id' => 'nullable|exists:suppliers,id', // Ziyadth dyal fournisseur
            'name' => 'required|string|max:150',
            'reference' => 'required|string|max:100|unique:products',
            'slug' => 'required|string|max:150|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*.image_path' => 'required|string',
            'images.*.is_main' => 'boolean',
            'images.*.position' => 'integer',
            'specifications' => 'nullable|array',
            'specifications.*.name' => 'required|string|max:100',
            'specifications.*.value' => 'required|string|max:255',
        ]);

        $product = DB::transaction(function () use ($validated) {
            $product = Product::create($validated);

            if (! empty($validated['images'])) {
                $product->productImages()->createMany($validated['images']);
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
        ]);

        $product->update($validated);

        // Vider l-cache dyal les produits w l-dashboard stats
        $this->clearProductCaches();

        return response()->json($product->load(['category', 'supplier']));
    }

    public function destroy(int $id): JsonResponse
    {
        Product::findOrFail($id)->delete();

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
        
        // 7it les pages kit-savaw b keys mokhtalifin, tqdr t-st3ml wildcard wla t-flushar cache files ila knti kat-st3ml file driver, 
        // Wla t-dir Artisan::call('cache:clear'); (Wla ghir Cache::flush();)
        Cache::flush(); 
    }
}