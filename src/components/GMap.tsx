/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { DEFAULT_SHIPMENTS } from '../data';

// Set global MapTiler key
const MAPTILER_KEY = 'EBHCwxAhPeIxNzMS3ZKI';
maptilersdk.config.apiKey = MAPTILER_KEY;

// Coordinates mapping for Delhi-Noida locations to guarantee smooth mapping/movement (Lng, Lat for MapTiler)
export const DELHI_NOIDA_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'connaught place, delhi': { lat: 28.6304, lng: 77.2177 },
  'sector 62, noida, up': { lat: 28.6219, lng: 77.3793 },
  'dwarka sector 10, delhi': { lat: 28.5850, lng: 77.0490 },
  'sector 18, noida, up': { lat: 28.5708, lng: 77.3261 },
  'igi airport t3, delhi': { lat: 28.5562, lng: 77.1001 },
  'sector 150, noida, up': { lat: 28.4636, lng: 77.4589 }
};

// Map search helper
export function resolveLocation(inputStr: string): { lat: number; lng: number } {
  const cleanInput = inputStr.toLowerCase().trim();
  for (const [key, coords] of Object.entries(DELHI_NOIDA_LOCATIONS)) {
    if (key.includes(cleanInput) || cleanInput.includes(key.split(',')[0])) {
      return coords;
    }
  }
  // Fallback coords centered near Akshardham / Mayur Vihar crossing (NCR central spine)
  return { lat: 28.5984, lng: 77.3115 };
}

interface GMapProps {
  origin?: string;
  destination?: string;
  activeShipmentId?: string;
  className?: string;
}

