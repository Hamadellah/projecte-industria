<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Quotation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'nullable|integer|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'name'       => 'required|string|max:150',
            'email'      => 'required|email|max:150',
            'phone'      => 'required|string|max:50',
            'company'    => 'nullable|string|max:150',
            'notes'      => 'nullable|string',
        ]);

        $quotation = DB::transaction(function () use ($request, $validated) {
            $product = !empty($validated['product_id'])
                ? Product::find($validated['product_id'])
                : null;

            $quantity = (int) $validated['quantity'];
            $unitPrice = $product ? (float) $product->price : 0.0;
            $subtotal = $unitPrice * $quantity;

            $quotation = Quotation::create([
                'user_id'          => $request->user()?->id,
                'quotation_number' => 'DEV-' . strtoupper(uniqid()),
                'client_name'      => $validated['name'],
                'client_email'     => $validated['email'],
                'client_phone'     => $validated['phone'],
                'company_name'     => $validated['company'] ?? null,
                'notes'            => $validated['notes'] ?? null,
                'status'           => 'pending',
                'total'            => $subtotal,
            ]);

            if ($product) {
                $quotation->quotationItems()->create([
                    'product_id' => $product->id,
                    'quantity'   => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal'   => $subtotal,
                ]);
            }

            return $quotation->load('quotationItems');
        });

        return response()->json([
            'message'   => 'Demande de devis enregistrée avec succès.',
            'quotation' => $quotation,
        ], 201);
    }

    public function getClientProductQuotations(int $productId): JsonResponse
    {
        $quotations = Quotation::whereHas('quotationItems', function ($query) use ($productId) {
            $query->where('product_id', $productId);
        })
            ->with('quotationItems')
            ->latest()
            ->get();

        return response()->json([
            'quotations' => $quotations,
        ]);
    }
}