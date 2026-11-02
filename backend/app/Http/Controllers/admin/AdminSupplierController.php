<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSupplierController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Supplier::withCount('products')->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'contact_person' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:150',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'ice' => 'nullable|string|max:50',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json($supplier, 201);
    }

    public function show(int $id): JsonResponse
    {
        $supplier = Supplier::with('products')->findOrFail($id);
        return response()->json($supplier);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'contact_person' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:150',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'ice' => 'nullable|string|max:50',
        ]);

        $supplier->update($validated);

        return response()->json($supplier);
    }

    public function destroy(int $id): JsonResponse
    {
        Supplier::findOrFail($id)->delete();
        return response()->json(['message' => 'Supplier deleted successfully']);
    }
}