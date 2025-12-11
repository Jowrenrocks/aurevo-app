<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Rsvp extends Model {
  protected $fillable = [
    'user_id',
    'event_id',
    'response',
    'status',
    'guest_name',
    'guest_email',
    'guest_phone',
    'guests',
    'special_requests'
  ];

  public function user(){ return $this->belongsTo(User::class); }
  public function event(){ return $this->belongsTo(Event::class); }
}
