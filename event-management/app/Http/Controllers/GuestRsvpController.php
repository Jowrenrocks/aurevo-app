<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Rsvp;

class GuestRsvpController extends Controller
{
    public function getEventPublic($eventId)
    {
        $event = Event::with('creator')->findOrFail($eventId);

        // Return public event details for RSVP page
        return response()->json([
            'id' => $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'start_at' => $event->start_at,
            'end_at' => $event->end_at,
            'location' => $event->location,
            'creator' => [
                'full_name' => $event->creator->full_name ?? 'Event Organizer'
            ]
        ]);
    }

    public function submitRsvp(Request $request, $eventId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:attending,not_attending,maybe',
            'guests' => 'nullable|integer|min:0|max:10',
            'special_requests' => 'nullable|string|max:1000'
        ]);

        $event = Event::findOrFail($eventId);

        // Check if RSVP already exists for this email
        $existingRsvp = Rsvp::where('event_id', $eventId)
                           ->where('guest_email', $request->email)
                           ->first();

        if ($existingRsvp) {
            // Update existing RSVP
            $existingRsvp->update([
                'guest_name' => $request->name,
                'guest_phone' => $request->phone,
                'status' => $request->status,
                'guests' => $request->guests ?? 1,
                'special_requests' => $request->special_requests
            ]);

            return response()->json([
                'message' => 'RSVP updated successfully',
                'rsvp' => $existingRsvp
            ]);
        }

        // Create new guest RSVP
        $rsvp = Rsvp::create([
            'event_id' => $eventId,
            'guest_name' => $request->name,
            'guest_email' => $request->email,
            'guest_phone' => $request->phone,
            'status' => $request->status,
            'guests' => $request->guests ?? 1,
            'special_requests' => $request->special_requests
        ]);

        return response()->json([
            'message' => 'RSVP submitted successfully',
            'rsvp' => $rsvp
        ], 201);
    }
}
