<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
         $products = [
            [
                'name' => 'Submersible Water Pump',
                'category' => 'Pumps',
                'reference' => 'PUMP-001',
                'description' => 'Powerful pump for extracting water from wells.',
                'price' => 2500,
                'stock_quantity' => 15,
            ],
            [
                'name' => 'PVC Well Casing Pipe',
                'category' => 'Pipes and Fittings',
                'reference' => 'PIPE-001',
                'description' => 'Durable PVC pipe for well construction.',
                'price' => 180,
                'stock_quantity' => 100,
            ],
            [
                'name' => 'Diamond Drill Bit',
                'category' => 'Drilling Equipment',
                'reference' => 'DRILL-001',
                'description' => 'High-quality drill bit for well drilling.',
                'price' => 850,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Safety Helmet',
                'category' => 'Safety Equipment',
                'reference' => 'SAFE-001',
                'description' => 'Protective helmet for drilling workers.',
                'price' => 150,
                'stock_quantity' => 40,
            ],
            [
                'name' => 'Steel Pipe Connector',
                'category' => 'Accessories',
                'reference' => 'CONN-001',
                'description' => 'Strong connector for drilling pipes.',
                'price' => 95,
                'stock_quantity' => 60,
            ],
        ];

        foreach ($products as $item) {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($item['category'])],
                [
                    'name' => $item['category'],
                    'description' => 'Products in the ' . $item['category'] . ' category.',
                ]
            );

            Product::updateOrCreate(
                ['reference' => $item['reference']],
                [
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']),
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'stock_quantity' => $item['stock_quantity'],
                    'is_active' => true,
                ]
            );
        }
    
        // Your products seeder code
    }
}