/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TelemetryStats, FleetVehicle, Shipment } from './types';

export const DEFAULT_STATS: TelemetryStats = {
  systemUptime: 99.85,
  activeNodes: 1248, // Number of Active Drivers/Vehicles across Noida & Delhi
  networkLatency: 11, // Avg matching latency in minutes
  liveMonitoring: true,
  activeFleetCount: 450,
  avgDeliveryMinutes: 28,
  secureNodesPercent: 99.9,
};

export const DEFAULT_VEHICLES: FleetVehicle[] = [
  {
    id: 'sedan',
    name: 'Sedan Cab',
    tag: 'POPULAR CHOICE',
    category: 'transit',
    description: 'Comfortable air-conditioned everyday hatchback & sedan cabs (Maruti Dzire, Hyundai Aura) for hassle-free city commutes.',
    capacity: '4 Passengers',
    connectivity: 'Fully AC, Music System',
    controlType: 'Verified Local Driver',
    iconName: 'car',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    passengerCount: 4,
    luggageCount: 2,
    energyType: 'CNG / Petrol Hybrid'
  },
  {
    id: 'suv-xl',
    name: 'SUVCab / XL',
    tag: 'SPACIOUS 6-SEATER',
    category: 'transit',
    description: 'Spacious and premium 6-seater multi-utility vehicles (Maruti Ertiga, Toyota Innova) perfect for family trips or group airport runs.',
    capacity: '6 Passengers',
    connectivity: 'Dual AC, Mobile Chargers',
    controlType: 'Experienced Highway Driver',
    iconName: 'shuttle',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    passengerCount: 6,
    luggageCount: 4,
    energyType: 'Clean Diesel / CNG'
  },
  {
    id: 'cargo-bike',
    name: 'Courier Bike',
    tag: 'SUPERFAST PARCEL',
    category: 'courier',
    description: 'Lightning-fast delivery of small packages, documents, groceries, and keys across Noida & Delhi within an hour.',
    capacity: 'Upto 15 kg',
    connectivity: 'Live GPS Location Tracking',
    controlType: 'Checked Professional Rider',
    iconName: 'bike',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    passengerCount: 1,
    luggageCount: 1,
    energyType: 'Electric Scooter'
  },
  {
    id: 'mini-truck',
    name: 'Tata Ace (Chota Hathi)',
    tag: 'BEST FOR HOUSE MOVING',
    category: 'logistics',
    description: 'Sturdy mini-trucks for commercial loads, industrial boxes, and household moves (furniture, electronics, appliances).',
    capacity: '850 kg Load',
    connectivity: 'In-app real-time status',
    controlType: 'Verified Local Transporter',
    iconName: 'truck',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    passengerCount: 2,
    luggageCount: 20,
    energyType: 'CNG Powered Green Eco'
  },
  {
    id: 'pickup-truck',
    name: 'Pickup Loader (Bolero Maxi)',
    tag: 'HEAVY INDUSTRIAL LOAD',
    category: 'logistics',
    description: 'Powerful pick-up loaders suited for bulky commercial supplies, steel/timber materials, machinery, or full home shifting.',
    capacity: '1.5 Tons Load',
    connectivity: 'Digital Waybill & Location',
    controlType: 'Highway Transport Specialist',
    iconName: 'truck',
    imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&q=80',
    passengerCount: 2,
    luggageCount: 50,
    energyType: 'Heavy Commercial Diesel'
  }
];

export const DEFAULT_SHIPMENTS: Shipment[] = [
  {
    id: 'DL-RU-4201',
    status: 'IN_TRANSIT',
    origin: 'Connaught Place, Delhi',
    destination: 'Sector 62, Noida, UP',
    eta: '00:35:10',
    currentLocation: { lat: 28.5984, lng: 77.3115 }, // Near Akshardham / Mayur Vihar
    historyLogs: [
      {
        time: '15 Mins Ago',
        status: 'DISPATCHED',
        description: 'Goods logged and loaded onto Tata Ace. Driver verified.',
        completed: true,
      },
      {
        time: '5 Mins Ago',
        status: 'EN ROUTE',
        description: 'Passed Mayur Vihar toll plaza. Heading towards Noida link road.',
        completed: true,
      },
      {
        time: 'In 15 Mins',
        status: 'DELIVERY AT DESTINATION',
        description: 'ETA Sector 62, Noida commercial block near Alt F coworking.',
        completed: false,
      }
    ]
  },
  {
    id: 'UP-ND-9952',
    status: 'DELIVERED',
    origin: 'Sector 18, Noida, UP',
    destination: 'Dwarka Sector 10, Delhi',
    eta: '00:00:00',
    currentLocation: { lat: 28.5850, lng: 77.0490 }, // Dwarka Sector 10
    historyLogs: [
      {
        time: '2 hours ago',
        status: 'BOOKING CONFIRMED',
        description: 'Sedan Cab booked for passenger transit from Wave Mall Noida Sector 18.',
        completed: true,
      },
      {
        time: '1 hour ago',
        status: 'TRIP IN PROGRESS',
        description: 'Crossed DND Flyway. Smooth traffic flow observed.',
        completed: true,
      },
      {
        time: '10 mins ago',
        status: 'TRIP COMPLETED',
        description: 'Safely dropped passenger at Dwarka Sector 10. Payment settled.',
        completed: true,
      }
    ]
  },
  {
    id: 'DL-AP-1080',
    status: 'ALERT',
    origin: 'IGI Airport T3, Delhi',
    destination: 'Sector 150, Noida, UP',
    eta: '01:10:00',
    currentLocation: { lat: 28.4952, lng: 77.1610 }, // Mahipalpur / Chattarpur
    historyLogs: [
      {
        time: '30 mins ago',
        status: 'PICKUP COMPLETED',
        description: 'Luggage loaded into SUV XL, journey started from Airport terminal T3 arrivals.',
        completed: true,
      },
      {
        time: '10 mins ago',
        status: 'ROUTE RECALCULATION',
        description: 'Heavy traffic congestion reported on Ring Road near South Ext. Driver rerouting via Outer Ring Road.',
        completed: true,
      }
    ]
  }
];

export const OPERATING_REGIONS = [
  'DELHI - CENTRAL (CONNAUGHT PLACE, NEW DELHI)',
  'DELHI - WEST (DWARKA, JANAKPURI)',
  'DELHI - SOUTH (VASANT KUNJ, SOUTH EXT)',
  'NOIDA - SECTOR 18 / FILM CITY',
  'NOIDA - SECTOR 62 / INDUSTRIAL AREA',
  'NOIDA - GREATER NOIDA EXPRESSWAY / SECTOR 150'
];

export const SERVICE_TYPES = [
  'CITY TEMPO / LOGISTICS',
  'INSTANT BIKE COURIER',
  'LOCAL CAB / SEDAN RIDES',
  'AIRPORT SHUTTLE (SUV XL)'
];

export const WHY_US_PILLARS = [
  {
    id: 'security',
    title: 'VERIFIED LOCAL DRIVERS',
    description: 'All taxi and loader drivers background-checked with strict physical police verifications and valid regional licenses.',
    icon: 'shield'
  },
  {
    id: 'rates',
    title: 'HONEST LOCAL RATES',
    description: 'No surge pricing schemes. Transparent base fares and per-kilometer prices matching standard Noida/Delhi commercial rates.',
    icon: 'eco' // using standard lucide icons
  },
  {
    id: 'matches',
    title: 'QUICK ASSIGNMENTS',
    description: 'With over 1,200 active vehicles across Delhi-NCR, get matches and pickups at your doorstep in under 12 minutes.',
    icon: 'speed'
  }
];
