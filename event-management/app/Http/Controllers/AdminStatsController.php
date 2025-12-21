<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use App\Models\Rsvp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    /**
     * Get comprehensive admin statistics for reports
     */
    public function getStats(Request $request)
    {
        $dateRange = $request->input('dateRange', 'all');
        
        // Calculate date filter based on range
        $dateFilter = $this->getDateFilter($dateRange);
        
        // Total Events
        $totalEvents = Event::when($dateFilter, function ($query) use ($dateFilter) {
            return $query->where('created_at', '>=', $dateFilter);
        })->count();
        
        // Upcoming Events (future events)
        $upcomingEvents = Event::where('date', '>=', now())
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->count();
        
        // Completed Events (past events)
        $completedEvents = Event::where('date', '<', now())
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->count();
        
        // Flagged Events
        $flaggedEvents = Event::whereNotNull('admin_notes')
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->count();
        
        // Total Users
        $totalUsers = User::when($dateFilter, function ($query) use ($dateFilter) {
            return $query->where('created_at', '>=', $dateFilter);
        })->count();
        
        // Total RSVPs
        $totalRsvps = Rsvp::when($dateFilter, function ($query) use ($dateFilter) {
            return $query->where('created_at', '>=', $dateFilter);
        })->count();
        
        // RSVP Breakdown
        $rsvpBreakdown = [
            'yes' => Rsvp::where('response', 'yes')
                ->when($dateFilter, function ($query) use ($dateFilter) {
                    return $query->where('created_at', '>=', $dateFilter);
                })
                ->count(),
            'no' => Rsvp::where('response', 'no')
                ->when($dateFilter, function ($query) use ($dateFilter) {
                    return $query->where('created_at', '>=', $dateFilter);
                })
                ->count(),
            'maybe' => Rsvp::where('response', 'maybe')
                ->when($dateFilter, function ($query) use ($dateFilter) {
                    return $query->where('created_at', '>=', $dateFilter);
                })
                ->count()
        ];
        
        // Events by Status
        $eventsByStatus = Event::select('status', DB::raw('count(*) as count'))
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
        
        // Get recent events for processing (for monthly data and type breakdown)
        $recentEvents = Event::with('rsvps')
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Transform events for frontend processing
        $recentEventsData = $recentEvents->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'created_at' => $event->created_at->toISOString(),
                'rsvps_count' => $event->rsvps->count()
            ];
        });
        
        return response()->json([
            'total_events' => $totalEvents,
            'upcoming_events' => $upcomingEvents,
            'completed_events' => $completedEvents,
            'flagged_events' => $flaggedEvents,
            'total_users' => $totalUsers,
            'total_rsvps' => $totalRsvps,
            'rsvp_breakdown' => $rsvpBreakdown,
            'events_by_status' => $eventsByStatus,
            'recent_events' => $recentEventsData
        ]);
    }

    /**
     * Get detailed event report
     */
    public function getEventReport(Request $request)
    {
        $dateRange = $request->input('dateRange', 'all');
        $dateFilter = $this->getDateFilter($dateRange);
        
        $events = Event::with(['user', 'rsvps'])
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        $eventData = $events->map(function ($event) {
            $rsvpsYes = $event->rsvps->where('response', 'yes')->count();
            $rsvpsNo = $event->rsvps->where('response', 'no')->count();
            $rsvpsMaybe = $event->rsvps->where('response', 'maybe')->count();
            
            return [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->date,
                'status' => $event->status,
                'creator' => $event->user->full_name,
                'total_rsvps' => $event->rsvps->count(),
                'attending' => $rsvpsYes,
                'not_attending' => $rsvpsNo,
                'maybe' => $rsvpsMaybe,
                'created_at' => $event->created_at
            ];
        });
        
        return response()->json($eventData);
    }

    /**
     * Get attendance report
     */
    public function getAttendanceReport(Request $request)
    {
        $dateRange = $request->input('dateRange', 'all');
        $dateFilter = $this->getDateFilter($dateRange);
        
        $rsvps = Rsvp::with(['event', 'user'])
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        $attendanceData = $rsvps->map(function ($rsvp) {
            return [
                'id' => $rsvp->id,
                'event_title' => $rsvp->event->title,
                'event_date' => $rsvp->event->date,
                'guest_name' => $rsvp->guest_name ?? ($rsvp->user ? $rsvp->user->full_name : 'N/A'),
                'guest_email' => $rsvp->guest_email ?? ($rsvp->user ? $rsvp->user->email : 'N/A'),
                'response' => $rsvp->response,
                'created_at' => $rsvp->created_at
            ];
        });
        
        return response()->json($attendanceData);
    }

    /**
     * Get user activity report
     */
    public function getUserActivityReport(Request $request)
    {
        $dateRange = $request->input('dateRange', 'all');
        $dateFilter = $this->getDateFilter($dateRange);
        
        $users = User::withCount([
            'events' => function ($query) use ($dateFilter) {
                if ($dateFilter) {
                    $query->where('created_at', '>=', $dateFilter);
                }
            },
            'rsvps' => function ($query) use ($dateFilter) {
                if ($dateFilter) {
                    $query->where('created_at', '>=', $dateFilter);
                }
            }
        ])
        ->when($dateFilter, function ($query) use ($dateFilter) {
            return $query->where('created_at', '>=', $dateFilter);
        })
        ->orderBy('created_at', 'desc')
        ->get();
        
        $userData = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'events_created' => $user->events_count,
                'rsvps_made' => $user->rsvps_count,
                'joined_date' => $user->created_at
            ];
        });
        
        return response()->json($userData);
    }

    /**
     * Export report as CSV
     */
    public function exportReport(Request $request)
    {
        $reportType = $request->input('type', 'summary');
        $dateRange = $request->input('dateRange', 'all');
        
        // Get the appropriate data based on report type
        switch ($reportType) {
            case 'detailed':
                $data = $this->getEventReport($request)->getData();
                $filename = 'event_report.csv';
                break;
            case 'attendance':
                $data = $this->getAttendanceReport($request)->getData();
                $filename = 'attendance_report.csv';
                break;
            case 'users':
                $data = $this->getUserActivityReport($request)->getData();
                $filename = 'user_activity_report.csv';
                break;
            default:
                $data = $this->getStats($request)->getData();
                $filename = 'summary_report.csv';
                break;
        }
        
        // Convert to CSV (simplified - in production use a CSV library)
        $csv = $this->arrayToCSV($data);
        
        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename={$filename}");
    }

    /**
     * Helper: Get date filter based on range
     */
    private function getDateFilter($dateRange)
    {
        switch ($dateRange) {
            case 'week':
                return now()->subWeek();
            case 'month':
                return now()->subMonth();
            case 'quarter':
                return now()->subMonths(3);
            case 'year':
                return now()->subYear();
            case 'all':
            default:
                return null;
        }
    }

    /**
     * Helper: Convert array to CSV
     */
    private function arrayToCSV($data)
    {
        if (empty($data)) {
            return '';
        }
        
        $output = fopen('php://temp', 'r+');
        
        // Get headers from first item
        if (is_array($data) || is_object($data)) {
            $firstItem = is_array($data) ? reset($data) : $data;
            if (is_object($firstItem) || is_array($firstItem)) {
                $headers = array_keys((array)$firstItem);
                fputcsv($output, $headers);
            }
        }
        
        // Add data rows
        foreach ($data as $row) {
            fputcsv($output, (array)$row);
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }
}