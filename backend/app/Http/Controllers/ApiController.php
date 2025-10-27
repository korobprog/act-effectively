<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiController extends Controller
{
    /**
     * Health check endpoint
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Laravel API is running',
            'timestamp' => now(),
            'version' => '12.0.0',
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'php_major_version' => PHP_MAJOR_VERSION,
            'php_minor_version' => PHP_MINOR_VERSION
        ]);
    }

    /**
     * Test endpoint with Laravel 12 features
     */
    public function test(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Test endpoint working',
            'data' => [
                'version' => '12.0.0',
                'environment' => app()->environment(),
                'php_version' => PHP_VERSION,
                'php_major_version' => PHP_MAJOR_VERSION,
                'php_minor_version' => PHP_MINOR_VERSION,
                'laravel_version' => app()->version(),
                'features' => [
                    'new_api' => true,
                    'php_8_4' => PHP_MAJOR_VERSION >= 8 && PHP_MINOR_VERSION >= 4
                ]
            ]
        ]);
    }

    /**
     * Get user info (requires authentication)
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
            'authenticated' => $request->user() !== null,
            'features' => []
        ]);
    }

    /**
     * Feature flags endpoint
     */
    public function features(Request $request): JsonResponse
    {
        return response()->json([
            'features' => [
                'new_api' => true,
                'php_8_4' => PHP_MAJOR_VERSION >= 8 && PHP_MINOR_VERSION >= 4,
                'laravel_12' => true
            ],
            'new_api_active' => true
        ]);
    }

    /**
     * Get VAPID public key for push notifications
     */
    public function vapidKey(): JsonResponse
    {
        return response()->json([
            'vapid_public_key' => env('VAPID_PUBLIC_KEY', '')
        ]);
    }
}
