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
                'name' => 'Pumps',
                'image' => 'images/categories/pumps.jpg',
                'description' => 'Water pumps and pumping equipment for wells and drilling sites.',
            ],
            [
                'name' => 'Drilling Equipment',
                'image' => 'images/categories/drilling-equipment.jpg',
                'description' => 'Equipment and tools used for drilling and well construction.',
            ],
            [
                'name' => 'Pipes and Fittings',
                'image' => 'images/categories/pipes-and-fittings.jpg',
                'description' => 'Pipes, connectors and fittings for water and drilling installations.',
            ],
            [
                'name' => 'Safety Equipment',
                'image' => 'images/categories/safety-equipment.jpg',
                'description' => 'Personal protective equipment for drilling and construction workers.',
            ],
            [
                'name' => 'Accessories',
                'image' => 'images/categories/accessories.jpg',
                'description' => 'Useful accessories and replacement parts for drilling equipment.',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                $category + ['slug' => Str::slug($category['name'])]
            );
        }
    }
}
