<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // حيدنا 'payments' من هنا
        $query = Order::with(['user', 'orderItems.product', 'invoice'])->latest();

        // 1. Filtrer par état (status)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // 2. Filtrer par date (date_from w date_to)
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('created_at', [
                $request->date_from . ' 00:00:00',
                $request->date_to . ' 23:59:59'
            ]);
        }

        return response()->json($query->paginate(20));
    }

    public function show(int $id): JsonResponse
    {
        // وحيدنا 'payments' حتى من هنا
        $order = Order::with(['user', 'orderItems.product', 'invoice'])->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        // Créer une facture automatiquement si la commande passe en processing/shipped/delivered et n'a pas encore de facture
        if (in_array($validated['status'], ['processing', 'shipped', 'delivered']) && !$order->invoice) {
            Invoice::create([
                'order_id'       => $order->id,
                'invoice_number' => 'FAC-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                'subtotal'       => $order->subtotal ?? 0,
                'tax_amount'     => ($order->subtotal ?? 0) * 0.20, // TVA 20%
                'delivery_fee'   => $order->delivery_fee ?? 0,
                'total'          => $order->total ?? 0,
                'status'         => 'unpaid',
            ]);
        }

        // Vider le cache du Dashboard Admin pour mettre à jour les statistiques
        Cache::forget('admin_dashboard_stats');

        return response()->json([
            'message' => 'Order status updated successfully',
            'order'   => $order->load('invoice'),
        ]);
    }
}