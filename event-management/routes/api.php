<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RsvpController;

Route::post('auth/register', [AuthController::class,'register']);
Route::post('auth/login', [AuthController::class,'login']);

Route::middleware(['auth:api'])->group(function(){
  Route::get('auth/me', [AuthController::class,'me']);
  Route::post('auth/logout', [AuthController::class,'logout']);

  Route::get('events', [EventController::class,'index']);
  Route::get('events/{id}', [EventController::class,'show']);
  Route::post('events', [EventController::class,'store']);
  Route::put('events/{id}', [EventController::class,'update']);
  Route::delete('events/{id}', [EventController::class,'destroy']);
  Route::get('events/{id}/attendees', [EventController::class,'attendees']);

  Route::post('events/{id}/rsvp', [RsvpController::class,'respond']);
});
