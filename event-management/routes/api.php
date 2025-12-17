<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RsvpController;
use App\Http\Controllers\GuestRsvpController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

// Public RSVP routes (no authentication required)
Route::get('/events/{eventId}/public', [GuestRsvpController::class, 'getEventPublic']);
Route::post('/events/{eventId}/rsvp-guest', [GuestRsvpController::class, 'submitRsvp']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    
    // Profile management
    Route::put('auth/update-profile', [ProfileController::class, 'updateProfile']);
    Route::put('auth/change-password', [ProfileController::class, 'changePassword']);

    // Events (users see only their events, admins see all)
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
    Route::get('/events/{id}/attendees', [EventController::class, 'attendees']);

    // Admin-specific routes
    Route::prefix('admin')->group(function () {
        Route::get('/events', [EventController::class, 'adminIndex']); // All events with filters
        Route::get('/stats', [EventController::class, 'adminStats']); // Dashboard statistics
        Route::get('/users', [EventController::class, 'getUsers']); // All users
    });

    // RSVPs (authenticated users)
    Route::post('/events/{eventId}/rsvp', [RsvpController::class, 'respond']);
    Route::get('/rsvps', [RsvpController::class, 'index']);
});