import React, { useState, useEffect } from 'react';
import { crimeService } from '../services/crimeService';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatDate, getSeverityColor } from '../utils/helpers';
import { CRIME_TYPES } from '../utils/constants';
import toast from 'react-hot-toast';
import { Filter } from 'lucide-react';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerIcon = (severity) => {
  const color = severity === 'Critical' ? 'red' :
                severity === 'High' ? 'orange' :
                severity === 'Medium' ? 'gold' : 'green';
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapPage = () => {
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const res = await crimeService.getCrimes({ limit: 1200 });
      const crimeList = res.data?.crimes || [];
      setCrimes(crimeList.filter(c => c.latitude && c.longitude));
    } catch (error) {
      toast.error('Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const filteredCrimes = typeFilter
    ? crimes.filter(c => c.crimeType === typeFilter)
    : crimes;

  if (loading) return <LoadingSpinner />;

  // Center on India
  const defaultCenter = [22.5, 78.9];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historical Reported Crime Distribution</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredCrimes.length} reported incidents on map
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Crime Types</option>
              {CRIME_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 text-xs bg-white px-3 py-2 rounded-lg shadow-sm border">
            <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-1.5"></span>Critical</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1.5"></span>High</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-1.5"></span>Medium</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>Low</div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden relative z-0">
        <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredCrimes.map(crime => (
            <Marker 
              key={crime._id} 
              position={[crime.latitude, crime.longitude]}
              icon={getMarkerIcon(crime.severity)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-base mb-1">{crime.crimeType}</h3>
                  <p className="text-sm text-gray-600">{formatDate(crime.date)} at {crime.time}</p>
                  <p className="text-sm mt-1">{crime.location}, {crime.city}</p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs font-medium">{crime.severity}</span>
                    <span className="text-xs text-gray-500">{crime.caseStatus}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <strong>Disclaimer:</strong> This map shows historical reported crime data for academic analysis only. 
          It does not indicate that a specific area is inherently unsafe or that residents of an area are likely 
          to commit crimes. Historical data may contain reporting and sampling biases.
        </p>
      </div>
    </div>
  );
};

export default MapPage;
