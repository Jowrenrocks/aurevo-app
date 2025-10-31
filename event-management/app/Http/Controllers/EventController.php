<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\User;

class EventController extends Controller {
  public function index(){ return Event::withCount('rsvps')->orderBy('start_at')->get(); }
  public function show($id){ return Event::with('creator','rsvps.user')->findOrFail($id); }

  public function store(Request $r){
    $r->validate(['title'=>'required','start_at'=>'required|date']);
    $user = auth()->user();
    $ev = Event::create(array_merge($r->only(['title','description','start_at','end_at','location']), ['created_by'=>$user->id]));
    return response()->json($ev,201);
  }

  public function update(Request $r, $id){
    $ev = Event::findOrFail($id);
    $this->authorize('update', $ev); // optional: add policy to restrict creators/admins
    $ev->update($r->only(['title','description','start_at','end_at','location','status']));
    return response()->json($ev);
  }

  public function destroy($id){
    $ev = Event::findOrFail($id);
    $this->authorize('delete', $ev);
    $ev->delete();
    return response()->json(['message'=>'deleted']);
  }

  public function attendees($id){
    $ev = Event::with('rsvps.user')->findOrFail($id);
    // optionally check permission (only event creator or admin)
    return response()->json($ev->rsvps);
  }
}
