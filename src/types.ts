/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TelemetryStats {
  systemUptime: number;
  activeNodes: number;
  networkLatency: number;
  liveMonitoring: boolean;
  activeFleetCount: number;
  avgDeliveryMinutes: number;
  secureNodesPercent: number;
}

export interface TransitLog {
  time: string;
  status: string;
  description: string;
  completed: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Shipment {
  id: string; // HubID: HUB-XXXX-XXXX-XXXX
  status: 'IN_TRANSIT' | 'DELIVERED' | 'DISPATCHING' | 'HELD' | 'ALERT';
  origin: string;
  destination: string;
  eta: string; // e.g., "04:12:05" code timer or time string
  currentLocation: {
    lat: number;
    lng: number;
  };
  historyLogs: TransitLog[];
}

export interface FleetVehicle {
  id: string;
  name: string;
  tag?: string;
  category: 'logistics' | 'transit' | 'courier';
  description: string;
  capacity: string;
  connectivity: string;
  controlType: string;
  iconName: string;
  imageUrl: string;
  passengerCount?: number;
  luggageCount?: number;
  energyType?: string;
}

export interface OnboardingData {
  fullName: string;
  email: string;
  operatingRegion: string;
  vehicleType: string;
  vinNumber: string;
  registrationFile?: File | null;
  registrationFileName?: string;
  certified: boolean;
  agreed: boolean;
}

export interface ContactInquiry {
  companyName: string;
  serviceType: string;
  email: string;
  networkRequirements: string;
}
