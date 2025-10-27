<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
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
    Route::post('/admin/create', [AdminController::class, 'createAdmin']);
    Route::get('/admin/list', [AdminController::class, 'listAdmins']);
    Route::delete('/admin/{id}', [AdminController::class, 'deleteAdmin']);

    // API Controller routes
Route::get('/health', [ApiController::class, 'health']);
Route::get('/test', [ApiController::class, 'test']);
Route::get('/features', [ApiController::class, 'features']);
Route::middleware('auth:sanctum')->get('/user-info', [ApiController::class, 'user']);
});
