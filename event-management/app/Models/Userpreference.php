<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'new_user_registered',
        'new_event_created',
        'new_rsvp_received',
        'upcoming_event_reminders',
        'flagged_event_alerts',
        'daily_summary',
        'weekly_report'
    ];

    protected $casts = [
        'new_user_registered' => 'boolean',
        'new_event_created' => 'boolean',
        'new_rsvp_received' => 'boolean',
        'upcoming_event_reminders' => 'boolean',
        'flagged_event_alerts' => 'boolean',
        'daily_summary' => 'boolean',
        'weekly_report' => 'boolean'
    ];

    /**
     * Get the user that owns the preferences
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}