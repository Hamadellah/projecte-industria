<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with([
            'category',
            'productImages',
            'productSpecifications',
        ])
        ->where('is_active', true)
        ->get();

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        abort_unless($product->is_active, 404);

        return response()->json(
            $product->load([
                'category',
                'productImages',
                'productSpecifications',
            ])
        );
    }
}
