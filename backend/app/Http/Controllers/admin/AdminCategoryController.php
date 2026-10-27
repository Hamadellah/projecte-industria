<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Category::withCount('products')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:150|unique:categories',
            'image' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'slug' => 'sometimes|string|max:150|unique:categories,slug,' . $id,
            'image' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy(int $id): JsonResponse
    {
        Category::findOrFail($id)->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}