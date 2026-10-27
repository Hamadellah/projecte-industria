<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Création des utilisateurs de test (Admin & Client)
        $admin = User::create([
            'name' => 'Admin Industria',
            'email' => 'admin@industria.com',
            'password' => Hash::make('password123'),
            'phone' => '+212600000000',
            'role' => 'admin',
        ]);

        $customer = User::create([
            'name' => 'Hamza Client',
            'email' => 'customer@industria.com',
            'password' => Hash::make('password123'),
            'phone' => '+212611111111',
            'role' => 'customer',
        ]);

        // 2. Création des catégories
        $cat1 = Category::create([
            'name' => 'Outillage Professionnel',
            'slug' => 'outillage-professionnel',
            'description' => 'Outils robustes et performants pour les professionnels de l’industrie.',
            'image' => 'categories/outillage.jpg',
        ]);

        $cat2 = Category::create([
            'name' => 'Équipements de Sécurité',
            'slug' => 'equipements-de-securite',
            'description' => 'Équipements de protection individuelle (EPI) certifiés.',
            'image' => 'categories/securite.jpg',
        ]);

        // 3. Création des produits avec leurs images et spécifications
        $product1 = Product::create([
            'category_id' => $cat1->id,
            'name' => 'Perceuse Industrielle Heavy Duty',
            'reference' => 'IND-PERC-001',
            'slug' => 'perceuse-industrielle-heavy-duty',
            'description' => 'Perceuse haute performance pour travaux industriels intensifs.',
            'price' => 1500.00,
            'stock_quantity' => 25,
            'is_active' => true,
        ]);

        $product1->productImages()->createMany([
            ['image_path' => 'products/perceuse-1.jpg', 'is_main' => true, 'position' => 1],
            ['image_path' => 'products/perceuse-2.jpg', 'is_main' => false, 'position' => 2],
        ]);

        $product1->productSpecifications()->createMany([
            ['name' => 'Puissance', 'value' => '1,5 kW'],
            ['name' => 'Tension', 'value' => '230 V'],
            ['name' => 'Diamètre', 'value' => '63 mm'],
        ]);

        $product2 = Product::create([
            'category_id' => $cat2->id,
            'name' => 'Casque de Sécurité Renforcé',
            'reference' => 'IND-SEC-002',
            'slug' => 'casque-de-securite-renforce',
            'description' => 'Casque de protection robuste pour chantiers et usines.',
            'price' => 120.00,
            'stock_quantity' => 100,
            'is_active' => true,
        ]);

        $product2->productImages()->createMany([
            ['image_path' => 'products/casque-1.jpg', 'is_main' => true, 'position' => 1],
        ]);

        $product2->productSpecifications()->createMany([
            ['name' => 'Matière', 'value' => 'Polycarbonate haute densité'],
            ['name' => 'Norme', 'value' => 'EN 397'],
        ]);
    }
}