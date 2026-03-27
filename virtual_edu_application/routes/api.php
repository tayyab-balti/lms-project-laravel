<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\VideoController;
use Illuminate\Http\Request;

// Public routes (no auth needed)
Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Protected routes (require valid token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Your existing CRUD
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('videos', VideoController::class);
});

// Optional: Get current authenticated user (helpful for testing)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});