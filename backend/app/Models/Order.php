<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status', // pending, processing, shipped, delivered, cancelled
        'subtotal',
        'tax_amount',
        'delivery_fee',
        'total',
        'recipient_name',
        'phone',
        'address',
        'city',
        'notes',
    ];

    // ... relations user, items ...

    // --- Jdid: Relation m3a la facture ---
    /**
     * Relation: Une commande a une seule facture.
     */
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}