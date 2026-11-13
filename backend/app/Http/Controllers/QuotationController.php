<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
public function getClientProductQuotations(Request $request, int $productId)
{
    // جيب كاع الـ Devises التي تحتوى على هاد المنتج بلا ما نحتاجو user_id
    $quotations = Quotation::whereHas('quotationItems', function ($query) use ($productId) {
            $query->where('product_id', $productId);
        })
        ->with('quotationItems')
        ->latest()
        ->get();

    return response()->json([
        'quotations' => $quotations
    ]);
}
}