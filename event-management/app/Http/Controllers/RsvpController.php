<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Rsvp;

class RsvpController extends Controller {
  public function respond(Request $r, $eventId){
    $r->validate(['response'=>'required|in:yes,no,maybe']);
    $user = auth()->user();
    $event = Event::findOrFail($eventId);
    $rsvp = Rsvp::updateOrCreate(
      ['user_id'=>$user->id,'event_id'=>$event->id],
      ['response'=>$r->response]
    );
    // dispatch notification to event creator if needed
    return response()->json($rsvp,200);
  }
}
