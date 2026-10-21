<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
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
                'images' => [
                    ['image_path' => 'images/products/submersible-water-pump.jpg', 'is_main' => true, 'position' => 0],
                    ['image_path' => 'images/products/submersible-water-pump-side.jpg', 'is_main' => false, 'position' => 1],
                ],
                'specifications' => [
                    ['name' => 'Power', 'value' => '2.2 kW'],
                    ['name' => 'Flow rate', 'value' => '15 m³/h'],
                    ['name' => 'Maximum head', 'value' => '80 m'],
                ],
            ],
            [
                'name' => 'PVC Well Casing Pipe',
                'category' => 'Pipes and Fittings',
                'reference' => 'PIPE-001',
                'description' => 'Durable PVC pipe for well construction.',
                'price' => 180,
                'stock_quantity' => 100,
                'images' => [
                    ['image_path' => 'images/products/pvc-well-casing-pipe.jpg', 'is_main' => true, 'position' => 0],
                ],
                'specifications' => [
                    ['name' => 'Material', 'value' => 'PVC'],
                    ['name' => 'Diameter', 'value' => '160 mm'],
                    ['name' => 'Length', 'value' => '6 m'],
                ],
            ],
            [
                'name' => 'Diamond Drill Bit',
                'category' => 'Drilling Equipment',
                'reference' => 'DRILL-001',
                'description' => 'High-quality drill bit for well drilling.',
                'price' => 850,
                'stock_quantity' => 20,
                'images' => [
                    ['image_path' => 'images/products/diamond-drill-bit.jpg', 'is_main' => true, 'position' => 0],
                ],
                'specifications' => [
                    ['name' => 'Diameter', 'value' => '200 mm'],
                    ['name' => 'Type', 'value' => 'Diamond core bit'],
                    ['name' => 'Connection', 'value' => 'API 2 3/8 in'],
                ],
            ],
            [
                'name' => 'Safety Helmet',
                'category' => 'Safety Equipment',
                'reference' => 'SAFE-001',
                'description' => 'Protective helmet for drilling workers.',
                'price' => 150,
                'stock_quantity' => 40,
                'images' => [
                    ['image_path' => 'images/products/safety-helmet.jpg', 'is_main' => true, 'position' => 0],
                ],
                'specifications' => [
                    ['name' => 'Material', 'value' => 'ABS'],
                    ['name' => 'Standard', 'value' => 'EN 397'],
                    ['name' => 'Color', 'value' => 'Yellow'],
                ],
            ],
            [
                'name' => 'Steel Pipe Connector',
                'category' => 'Accessories',
                'reference' => 'CONN-001',
                'description' => 'Strong connector for drilling pipes.',
                'price' => 95,
                'stock_quantity' => 60,
                'images' => [
                    ['image_path' => 'images/products/steel-pipe-connector.jpg', 'is_main' => true, 'position' => 0],
                ],
                'specifications' => [
                    ['name' => 'Material', 'value' => 'Galvanized steel'],
                    ['name' => 'Diameter', 'value' => '110 mm'],
                    ['name' => 'Thread', 'value' => 'BSP'],
                ],
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

            $product = Product::updateOrCreate(
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

            $product->productImages()->delete();
            $product->productImages()->createMany($item['images']);

            $product->productSpecifications()->delete();
            $product->productSpecifications()->createMany($item['specifications']);
        }
    }
}
