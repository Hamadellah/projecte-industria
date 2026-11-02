<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['user', 'orderItems.product', 'payments'])->latest();

        // 1. Filtrer par état (status)
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // 2. Filtrer par date (date_from w date_to)
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('created_at', [$request->date_from, $request->date_to]);
        }

        return response()->json($query->paginate(20));
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with(['user', 'orderItems.product', 'payments', 'invoice'])->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        // Automatiquement ila t-delivered wla processing, n9dro ncreew invoice ila makantch
        if (in_array($validated['status'], ['processing', 'shipped', 'delivered']) && !$order->invoice) {
            \App\Models\Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => 'FAC-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                'subtotal' => $order->subtotal,
                'tax_amount' => $order->subtotal * 0.20, // TVA 20% mitalan
                'delivery_fee' => $order->delivery_fee,
                'total' => $order->total,
                'status' => 'unpaid'
            ]);
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load('invoice')
        ]);
    }
}