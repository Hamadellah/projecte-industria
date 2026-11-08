<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class AdminCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        // Cache l-mouddat 24h
        $categories = Cache::remember('admin_categories_all', 86400, function () {
            return Category::withCount('products')->get();
        });

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        // Validation & Creation code...
        $category = Category::create($request->all());

        // Clear l-cache dyal Admin categories mli y-tzad chi category jdid
        Cache::forget('admin_categories_all');

        return response()->json($category, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->update($request->all());

        // Clear l-cache
        Cache::forget('admin_categories_all');

        return response()->json($category);
    }

    public function destroy($id): JsonResponse
    {
        Category::findOrFail($id)->delete();

        // Clear l-cache
        Cache::forget('admin_categories_all');

        return response()->json(['message' => 'Category deleted']);
    }
}