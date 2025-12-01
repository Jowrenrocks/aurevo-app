<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {
  use HasApiTokens, Notifiable;
  protected $fillable = ['full_name','email','password','role_id'];
  protected $hidden = ['password','remember_token'];
  public function role(){ return $this->belongsTo(Role::class); }
  public function events(){ return $this->hasMany(Event::class, 'created_by'); }
  public function rsvps(){ return $this->hasMany(Rsvp::class); }
}
