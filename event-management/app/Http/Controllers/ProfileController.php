<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\UserPreference;

class ProfileController extends Controller
{
    /**
     * Get current user profile
     */
    public function getProfile(Request $request)
    {
        $user = auth()->user();
        $user->load('role'); // Load the role relationship
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->full_name,  // ✅ Changed from 'name' to 'full_name'
            'email' => $user->email,
            'phone' => $user->phone ?? null,
            'address' => $user->address ?? null,
            'city' => $user->city ?? null,
            'country' => $user->country ?? null,
            'bio' => $user->bio ?? null,
            'role_id' => $user->role_id,
            'created_at' => $user->created_at
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',  // Frontend sends 'name'
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500'
        ]);

        // Map 'name' to 'full_name' for database
        $updateData = $validated;
        $updateData['full_name'] = $validated['name'];  // ✅ Map to full_name
        unset($updateData['name']);

        // Update user
        $user->update($updateData);

        return response()->json([
            'id' => $user->id,
            'name' => $user->full_name,  // ✅ Return as 'name' for frontend
            'email' => $user->email,
            'phone' => $user->phone,
            'address' => $user->address,
            'city' => $user->city,
            'country' => $user->country,
            'bio' => $user->bio,
            'role_id' => $user->role_id,
            'created_at' => $user->created_at
        ]);
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect']
            ]);
        }

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }

    /**
     * Get admin notification preferences
     */
    public function getNotificationPreferences(Request $request)
    {
        $user = auth()->user();
        
        // Only for admins
        if ($user->role_id !== 1) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Get or create preferences
        $preferences = UserPreference::firstOrCreate(
            ['user_id' => $user->id],
            [
                'new_user_registered' => true,
                'new_event_created' => true,
                'new_rsvp_received' => true,
                'upcoming_event_reminders' => true,
                'flagged_event_alerts' => true,
                'daily_summary' => false,
                'weekly_report' => true
            ]
        );

        return response()->json([
            'new_user_registered' => $preferences->new_user_registered,
            'new_event_created' => $preferences->new_event_created,
            'new_rsvp_received' => $preferences->new_rsvp_received,
            'upcoming_event_reminders' => $preferences->upcoming_event_reminders,
            'flagged_event_alerts' => $preferences->flagged_event_alerts,
            'daily_summary' => $preferences->daily_summary,
            'weekly_report' => $preferences->weekly_report
        ]);
    }

    /**
     * Update admin notification preferences
     */
    public function updateNotificationPreferences(Request $request)
    {
        $user = auth()->user();
        
        // Only for admins
        if ($user->role_id !== 1) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'new_user_registered' => 'boolean',
            'new_event_created' => 'boolean',
            'new_rsvp_received' => 'boolean',
            'upcoming_event_reminders' => 'boolean',
            'flagged_event_alerts' => 'boolean',
            'daily_summary' => 'boolean',
            'weekly_report' => 'boolean'
        ]);

        // Update or create preferences
        $preferences = UserPreference::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'message' => 'Notification preferences updated successfully',
            'preferences' => $preferences
        ]);
    }

    /**
     * Delete account (soft delete)
     */
    public function deleteAccount(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'password' => 'required|string',
            'confirmation' => 'required|in:DELETE'
        ]);

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Password is incorrect']
            ]);
        }

        // Soft delete user
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}