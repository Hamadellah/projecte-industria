<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quotation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminQuotationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->get('page', 1);
        $status = $request->get('status', 'all');
        $cacheKey = "admin_quotations_page_{$page}_status_{$status}";

        // Cache dyal les devis l-mouddat 60 minutes
        $quotations = Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = Quotation::with(['user', 'quotationItems.product'])->latest();

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            return $query->paginate(20);
        });

        return response()->json($quotations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'quotation_number' => 'required|string|max:100|unique:quotations',
            'status' => 'required|string|in:pending,accepted,rejected',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        $quotation = DB::transaction(function () use ($validated) {
            $quotation = Quotation::create([
                'user_id' => $validated['user_id'],
                'quotation_number' => $validated['quotation_number'],
                'status' => $validated['status'],
                'total' => $validated['total'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $quotation->quotationItems()->create($item);
            }

            return $quotation->load(['user', 'quotationItems.product']);
        });

        // Vider l-cache dyal quotations w dashboard stats
        $this->clearQuotationCaches();

        return response()->json($quotation, 201);
    }

    public function show(int $id): JsonResponse
    {
        $quotation = Quotation::with(['user', 'quotationItems.product'])->findOrFail($id);
        return response()->json($quotation);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,accepted,rejected',
        ]);

        $quotation = Quotation::findOrFail($id);
        $quotation->update(['status' => $validated['status']]);

        // Vider l-cache
        $this->clearQuotationCaches();

        return response()->json([
            'message' => 'Quotation status updated successfully',
            'quotation' => $quotation
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Quotation::findOrFail($id)->delete();

        // Vider l-cache
        $this->clearQuotationCaches();

        return response()->json(['message' => 'Quotation deleted successfully']);
    }

    /**
     * Helper function bach t-ms7 cache dyal quotations w dashboard.
     */
    private function clearQuotationCaches(): void
    {
        Cache::forget('admin_dashboard_stats');
        Cache::flush();
    }
}