
<?php

use Illuminate\Support\Facades\Route;

// Admin Controllers
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminInvoiceController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminQuotationController;
use App\Http\Controllers\Admin\AdminSupplierController;
use App\Http\Controllers\Admin\AdminUserController;

// Auth Controllers
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\api\AuthController;

// Store Controllers
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\QuotationController;


// ========================================
// Routes publiques
// ========================================

Route::post('/register', [RegisterController::class, 'register']);

Route::post('/login', [LoginController::class, 'login']);

Route::get('/categories', [AdminCategoryController::class, 'index']);

Route::get('/products', [ProductController::class, 'index']);

Route::get('/products/{product}', [ProductController::class, 'show']);


// ========================================
// Routes Admin
// ========================================

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [
            AdminDashboardController::class,
            'index'
        ]);

        // Categories
        Route::apiResource('categories', AdminCategoryController::class);

        // Products
        Route::apiResource('products', AdminProductController::class);

        // Suppliers
        Route::apiResource('suppliers', AdminSupplierController::class);

        // Quotations
        Route::apiResource('quotations', AdminQuotationController::class);

        Route::patch('/quotations/{id}/status', [
            AdminQuotationController::class,
            'updateStatus'
        ]);

        // Orders Management
        Route::get('/orders', [
            AdminOrderController::class,
            'index'
        ]);

        Route::get('/orders/{id}', [
            AdminOrderController::class,
            'show'
        ]);

        Route::patch('/orders/{id}/status', [
            AdminOrderController::class,
            'updateStatus'
        ]);

        // Invoices Management
        Route::get('/invoices', [
            AdminInvoiceController::class,
            'index'
        ]);

        Route::get('/invoices/{id}', [
            AdminInvoiceController::class,
            'show'
        ]);

        Route::patch('/invoices/{id}/status', [
            AdminInvoiceController::class,
            'updateStatus'
        ]);

        // Users & Customers Management
        Route::get('/users', [
            AdminUserController::class,
            'index'
        ]);

        Route::get('/users/{id}', [
            AdminUserController::class,
            'show'
        ]);

        Route::patch('/users/{id}/role', [
            AdminUserController::class,
            'updateRole'
        ]);

        Route::delete('/users/{id}', [
            AdminUserController::class,
            'destroy'
        ]);
    });


// ========================================
// Routes Client / User
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // ====================================
    // User Management
    // ====================================

    Route::get('/user', [
        AuthController::class,
        'user'
    ]);

    Route::post('/logout', [
        AuthController::class,
        'logout'
    ]);


    // ====================================
    // Cart Management
    // ====================================

    Route::get('/cart', [
        CartController::class,
        'index'
    ]);

    Route::post('/cart', [
        CartController::class,
        'store'
    ]);

    // Guest Cart Synchronization
    Route::post('/cart/sync', [
        CartController::class,
        'sync'
    ]);

    Route::patch('/cart/{item}', [
        CartController::class,
        'update'
    ]);

    Route::delete('/cart/{item}', [
        CartController::class,
        'destroy'
    ]);

    Route::delete('/cart', [
        CartController::class,
        'clear'
    ]);


    // ====================================
    // Orders Management
    // ====================================

    // Create a new order
    Route::post('/orders', [
        OrderController::class,
        'store'
    ]);

    // Get all orders of authenticated user
    Route::get('/orders', [
        OrderController::class,
        'index'
    ]);

    // Get details of a specific order
    Route::get('/orders/{id}', [
        OrderController::class,
        'show'
    ]);

});
// حطها برة الجروب ديال auth:sanctum
Route::get('/client/products/{productId}/quotations', [QuotationController::class, 'getClientProductQuotations']);