<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Zid gha les colonnes li makayninch wla bghiti t-zdiHom
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin', 'customer'])->default('customer')->after('email');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 20)->nullable()->after('password');
            }
            $table->string('company_name')->nullable()->after('role');
            $table->string('ice')->nullable()->after('company_name');
            $table->string('address')->nullable()->after('ice');
            $table->string('city')->nullable()->after('address');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'ice', 'address', 'city']);
            // Ila bghiti t-7yd ta role w phone ila t-zadaw:
            // $table->dropColumn(['role', 'phone']);
        });
    }
};