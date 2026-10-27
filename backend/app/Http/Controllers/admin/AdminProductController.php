<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with(['category', 'productImages', 'productSpecifications'])
            ->latest()
            ->paginate(20);

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
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

        return DB::transaction(function () use ($validated) {
            $product = Product::create($validated);

            if (! empty($validated['images'])) {
                $product->productImages()->createMany($validated['images']);
            }

            if (! empty($validated['specifications'])) {
                $product->productSpecifications()->createMany($validated['specifications']);
            }

            return response()->json($product->load(['productImages', 'productSpecifications']), 201);
        });
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:150',
            'reference' => 'sometimes|string|max:100|unique:products,reference,' . $id,
            'slug' => 'sometimes|string|max:150|unique:products,slug,' . $id,
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(int $id): JsonResponse
    {
        Product::findOrFail($id)->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}