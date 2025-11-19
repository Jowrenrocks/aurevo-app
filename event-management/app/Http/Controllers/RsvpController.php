<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\RsvpGuest;

class GuestRsvpController extends Controller
{
    public function getEventPublic($id)
    {
        $event = Event::findOrFail($id);
        return response()->json($event);
    }

    public function submitRsvp(Request $request, $eventId)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'number_of_guests' => 'required|integer|min:1',
            'dietary_restrictions' => 'nullable|string',
            'message' => 'nullable|string'
        ]);

        $rsvp = RsvpGuest::create([
            'event_id' => $eventId,
            ...$validated
        ]);

        // TODO: Send confirmation email

        return response()->json(['message' => 'RSVP submitted successfully!', 'rsvp' => $rsvp]);
    }
}