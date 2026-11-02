<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {
        // Ila kan status khedam string w bghiti trddo enum, kankhdmo b change() (khas ykon doctrine/dbal) wla kandiro drop w n-3awdo zido:
        if (Schema::hasColumn('orders', 'status')) {
            $table->dropColumn('status');
        }
    });

    Schema::table('orders', function (Blueprint $table) {
        $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending')->after('order_number');
    });
}

public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropColumn('status');
        $table->string('status', 50)->default('pending');
    });
}
};
