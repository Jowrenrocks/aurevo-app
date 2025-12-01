<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $req){
    $data = $req->validate([
        'full_name'=>'required|string|max:100',
        'email'=>'required|email|unique:users,email',
        'password'=>'required|string|min:6|confirmed'
    ]);

    $user = User::create([
        'full_name'=>$data['full_name'],
        'email'=>$data['email'],
        'password'=>Hash::make($data['password']),
        'role_id' => 2 // default: user
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;
    $user->load('role');

    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'role' => $user->role->name ?? 'user'
        ]
    ], 201);
}

    public function login(Request $req)
    {
        $credentials = $req->only('email', 'password');

        if (!auth()->attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = auth()->user()->load('role');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'user'
            ]
        ]);
    }
    public function me(Request $request)
    {
        $user = $request->user()->load('role');
        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
