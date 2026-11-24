<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminSupplierController extends Controller
{
    public function index(): JsonResponse
    {
        // Cache dyal les fournisseurs l-mouddat 60 minutes
        $suppliers = Cache::remember('admin_suppliers_all', 3600, function () {
            return Supplier::withCount('products')->latest()->get();
        });

        return response()->json($suppliers);
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

        // Vider l-cache dyal suppliers w dashboard stats
        $this->clearSupplierCaches();

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

        // Vider l-cache dyal suppliers w dashboard stats
        $this->clearSupplierCaches();

        return response()->json($supplier);
    }

    public function destroy(int $id): JsonResponse
    {
        Supplier::findOrFail($id)->delete();

        // Vider l-cache dyal suppliers w dashboard stats
        $this->clearSupplierCaches();

        return response()->json(['message' => 'Supplier deleted successfully']);
    }

    /**
     * Helper function bach t-ms7 cache dyal suppliers w dashboard.
     */
    private function clearSupplierCaches(): void
    {
        Cache::forget('admin_dashboard_stats');
        Cache::flush();
    }
}