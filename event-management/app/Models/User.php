<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'full_name',  // ✅ Make sure this is here
        'email',
        'password',
        'phone',
        'address',
        'city',
        'country',
        'bio',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ✅ ADD THIS RELATIONSHIP
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function preferences()
    {
        return $this->hasOne(UserPreference::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class, 'user_id');
    }

    public function rsvps()
    {
        return $this->hasMany(Rsvp::class);
    }
}