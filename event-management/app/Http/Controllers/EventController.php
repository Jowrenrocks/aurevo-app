<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\User;
use App\Models\Rsvp;

class EventController extends Controller {
  
  // Get all events (with creator info and RSVP count)
  public function index(Request $request){ 
    $query = Event::with('creator')->withCount('rsvps');
    
    // If user is not admin, only show their events
    $user = auth()->user();
    if ($user->role_id !== 1) { // Assuming 1 is admin role
      $query->where('user_id', $user->id);
    }
    
    return $query->orderBy('start_at', 'desc')->get(); 
  }
  
  // Get single event with full details
  public function show($id){ 
    return Event::with('creator','rsvps.user')->findOrFail($id); 
  }

  // Create new event
  public function store(Request $r){
    $r->validate([
      'title'=>'required|string|max:255',
      'start_at'=>'required|date',
      'description'=>'nullable|string',
      'end_at'=>'nullable|date|after:start_at',
      'location'=>'nullable|string|max:255',
      'host_name'=>'nullable|string|max:255',
      'host_contact'=>'nullable|string|max:255'
    ]);
    
    $user = auth()->user();
    
    // Determine status based on user role
    $status = ($user->role_id === 1) ? 'approved' : 'pending';
    
    $ev = Event::create(array_merge(
      $r->only(['title','description','start_at','end_at','location','host_name','host_contact']), 
      ['user_id'=>$user->id, 'status'=>$status]
    ));
    
    return response()->json($ev->load('creator'),201);
  }

  // Update event (admin can update any, users only their own)
  public function update(Request $r, $id){
    $ev = Event::findOrFail($id);
    $user = auth()->user();
    
    // Check if user can update (is admin or is creator)
    if ($user->role_id !== 1 && $ev->user_id !== $user->id) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }
    
    $validated = $r->validate([
      'title'=>'sometimes|string|max:255',
      'description'=>'nullable|string',
      'start_at'=>'sometimes|date',
      'end_at'=>'nullable|date',
      'location'=>'nullable|string|max:255',
      'host_name'=>'nullable|string|max:255',
      'host_contact'=>'nullable|string|max:255',
      'status'=>'sometimes|in:draft,pending,approved,declined,concluded'
    ]);
    
    $ev->update($validated);
    return response()->json($ev->load('creator'));
  }

  // Delete event (admin can delete any, users only their own)
  public function destroy($id){
    $ev = Event::findOrFail($id);
    $user = auth()->user();
    
    // Check if user can delete (is admin or is creator)
    if ($user->role_id !== 1 && $ev->user_id !== $user->id) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }
    
    $ev->delete();
    return response()->json(['message'=>'Event deleted successfully']);
  }

  // Get event attendees/RSVPs
  public function attendees($id){
    $ev = Event::with(['rsvps' => function($query) {
      $query->with('user');
    }])->findOrFail($id);
    
    return response()->json($ev->rsvps);
  }
  
  // Admin: Get all events from all users
  public function adminIndex(Request $request){
    $user = auth()->user();
    
    // Only admins can access this
    if ($user->role_id !== 1) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }
    
    $query = Event::with('creator')->withCount('rsvps');
    
    // Filter by status if provided
    if ($request->has('status')) {
      $query->where('status', $request->status);
    }
    
    // Filter by user if provided
    if ($request->has('user_id')) {
      $query->where('user_id', $request->user_id);
    }
    
    return $query->orderBy('start_at', 'desc')->get();
  }
  
  // Admin: Get statistics
  public function adminStats(){
    $user = auth()->user();
    
    // Only admins can access this
    if ($user->role_id !== 1) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }
    
    $stats = [
      'total_events' => Event::count(),
      'upcoming_events' => Event::where('start_at', '>', now())->count(),
      'completed_events' => Event::where('start_at', '<=', now())->count(),
      'total_users' => User::where('role_id', 2)->count(),
      'total_rsvps' => Rsvp::count(),
      'events_by_status' => Event::selectRaw('status, count(*) as count')
        ->groupBy('status')
        ->pluck('count', 'status')
        ->toArray(),
      'recent_events' => Event::with('creator')
        ->withCount('rsvps')
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get(),
      'rsvp_breakdown' => [
        'yes' => Rsvp::where('response', 'yes')->count(),
        'no' => Rsvp::where('response', 'no')->count(),
        'maybe' => Rsvp::where('response', 'maybe')->count()
      ]
    ];
    
    return response()->json($stats);
  }
  
  // Get all users (for admin to see who created what)
  public function getUsers(){
    $user = auth()->user();
    
    // Only admins can access this
    if ($user->role_id !== 1) {
      return response()->json(['error' => 'Unauthorized'], 403);
    }
    
    $users = User::with('role')
      ->withCount('events')
      ->where('role_id', 2) // Only regular users
      ->orderBy('created_at', 'desc')
      ->get();
    
    return response()->json($users);
  }
}