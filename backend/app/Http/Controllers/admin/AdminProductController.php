<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->get('page', 1);$stockMin = $request->get('stock_min', 'all');$cacheKey = "admin_products_page_{$page}_stock_{$stockMin}";

        $products = Cache::remember($cacheKey, 3600, function () use ($request) {$query = Product::with(['category', 'supplier', 'productImages', 'productSpecifications'])->latest();

            if ($request->filled('stock_min')) {
                $query->where('stock_quantity', '>=',$request->stock_min);
            }

            return $query->paginate(20);
        });

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $validated =$request->validate([
            'category_id'    => 'required|exists:categories,id',
            'supplier_id'    => 'nullable|exists:suppliers,id',
            'name'           => 'required|string|max:150',
            'reference'      => 'required|string|max:100|unique:products',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'is_active'      => 'required',
            'images'         => 'nullable|array',
            'images.*'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'specifications' => 'nullable',
        ]);

        $product = DB::transaction(function () use ($request,$validated) {
            $productData = collect($validated)->except(['images', 'specifications'])->toArray();
            
            // Genri slug random w unique automatically mn l-name
            $productData['slug'] = Str::slug($validated['name']) . '-' . uniqid();
            
            $productData['is_active'] = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);

            $product = Product::create($productData);

            // Storage dyal les images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as$index => $imageFile) {$path = $imageFile->store('products', 'public');$product->productImages()->create([
                        'image_path' => $path,
                        'is_main'    => $index === 0, 'position'   =>$index + 1,
                    ]);
                }
            }

            // Storage dyal specifications
            $specs =$request->input('specifications');
            if (!empty($specs)) {
                if (is_string($specs)) {
                    $specs = json_decode($specs, true);
                }
                if (is_array($specs)) {
                    foreach ($specs as$spec) {
                        if (!empty($spec['name']) && !empty($spec['value'])) {$product->productSpecifications()->create([
                                'name'  => $spec['name'],
                                'value' => $spec['value'],
                            ]);
                        }
                    }
                }
            }

            return $product->load(['category', 'supplier', 'productImages', 'productSpecifications']);
        });

        $this->clearProductCaches();

        return response()->json($product, 201);
    }

    public function update(Request $request, int$id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated =$request->validate([
            'category_id'    => 'sometimes|exists:categories,id',
            'supplier_id'    => 'nullable|exists:suppliers,id',
            'name'           => 'sometimes|string|max:150',
            'reference'      => 'sometimes|string|max:100|unique:products,reference,' . $id,
            'description'    => 'nullable|string',
            'price'          => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'is_active'      => 'sometimes',
            'images'         => 'nullable|array',
            'images.*'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        DB::transaction(function () use ($request, $product,$validated) {
            $productData = collect($validated)->except(['images'])->toArray();
            
            if (isset($validated['name'])) {
                $productData['slug'] = Str::slug($validated['name']) . '-' . uniqid();
            }

            if ($request->has('is_active')) {
                $productData['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
            }

            $product->update($productData);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as$index => $imageFile) {$path = $imageFile->store('products', 'public');$product->productImages()->create([
                        'image_path' => $path,
                        'is_main'    => false,
                        'position'   => $product->productImages()->count() +$index + 1,
                    ]);
                }
            }
        });

        $this->clearProductCaches();

        return response()->json($product->load(['category', 'supplier', 'productImages', 'productSpecifications']));
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        foreach ($product->productImages as$img) {
            Storage::disk('public')->delete($img->image_path);
        }

        $product->delete();

        $this->clearProductCaches();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    private function clearProductCaches(): void
    {
        Cache::forget('admin_dashboard_stats');
        Cache::flush();
    }
}