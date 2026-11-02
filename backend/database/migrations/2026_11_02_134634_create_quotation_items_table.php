<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quotation_id')->constrained()->onDelete('cascade'); // M-rbtab b l-devis
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); // L-produit
            $table->integer('quantity'); // La quantité
            $table->decimal('unit_price', 10, 2); // Prix unitaire f dik l-wqt
            $table->decimal('subtotal', 10, 2); // Quantity * Unit Price
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotation_items');
    }
};