export default function GMap({
  origin = '',
  destination = '',
  activeShipmentId = '',
  className = 'w-full h-full'
}: GMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // NCR bounding box (S-W to N-E coordinates of Delhi + Noida) to lock map
    const ncrBounds: [number, number, number, number] = [76.80, 28.32, 77.65, 28.92];

    const map = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.STREETS.DARK, // High contrast tech style
      center: [77.29, 28.59], // Centered right in the middle of Delhi & Noida
      zoom: 11.2,
      minZoom: 10,
      maxZoom: 16,
      maxBounds: ncrBounds, // Keep it restricted only to Delhi & Noida region
      navigationControl: true,
      geolocateControl: false
    });

    mapInstanceRef.current = map;

    map.on('load', () => {
      renderMapDetails();
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map details on prop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && map.loaded()) {
      renderMapDetails();
    }
  }, [origin, destination, activeShipmentId]);

  // Main draw loop
  const renderMapDetails = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // 2. Add Standard Landmarks (Noida + Delhi network points)
    const LANDMARKS = [
      { name: "Connaught Place Hub", coords: [77.2177, 28.6304], type: "Delhi Center", color: "#4285F4" },
      { name: "Sec 62 Noida Yard", coords: [77.3793, 28.6219], type: "Tata Ace Dispatch", color: "#ff5545" },
      { name: "Sec 18 Noida Stn", coords: [77.3261, 28.5708], type: "Local Cab Stand", color: "#eab308" },
      { name: "Delhi IGI Airport T3", coords: [77.1001, 28.5562], type: "SUV XL Shuttle Zone", color: "#22c55e" }
    ];

    LANDMARKS.forEach((l) => {
      const el = document.createElement('div');
      el.className = 'custom-landmark-pin';
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = l.color;
      el.style.border = '2px solid #ffffff';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';

      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat(l.coords as [number, number])
        .setPopup(new maptilersdk.Popup({ offset: 12 }).setHTML(`
          <div style="color: #0c0a09; font-family: sans-serif; font-size: 11px; padding: 4px; line-height: 1.4;">
            <strong style="text-transform: uppercase; font-weight: 800; color: #171717;">${l.name}</strong>
            <p style="margin: 3px 0 0; color: #52525b; font-weight: 500;">Type: ${l.type}</p>
          </div>
        `))
        .addTo(map);
      markersRef.current.push(marker);
    });

    // 3. Resolve actual route points
    const shipment = DEFAULT_SHIPMENTS.find((s) => s.id === activeShipmentId);
    const resolvedOrigin = origin ? resolveLocation(origin) : (shipment ? resolveLocation(shipment.origin) : null);
    const resolvedDest = destination ? resolveLocation(destination) : (shipment ? resolveLocation(shipment.destination) : null);

    if (resolvedOrigin && resolvedDest) {
      // Create multi-point curved path for real-looking transit routes (DND / Expressway simulation)
      let coordinates = [
        [resolvedOrigin.lng, resolvedOrigin.lat],
        [resolvedDest.lng, resolvedDest.lat]
      ];

      const isCP = (Math.abs(resolvedOrigin.lng - 77.2177) < 0.01 && Math.abs(resolvedOrigin.lat - 28.6304) < 0.01);
      const isSec62 = (Math.abs(resolvedDest.lng - 77.3793) < 0.01 && Math.abs(resolvedDest.lat - 28.6219) < 0.01);
      
      const isSec18 = (Math.abs(resolvedOrigin.lng - 77.3261) < 0.01 && Math.abs(resolvedOrigin.lat - 28.5708) < 0.01);
      const isDwarka = (Math.abs(resolvedDest.lng - 77.0490) < 0.01 && Math.abs(resolvedDest.lat - 28.5850) < 0.01);

      if (isCP && isSec62) {
        // CP -> Akshardham Crossing -> Mayur Vihar -> Sector 62 Noida
        coordinates = [
          [77.2177, 28.6304],
          [77.2580, 28.6180],
          [77.2960, 28.5990],
          [77.3390, 28.6010],
          [77.3793, 28.6219]
        ];
      } else if (isSec18 && isDwarka) {
        // Noida Sect 18 -> DND Flyway -> Ring Road -> Airport Junction -> Dwarka
        coordinates = [
          [77.3261, 28.5708],
          [77.2880, 28.5750],
          [77.2410, 28.5680],
          [77.1850, 28.5520],
          [77.1080, 28.5610],
          [77.0490, 28.5850]
        ];
      }

      // Draw Route Polyline
      const sourceId = 'active-route-src';
      const layerId = 'active-route-lyr';

      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff5545',
          'line-width': 5,
          'line-opacity': 0.85
        }
      });

      // Fit bounds nicely to current route
      const bounds = coordinates.reduce((val, c) => {
        return val.extend(c as [number, number]);
      }, new maptilersdk.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

      map.fitBounds(bounds, { padding: 50, maxZoom: 13.5, duration: 1200 });

      // Add Start Place Pin
      const sPinEl = document.createElement('div');
      sPinEl.className = 'route-start-pin';
      sPinEl.style.width = '20px';
      sPinEl.style.height = '20px';
      sPinEl.style.borderRadius = '50%';
      sPinEl.style.backgroundColor = '#1e293b';
      sPinEl.style.border = '2.5px solid #ff5545';
      sPinEl.style.display = 'flex';
      sPinEl.style.alignItems = 'center';
      sPinEl.style.justifyContent = 'center';
      sPinEl.style.color = '#ffffff';
      sPinEl.style.fontSize = '9px';
      sPinEl.style.fontWeight = 'bold';
      sPinEl.innerText = 'S';

      const sMarker = new maptilersdk.Marker({ element: sPinEl })
        .setLngLat(coordinates[0] as [number, number])
        .setPopup(new maptilersdk.Popup({ offset: 12 }).setHTML(`
          <div style="color: #0c0a09; font-family: sans-serif; font-size: 11px; padding: 4px;">
            <strong style="color: #ff5545;">DISPATCH ORIGIN</strong>
            <p style="margin: 2px 0 0; color: #52525b;">${origin || (shipment ? shipment.origin : 'Source point')}</p>
          </div>
        `))
        .addTo(map);
      markersRef.current.push(sMarker);

      // Add End Destination Pin
      const dPinEl = document.createElement('div');
      dPinEl.className = 'route-dest-pin';
      dPinEl.style.width = '20px';
      dPinEl.style.height = '20px';
      dPinEl.style.borderRadius = '50%';
      dPinEl.style.backgroundColor = '#ff5545';
      dPinEl.style.border = '2.5px solid #ffffff';
      dPinEl.style.display = 'flex';
      dPinEl.style.alignItems = 'center';
      dPinEl.style.justifyContent = 'center';
      dPinEl.style.color = '#ffffff';
      dPinEl.style.fontSize = '9px';
      dPinEl.style.fontWeight = 'bold';
      dPinEl.innerText = 'D';

      const dMarker = new maptilersdk.Marker({ element: dPinEl })
        .setLngLat(coordinates[coordinates.length - 1] as [number, number])
        .setPopup(new maptilersdk.Popup({ offset: 12 }).setHTML(`
          <div style="color: #0c0a09; font-family: sans-serif; font-size: 11px; padding: 4px;">
            <strong style="color: #ff5545;">DESTINATION REACH</strong>
            <p style="margin: 2px 0 0; color: #52525b;">${destination || (shipment ? shipment.destination : 'Target Point')}</p>
          </div>
        `))
        .addTo(map);
      markersRef.current.push(dMarker);
    }

    // 4. Add moving vehicle live pulsing marker if trackable shipment exists
    if (shipment) {
      const vLng = shipment.currentLocation.lng;
      const vLat = shipment.currentLocation.lat;

      const el = document.createElement('div');
      el.className = 'live-tracking-vehicle-pulse';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#ff5545';
      el.style.border = '3px solid #ffffff';
      el.style.boxShadow = '0 0 16px #ff5545';
      el.style.animation = 'ncr-tracker-pulse 1.6s infinite';

      // Insert css animation if needed
      if (!document.getElementById('ncr-pulse-styles')) {
        const style = document.createElement('style');
        style.id = 'ncr-pulse-styles';
        style.innerHTML = `
          @keyframes ncr-tracker-pulse {
            0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(255, 85, 69, 0.7); }
            70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 85, 69, 0); }
            100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(255, 85, 69, 0); }
          }
        `;
        document.head.appendChild(style);
      }

      const vMarker = new maptilersdk.Marker({ element: el })
        .setLngLat([vLng, vLat])
        .setPopup(new maptilersdk.Popup({ offset: 14 }).setHTML(`
          <div style="color: #0c0a09; font-family: sans-serif; font-size: 11px; padding: 4px; line-height: 1.4;">
            <strong style="color: #ff5545; font-weight: 800;">VEHICLE ${shipment.id}</strong>
            <p style="margin: 3px 0 0; color: #404040;">Status: <span style="font-weight: 700; color: #15803d;">${shipment.status}</span></p>
            <p style="margin: 1px 0 0; color: #737373;">ETA: ${shipment.eta !== '00:00:00' ? shipment.eta : 'DELIVERED'}</p>
          </div>
        `))
        .addTo(map);
      markersRef.current.push(vMarker);
    }
  };

  return (
    <div className={`relative ${className} overflow-hidden rounded-3xl`}>
      {/* Mapbox gl/MapTiler container */}
      <div ref={mapContainerRef} className="w-full h-full text-neutral-900" style={{ minHeight: '100%' }} />
    </div>
  );
}
