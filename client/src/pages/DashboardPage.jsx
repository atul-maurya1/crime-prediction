import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, MapPin, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

const DashboardPage = () => {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, trendsRes, typeRes, locationRes, severityRes] = await Promise.all([
        analyticsService.getSummary(filters),
        analyticsService.getTrends(filters),
        analyticsService.getByType(filters),
        analyticsService.getByLocation(filters),
        analyticsService.getSeverityAnalysis(filters)
      ]);
      
      // Format trends data for chart (convert {_id: {year, month}, count} to readable format)
      const trendsData = (trendsRes.data || []).map(item => ({
        name: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count
      }));

      setData({
        summary: summaryRes.data,
        trends: trendsData,
        byType: typeRes.data || [],
        byLocation: locationRes.data || [],
        severity: severityRes.data || []
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <FilterBar filters={filters} setFilters={setFilters} />

      {loading ? (
        <LoadingSpinner />
      ) : data ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
            <StatCard 
              title="Total Crimes" 
              value={data.summary.totalCrimes || 0} 
              icon={ShieldAlert}
              color="blue"
            />
            <StatCard 
              title="This Month" 
              value={data.summary.thisMonthCrimes || 0} 
              icon={Clock}
              color="purple"
            />
            <StatCard 
              title="Most Common" 
              value={data.summary.mostCommonType || 'N/A'} 
              icon={TrendingUp}
              color="yellow"
            />
            <StatCard 
              title="Top Location" 
              value={data.summary.topLocation || 'N/A'} 
              icon={MapPin}
              color="cyan"
            />
            <StatCard 
              title="Open Cases" 
              value={data.summary.openCases || 0} 
              icon={AlertTriangle}
              color="orange"
            />
            <StatCard 
              title="Closed Cases" 
              value={data.summary.closedCases || 0} 
              icon={CheckCircle}
              color="green"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Trends Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crime Trends Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} name="Reported Crimes" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Type Distribution Pie */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crime Type Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.byType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="_id"
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
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crimes by City</h3>
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

            {/* Severity Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.severity}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="_id"
                      label={({ _id, count }) => `${_id}: ${count}`}
                    >
                      {data.severity.map((entry, index) => {
                        const sevColors = { Low: '#10b981', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
                        return <Cell key={`cell-${index}`} fill={sevColors[entry._id] || COLORS[index % COLORS.length]} />;
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DashboardPage;
