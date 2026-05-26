/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Compass, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { DEFAULT_VEHICLES } from '../data';
import { FleetVehicle } from '../types';
import GMap from './GMap';

interface ServicesProps {
  initialSelectVehicleId?: string;
}

export default function ServicesView({ initialSelectVehicleId }: ServicesProps) {
  const fallbackVehicle = DEFAULT_VEHICLES[0];
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle>(() => {
    return DEFAULT_VEHICLES.find(v => v.id === initialSelectVehicleId) || fallbackVehicle;
  });

  const activeVehicle = selectedVehicle || fallbackVehicle;

  // Form states
  const [pickup, setPickup] = useState('Sector 18, Noida, UP');
  const [destination, setDestination] = useState('Connaught Place, Delhi');
  const [tier, setTier] = useState(activeVehicle.id);
  
  // Dispatch sim states
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStage, setDispatchStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const dispatchStages = [
    'Checking for nearby drivers...',
    'Connecting with closest driver partner...',
    'Calculating the quickest and fastest route...',
    'Driver accepting your booking request...',
    'Driver assigned successfully! Ready for pickup.'
  ];

  const handleSelectVehicle = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setTier(vehicle.id);
  };

  const handleStartDispatch = (e: FormEvent) => {
    e.preventDefault();
    if (!pickup || !destination) {
      alert('Please enter both pickup and drop-off locations.');
      return;
    }

    setIsDispatching(true);
    setDispatchStage(0);
    setProgress(0);

    // Stage intervals
    const stageTimer = setInterval(() => {
      setDispatchStage((prev) => {
        if (prev >= dispatchStages.length - 1) {
          clearInterval(stageTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    // Progress bar interval
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 70);
  };

  return (
    <div className="pt-32 lg:pt-36 px-6 md:px-16 max-w-7xl mx-auto pb-24">
      {/* Intro section */}
      <div className="mb-16">
        <span className="text-primary-container font-sans text-xs uppercase tracking-[0.2em] font-bold block mb-4">
          Cabs & Delivery Trucks
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
          OUR CABS & TRUCKS
        </h1>
        <div className="h-1 bg-primary-container w-24 mb-6" />
        <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-2xl leading-relaxed">
          Choose from our wide range of reliable, clean, and top-rated vehicles. From everyday Hatchbacks and spacious SUVs for family trips, to Courier Bikes and cargo trucks for hassle-free home shifting and deliveries.
        </p>
      </div>

      {/* Interactive Fleet Selector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
        
        {/* Vehicles list (left 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-white font-sans text-xs font-bold uppercase tracking-widest block mb-4">
            SELECT FLEET TIER
          </span>
          {DEFAULT_VEHICLES.map((vehicle) => {
            const isSelected = activeVehicle.id === vehicle.id;
            return (
              <div
                key={vehicle.id}
                onClick={() => handleSelectVehicle(vehicle)}
                className={`p-6 border-l-4 rounded-3xl cursor-pointer transition-all duration-300 flex justify-between items-center ${
                  isSelected
                    ? 'bg-white/[0.09] border-white shadow-xl shadow-white/[0.02]'
                    : 'bg-white/[0.01] hover:bg-white/[0.04] border-white/[0.06] hover:border-white/25'
                }`}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                    <span className="font-display text-sm md:text-md font-bold text-white tracking-wide uppercase truncate">
                      {vehicle.name}
                    </span>
                    {vehicle.tag && (
                      <span className="bg-white/[0.08] text-white/90 border border-white/15 text-[8px] font-sans font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 w-fit">
                        {vehicle.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-on-surface-variant font-sans text-[11px] uppercase mt-2">
                    Capacity: {vehicle.capacity}
                  </p>
                </div>
                <div className={`font-mono text-[9px] uppercase tracking-wider shrink-0 px-2.5 py-1 border rounded-lg ${
                  isSelected 
                    ? 'text-white border-white bg-white/10 font-bold' 
                    : 'text-on-surface-variant border-white/10'
                }`}>
                  {isSelected ? 'ACTIVE' : 'VIEW DETAILS'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Vehicle details panel & Image showcase (right 7 cols) */}
        <div className="lg:col-span-7 bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] p-8 rounded-3xl flex flex-col gap-8 relative overflow-hidden">
          {/* Main Visual Image Showcase */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/[0.08]">
            <img
              alt={activeVehicle.name}
              className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
              src={activeVehicle.imageUrl}
            />
            <div className="absolute top-4 left-4 bg-[#131313]/90 px-3 py-1.5 border-l-2 border-primary-container rounded-r backdrop-blur-sm">
              <span className="font-mono text-[10px] text-white tracking-widest">
                {activeVehicle.id.toUpperCase()} // READY
              </span>
            </div>
          </div>

          <div>
            <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block mb-2 uppercase">
              VEHICLE DETAILS
            </span>
            <p className="text-white font-semibold font-display text-sm md:text-md uppercase mb-4 leading-relaxed">
              {activeVehicle.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
              <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-on-surface-variant font-sans text-[9px] tracking-wider block uppercase">
                  COMFORT & FEATURES
                </span>
                <span className="text-white font-sans text-xs font-bold uppercase mt-1 block">
                  {activeVehicle.connectivity}
                </span>
              </div>
              <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-on-surface-variant font-sans text-[9px] tracking-wider block uppercase">
                  DRIVER PARTNER
                </span>
                <span className="text-white font-sans text-xs font-bold uppercase mt-1 block">
                  {activeVehicle.controlType}
                </span>
              </div>
              <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                <span className="text-on-surface-variant font-sans text-[9px] tracking-wider block uppercase">
                  FUEL ENG type
                </span>
                <span className="text-white font-sans text-xs font-bold uppercase mt-1 block">
                  {activeVehicle.energyType || 'Standard Battery Cell'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Deployment & Dispatch Section Header */}
      <div className="border-t border-white/[0.08] pt-16 mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-black text-glow text-white uppercase tracking-tight">
          BOOK A VEHICLE
        </h2>
        <p className="text-on-surface-variant font-sans text-xs uppercase tracking-widest mt-2 font-semibold">
          Enter pickup and drop locations to simulate a live booking
        </p>
      </div>

      {/* Deploy form input & live preview coordinates map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="deployment-terminal">
        
        {/* Dispatch Form Panel (left 5 cols) */}
        <div className="lg:col-span-5 bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] rounded-3xl p-8">
          <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block mb-6 uppercase">
            QUICK BOOKING FORM
          </span>
          
          <form onSubmit={handleStartDispatch} className="space-y-6">
            <div>
              <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                PICKUP LOCATION
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-primary-container" size={16} />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g., California Hub Alfa"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 pl-10 text-xs font-sans text-white focus:outline-none focus:border-primary-container transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                DROP LOCATION
              </label>
              <div className="relative">
                <Navigation className="absolute left-3 top-3.5 text-primary-container animate-pulse" size={16} />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Neo-Sector Beta Depot"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 pl-10 text-xs font-sans text-white focus:outline-none focus:border-primary-container transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                  CHOOSE VEHICLE
                </label>
                <select
                  value={tier}
                  onChange={(e) => {
                    setTier(e.target.value);
                    const v = DEFAULT_VEHICLES.find(x => x.id === e.target.value);
                    if (v) setSelectedVehicle(v);
                  }}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container transition-all"
                >
                  {DEFAULT_VEHICLES.map((v) => (
                    <option key={v.id} value={v.id} className="bg-neutral-900">
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                  BOOKING STATUS
                </label>
                <span className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 text-xs font-sans text-emerald-400 font-bold block overflow-hidden whitespace-nowrap text-center">
                  DIRECT DRIVER ASSIGNED
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isDispatching}
              className={`w-full py-4 rounded-full text-xs font-bold tracking-[0.2em] transition-all uppercase cursor-pointer shadow-lg ${
                isDispatching
                  ? 'bg-white/[0.04] text-on-surface-variant border border-white/[0.08] cursor-not-allowed shadow-none'
                  : 'bg-primary-container text-white hover:brightness-110 active:scale-95 shadow-[0_4px_16px_rgba(255,85,69,0.35)]'
              }`}
            >
              {isDispatching ? 'ASSIGNING DRIVER...' : 'BOOK NOW'}
            </button>
          </form>
        </div>

        {/* Live Google Map Interface (right 7 cols) */}
        <div className="lg:col-span-7 bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] rounded-3xl p-8 min-h-[460px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-sans text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Compass className="text-primary-container animate-spin" size={16} />
                LIVE DELHI & NOIDA GOOGLE MAP
              </span>
              <span className="bg-[#131313]/90 text-[9px] font-mono font-bold text-primary-container border border-primary-container/30 px-2 py-1 tracking-wider uppercase">
                {isDispatching ? 'ROUTE ACTIVE' : 'MAP STANDBY'}
              </span>
            </div>

            {/* Google Map Panel */}
            <div className="relative aspect-video w-full overflow-hidden border border-white/[0.08] bg-neutral-900 rounded-xl flex items-center justify-center">
              <GMap 
                origin={pickup} 
                destination={destination} 
                className="w-full h-full min-h-[300px]" 
              />
            </div>
          </div>

          {/* Active Sim State Console */}
          {isDispatching && (
            <div className="border border-white/10 bg-black/40 rounded-3xl p-4 font-mono text-xs mt-6 text-on-surface-variant flex flex-col gap-2">
              <div className="flex justify-between border-b border-white/[0.08] pb-2">
                <span className="text-white">BOOKING STATUS</span>
                <span className={progress >= 100 ? "text-emerald-400" : "text-primary-container animate-pulse"}>
                  {progress >= 100 ? "SUCCESS" : "PROCESSING..."}
                </span>
              </div>
              <p className="text-white text-[11px] font-bold tracking-wide">
                &gt; {dispatchStages[dispatchStage]}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]">VEHICLE ID: {tier.toUpperCase()}-NCR</span>
                <span className="ml-auto text-[10px]">GPS LINK ONLINE</span>
              </div>
              
              {progress >= 100 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 bg-[#ff5545]/10 border border-[#ff5545]/40 rounded-xl p-3 text-[#ff5545] flex items-center gap-3"
                >
                  <CheckCircle size={18} className="text-[#ff5545] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white font-sans text-xs uppercase">DRIVER BOOKED SUCCESSFULLY</p>
                    <p className="font-sans text-[10px] text-on-surface-variant">Your driver is on the way. Please keep your phone handy.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsDispatching(false);
                      setProgress(0);
                    }}
                    className="ml-auto text-[10px] border border-[#ff5545]/20 hover:border-white hover:text-white px-2 py-1 uppercase tracking-wider font-bold rounded"
                  >
                    RESET
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
