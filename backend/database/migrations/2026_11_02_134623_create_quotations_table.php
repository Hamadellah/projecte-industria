<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // L-client li tlob l-devis
            $table->string('quotation_number')->unique(); // Ex: DEV-2026-0001
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending'); // Halat l-devis
            $table->decimal('total', 10, 2); // Montant total dyal l-devis
            $table->text('notes')->nullable(); // Remarques
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};