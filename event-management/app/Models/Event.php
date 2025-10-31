<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Event extends Model {
  protected $fillable = ['title','description','start_at','end_at','location','created_by','status'];
  public function creator(){ return $this->belongsTo(User::class, 'created_by'); }
  public function rsvps(){ return $this->hasMany(Rsvp::class); }
}
