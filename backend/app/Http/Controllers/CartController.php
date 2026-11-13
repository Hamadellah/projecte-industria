<?php
namespace App\Http\Controllers;


use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    // Récupérer ou créer le panier de l'utilisateur connecté
    private function getCart(Request $request): Cart
    {
        return Cart::firstOrCreate([
            'user_id' => $request->user()->id,
        ]);
    }

    // Afficher le panier
    public function index(Request $request)
    {
        $cart = $this->getCart($request)->load(
            'cartItems.product.category',
            'cartItems.product.productImages'
        );

        $items = $cart->cartItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'reference' => $item->product->reference,
                'price' => (float) $item->product->price,
                'quantity' => $item->quantity,
                'subtotal' => round(
                    (float) $item->product->price * $item->quantity,
                    2
                ),
            ];
        });

        return response()->json([
            'cart_id' => $cart->id,
            'items' => $items,
            'total' => round($items->sum('subtotal'), 2),
        ]);
    }

    // Ajouter un produit au panier
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],
            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        $product = Product::where('is_active', true)
            ->findOrFail($validated['product_id']);

        $cart = $this->getCart($request);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        $newQuantity = ($item?->quantity ?? 0)
            + $validated['quantity'];

        if ($newQuantity > $product->stock_quantity) {
            return response()->json([
                'message' => 'Not enough stock available.',
                'available_stock' => $product->stock_quantity,
            ], 422);
        }

        if ($item) {
            $item->update([
                'quantity' => $newQuantity,
            ]);
        } else {
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart successfully.',
            'cart_item' => $item->load('product'),
        ], 201);
    }

    // Synchroniser le panier Guest après Login
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],

            'items.*.product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        try {
            DB::transaction(function () use ($request, $validated) {

                $cart = $this->getCart($request);

                // Regrouper les produits identiques
                $groupedItems = collect($validated['items'])
                    ->groupBy('product_id');

                foreach ($groupedItems as $productId => $group) {

                    $quantity = $group->sum('quantity');

                    // Vérifier le produit et verrouiller sa ligne
                    $product = Product::where('is_active', true)
                        ->whereKey($productId)
                        ->lockForUpdate()
                        ->first();

                    if (!$product) {
                        throw new \RuntimeException(
                            'A product is unavailable.'
                        );
                    }

                    // Chercher le produit dans le panier utilisateur
                    $cartItem = CartItem::where('cart_id', $cart->id)
                        ->where('product_id', $product->id)
                        ->lockForUpdate()
                        ->first();

                    $newQuantity = ($cartItem?->quantity ?? 0)
                        + $quantity;

                    // Vérifier le stock
                    if ($newQuantity > $product->stock_quantity) {
                        throw new \RuntimeException(
                            'Not enough stock for: ' . $product->name
                        );
                    }

                    // Mettre à jour ou créer la ligne du panier
                    if ($cartItem) {
                        $cartItem->update([
                            'quantity' => $newQuantity,
                        ]);
                    } else {
                        CartItem::create([
                            'cart_id' => $cart->id,
                            'product_id' => $product->id,
                            'quantity' => $quantity,
                        ]);
                    }
                }
            });

            return response()->json([
                'message' => 'Guest cart synchronized successfully.',
            ]);

        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // Modifier la quantité
    public function update(Request $request, CartItem $item)
    {
        $validated = $request->validate([
            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        $cart = $this->getCart($request);

        if ($item->cart_id !== $cart->id) {
            return response()->json([
                'message' => 'Cart item not found.',
            ], 404);
        }

        $product = Product::findOrFail($item->product_id);

        if ($validated['quantity'] > $product->stock_quantity) {
            return response()->json([
                'message' => 'Not enough stock available.',
                'available_stock' => $product->stock_quantity,
            ], 422);
        }

        $item->update([
            'quantity' => $validated['quantity'],
        ]);

        return response()->json([
            'message' => 'Quantity updated successfully.',
            'cart_item' => $item->load('product'),
        ]);
    }

    // Supprimer un produit
    public function destroy(Request $request, CartItem $item)
    {
        $cart = $this->getCart($request);

        if ($item->cart_id !== $cart->id) {
            return response()->json([
                'message' => 'Cart item not found.',
            ], 404);
        }

        $item->delete();

        return response()->json([
            'message' => 'Product removed from cart successfully.',
        ]);
    }

    // Vider le panier
    public function clear(Request $request)
    {
        $cart = $this->getCart($request);

        $cart->cartItems()->delete();

        return response()->json([
            'message' => 'Cart cleared successfully.',
        ]);
    }
}
