<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // Cache dyal l-stats l-mouddat 15 minutes (900 seconds) khas ghir b l-admin
        $stats = Cache::remember('admin_dashboard_stats', 900, function () {
            return [
                'total_users' => User::count(),
                'total_products' => Product::count(),
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'total_revenue' => Order::where('status', 'delivered')->sum('total'),
                'unpaid_invoices' => Invoice::where('status', 'unpaid')->count(),
            ];
        });

        return response()->json($stats);
    }
}