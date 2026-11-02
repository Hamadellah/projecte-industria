<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Création des utilisateurs de test (Admin & Client)
        User::updateOrCreate(
            ['email' => 'admin@industria.com'],
            [
                'name' => 'Admin Industria',
                'password' => Hash::make('password123'),
                'phone' => '+212600000000',
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@industria.com'],
            [
                'name' => 'Hamza Client',
                'password' => Hash::make('password123'),
                'phone' => '+212611111111',
                'role' => 'customer',
            ]
        );

        // 2. Appel des autres seeders (Categories w Products)
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}