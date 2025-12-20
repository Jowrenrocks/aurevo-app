<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_at',
        'end_at',
        'location',
        'host_name',
        'host_contact',
        'user_id',
        'status',
        'admin_notes'
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];

    // Relationship: Event belongs to a User (creator)
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship: Event has many RSVPs
    public function rsvps()
    {
        return $this->hasMany(Rsvp::class);
    }

    // Relationship: Event belongs to a User (through user_id)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}