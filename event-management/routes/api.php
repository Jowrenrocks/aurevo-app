<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Event;

// ✅ Public: get all events
Route::get('/events', fn() => Event::all());

// ✅ Public: create event
Route::post('/events', function (Request $request) {
    $request->validate([
        'name' => 'required|string',
        'location' => 'required|string',
        'date' => 'required|date',
    ]);

    $event = Event::create($request->all());
    return response()->json($event, 201);
});

// ✅ User registration
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users',
        'password' => 'required|string|min:6|confirmed',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    return response()->json(['message' => 'User registered successfully']);
});

// ✅ Login
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password',
        ], 401);
    }

    // Create a simple token (if Sanctum is not installed)
    $token = base64_encode(random_bytes(32));

    return response()->json([
        'success' => true,
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token,
    ]);
});
