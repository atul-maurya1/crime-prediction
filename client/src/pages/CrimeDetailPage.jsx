import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crimeService } from '../services/crimeService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate, getSeverityColor, getStatusColor } from '../utils/helpers';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CrimeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [crime, setCrime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchCrime();
  }, [id]);

  const fetchCrime = async () => {
    try {
      const res = await crimeService.getCrime(id);
      setCrime(res.data);
    } catch (error) {
      toast.error('Failed to load crime details');
      navigate('/crimes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await crimeService.deleteCrime(id);
      toast.success('Crime deleted');
      navigate('/crimes');
    } catch (error) {
      toast.error('Failed to delete crime');
      setDeleteDialog(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!crime) return <div className="text-center py-10">Crime not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/crimes')} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to List
        </button>
        {isAdmin && (
          <div className="flex space-x-3">
            <button onClick={() => navigate(`/crimes/new?edit=true&id=${id}`)} className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button onClick={() => setDeleteDialog(true)} className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Crime Details: {crime.crimeType}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Record ID: {crime._id}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getSeverityColor(crime.severity)}`}>
              {crime.severity} Severity
            </span>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(crime.caseStatus)}`}>
              {crime.caseStatus}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                Date & Time
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(crime.date)} at {crime.time}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {crime.location}<br />
                {crime.city}, {crime.state}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-gray-400" />
                Reporting Source
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {crime.reportingSource}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Description
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {crime.description || 'No description provided.'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-4 h-96">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Location Map</h4>
        {crime.latitude && crime.longitude ? (
          <MapContainer center={[crime.latitude, crime.longitude]} zoom={15} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[crime.latitude, crime.longitude]}>
              <Popup>
                <strong>{crime.crimeType}</strong><br />
                {crime.location}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <p className="text-gray-500">Location coordinates not available</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Crime Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
      />
    </div>
  );
};

export default CrimeDetailPage;
