<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Event;
use App\Models\Rsvp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Notification::where('user_id', $user->id)
            ->with('event:id,title')
            ->orderBy('created_at', 'desc');
        
        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        $notifications = $query->get();
        
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
                'scheduledDate' => $notification->scheduled_for,
                'sentDate' => $notification->sent_at,
                'created_at' => $notification->created_at
            ];
        });
        
        return response()->json($notifications);
    }

    /**
     * Send a notification
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'type' => 'required|in:email,sms,push',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'eventId' => 'nullable|exists:events,id',
            'sendToAll' => 'boolean',
            'recipientEmails' => 'nullable|array',
            'recipientEmails.*' => 'email',
            'scheduleFor' => 'nullable|date'
        ]);
        
        // Verify user owns the event if eventId is provided
        if ($validated['eventId']) {
            $event = Event::where('id', $validated['eventId'])
                ->where('user_id', $user->id)
                ->first();
            
            if (!$event) {
                return response()->json([
                    'error' => 'Event not found or you do not have permission'
                ], 403);
            }
        }
        
        // Get recipients
        $recipients = [];
        $recipientCount = 0;
        
        if ($validated['sendToAll'] ?? true) {
            // Send to all RSVPs for user's events
            if ($validated['eventId']) {
                // Send to specific event attendees
                $rsvps = Rsvp::where('event_id', $validated['eventId'])
                    ->where(function($query) {
                        $query->where('response', 'yes')
                              ->orWhere('status', 'attending');
                    })
                    ->get();
                
                foreach ($rsvps as $rsvp) {
                    $email = $rsvp->guest_email ?? $rsvp->user?->email;
                    if ($email && !in_array($email, $recipients)) {
                        $recipients[] = $email;
                    }
                }
            } else {
                // Send to all attendees across all user's events
                $userEvents = Event::where('user_id', $user->id)->pluck('id');
                $rsvps = Rsvp::whereIn('event_id', $userEvents)
                    ->where(function($query) {
                        $query->where('response', 'yes')
                              ->orWhere('status', 'attending');
                    })
                    ->get();
                
                foreach ($rsvps as $rsvp) {
                    $email = $rsvp->guest_email ?? $rsvp->user?->email;
                    if ($email && !in_array($email, $recipients)) {
                        $recipients[] = $email;
                    }
                }
            }
            $recipientCount = count($recipients);
        } else {
            // Send to specific emails
            $recipients = $validated['recipientEmails'] ?? [];
            $recipientCount = count($recipients);
        }
        
        // Determine status
        $status = 'sent';
        $sentAt = now();
        
        if (isset($validated['scheduleFor'])) {
            $status = 'scheduled';
            $sentAt = null;
        }
        
        // Create notification record
        $notification = Notification::create([
            'user_id' => $user->id,
            'event_id' => $validated['eventId'] ?? null,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'status' => $status,
            'recipient_count' => $recipientCount,
            'recipient_emails' => $recipients,
            'scheduled_for' => $validated['scheduleFor'] ?? null,
            'sent_at' => $sentAt
        ]);
        
        // Send emails if type is email and not scheduled
        if ($validated['type'] === 'email' && $status === 'sent') {
            $this->sendEmails($notification, $recipients);
        }
        
        return response()->json([
            'message' => $status === 'sent' ? 'Notification sent successfully' : 'Notification scheduled successfully',
            'notification' => [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'status' => $notification->status,
                'recipientCount' => $notification->recipient_count,
                'sentDate' => $notification->sent_at,
                'scheduledDate' => $notification->scheduled_for
            ]
        ], 201);
    }

    /**
     * Send reminder to all attendees
     */
    public function sendReminder(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'message' => 'required|string',
            'type' => 'required|in:email,sms,push',
            'eventId' => 'nullable|exists:events,id'
        ]);
        
        // Get all attendees
        $query = Rsvp::query();
        
        if ($validated['eventId']) {
            // Verify user owns the event
            $event = Event::where('id', $validated['eventId'])
                ->where('user_id', $user->id)
                ->first();
            
            if (!$event) {
                return response()->json([
                    'error' => 'Event not found or you do not have permission'
                ], 403);
            }
            
            $query->where('event_id', $validated['eventId']);
            $title = "Reminder: {$event->title}";
        } else {
            // All user's events
            $userEvents = Event::where('user_id', $user->id)->pluck('id');
            $query->whereIn('event_id', $userEvents);
            $title = "Event Reminder";
        }
        
        // Get attending RSVPs only
        $rsvps = $query->where(function($q) {
            $q->where('response', 'yes')
              ->orWhere('status', 'attending');
        })->get();
        
        $recipients = [];
        foreach ($rsvps as $rsvp) {
            $email = $rsvp->guest_email ?? $rsvp->user?->email;
            if ($email && !in_array($email, $recipients)) {
                $recipients[] = $email;
            }
        }
        
        // Create notification record
        $notification = Notification::create([
            'user_id' => $user->id,
            'event_id' => $validated['eventId'] ?? null,
            'type' => $validated['type'],
            'title' => $title,
            'message' => $validated['message'],
            'status' => 'sent',
            'recipient_count' => count($recipients),
            'recipient_emails' => $recipients,
            'sent_at' => now()
        ]);
        
        // Send emails
        if ($validated['type'] === 'email') {
            $this->sendEmails($notification, $recipients);
        }
        
        return response()->json([
            'message' => 'Reminder sent successfully to ' . count($recipients) . ' attendees',
            'notification' => [
                'id' => $notification->id,
                'recipientCount' => count($recipients)
            ]
        ]);
    }

    /**
     * Get notification statistics
     */
    public function stats()
    {
        $user = auth()->user();
        
        $total = Notification::where('user_id', $user->id)->count();
        $sent = Notification::where('user_id', $user->id)->where('status', 'sent')->count();
        $scheduled = Notification::where('user_id', $user->id)->where('status', 'scheduled')->count();
        $draft = Notification::where('user_id', $user->id)->where('status', 'draft')->count();
        
        return response()->json([
            'total' => $total,
            'sent' => $sent,
            'scheduled' => $scheduled,
            'draft' => $draft
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy($id)
    {
        $user = auth()->user();
        
        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$notification) {
            return response()->json([
                'error' => 'Notification not found'
            ], 404);
        }
        
        $notification->delete();
        
        return response()->json([
            'message' => 'Notification deleted successfully'
        ]);
    }

    /**
     * Helper: Send emails to recipients
     */
    private function sendEmails($notification, $recipients)
    {
        try {
            // In a real application, you would use Laravel's Mail facade
            // and queue the emails for better performance
            
            foreach ($recipients as $recipient) {
                // Simulated email sending - replace with actual mail sending
                Log::info("Sending email to: {$recipient}", [
                    'title' => $notification->title,
                    'message' => $notification->message
                ]);
                
                // Example of actual email sending (uncomment when you have mail configured):
                /*
                Mail::raw($notification->message, function ($message) use ($recipient, $notification) {
                    $message->to($recipient)
                        ->subject($notification->title);
                });
                */
            }
            
            Log::info("Emails sent successfully", [
                'notification_id' => $notification->id,
                'recipient_count' => count($recipients)
            ]);
            
        } catch (\Exception $e) {
            Log::error("Failed to send emails", [
                'notification_id' => $notification->id,
                'error' => $e->getMessage()
            ]);
            
            // Update notification status to failed
            $notification->update(['status' => 'failed']);
        }
    }
}