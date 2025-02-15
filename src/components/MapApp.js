import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { Search, MapPin, Layers, Navigation, Trash, Info, X, Edit, Save, Undo, Redo, Download, Upload } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { debounce } from 'lodash';

// Leaflet icon configuration
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const defaultIcon = new L.Icon.Default();

const MapEvents = ({ onLocationFound }) => {
  useMapEvents({
    click(e) {
      onLocationFound(e.latlng);
    },
  });
  return null;
};

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng]);
  return null;
};

const MacOSButton = ({ children, onClick, className = '', title }) => (
  <button 
    className={`px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
);

const MapApp = () => {
  const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayer, setMapLayer] = useState('streets');
  const [route, setRoute] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isEditingMarker, setIsEditingMarker] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [transportMode, setTransportMode] = useState('driving');
  const [history, setHistory] = useState([[]]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const updateHistory = useCallback((newMarkers) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newMarkers);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [history, currentHistoryIndex]);

  const handleAddMarker = useCallback((location) => {
    const newMarkers = [...markers, { ...location, id: Date.now(), label: `Marker ${markers.length + 1}` }];
    setMarkers(newMarkers);
    updateHistory(newMarkers);
  }, [markers, updateHistory]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch (error) {
      setErrorMessage('Error searching location. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query) return;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const data = await response.json();
        setSearchSuggestions(data);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    }, 300),
    []
  );

  const handleRouting = useCallback(async (markersArray) => {
    const usedMarkers = markersArray || markers;
    if (usedMarkers.length >= 2) {
      setIsLoading(true);
      try {
        const start = usedMarkers[usedMarkers.length - 2];
        const end = usedMarkers[usedMarkers.length - 1];
        const profile = transportMode === 'cycling' ? 'bike' : transportMode;
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/${profile}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
          setRouteInfo({
            distance: (data.routes[0].distance / 1000).toFixed(2) + ' km',
            duration: (data.routes[0].duration / 60).toFixed(2) + ' min'
          });
        }
      } catch (error) {
        setErrorMessage('Error calculating route. Please try again.');
        setTimeout(() => setErrorMessage(''), 5000);
      } finally {
        setIsLoading(false);
      }
    }
  }, [markers, transportMode]);

  const handleMarkerDragEnd = useCallback((markerId, newLatLng) => {
    setMarkers(prevMarkers => {
      const newMarkers = prevMarkers.map(marker => 
        marker.id === markerId ? { ...marker, lat: newLatLng.lat, lng: newLatLng.lng } : marker
      );
      updateHistory(newMarkers);
      if (route) handleRouting(newMarkers);
      return newMarkers;
    });
  }, [route, handleRouting, updateHistory]);

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMessage('Error getting your location. Please enable permissions.');
          setTimeout(() => setErrorMessage(''), 5000);
        }
      );
    }
  }, []);

  const handleExportMarkers = useCallback(() => {
    const dataStr = JSON.stringify(markers);
    const link = document.createElement('a');
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr);
    link.download = 'markers.json';
    link.click();
  }, [markers]);

  const handleImportMarkers = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedMarkers = JSON.parse(event.target.result);
        setMarkers(importedMarkers);
        updateHistory(importedMarkers);
      } catch (error) {
        setErrorMessage('Invalid markers file format.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    };
    reader.readAsText(file);
  }, [updateHistory]);

  const handleUndo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1);
      setMarkers(history[currentHistoryIndex - 1]);
    }
  }, [currentHistoryIndex, history]);

  const handleRedo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(prev => prev + 1);
      setMarkers(history[currentHistoryIndex + 1]);
    }
  }, [currentHistoryIndex, history]);

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      {/* Top toolbar */}
      <div className="flex items-center p-4 bg-white border-b border-gray-200 space-x-2">
        <div className="relative flex-grow">
          <input 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search location..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
          {searchSuggestions.length > 0 && (
            <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSearchQuery(suggestion.display_name);
                    setCenter({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
                    setSearchSuggestions([]);
                  }}
                >
                  {suggestion.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <select
          value={transportMode}
          onChange={(e) => setTransportMode(e.target.value)}
          className="p-2 border rounded-md text-sm"
        >
          <option value="driving">Driving</option>
          <option value="cycling">Cycling</option>
          <option value="walking">Walking</option>
        </select>

        <MacOSButton onClick={handleSearch} title="Search">
          <Search className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={() => setMapLayer(l => l === 'streets' ? 'satellite' : 'streets')} title="Toggle Layer">
          <Layers className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={handleRouting} title="Calculate Route">
          <Navigation className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={handleLocateMe} title="My Location">
          <MapPin className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={handleExportMarkers} title="Export Markers">
          <Download className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={() => fileInputRef.current.click()} title="Import Markers">
          <Upload className="h-4 w-4" />
        </MacOSButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportMarkers}
          className="hidden"
          accept=".json"
        />
        <MacOSButton onClick={handleUndo} disabled={currentHistoryIndex === 0} title="Undo">
          <Undo className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={handleRedo} disabled={currentHistoryIndex === history.length - 1} title="Redo">
          <Redo className="h-4 w-4" />
        </MacOSButton>
        <MacOSButton onClick={() => setMarkers([])} title="Clear All">
          <Trash className="h-4 w-4" />
        </MacOSButton>
      </div>

      {/* Map container */}
      <div className="flex-grow relative">
        {isLoading && (
          <div className="absolute z-50 top-4 left-4 bg-white p-2 rounded-md shadow-md flex items-center">
            <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        )}

        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url={mapLayer === 'streets' 
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            }
            attribution={mapLayer === 'streets' 
              ? '© OpenStreetMap'
              : '© Esri'
            }
          />
          {markers.map((marker, index) => (
            <Marker
              key={marker.id}
              position={marker}
              icon={
                route && index === markers.length - 2 ? startIcon :
                route && index === markers.length - 1 ? endIcon :
                defaultIcon
              }
              draggable={true}
              eventHandlers={{
                click: () => setSelectedMarker(marker),
                dragend: (e) => handleMarkerDragEnd(marker.id, e.target.getLatLng())
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{marker.label}</strong><br />
                  {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          ))}
          {route && <Polyline positions={route} color="blue" />}
          <MapEvents onLocationFound={handleAddMarker} />
          <RecenterAutomatically lat={center.lat} lng={center.lng} />
        </MapContainer>
      </div>

      {/* Info panels */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Marker Details</h3>
            <button onClick={() => setSelectedMarker(null)} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          {isEditingMarker ? (
            <input
              type="text"
              defaultValue={selectedMarker.label}
              onBlur={(e) => {
                setMarkers(markers.map(m => 
                  m.id === selectedMarker.id ? {...m, label: e.target.value} : m
                ));
                setIsEditingMarker(false);
              }}
              className="w-full p-1 mb-2 border rounded"
              autoFocus
            />
          ) : (
            <p className="font-medium mb-2">{selectedMarker.label}</p>
          )}
          <p className="text-sm">Latitude: {selectedMarker.lat.toFixed(6)}</p>
          <p className="text-sm">Longitude: {selectedMarker.lng.toFixed(6)}</p>
          <div className="flex space-x-2 mt-3">
            <MacOSButton onClick={() => setIsEditingMarker(true)}>
              <Edit className="h-4 w-4" />
            </MacOSButton>
            <MacOSButton onClick={() => {
              setMarkers(markers.filter(m => m.id !== selectedMarker.id));
              setSelectedMarker(null);
            }}>
              <Trash className="h-4 w-4" />
            </MacOSButton>
          </div>
        </div>
      )}

      {routeInfo && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Route Info</h3>
          <p className="text-sm">Distance: {routeInfo.distance}</p>
          <p className="text-sm">Duration: {routeInfo.duration}</p>
        </div>
      )}

      {errorMessage && (
        <div className="absolute bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200 text-sm text-gray-500">
        <div>{markers.length} markers placed</div>
        <div>{mapLayer === 'streets' ? 'Street View' : 'Satellite View'}</div>
      </div>
    </div>
  );
};

export default MapApp;