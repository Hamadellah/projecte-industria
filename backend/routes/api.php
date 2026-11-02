
<?php

use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminInvoiceController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminSupplierController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

// Routes Publiques (Authentication)
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// Routes Admin (Protected by Sanctum & Admin Middleware)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    
    // Categories & Products & Suppliers (API Resources)
    Route::apiResource('categories', AdminCategoryController::class);
    Route::apiResource('products', AdminProductController::class);
    Route::apiResource('suppliers', AdminSupplierController::class); // <--- Jdid: Fournisseurs
    
    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
    
    // Invoices Management (Factures)
    Route::get('/invoices', [AdminInvoiceController::class, 'index']);             // <--- Jdid
    Route::get('/invoices/{id}', [AdminInvoiceController::class, 'show']);         // <--- Jdid
    Route::patch('/invoices/{id}/status', [AdminInvoiceController::class, 'updateStatus']); // <--- Jdid
    
    // Users & Customers Management (B2B Details)
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);               // <--- Jdid: Details client & orders dyalu
    Route::patch('/users/{id}/role', [AdminUserController::class, 'updateRole']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
    
});
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::patch('/cart/{item}', [CartController::class, 'update']);
     Route::delete('/cart/{item}', [CartController::class, 'destroy']);
     Route::delete('/cart', [CartController::class, 'clear']);

     Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});

