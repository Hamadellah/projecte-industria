<?php
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController; 
use App\Http\Controllers\Admin\AdminUserController; 
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
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
