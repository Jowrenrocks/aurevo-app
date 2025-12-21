<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Rsvp;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminNotificationController extends Controller
{
    /**
     * Get system notifications for admin
     * These are platform activity notifications (new users, events, RSVPs, etc.)
     */
    public function getSystemNotifications(Request $request)
    {
        // In a production app, you would have a separate system_notifications table
        // For now, we'll generate notifications from recent platform activity
        
        $notifications = [];
        
        // Get recent user registrations
        $recentUsers = User::where('created_at', '>=', now()->subDays(30))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        foreach ($recentUsers as $user) {
            $notifications[] = [
                'id' => 'user_' . $user->id,
                'type' => 'new_user',
                'title' => 'New User Registration',
                'message' => "{$user->full_name} registered an account",
                'data' => [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->full_name
                ],
                'created_at' => $user->created_at,
                'read' => false
            ];
        }
        
        // Get recent events
        $recentEvents = Event::with('user')
            ->where('created_at', '>=', now()->subDays(30))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        foreach ($recentEvents as $event) {
            $notifications[] = [
                'id' => 'event_' . $event->id,
                'type' => 'new_event',
                'title' => 'New Event Created',
                'message' => "{$event->title} was created by {$event->user->full_name}",
                'data' => [
                    'event_id' => $event->id,
                    'event_title' => $event->title,
                    'creator' => $event->user->full_name,
                    'date' => $event->date
                ],
                'created_at' => $event->created_at,
                'read' => false
            ];
        }
        
        // Get recent RSVPs
        $recentRsvps = Rsvp::with(['event', 'user'])
            ->where('created_at', '>=', now()->subDays(30))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        foreach ($recentRsvps as $rsvp) {
            $guestName = $rsvp->guest_name ?? ($rsvp->user ? $rsvp->user->full_name : 'Guest');
            $notifications[] = [
                'id' => 'rsvp_' . $rsvp->id,
                'type' => 'new_rsvp',
                'title' => 'New RSVP Received',
                'message' => "{$guestName} RSVP'd to {$rsvp->event->title}",
                'data' => [
                    'rsvp_id' => $rsvp->id,
                    'event_title' => $rsvp->event->title,
                    'guest_name' => $guestName,
                    'response' => $rsvp->response
                ],
                'created_at' => $rsvp->created_at,
                'read' => false
            ];
        }
        
        // Get flagged events (events with admin_notes)
        $flaggedEvents = Event::with('user')
            ->whereNotNull('admin_notes')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();
        
        foreach ($flaggedEvents as $event) {
            $notifications[] = [
                'id' => 'flagged_' . $event->id,
                'type' => 'flagged_event',
                'title' => 'Event Flagged for Review',
                'message' => "{$event->title} requires admin attention",
                'data' => [
                    'event_id' => $event->id,
                    'event_title' => $event->title,
                    'admin_notes' => $event->admin_notes,
                    'creator' => $event->user->full_name
                ],
                'created_at' => $event->updated_at,
                'read' => false
            ];
        }
        
        // Sort all notifications by date
        usort($notifications, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });
        
        // Calculate stats
        $stats = [
            'total' => count($notifications),
            'new_users' => User::where('created_at', '>=', now()->subDays(30))->count(),
            'new_events' => Event::where('created_at', '>=', now()->subDays(30))->count(),
            'new_rsvps' => Rsvp::where('created_at', '>=', now()->subDays(30))->count(),
            'flagged_events' => Event::whereNotNull('admin_notes')->count(),
            'user_notifications' => Notification::count()
        ];
        
        return response()->json([
            'notifications' => $notifications,
            'stats' => $stats
        ]);
    }

    /**
     * Get all notifications sent by users
     */
    public function getAllUserNotifications(Request $request)
    {
        $notifications = Notification::with(['user', 'event'])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();
        
        // Transform data for frontend
        $notifications = $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'status' => $notification->status,
                'recipientCount' => $notification->recipient_count,
                'eventTitle' => $notification->event ? $notification->event->title : 'N/A',
                'creator' => [
                    'full_name' => $notification->user->full_name
                ],
                'scheduledDate' => $notification->scheduled_for,
                'sentDate' => $notification->sent_at,
                'created_at' => $notification->created_at
            ];
        });
        
        return response()->json($notifications);
    }

    /**
     * Mark a system notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        // In a real system, you'd update a read status in the database
        // For now, we'll just return success
        
        return response()->json([
            'message' => 'Notification marked as read',
            'id' => $id
        ]);
    }

    /**
     * Get notification statistics for admin dashboard
     */
    public function getNotificationStats()
    {
        $stats = [
            'total' => Notification::count(),
            'sent' => Notification::where('status', 'sent')->count(),
            'scheduled' => Notification::where('status', 'scheduled')->count(),
            'draft' => Notification::where('status', 'draft')->count(),
            'new_users_today' => User::whereDate('created_at', today())->count(),
            'new_events_today' => Event::whereDate('created_at', today())->count(),
            'new_rsvps_today' => Rsvp::whereDate('created_at', today())->count()
        ];
        
        return response()->json($stats);
    }
}