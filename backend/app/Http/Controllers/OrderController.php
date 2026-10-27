<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $cart = $request->user()
            ->cart()
            ->with('cartItems.product')
            ->first();

        if (!$cart || $cart->cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty.',
            ], 422);
        }

        $order = DB::transaction(function () use ($request, $validated, $cart) {
            $subtotal = 0;
            $items = [];

            foreach ($cart->cartItems as $cartItem) {
                $product = Product::whereKey($cartItem->product_id)
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->first();

                if (
                    !$product ||
                    $cartItem->quantity > $product->stock_quantity
                ) {
                    throw new \RuntimeException(
                        'A product is unavailable or has insufficient stock.'
                    );
                }

                $price = (float) $product->price;
                $subtotal += $price * $cartItem->quantity;

                $items[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_reference' => $product->reference,
                    'unit_price' => $price,
                    'quantity' => $cartItem->quantity,
                ];
            }

            $subtotal = round($subtotal, 2);
            $deliveryFee = 0;

            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_number' => 'ORD-' . Str::upper(Str::random(12)),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'total' => round($subtotal + $deliveryFee, 2),
                'recipient_name' => $validated['recipient_name'],
                'phone' => $validated['phone'],
                'city' => $validated['city'],
                'address' => $validated['address'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($items as $item) {
                $order->orderItems()->create($item);

                Product::whereKey($item['product_id'])
                    ->decrement('stock_quantity', $item['quantity']);
            }

            $cart->cartItems()->delete();

            return $order;
        });

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order->load('orderItems'),
        ], 201);
    }

    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('orderItems')
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, int $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->with('orderItems')
            ->findOrFail($id);

        return response()->json([
            'order' => $order,
        ]);
    }
}
