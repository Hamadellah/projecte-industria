<?php
namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
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

    // Relation avec les produits de la commande
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Relation avec la facture
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    // Relation avec le client
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
