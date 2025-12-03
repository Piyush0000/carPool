import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GroupMember {
  id: string;
  name: string;
  liveLocation?: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface GroupLocationMapProps {
  members: GroupMember[];
  destination: {
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
  };
  className?: string;
}

const GroupLocationMap: React.FC<GroupLocationMapProps> = ({ 
  members, 
  destination,
  className = '' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      // Set initial view to destination or default location
      const defaultCenter: [number, number] = destination.coordinates || [28.6139, 77.2090]; // Delhi coordinates
      
      mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Create layer group for markers
      markersRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current?.clearLayers();

    // Add member location markers
    members.forEach(member => {
      if (member.liveLocation?.coordinates) {
        const [lng, lat] = member.liveLocation.coordinates;
        const marker = L.marker([lat, lng]).addTo(markersRef.current!);
        marker.bindPopup(`<b>${member.name}</b><br>Current Location`);
      }
    });

    // Add destination marker
    if (destination.coordinates) {
      const [lng, lat] = destination.coordinates;
      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(markersRef.current!);
      marker.bindPopup(`<b>Destination</b><br>${destination.address}`);
    }

    // Fit bounds to show all markers
    const allCoordinates = [
      ...members
        .filter(member => member.liveLocation?.coordinates)
        .map(member => {
          const [lng, lat] = member.liveLocation!.coordinates;
          return [lat, lng] as [number, number];
        }),
      destination.coordinates ? [destination.coordinates[1], destination.coordinates[0]] as [number, number] : null
    ].filter(Boolean) as [number, number][];

    if (allCoordinates.length > 0) {
      const bounds = L.latLngBounds(allCoordinates);
      mapInstanceRef.current?.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [members, destination]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
};

export default GroupLocationMap;