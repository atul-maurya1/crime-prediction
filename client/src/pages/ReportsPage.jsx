import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { analyticsService } from '../services/analyticsService';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Download, FileText, Table } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [filters, setFilters] = useState({});
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getSummary(filters);
      setSummary(res.data);
    } catch (error) {
      toast.error('Failed to load summary for report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const blob = await reportService.exportCrimesCSV(filters);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `crime_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Data Export</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download customized crime reports</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {exporting ? (
            <span className="flex items-center"><LoadingSpinner /> Exporting...</span>
          ) : (
            <><Download className="h-5 w-5 mr-2" /> Export to CSV</>
          )}
        </button>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-400" />
            Report Summary
          </h3>
        </div>
        
        {loading ? (
          <div className="p-12"><LoadingSpinner /></div>
        ) : summary ? (
          <div className="px-6 py-5">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Records in Range</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{summary.totalCrimes}</dd>
              </div>
              <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Open Cases</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{summary.openCases}</dd>
              </div>
              <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Closed Cases</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{summary.closedCases}</dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <Table className="h-4 w-4 mr-2" /> Export Details
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Format: Comma Separated Values (.csv)</li>
                <li>• Data fields included: ID, Type, Date, Time, Location, City, State, Latitude, Longitude, Severity, Status</li>
                <li>• Applied filters: {Object.keys(filters).length === 0 ? 'None (All records)' : Object.entries(filters).map(([k,v]) => `${k}=${v}`).join(', ')}</li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReportsPage;
