<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificationController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Admin routes (только для администраторов)
Route::middleware('auth:sanctum')->group(function () {
    // User management routes (must be defined before /admin/{id} to avoid route conflicts)
    Route::get('/admin/users', [AdminController::class, 'listUsers']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    Route::patch('/admin/users/{id}/role', [AdminController::class, 'updateUserRole']);
    
    // Admin management routes
    Route::post('/admin/create', [AdminController::class, 'createAdmin']);
    Route::get('/admin/list', [AdminController::class, 'listAdmins']);
    Route::delete('/admin/{id}', [AdminController::class, 'deleteAdmin']);
});

// API Controller routes
Route::get('/health', [ApiController::class, 'health']);
Route::get('/test', [ApiController::class, 'test']);
Route::get('/features', [ApiController::class, 'features']);
Route::middleware('auth:sanctum')->get('/user-info', [ApiController::class, 'user']);

// Push notification routes
Route::middleware('auth:sanctum')->group(function () {
    // Admin routes (только для супер-администратора)
    Route::middleware(function ($request, $next) {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }
        return $next($request);
    })->group(function () {
        Route::post('/notifications/send/user/{id}', [NotificationController::class, 'sendToUser']);
        Route::post('/notifications/send/all-users', [NotificationController::class, 'sendToAllUsers']);
        Route::post('/notifications/send/all-admins', [NotificationController::class, 'sendToAllAdmins']);
        Route::get('/notifications/subscribers', [NotificationController::class, 'subscribers']);
    });
});
