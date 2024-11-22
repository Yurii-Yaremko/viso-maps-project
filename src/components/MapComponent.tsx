import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface MarkerData {
  id: number;
  lat: number;
  lng: number;
  timestamp: string;
  label: string;
  nextId: number | null;
}

const containerStyle = {
  width: '100%',
  height: '700px',
};

const center = {
  lat: 48.8566,
  lng: 2.3522,
};

const MapComponent = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const querySnapshot = await getDocs(collection(db, 'markers'));
      const fetchedMarkers: MarkerData[] = [];
      
      querySnapshot.forEach((doc) => {
        const markerData = doc.data();
        
        const marker: MarkerData = {
          id: parseInt(doc.id, 10),
          lat: markerData.lat,
          lng: markerData.lng,
          timestamp: markerData.timestamp,
          label: markerData.label,
          nextId: markerData.nextId || null,
        };

        fetchedMarkers.push(marker);
      });
      
      setMarkers(fetchedMarkers);
    };

    fetchMarkers();
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) {
      return;
    }

    const newMarker: MarkerData = {
      id: markers.length + 1,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      timestamp: new Date().toISOString(),
      label: `${markers.length + 1}`,
      nextId: null,
    };

    setMarkers((prevMarkers) => {
      if (prevMarkers.length > 0) {
        prevMarkers[prevMarkers.length - 1].nextId = newMarker.id;
      }

      return [...prevMarkers, newMarker];
    });
  };

  const handleMarkerDelete = (id: number) => {
    setMarkers((prevMarkers) =>
      prevMarkers
        .filter((marker) => marker.id !== id)
        .map((marker, index, updatedMarkers) => {
          if (marker.nextId === id) {
            marker.nextId = updatedMarkers[index + 1]?.id || null;
          }
          return marker;
        })
    );
  };

  const handleClearMarkers = () => {
    setMarkers([]);
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              label={marker.label}
              draggable
              onDragEnd={(event) => {
                const newLat = event.latLng?.lat();
                const newLng = event.latLng?.lng();
                if (newLat !== undefined && newLng !== undefined) {
                  setMarkers((prevMarkers) =>
                    prevMarkers.map((m) =>
                      m.id === marker.id ? { ...m, lat: newLat, lng: newLng } : m
                    )
                  );
                }
              }}
              onClick={() => handleMarkerDelete(marker.id)}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      <button onClick={handleClearMarkers} style={{ marginTop: '10px' }}>
        Clear All Markers
      </button>
    </div>
  );
};

export default MapComponent;
