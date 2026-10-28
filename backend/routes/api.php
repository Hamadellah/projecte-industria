
<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminUserController;

// ==========================
// AUTHENTICATION
// ==========================

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);


// ==========================
// PUBLIC CATEGORIES
// ==========================

Route::get('/categories', [CategoryController::class, 'index']);


// ==========================
// PUBLIC PRODUCTS
// ==========================

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);


// ==========================
// CUSTOMER CART & ORDERS
// ==========================

Route::middleware('auth:sanctum')->group(function () {

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::patch('/cart/{item}', [CartController::class, 'update']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
    Route::delete('/cart/{item}', [CartController::class, 'destroy']);

    // Orders
    Route::post('/orders', [OrderController::class, 'store']);

});


// ==========================
// ADMIN
// ==========================

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        Route::apiResource('categories', AdminCategoryController::class);
        Route::apiResource('products', AdminProductController::class);

        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{id}/role', [AdminUserController::class, 'updateRole']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    });
