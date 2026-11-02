<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role', // customer, admin
        // --- ZIYADA DYAL B2B DETAILS ---
        'company_name',
        'ice',
        'address',
        'city',
    ];

    // ... code auth...

    /**
     * Relation: Un client a plusieurs commandes.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // --- Jdid: Relation m3a les devis ---
    /**
     * Relation: Un client a plusieurs devis.
     */
    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class);
    }
}