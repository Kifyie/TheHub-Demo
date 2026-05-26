/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Clock, MapPin, Search, PlusCircle, AlertTriangle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { DEFAULT_SHIPMENTS, SERVICE_TYPES } from '../data';
import { Shipment, TransitLog } from '../types';
import GMap from './GMap';

export default function LogisticsView() {
  const [trackingNumber, setTrackingNumber] = useState('DL-RU-4201');
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(
    DEFAULT_SHIPMENTS[0]
  );
  
  // Custom generated tracking simulation list
  const [createdShipments, setCreatedShipments] = useState<Shipment[]>([]);
  const [customSearchError, setCustomSearchError] = useState(false);

  // Inquiry Form
  const [companyName, setCompanyName] = useState('');
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [email, setEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  
  // Inquiry loading phases
  const [syncPhase, setSyncPhase] = useState<'STANDBY' | 'INITIALIZING' | 'CONFIGURING' | 'SUCCESS'>('STANDBY');

  const handleTrackShipment = (e: FormEvent) => {
    e.preventDefault();
    setCustomSearchError(false);

    // Look up in defaults
    const foundDefault = DEFAULT_SHIPMENTS.find(
      (s) => s.id.toUpperCase() === trackingNumber.trim().toUpperCase()
    );

    if (foundDefault) {
      setActiveShipment(foundDefault);
      return;
    }

    // Look up in created
    const foundCreated = createdShipments.find(
      (s) => s.id.toUpperCase() === trackingNumber.trim().toUpperCase()
    );

    if (foundCreated) {
      setActiveShipment(foundCreated);
      return;
    }

    // Generate dynamic mock tracking path if custom characters are entered
    if (trackingNumber.trim().length >= 4) {
      const generatedId = trackingNumber.trim().toUpperCase();
      const mockNewShipment: Shipment = {
        id: generatedId,
        status: 'IN_TRANSIT',
        origin: 'Palo Alto Regional Hub (D-6)',
        destination: 'Seattle Waterfront Port',
        eta: '11:45:00',
        currentLocation: { lat: 37.7749, lng: -122.4194 },
        historyLogs: [
          {
            time: '04 hours ago',
            status: 'MANIFEST CLEARED',
            description: `Core shipment ID ${generatedId} signed off at origin terminal hub by AI dispatcher system.`,
            completed: true,
          },
          {
            time: '01 hour ago',
            status: 'NODE DEPARTURE',
            description: 'Coupled to autonomous container carrier and routing telemetry locked.',
            completed: true,
          },
          {
            time: 'Just Now',
            status: 'GRID MONITORING',
            description: 'Operating under standard high-velocity trajectory patterns.',
            completed: false,
          }
        ]
      };

      setCreatedShipments((prev) => [...prev, mockNewShipment]);
      setActiveShipment(mockNewShipment);
    } else {
      setCustomSearchError(true);
      setActiveShipment(null);
    }
  };

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!companyName || !email) {
      alert('Please provide Company Legal Name and corporate Email.');
      return;
    }

    setSyncPhase('INITIALIZING');
    
    setTimeout(() => {
      setSyncPhase('CONFIGURING');
    }, 1800);

    setTimeout(() => {
      setSyncPhase('SUCCESS');
    }, 3600);
  };

  return (
    <div className="pt-32 lg:pt-36 px-6 md:px-16 max-w-7xl mx-auto pb-24">
      {/* Intro section */}
      <div className="mb-16">
        <span className="text-primary-container font-sans text-xs uppercase tracking-[0.2em] font-bold block mb-4">
          Real-Time Delivery & Cargo Tracking
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
          TRACK NCR GOOD DELIVERIES
        </h1>
        <div className="h-1 bg-primary-container w-24 mb-6" />
        <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-2xl leading-relaxed">
          Easily track your active goods courier parcels, Tata Ace load items, or document shipping packages in real-time across Delhi, Noida, and NCR regions.
        </p>
      </div>

      {/* Grid Layout: Tracking Interface Console vs Inquiry System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
        
        {/* Track console (left 7 cols) */}
        <div className="lg:col-span-7 bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] p-8 rounded-3xl flex flex-col justify-between shadow-2xl" id="tracking-console-wrapper">
          <div>
            <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block mb-4 uppercase">
              DELIvery Tracker
            </span>

            {/* Quick selectors for default tracking numbers */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <span className="text-on-surface-variant font-sans text-[10px] font-bold tracking-wider mr-2 self-center">
                ACTIVE SHIPMENTS:
              </span>
              {DEFAULT_SHIPMENTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setTrackingNumber(s.id);
                    setActiveShipment(s);
                  }}
                  className={`px-3 py-1 font-mono text-[10px] uppercase font-bold border rounded-full transition-all ${
                    trackingNumber === s.id
                      ? 'bg-primary-container border-primary-container text-white'
                      : 'border-white/[0.08] hover:border-white text-on-surface-variant'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>

            {/* Submit layout ID search input */}
            <form onSubmit={handleTrackShipment} className="flex gap-2 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3.5 text-on-surface-variant" size={16} />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking ID (e.g., DL-RU-4201)"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 pl-10 text-xs font-mono text-white uppercase focus:outline-none focus:border-primary-container"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary-container text-white px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_16px_rgba(255,85,69,0.3)]"
              >
                Track Now
              </button>
            </form>

            {customSearchError && (
              <div className="bg-[#ff5545]/10 border border-[#ff5545]/40 rounded-xl p-4 text-[#ff5545] font-mono text-[11px] uppercase mb-6 flex gap-2 items-center">
                <AlertTriangle size={16} />
                <span>TRACKING ID NOT FOUND. Enter at least 4 characters to simulate custom delivery paths.</span>
              </div>
            )}

            {/* Active tracking display results */}
            <AnimatePresence mode="wait">
              {activeShipment && (
                <motion.div
                  key={activeShipment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Summary row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.02] p-4 rounded-3xl border border-white/[0.06]">
                    <div>
                      <span className="text-on-surface-variant text-[9px] uppercase font-sans">STATUS</span>
                      <span className={`block font-sans text-xs font-black uppercase tracking-wider mt-1 ${
                        activeShipment.status === 'DELIVERED' ? 'text-emerald-400' : 'text-primary-container animate-pulse'
                      }`}>
                        {activeShipment.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[9px] uppercase font-sans">ETA TIME</span>
                      <span className="block font-sans text-xs font-black tracking-wide text-white mt-1">
                        {activeShipment.eta !== '00:00:00' ? activeShipment.eta : 'DELIVERED'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-on-surface-variant text-[9px] uppercase font-sans">DELIVERY REGION</span>
                      <span className="block font-sans text-xs text-glow text-white font-semibold mt-1 uppercase">
                        {activeShipment.destination}
                      </span>
                    </div>
                  </div>

                  {/* Google Maps Tracking View */}
                  <div className="space-y-3">
                    <span className="text-white font-sans text-xs font-bold uppercase tracking-widest block">
                      LIVE DELIVERY LOCATION MAP
                    </span>
                    <div className="relative w-full h-[240px] bg-neutral-900 overflow-hidden border border-white/[0.08] rounded-3xl">
                      <GMap 
                        activeShipmentId={activeShipment.id} 
                        className="w-full h-full" 
                      />
                    </div>
                  </div>

                  {/* Transit stage logs checklist path */}
                  <div className="space-y-4">
                    <span className="text-white font-sans text-xs font-bold uppercase tracking-widest block">
                      DELIVERY HISTORY DETAILS
                    </span>

                    <div className="relative border-l border-white/[0.08] pl-6 ml-3 space-y-8 py-2">
                      {activeShipment.historyLogs.map((log: TransitLog, index: number) => (
                        <div key={index} className="relative group">
                          {/* Anchor bullet pointer icon */}
                          <div className={`absolute -left-9 top-1 w-6 h-6 rounded-full border flex items-center justify-center ${
                            log.completed 
                              ? 'bg-[#131313] border-primary-container text-primary-container' 
                              : 'bg-[#131313] border-outline-variant text-on-surface-variant'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${log.completed ? 'bg-primary-container' : 'bg-[#131313]'}`} />
                          </div>

                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-display text-xs font-bold text-white tracking-wide uppercase">
                                {log.status}
                              </span>
                              <span className="text-on-surface-variant font-mono text-[10px]">
                                {log.time}
                              </span>
                            </div>
                            <p className="text-on-surface-variant font-sans text-xs uppercase leading-relaxed mt-1">
                              {log.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Create inquiry form match partnership panel (right 5 cols) */}
        <div className="lg:col-span-5 bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] rounded-3xl p-8 shadow-2xl">
          <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block mb-4 uppercase">
            BOOK A BULK SHIPMENT
          </span>
          <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6 uppercase">
            Need regular goods transport? Send us your requirements below.
          </p>

          {syncPhase === 'STANDBY' ? (
            <form onSubmit={handleInquirySubmit} className="space-y-6">
              <div>
                <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                  COMPANY NAME / YOUR NAME
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Global Cargo corp"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                  REQUIRED VEHICLE TYPE
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-neutral-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., dispatcher@corporation.com"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                  required
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                  DESCRIBE YOUR REQUIREMENTS
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Detail any special items, recurring delivery times, or weight profiles..."
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-container text-white py-4 rounded-full text-xs font-bold tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all uppercase cursor-pointer shadow-[0_4px_16px_rgba(255,85,69,0.35)]"
              >
                SUBMIT BULK REQUEST
              </button>
            </form>
          ) : (
            // Phase loading and success render as in the premium style script description
            <div className="py-12 flex flex-col items-center justify-center text-center">
              {syncPhase === 'INITIALIZING' && (
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full border-2 border-primary-container border-t-transparent animate-spin mx-auto" />
                  <div>
                    <p className="font-sans text-xs font-black tracking-[0.2em] text-primary-container uppercase">
                      SENDING ENQUIRY...
                    </p>
                    <p className="text-on-surface-variant font-sans text-[11px] mt-2 max-w-xs mx-auto">
                      Saving your corporate inquiry in our driver matchmaking database.
                    </p>
                  </div>
                </div>
              )}

              {syncPhase === 'CONFIGURING' && (
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto" />
                  <div>
                    <p className="font-sans text-xs font-black tracking-[0.2em] text-white uppercase">
                      FINDING SUITABLE LOCATIONS...
                    </p>
                    <p className="text-on-surface-variant font-sans text-[11px] mt-2 max-w-xs mx-auto">
                      Matching your weight and vehicle requirements with active Delhi-NCR drivers.
                    </p>
                  </div>
                </div>
              )}

              {syncPhase === 'SUCCESS' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center rounded-full mx-auto text-emerald-400">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-black tracking-[0.2em] text-emerald-400 uppercase">
                      REQUEST INITIATED SUCCESSFULLY
                    </p>
                    <p className="text-on-surface-variant font-sans text-[11px] mt-2 max-w-xs mx-auto">
                      We have received your request. A bulk logistics manager will email you with custom pricing shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCompanyName('');
                      setEmail('');
                      setRequirements('');
                      setSyncPhase('STANDBY');
                    }}
                    className="border border-[#ff5545]/20 hover:border-white text-[11px] font-sans font-bold text-white tracking-widest px-6 py-2 rounded-full uppercase transition-all"
                  >
                    SEND ANOTHER REQUEST
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
