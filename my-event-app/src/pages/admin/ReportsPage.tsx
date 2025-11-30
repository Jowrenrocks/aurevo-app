import { useState } from 'react';
import { FileText, Download, TrendingUp, Calendar, Users, DollarSign, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('month');

  const reportStats = {
    totalEvents: 15,
    totalAttendees: 1250,
    totalRevenue: 2500000,
    avgAttendance: 83.3,
    upcomingEvents: 5,
    completedEvents: 10
  };

  const eventTypeBreakdown = [
    { type: 'Wedding', count: 5, percentage: 33 },
    { type: 'Corporate', count: 4, percentage: 27 },
    { type: 'Birthday', count: 3, percentage: 20 },
    { type: 'Anniversary', count: 2, percentage: 13 },
    { type: 'Other', count: 1, percentage: 7 }
  ];

  const monthlyData = [
    { month: 'January', events: 2, attendees: 180, revenue: 350000 },
    { month: 'February', events: 3, attendees: 250, revenue: 480000 },
    { month: 'March', events: 2, attendees: 170, revenue: 320000 },
    { month: 'April', events: 4, attendees: 320, revenue: 620000 },
    { month: 'May', events: 2, attendees: 180, revenue: 350000 },
    { month: 'June', events: 2, attendees: 150, revenue: 380000 }
  ];

  const handleExportReport = () => {
    alert('Exporting report... (Frontend Demo)');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View detailed insights and generate reports</p>
        </div>
        <button 
          onClick={handleExportReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Report Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Event Report</option>
              <option value="financial">Financial Report</option>
              <option value="attendance">Attendance Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">{reportStats.totalEvents}</h3>
          <p className="text-blue-100">Total Events</p>
          <div className="mt-3 pt-3 border-t border-blue-400">
            <p className="text-sm text-blue-100">
              {reportStats.upcomingEvents} upcoming • {reportStats.completedEvents} completed
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">{reportStats.totalAttendees.toLocaleString()}</h3>
          <p className="text-purple-100">Total Attendees</p>
          <div className="mt-3 pt-3 border-t border-purple-400">
            <p className="text-sm text-purple-100">
              Average: {Math.round(reportStats.totalAttendees / reportStats.totalEvents)} per event
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold">₱{(reportStats.totalRevenue / 1000000).toFixed(1)}M</h3>
          <p className="text-green-100">Total Revenue</p>
          <div className="mt-3 pt-3 border-t border-green-400">
            <p className="text-sm text-green-100">
              Avg: ₱{Math.round(reportStats.totalRevenue / reportStats.totalEvents).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Event Type Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Event Type Breakdown</h2>
        </div>
        <div className="space-y-4">
          {eventTypeBreakdown.map((item, index) => (
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

      {/* Monthly Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Monthly Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Month</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Events</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Attendees</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyData.map((month, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{month.month}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {month.events}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                      {month.attendees}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">
                    ₱{month.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-center text-sm font-bold text-blue-700">
                  {monthlyData.reduce((sum, m) => sum + m.events, 0)}
                </td>
                <td className="px-6 py-4 text-center text-sm font-bold text-purple-700">
                  {monthlyData.reduce((sum, m) => sum + m.attendees, 0)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-green-700">
                  ₱{monthlyData.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
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
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-medium">
            <FileText className="w-4 h-4" />
            Download PDF
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium">
            <FileText className="w-4 h-4" />
            Download Excel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium">
            <FileText className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}