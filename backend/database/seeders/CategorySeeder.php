<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Submersible Water Pump',
                'category_id' => 1,
                'description' => 'Powerful pump for extracting water from wells.',
                'price' => 2500,
                'stock' => 15,
            ],
            [
                'name' => 'PVC Well Casing Pipe',
                'category_id' => 3,
                'description' => 'Durable PVC pipe for well construction.',
                'price' => 180,
                'stock' => 100,
            ],
            [
                'name' => 'Diamond Drill Bit',
                'category_id' => 1,
                'description' => 'High-quality drill bit for well drilling.',
                'price' => 850,
                'stock' => 20,
            ],
            [
                'name' => 'Safety Helmet',
                'category_id' => 4,
                'description' => 'Protective helmet for drilling workers.',
                'price' => 150,
                'stock' => 40,
            ],
            [
                'name' => 'Steel Pipe Connector',
                'category_id' => 5,
                'description' => 'Strong connector for drilling pipes.',
                'price' => 95,
                'stock' => 60,
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['slug' => Str::slug($product['name'])],
                [
                    'category_id' => $product['category_id'],
                    'name' => $product['name'],
                    'slug' => Str::slug($product['name']),
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'stock' => $product['stock'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
