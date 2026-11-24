
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
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\QuotationController;


// ========================================
// Public Routes
// ========================================

Route::post('/register', [RegisterController::class, 'register']);

Route::post('/login', [LoginController::class, 'login']);

// Public categories
Route::get('/categories', [CategoryController::class, 'index']);

// Public products
Route::get('/products', [ProductController::class, 'index']);

Route::get('/products/{product}', [ProductController::class, 'show']);


// ========================================
// Admin Routes
// ========================================

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [
            AdminDashboardController::class,
            'index'
        ]);

        // Categories CRUD
        Route::apiResource('categories', AdminCategoryController::class);

        // Products CRUD
        Route::apiResource('products', AdminProductController::class);

        // Suppliers CRUD
        Route::apiResource('suppliers', AdminSupplierController::class);

        // Quotations CRUD
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
// Authenticated Client / User Routes
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // User Management
    Route::get('/user', [
        AuthController::class,
        'user'
    ]);

    Route::post('/logout', [
        AuthController::class,
        'logout'
    ]);

    // Cart Management
    Route::get('/cart', [
        CartController::class,
        'index'
    ]);

    Route::post('/cart', [
        CartController::class,
        'store'
    ]);

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

    // Orders Management
    Route::post('/orders', [
        OrderController::class,
        'store'
    ]);

    Route::get('/orders', [
        OrderController::class,
        'index'
    ]);

    Route::get('/orders/{id}', [
        OrderController::class,
        'show'
    ]);
});


// ========================================
// Client Product Quotations
// ========================================

Route::get('/client/products/{productId}/quotations', [
    QuotationController::class,
    'getClientProductQuotations'
]);

Route::post('/quotations', [
    QuotationController::class,
    'store'
]);
