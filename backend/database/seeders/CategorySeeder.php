<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Outillage Professionnel',
                'description' => 'Outils robustes et performants pour les professionnels de l’industrie.',
                'image' => 'categories/outillage.jpg',
            ],
            [
                'name' => 'Équipements de Sécurité',
                'description' => 'Équipements de protection individuelle (EPI) certifiés.',
                'image' => 'categories/securite.jpg',
            ],
            [
                'name' => 'Pumps',
                'description' => 'Pumps and extraction equipment for wells and industrial use.',
                'image' => 'categories/pumps.jpg',
            ],
            [
                'name' => 'Pipes and Fittings',
                'description' => 'Durable pipes, casings, and connectors for construction.',
                'image' => 'categories/pipes.jpg',
            ],
            [
                'name' => 'Drilling Equipment',
                'description' => 'High-quality drill bits and machinery for drilling.',
                'image' => 'categories/drilling.jpg',
            ],
            [
                'name' => 'Accessories',
                'description' => 'Various accessories and parts for industrial equipment.',
                'image' => 'categories/accessories.jpg',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'slug' => Str::slug($category['name']),
                    'description' => $category['description'],
                    'image' => $category['image'] ?? null,
                ]
            );
        }
    }
}