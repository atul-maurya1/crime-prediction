import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crimeService } from '../services/crimeService';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { formatDate, getSeverityColor, getStatusColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const CrimesPage = () => {
  const [crimes, setCrimes] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchCrimes();
  }, [filters, page]);

  const fetchCrimes = async () => {
    setLoading(true);
    try {
      const res = await crimeService.getCrimes({ ...filters, page, limit: 10 });
      setCrimes(res.data?.crimes || []);
      setTotalPages(res.data?.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch crimes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await crimeService.deleteCrime(deleteId);
      toast.success('Crime record deleted');
      setDeleteId(null);
      fetchCrimes();
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Crime Records</h1>
        {isAdmin && (
          <button
            onClick={() => navigate('/crimes/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Crime
          </button>
        )}
      </div>

      <FilterBar filters={filters} setFilters={(f) => { setFilters(f); setPage(1); }} />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8"><LoadingSpinner /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {crimes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No records found</td>
                    </tr>
                  ) : (
                    crimes.map((crime) => (
                      <tr key={crime._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{crime.crimeType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(crime.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crime.location}, {crime.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(crime.severity)}`}>
                            {crime.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(crime.caseStatus)}`}>
                            {crime.caseStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => navigate(`/crimes/${crime._id}`)} className="text-blue-600 hover:text-blue-900 mx-2">
                            <Eye className="h-5 w-5" />
                          </button>
                          {isAdmin && (
                            <>
                              <button onClick={() => navigate(`/crimes/${crime._id}?edit=true`)} className="text-indigo-600 hover:text-indigo-900 mx-2">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button onClick={() => setDeleteId(crime._id)} className="text-red-600 hover:text-red-900 mx-2">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Crime Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
      />
    </div>
  );
};

export default CrimesPage;
