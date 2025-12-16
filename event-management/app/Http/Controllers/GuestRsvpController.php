<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Rsvp;

class GuestRsvpController extends Controller
{
    /**
     * Get public event details (no authentication required)
     */
    public function getEventPublic($eventId)
    {
        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Event not found',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Submit guest RSVP (no authentication required)
     */
    public function submitRsvp(Request $request, $eventId)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'status' => 'required|in:yes,no,maybe',
            'guests' => 'nullable|integer|min:0|max:10',
            'reason_for_declining' => 'required_if:status,no|nullable|string|max:1000',
            'special_requests' => 'nullable|string|max:1000'
        ]);

        try {
            $event = Event::findOrFail($eventId);

            // Check if RSVP already exists for this email
            $existingRsvp = Rsvp::where('event_id', $eventId)
                               ->where('guest_email', $validated['email'])
                               ->first();

            // Map status to both fields for compatibility
            $statusMapping = [
                'yes' => 'attending',
                'no' => 'not_attending',
                'maybe' => 'maybe'
            ];

            $rsvpData = [
                'guest_name' => $validated['name'],
                'guest_email' => $validated['email'],
                'guest_phone' => $validated['phone'],
                'response' => $validated['status'], // yes/no/maybe
                'status' => $statusMapping[$validated['status']], // attending/not_attending/maybe
                'guests' => $validated['status'] === 'yes' ? ($validated['guests'] ?? 1) : 0,
                'reason_for_declining' => $validated['status'] === 'no' ? $validated['reason_for_declining'] : null,
                'special_requests' => $validated['special_requests'] ?? null
            ];

            if ($existingRsvp) {
                // Update existing RSVP
                $existingRsvp->update($rsvpData);

                return response()->json([
                    'message' => 'RSVP updated successfully',
                    'rsvp' => $existingRsvp
                ]);
            }

            // Create new guest RSVP
            $rsvpData['event_id'] = $eventId;
            $rsvp = Rsvp::create($rsvpData);

            return response()->json([
                'message' => 'RSVP submitted successfully',
                'rsvp' => $rsvp
            ], 201);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Database error',
                'message' => 'Failed to save RSVP. Please try again.',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}