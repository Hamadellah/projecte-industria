<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminInvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['order.user'])->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
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

        return response()->json([
            'message' => 'Invoice status updated successfully',
            'invoice' => $invoice
        ]);
    }
}