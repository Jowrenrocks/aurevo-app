<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_id',
        'type',
        'title',
        'message',
        'status',
        'recipient_count',
        'recipient_emails',
        'scheduled_for',
        'sent_at'
    ];

    protected $casts = [
        'recipient_emails' => 'array',
        'scheduled_for' => 'datetime',
        'sent_at' => 'datetime',
        'recipient_count' => 'integer'
    ];

    /**
     * Get the user who created this notification
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event this notification is for
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}