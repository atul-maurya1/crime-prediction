import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { crimeService } from '../services/crimeService';
import { CRIME_TYPES, SEVERITIES, CASE_STATUSES, REPORTING_SOURCES, CITIES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AddCrimePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true' || !!id;
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    crimeType: '',
    description: '',
    date: '',
    time: '',
    location: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    severity: 'Medium',
    caseStatus: 'Under Investigation',
    reportingSource: 'Police Station'
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchCrime();
    }
  }, [id]);

  const fetchCrime = async () => {
    try {
      const res = await crimeService.getCrime(id);
      const data = res.data;
      setFormData({
        ...data,
        date: data.date.split('T')[0],
      });
    } catch (error) {
      toast.error('Failed to load crime data');
      navigate('/crimes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (isEdit) {
        await crimeService.updateCrime(id, payload);
        toast.success('Crime updated successfully');
      } else {
        await crimeService.createCrime(payload);
        toast.success('Crime added successfully');
      }
      navigate('/crimes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save record');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEdit ? 'Edit Crime Record' : 'Add New Crime Record'}
      </h1>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Crime Type *</label>
              <select name="crimeType" required value={formData.crimeType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Type</option>
                {CRIME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time *</label>
              <input type="time" name="time" required value={formData.time} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City *</label>
              <select name="city" required value={formData.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select City</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Location Details *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Street address or cross streets" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude *</label>
              <input type="number" step="any" name="latitude" required value={formData.latitude} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude *</label>
              <input type="number" step="any" name="longitude" required value={formData.longitude} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Severity</label>
              <select name="severity" value={formData.severity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="caseStatus" value={formData.caseStatus} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                {CASE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => navigate('/crimes')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCrimePage;
