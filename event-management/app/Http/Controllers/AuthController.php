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

    $token = JWTAuth::fromUser($user);
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

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = auth()->user()->load('role'); // ✅ load role relationship

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'user' // ✅ Send role name
            ]
        ]);
    }
    public function me()
    {
        $user = auth()->user()->load('role');
        return response()->json($user);
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Logged out']);
    }
}
