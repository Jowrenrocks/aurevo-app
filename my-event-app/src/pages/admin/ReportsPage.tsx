import { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Calendar, Users, BarChart3, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

type MonthlyDataItem = {
  month: string;
  events: number;
  attendees: number;
  rsvps: number;
};

interface ReportStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  flaggedEvents: number;
  totalUsers: number;
  totalRsvps: number;
  rsvpBreakdown: {
    yes: number;
    no: number;
    maybe: number;
  };
  eventsByStatus: {
    draft?: number;
    pending?: number;
    approved?: number;
    declined?: number;
    concluded?: number;
    flagged?: number;
  };
  monthlyData: MonthlyDataItem[];
  eventTypeBreakdown: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats | null>(null);

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats', {
        params: { dateRange }
      });
      
      const data = response.data;
      
      // Process monthly data
      const monthlyData = generateMonthlyData((data.recent_events as any[]) || []);
      
      // Process event type breakdown
      const eventTypeBreakdown = generateEventTypeBreakdown(data.recent_events || []);
      
      setStats({
        totalEvents: data.total_events || 0,
        upcomingEvents: data.upcoming_events || 0,
        completedEvents: data.completed_events || 0,
        flaggedEvents: data.flagged_events || 0,
        totalUsers: data.total_users || 0,
        totalRsvps: data.total_rsvps || 0,
        rsvpBreakdown: data.rsvp_breakdown || { yes: 0, no: 0, maybe: 0 },
        eventsByStatus: data.events_by_status || {},
        monthlyData,
        eventTypeBreakdown
      });
      
    } catch (error: any) {
      console.error('Error loading report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (events: any[]): MonthlyDataItem[] => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = new Date().getMonth();
    const monthlyStats: Record<string, MonthlyDataItem> = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthlyStats[months[monthIndex]] = {
        month: months[monthIndex],
        events: 0,
        attendees: 0,
        rsvps: 0
      };
    }

    // Count events per month
    events.forEach((event: any) => {
      const eventDate = new Date(event.created_at);
      const monthName = months[eventDate.getMonth()];

      if (monthlyStats[monthName]) {
        monthlyStats[monthName].events += 1;
        monthlyStats[monthName].rsvps += event.rsvps_count || 0;
        monthlyStats[monthName].attendees += event.rsvps_count || 0;
      }
    });

    return Object.values(monthlyStats);
  };

  const generateEventTypeBreakdown = (events: any[]) => {
    const types: { [key: string]: number } = {};
    
    events.forEach((event: any) => {
      // Try to extract type from title or description
      const title = (event.title || '').toLowerCase();
      let type = 'Other';
      
      if (title.includes('wedding')) type = 'Wedding';
      else if (title.includes('birthday')) type = 'Birthday';
      else if (title.includes('corporate') || title.includes('conference')) type = 'Corporate';
      else if (title.includes('anniversary')) type = 'Anniversary';
      
      types[type] = (types[type] || 0) + 1;
    });

    const total = events.length || 1;
    return Object.entries(types).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  };

  const handleRefresh = () => {
    toast.promise(
      loadReportData(),
      {
        loading: 'Refreshing report data...',
        success: 'Report data refreshed',
        error: 'Failed to refresh'
      }
    );
  };

  const handleExportReport = () => {
    if (!stats) {
      toast.error('No data to export');
      return;
    }

    const reportData = {
      'Report Type': reportType,
      'Date Range': dateRange,
      'Generated': new Date().toLocaleString(),
      'Total Events': stats.totalEvents,
      'Upcoming Events': stats.upcomingEvents,
      'Completed Events': stats.completedEvents,
      'Flagged Events': stats.flaggedEvents,
      'Total Users': stats.totalUsers,
      'Total RSVPs': stats.totalRsvps,
      'RSVPs - Attending': stats.rsvpBreakdown.yes,
      'RSVPs - Not Attending': stats.rsvpBreakdown.no,
      'RSVPs - Maybe': stats.rsvpBreakdown.maybe
    };

    const csvContent = [
      ['Metric', 'Value'],
      ...Object.entries(reportData).map(([key, value]) => [key, value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report exported successfully');
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#d4b885] mx-auto mb-4 animate-spin" />
          <p className="text-lg text-[#3b2a13] font-medium">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Report</h3>
          <p className="text-gray-600 mb-4">Unable to fetch report data</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-[#d4b885] text-[#3b2a13] rounded-lg font-semibold hover:bg-[#c4b184] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3b2a13]">REPORTS & ANALYTICS</h2>
            <p className="text-sm text-[#3b2a13]">View detailed insights and generate reports</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white text-[#3b2a13] rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 border-2 border-[#3b2a13]"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button 
              onClick={handleExportReport}
              className="px-4 py-2 bg-[#3b2a13] text-white rounded-lg hover:bg-[#2a1f13] transition flex items-center gap-2 font-medium"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Event Report</option>
              <option value="attendance">Attendance Report</option>
              <option value="users">User Activity Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalEvents}</h3>
          <p className="text-blue-100">Total Events</p>
          <div className="mt-3 pt-3 border-t border-blue-400">
            <p className="text-sm text-blue-100">
              {stats.upcomingEvents} upcoming • {stats.completedEvents} completed
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalRsvps}</h3>
          <p className="text-purple-100">Total RSVPs</p>
          <div className="mt-3 pt-3 border-t border-purple-400">
            <p className="text-sm text-purple-100">
              Average: {Math.round(stats.totalRsvps / (stats.totalEvents || 1))} per event
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
          <p className="text-green-100">Total Users</p>
          <div className="mt-3 pt-3 border-t border-green-400">
            <p className="text-sm text-green-100">
              Platform registered users
            </p>
          </div>
        </div>
      </div>

      {/* Event Status Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Event Status Breakdown</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(stats.eventsByStatus).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900 capitalize">{status}</span>
                <span className="text-sm text-gray-600">{count} events</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${Math.round((count / stats.totalEvents) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">RSVP Response Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">✅ Attending</span>
              <span className="text-2xl font-bold text-green-600">{stats.rsvpBreakdown.yes}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-full rounded-full"
                style={{ width: `${Math.round((stats.rsvpBreakdown.yes / stats.totalRsvps) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-800">❌ Not Attending</span>
              <span className="text-2xl font-bold text-red-600">{stats.rsvpBreakdown.no}</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-full rounded-full"
                style={{ width: `${Math.round((stats.rsvpBreakdown.no / stats.totalRsvps) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">❓ Maybe</span>
              <span className="text-2xl font-bold text-yellow-600">{stats.rsvpBreakdown.maybe}</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-full rounded-full"
                style={{ width: `${Math.round((stats.rsvpBreakdown.maybe / stats.totalRsvps) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Type Breakdown */}
      {stats.eventTypeBreakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Event Type Distribution</h2>
          </div>
          <div className="space-y-4">
            {stats.eventTypeBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">{item.type}</span>
                  <span className="text-sm text-gray-600">{item.count} events ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Monthly Performance (Last 6 Months)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Month</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Events</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">RSVPs</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Attendees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.monthlyData.map((month, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{month.month}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {month.events}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                      {month.rsvps}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-green-600">
                    {month.attendees}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-center text-sm font-bold text-blue-700">
                  {stats.monthlyData.reduce((sum, m) => sum + m.events, 0)}
                </td>
                <td className="px-6 py-4 text-center text-sm font-bold text-purple-700">
                  {stats.monthlyData.reduce((sum, m) => sum + m.rsvps, 0)}
                </td>
                <td className="px-6 py-4 text-center text-sm font-bold text-green-700">
                  {stats.monthlyData.reduce((sum, m) => sum + m.attendees, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Export Options</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Download detailed reports in your preferred format
        </p>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium"
          >
            <FileText className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}