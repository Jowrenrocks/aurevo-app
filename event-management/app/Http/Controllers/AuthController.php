<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller {
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
    ]);
    $token = JWTAuth::fromUser($user);
    return response()->json(['user'=>$user,'token'=>$token],201);
  }

  public function login(Request $req){
    $credentials = $req->only('email','password');
    if(!$token = auth()->attempt($credentials)){
      return response()->json(['error'=>'Invalid credentials'],401);
    }
    return response()->json(['token'=>$token,'user'=>auth()->user()]);
  }

  public function me(){ return response()->json(auth()->user()); }
  public function logout(){ auth()->logout(); return response()->json(['message'=>'Logged out']); }
}
