<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminInvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->get('page', 1);
        $status = $request->get('status', 'all');
        $cacheKey = "admin_invoices_page_{$page}_status_{$status}";

        // Cache dyal les factures l-mouddat 60 minutes
        $invoices = Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = Invoice::with(['order.user'])->latest();

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            return $query->paginate(20);
        });

        return response()->json($invoices);
    }

    public function show(int $id): JsonResponse
    {
        $invoice = Invoice::with(['order.user', 'order.orderItems.product'])->findOrFail($id);
        return response()->json($invoice);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:unpaid,paid,cancelled',
        ]);

        $invoice = Invoice::findOrFail($id);
        $invoice->update(['status' => $validated['status']]);

        // Vider l-cache dyal invoices w dashboard stats
        $this->clearInvoiceCaches();

        return response()->json([
            'message' => 'Invoice status updated successfully',
            'invoice' => $invoice
        ]);
    }

    /**
     * Helper function bach t-ms7 cache dyal invoices w dashboard.
     */
    private function clearInvoiceCaches(): void
    {
        Cache::forget('admin_dashboard_stats');
        Cache::flush();
    }
}