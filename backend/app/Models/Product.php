<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        // --- ZIYADA DYAL FOURNISSEUR ---
        'supplier_id',
        'name',
        'reference',
        'slug',
        'description',
        'price',
        'stock_quantity',
        'is_active',
    ];

    // ... relations category, images ...

    // --- Jdid: Relation m3a fournisseur ---
    /**
     * Relation: Un produit appartient à un fournisseur.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}