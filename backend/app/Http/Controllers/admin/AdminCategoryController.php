<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

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
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:categories',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Validation dyal l-file dyal l-image
        ]);

        $categoryData = collect($validated)->except(['image'])->toArray();

        // Traitement w stockage dyal l-image ila t-uploadat
        if ($request->hasFile('image')) {
            $categoryData['image'] = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create($categoryData);

        // Clear l-cache dyal Admin categories
        Cache::forget('admin_categories_all');
        Cache::forget('admin_dashboard_stats');

        return response()->json($category, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'slug' => 'sometimes|string|max:150|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $categoryData = collect($validated)->except(['image'])->toArray();

        // Ila t-uploadat image jdida f l-update
        if ($request->hasFile('image')) {
            // N-ms7o l-image l-qdima ila kant kat-khass l-hal
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $categoryData['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($categoryData);

        // Clear l-cache
        Cache::forget('admin_categories_all');
        Cache::forget('admin_dashboard_stats');

        return response()->json($category);
    }

    public function destroy($id): JsonResponse
    {
        $category = Category::findOrFail($id);

        // N-ms7 l-image mn storage ila kants m-stokiya
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        // Clear l-cache
        Cache::forget('admin_categories_all');
        Cache::forget('admin_dashboard_stats');

        return response()->json(['message' => 'Category deleted']);
    }
}