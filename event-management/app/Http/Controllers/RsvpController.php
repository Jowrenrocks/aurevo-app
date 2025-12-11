<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Rsvp;

class RsvpController extends Controller
{
    public function respond(Request $request, $eventId)
    {
        $request->validate([
            'status' => 'required|in:attending,not_attending,maybe'
        ]);

        $user = auth()->user();
        $event = Event::findOrFail($eventId);

        $rsvp = Rsvp::updateOrCreate(
            ['user_id' => $user->id, 'event_id' => $eventId],
            ['status' => $request->status]
        );

        return response()->json(['message' => 'RSVP updated successfully', 'rsvp' => $rsvp]);
    }

    public function index()
    {
        $user = auth()->user();
        $rsvps = Rsvp::with('event')->where('user_id', $user->id)->get();
        return response()->json($rsvps);
    }
}
