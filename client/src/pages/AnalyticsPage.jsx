import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

const AnalyticsPage = () => {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState({
    trends: [],
    byType: [],
    byLocation: [],
    byTime: [],
    severity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [trendsRes, byTypeRes, byLocRes, byTimeRes, sevRes] = await Promise.all([
        analyticsService.getTrends(filters),
        analyticsService.getByType(filters),
        analyticsService.getByLocation(filters),
        analyticsService.getByTime(filters),
        analyticsService.getSeverityAnalysis(filters)
      ]);
      
      // Format trends (year/month to YYYY-MM string)
      const formattedTrends = (trendsRes.data || []).map(item => ({
        name: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count
      }));

      // Format time object { Morning: x, Afternoon: y, ... } to array [{ time: 'Morning', count: x }]
      const timeObj = byTimeRes.data || {};
      const formattedTime = Object.keys(timeObj).map(key => ({
        time: key,
        count: timeObj[key]
      }));

      setData({
        trends: formattedTrends,
        byType: byTypeRes.data || [],
        byLocation: byLocRes.data || [],
        byTime: formattedTime,
        severity: sevRes.data || []
      });
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Deep-dive statistical charts and distribution patterns</p>
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Crime Trends */}
        <div className="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crime Trends Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Total Crimes" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime by Location */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents by City</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byLocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" fontSize={12} angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Crimes" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime by Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents by Time of Day</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" name="Crimes" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime by Type */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution by Crime Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byType}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                  label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.severity}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                  label={({ _id, count }) => `${_id}: ${count}`}
                >
                  {data.severity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry._id === 'Critical' ? '#ef4444' :
                      entry._id === 'High' ? '#f97316' :
                      entry._id === 'Medium' ? '#f59e0b' : '#10b981'
                    } />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
