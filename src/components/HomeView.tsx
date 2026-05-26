/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Shield, Leaf, Zap, Cpu, ArrowRight, Activity, Server, Database, Layers, Car, Truck, Bike } from 'lucide-react';
import { DEFAULT_STATS } from '../data';
import { ContainerScroll } from './ui/container-scroll-animation';

interface HomeViewProps {
  setTab: (tab: string) => void;
  onDeployFleet: () => void;
}

export default function HomeView({ setTab, onDeployFleet }: HomeViewProps) {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loadPercent, setLoadPercent] = useState(75);

  // Scroll Parallax Hooks for high performance smooth scroll effects
  const { scrollY } = useScroll();
  const yHeroImage = useTransform(scrollY, [0, 800], ["0%", "24%"]);
  const yMockupImage = useTransform(scrollY, [800, 2400], ["12%", "-24%"]);

  // Tick statistics to make the grid feel live and high-tech!
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeNodes: prev.activeNodes + Math.floor(Math.random() * 5) - 2,
        networkLatency: Math.max(8, prev.networkLatency + (Math.random() > 0.5 ? 1 : -1)),
      }));

      setLoadPercent((prev) => {
        const diff = Math.floor(Math.random() * 5) - 2;
        const next = prev + diff;
        return Math.max(68, Math.min(84, next));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Tilted Core Engine Scroll Showcase Section AS THE MAIN HERO */}
      <section className="bg-transparent pt-32 md:pt-40 pb-16 overflow-hidden relative">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center px-4 max-w-5xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-7xl font-extrabold text-white mb-10 uppercase tracking-tight leading-none text-glow">
                LOCAL TRANSPORT <br />
                <span className="text-primary-container font-black text-glow">SIMPLIFIED</span>
              </h1>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12">
                Ditch over-complicated logistics. The Hub is a simple, dependable network for local passenger cabs and goods loaders operating exclusively across Delhi and Noida. Scroll down to activate the interactive NCR dispatch controller.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-full sm:w-auto px-4 z-30 pointer-events-auto">
                <button
                  onClick={() => setTab('SERVICES')}
                  className="bg-primary-container text-white text-[12px] font-bold tracking-widest px-8 py-4 rounded-full hover:brightness-110 active:scale-95 transition-all uppercase shadow-[0_4px_16px_rgba(255,85,69,0.35)] cursor-pointer"
                >
                  BOOK CAB / LOADER
                </button>
                <button
                  onClick={() => setTab('LOGISTICS')}
                  className="border border-white/40 bg-white/[0.04] backdrop-blur-md text-white text-[12px] font-bold tracking-widest px-8 py-4 rounded-full hover:bg-white hover:text-[#131313] active:scale-95 transition-all uppercase cursor-pointer"
                >
                  TRACK GOODS DELIVERY
                </button>
              </div>
            </div>
          }
        >
          {/* Inner Dashboard Display Mockup */}
          <div className="w-full h-full bg-[#111111]/60 backdrop-blur-3xl border border-white/[0.12] rounded-2xl flex flex-col md:grid md:grid-cols-12 overflow-hidden pointer-events-auto shadow-[0_12px_44px_rgba(0,0,0,0.6)] text-left">
            
            {/* Top Toolbar */}
            <div className="col-span-12 bg-black/50 border-b border-white/[0.1] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container"></span>
                </span>
                <span className="font-mono text-xs font-black uppercase tracking-widest text-white">
                  DELHI-NCR DISPATCH TERMINAL
                </span>
                <div className="hidden sm:inline-flex items-center gap-1.5 bg-white/[0.05] px-2.5 py-0.5 border border-white/[0.08] rounded font-mono text-[9px] text-primary-container">
                  <span>LIVE COCKPIT</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
              </div>
            </div>

            {/* Sidebar Cabs & Loaders List (Col span 5 on large screen) */}
            <div className="col-span-12 md:col-span-5 bg-[#151515]/80 border-r border-[#ffffff]/10 p-5 flex flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-500 tracking-widest uppercase block mb-3">
                  ACTIVE DELHI & NOIDA RUNS
                </span>
                
                <div className="space-y-3">
                  {/* Item 1 */}
                  <div className="p-3 bg-white/[0.05] border border-white/[0.1] rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-primary-container/20 border border-primary-container/30 rounded-lg text-primary-container mt-0.5">
                      <Car size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-bold text-white uppercase tracking-wide">AC Sedan • DL-3C-1284</span>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">IN RIDE</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">Connaught Place ➔ Noida Sector 62</p>
                      <p className="text-[9px] text-neutral-500 font-mono mt-0.5">Verified Driver: Ravi Kumar</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-neutral-400 mt-0.5">
                      <Truck size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide font-display">TATA ACE • HR-55-4321</span>
                        <span className="text-[9px] font-mono font-bold text-yellow-500 bg-yellow-950/40 border border-yellow-500/20 px-1.5 py-0.5 rounded">GOING TO PICKUP</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate font-sans">Indirapuram ➔ South Extension</p>
                      <p className="text-[9px] text-neutral-500 font-mono mt-0.5">Cargo: Home Shifting</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-neutral-400 mt-0.5">
                      <Bike size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide font-display">COURIER BIKE • DL-7S-0482</span>
                        <span className="text-[9px] font-mono font-bold text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">COMPLETED</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate font-sans">Noida Sector 15 ➔ Dwarka Sector 21</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Help Support Info */}
              <div className="bg-primary-container/[0.03] border border-primary-container/10 rounded-xl p-3 flex items-center gap-2.5">
                <span className="pulse-dot w-2 h-2 rounded-full bg-primary-container animate-pulse flex-shrink-0" />
                <p className="text-[11px] text-neutral-400 font-sans leading-snug">
                  Rates are <strong className="text-white font-semibold">strictly standardized per km</strong>. Absolutely zero surge pricing or hidden fees across Delhi & Noida.
                </p>
              </div>
            </div>

            {/* Central Simplified Ticket Preview Panel (Col span 7 on large screen) */}
            <div className="col-span-12 md:col-span-7 p-6 flex flex-col justify-between relative overflow-hidden bg-black/10">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                
                {/* Simulated Customer Booking Interface Header */}
                <div>
                  <span className="text-primary-container font-mono text-[9px] font-black uppercase tracking-widest block mb-1">
                    CUSTOMER RECEIPT PREVIEW
                  </span>
                  <h4 className="font-display text-xl font-extrabold text-white uppercase tracking-wider mb-2">
                    TRANSPARENT BOOKINGS
                  </h4>
                  <p className="text-on-surface-variant font-sans text-xs leading-relaxed">
                    This is a simulation of the standard ticket layout dispatched to your phone instantly upon booking any cab or local goods loader.
                  </p>
                </div>

                {/* Simulated Receipt Component */}
                <div className="bg-[#1c1c1c] border border-white/[0.1] rounded-2xl p-5 shadow-inner relative space-y-4">
                  {/* Decorative Ticket Notch Circles on Left and Right borders */}
                  <div className="absolute top-1/2 -left-2 w-4 h-4 bg-[#111111] border-r border-white/[0.1] rounded-full -translate-y-1/2" />
                  <div className="absolute top-1/2 -right-2 w-4 h-4 bg-[#111111] border-l border-white/[0.1] rounded-full -translate-y-1/2" />
                  
                  {/* Receipt Header details */}
                  <div className="flex justify-between items-start border-b border-dashed border-white/[0.08] pb-3.5">
                    <div>
                      <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block">VEHICLE ASSIGNED</span>
                      <p className="text-xs font-bold text-white font-display mt-0.5">AC LUXURY EXPERT SEDAN</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block">ESTIMATED FARE</span>
                      <p className="text-xs font-bold text-primary-container font-mono mt-0.5">₹240 FLAT RATE</p>
                    </div>
                  </div>

                  {/* Route information */}
                  <div className="space-y-1.5 text-xs font-sans">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-neutral-300 font-medium">Pickup: Connaught Place, Inner Circle</span>
                    </div>
                    <div className="w-[1px] h-3 bg-neutral-600 ml-0.5 border-dashed border-l border-neutral-600/[0.4]" />
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
                      <span className="text-neutral-300 font-medium font-sans">Drop: Sector 62, Noida (Expressway Exits)</span>
                    </div>
                  </div>

                  {/* Booking parameters */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.05] text-[10px] font-mono">
                    <div>
                      <span className="text-neutral-500 block uppercase">DISTANCE</span>
                      <span className="text-white block mt-0.5">14.2 Kilometers</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase">TRAVEL TIME</span>
                      <span className="text-white block mt-0.5">28 Mins Approx</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase">DRIVER PROFILE</span>
                      <span className="text-emerald-400 block mt-0.5">★ 4.9 Rated</span>
                    </div>
                  </div>
                </div>

                {/* Booking call to action link preview */}
                <div className="flex justify-between items-center pt-4 border-t border-white/[0.08]">
                  <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider">BOOK PASSENGER CAB / FREIGHT GOODS LOADER</span>
                  <button 
                    onClick={() => setTab('SERVICES')}
                    className="flex items-center gap-1 text-xs font-bold text-primary-container hover:text-white uppercase tracking-widest font-mono transition-colors cursor-pointer"
                  >
                    <span>GO TO SERVICES</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </ContainerScroll>
      </section>

      {/* Anchor Stats Bar (Positioned as direct flow element) */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 -mt-16 mb-24 relative z-20">
        <div className="bg-[#111111]/50 backdrop-blur-2xl border border-white/[0.12] p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
            <div className="flex flex-col border-r border-white/[0.05] last:border-0 p-2">
              <span className="text-primary-container font-display text-2xl lg:text-3xl font-black">{stats.systemUptime}%</span>
              <span className="text-on-surface-variant font-sans text-[10px] tracking-widest uppercase mt-1">SLA Delivery Rate</span>
            </div>
            <div className="flex flex-col lg:border-r border-white/[0.05] last:border-0 p-2">
              <span className="text-primary-container font-display text-2xl lg:text-3xl font-black">{stats.activeNodes.toLocaleString()}</span>
              <span className="text-on-surface-variant font-sans text-[10px] tracking-widest uppercase mt-1">Active Local Drivers</span>
            </div>
            <div className="flex flex-col border-r border-white/[0.05] last:border-0 p-2">
              <span className="text-primary-container font-display text-2xl lg:text-3xl font-black">{stats.networkLatency} MINS</span>
              <span className="text-on-surface-variant font-sans text-[10px] tracking-widest uppercase mt-1">Avg Matching Time</span>
            </div>
            <div className="flex flex-col last:border-0 p-2">
              <span className="text-primary-container font-display text-2xl lg:text-3xl font-black flex items-center justify-center lg:justify-start gap-2">
                24/7
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-on-surface-variant font-sans text-[10px] tracking-widest uppercase mt-1">NCR Hotline Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Services */}
      <section className="py-16 bg-transparent px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold text-white mb-4 uppercase tracking-tight">
            LOCAL FLEET CHANNELS
          </h2>
          <div className="h-1 w-20 bg-primary-container mb-6" />
          <p className="text-on-surface-variant font-sans text-sm md:text-base leading-relaxed">
            Reliable local mobility services built for real-world transport needs. We manage everyday passenger rides and goods trucking with absolute ease.
          </p>
        </div>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Autonomous Logistics (Main Large Card - spans 8 cols) */}
          <div 
            onClick={() => setTab('LOGISTICS')}
            className="md:col-span-8 bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] hover:bg-white/[0.08] hover:border-primary-container p-8 md:p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-h-[350px]"
          >
            {/* Visual background image representing logistics loader */}
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-[45%] opacity-[0.22] group-hover:opacity-[0.38] md:opacity-40 md:group-hover:opacity-[0.65] transition-all duration-300 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#131111] via-[#131111]/65 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800"
                alt="Logistics Goods Loader Truck driving on expressway at night"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-110 group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-300">
              <Cpu size={140} className="text-primary-container" />
            </div>
            <div className="relative z-10 max-w-lg">
              <span className="text-primary-container font-sans text-xs tracking-widest uppercase font-bold mb-4 block">
                Goods Transport
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight uppercase">
                LOCAL GOODS LOADERS & BIKE COURIERS
              </h3>
              <p className="text-on-surface-variant font-sans text-sm leading-relaxed mb-8">
                Instantly book local transport vehicles like Chota Hathi (Tata Ace) and Bolero Pickups, or courier bikes for your document and commercial shipping deliveries.
              </p>
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 font-sans text-xs font-bold text-white group-hover:text-primary-container tracking-wider uppercase transition-colors">
                TRACK LOCAL CARGO <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

          {/* InfrastructureTwin Monitor Card (spans 4 cols) */}
          <div className="md:col-span-4 bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] rounded-3xl p-8 flex flex-col justify-between hover:border-primary-container hover:bg-white/[0.08] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div>
              <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-6">
                <Activity size={22} className="text-white" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-3 uppercase tracking-wider">
                NETWORK STATUS
              </h3>
              <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6">
                Real-time tracking of overall driver network load across Delhi, Noida, and Greater Noida Expressway.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-1.5 bg-white/[0.08] rounded-full w-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-container rounded-full"
                  animate={{ width: `${loadPercent}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-between font-sans text-[10px] font-bold tracking-wider">
                <span className="text-on-surface-variant uppercase">DELHI-NCR DRIVER LOAD</span>
                <span className="text-white">{loadPercent}% ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Premium Transit booking card */}
          <div className="md:col-span-4 bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] rounded-3xl p-8 flex flex-col justify-between hover:border-primary-container hover:bg-white/[0.08] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group relative overflow-hidden min-h-[350px]">
            {/* Visual background image representing taxi cab */}
            <div className="absolute inset-0 opacity-[0.2] group-hover:opacity-[0.35] transition-all duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/75 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1492664738948-2ec93a5c0942?auto=format&fit=crop&q=80&w=600"
                alt="Passenger Taxi Cab"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-110 group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="relative z-10">
              <div className="w-10 h-10 border border-primary-container rounded-lg flex items-center justify-center mb-6">
                <Car size={18} className="text-primary-container" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-3 uppercase tracking-wider text-glow">
                PASSENGER CAB BOOKINGS
              </h3>
              <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6">
                Easy air-conditioned point-to-point taxi passenger rides with verified drivers in Sedan or SUV XL segments.
              </p>
            </div>
            <div className="relative z-10">
              <button 
                onClick={() => setTab('SERVICES')}
                className="border-b border-primary-container pb-1 text-left font-sans text-xs font-bold text-primary-container hover:text-white hover:border-white transition-all w-max uppercase tracking-widest cursor-pointer"
              >
                BOOK CAB ONLINE
              </button>
            </div>
          </div>

          {/* Predictive Analytics / Data Hub (spans 8 cols) */}
          <div className="md:col-span-8 bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center justify-between hover:border-primary-container hover:bg-white/[0.06] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4 text-primary-container">
                <Database size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Regional Dispatch Engine</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-3 uppercase tracking-tighter">
                EFFICIENT NCR DISPATCH
              </h3>
              <p className="text-on-surface-variant font-sans text-xs md:text-sm leading-relaxed max-w-md">
                Our simple regional matchmaking algorithm automatically routes neighboring drivers to minimize standby time and help you get moving fast.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-64">
              <div className="aspect-square bg-white/[0.03] rounded-xl flex flex-col items-center justify-center border border-white/[0.06] group-hover:border-primary-container/30 transition-all p-4">
                <span className="text-primary-container font-display text-2xl font-black">12 MINS</span>
                <span className="text-on-surface-variant font-sans text-[9px] tracking-widest uppercase mt-1 text-center">AVG MATCH TIME</span>
              </div>
              <div className="aspect-square bg-white/[0.03] rounded-xl flex flex-col items-center justify-center border border-white/[0.06] group-hover:border-primary-container/30 transition-all p-4">
                <span className="text-primary-container font-display text-2xl font-black">99.9%</span>
                <span className="text-on-surface-variant font-sans text-[9px] tracking-widest uppercase mt-1 text-center">FULFILLMENT RATE</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Fleet Directory & Sizing Section */}
      <section className="py-24 bg-transparent border-y border-white/[0.08] px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary-container font-sans text-xs uppercase tracking-[0.25em] font-black mb-4 block select-none">
                DELHI & NOIDA NCR ACTIVE CHANNELS
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight text-glow">
                OUR ACTIVE FLEET <br />& SIZING PARAMETERS
              </h2>
            </div>
            <p className="text-on-surface-variant font-sans text-sm max-w-sm leading-relaxed">
              We operate a thoroughly vetted and streamlined selection of vehicles, specifically optimized for seamless point-to-point transit across Delhi congestion zones and the Noida Expressway.
            </p>
          </div>

          {/* Sizing Grid Card Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Vehicle 1: Courier Bike */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-3xl overflow-hidden hover:border-primary-container hover:bg-white/[0.05] transition-all duration-500 group flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/30 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=600"
                  alt="Express Courier Delivery Bike"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 z-20 bg-primary-container/90 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                  BIKE COURIER
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-white/50 text-xs font-mono">
                    <Bike size={14} className="text-primary-container" />
                    <span>CARGO CAPACITY: up to 15 KG</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-primary-container transition-colors">
                    NIMBLE TWO-WHEELER
                  </h4>
                  <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6">
                    Perfect for documents, office files, food courier runs, electronics, and small dynamic parcels bypassing Noida-Delhi heavy traffic corridors.
                  </p>
                </div>
                
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">MAX DIMENSIONS</span>
                    <span className="text-white">1.2 x 1 x 1 FT</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">IDEAL RANGE</span>
                    <span className="text-white">INTRA-CITY (NCR ONLY)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle 2: AC Sedan */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-3xl overflow-hidden hover:border-primary-container hover:bg-white/[0.05] transition-all duration-500 group flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/30 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600"
                  alt="Standard AC Passenger Sedan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 z-20 bg-primary-container/90 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                  CAB SEDAN
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-white/50 text-xs font-mono">
                    <Car size={14} className="text-primary-container" />
                    <span>PASSENGERS: 4 SEATER</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-primary-container transition-colors">
                    AIR-CONDITIONED SEDAN
                  </h4>
                  <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6">
                    A comfortable, quiet ride option built for official corporate commutes, daily executive transfers, and transit to Delhi Indira Gandhi Airport.
                  </p>
                </div>
                
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">LUGGAGE CAPACITY</span>
                    <span className="text-white">2 LARGE BAGS (350L COOT)</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">AIR CONDITIONING</span>
                    <span className="text-white">DUAL CLIMATE CONTROL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle 3: Luxury SUV XL */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-3xl overflow-hidden hover:border-primary-container hover:bg-white/[0.05] transition-all duration-500 group flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/30 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600"
                  alt="Premium Luxury Passenger SUV XL"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 z-20 bg-primary-container/90 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                  CAB SUV XL
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-white/50 text-xs font-mono">
                    <Car size={14} className="text-primary-container" />
                    <span>PASSENGERS: 6-7 SEATER</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-primary-container transition-colors">
                    PREMIUM HIGH-CAPACITY SUV
                  </h4>
                  <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6">
                    Extra legroom, elevated road view, and immense cargo capacity for family trips, bulky bags, or elite high-profile delegations.
                  </p>
                </div>
                
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">LUGGAGE CAPACITY</span>
                    <span className="text-white">4 LARGE BAGS (600L+)</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">PREMIUM ACCENTS</span>
                    <span className="text-white">ERGONOMIC LEATHER SEATS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle 4: 3-Wheeler Loader */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-3xl overflow-hidden hover:border-primary-container hover:bg-white/[0.05] transition-all duration-500 group flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/30 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1566008889988-cb7ae44d18fa?auto=format&fit=crop&q=80&w=600"
                  alt="3-Wheeler Intra-City Cargo Loader"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 z-20 bg-primary-container/90 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                  3WD LOADER
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-white/50 text-xs font-mono">
                    <Truck size={14} className="text-primary-container" />
                    <span>PAYLOAD BLOCK: up to 500 KG</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-primary-container transition-colors">
                    COMPACT 3-WHEELER TRUCK
                  </h4>
                  <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6">
                    A nimble option specialized to weave through narrow historical market streets in Old Delhi and congested commercial warehouses easily.
                  </p>
                </div>
                
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">LOAD AREA (L x W)</span>
                    <span className="text-white">5.5 FT x 4.5 FT</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">MAX WEIGHT DISP</span>
                    <span className="text-white">500 KG / 1100 LBS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle 5: Tata Ace */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-3xl overflow-hidden hover:border-primary-container hover:bg-white/[0.05] transition-all duration-500 group flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/30 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600"
                  alt="Tata Ace loader mini truck"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 z-20 bg-primary-container/90 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                  MINI TRUCK (ACE)
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-white/50 text-xs font-mono">
                    <Truck size={14} className="text-primary-container" />
                    <span>PAYLOAD BLOCK: up to 850 KG</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-primary-container transition-colors">
                    TATA ACE (CHOTA HATHI)
                  </h4>
                  <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6">
                    Our most requested freight carrier. Uniquely skilled for shifting house materials, wholesale commercial commodities, and middleweight machinery.
                  </p>
                </div>
                
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">LOAD AREA (L x W)</span>
                    <span className="text-white">7.2 FT x 4.8 FT</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">RECOMMENDED FOR</span>
                    <span className="text-white">MEDIUM HOME SHIFT / APPLIANCES</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle 6: Bolero Pickup */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-3xl overflow-hidden hover:border-primary-container hover:bg-white/[0.05] transition-all duration-500 group flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/30 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600"
                  alt="Bolero high-capacity logistics transport pickup truck"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 z-20 bg-primary-container/90 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                  HEAVY PICKUP
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-white/50 text-xs font-mono">
                    <Truck size={14} className="text-primary-container" />
                    <span>PAYLOAD BLOCK: up to 1.5 TONNES</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-primary-container transition-colors">
                    BOLERO PICKUP TRUCK
                  </h4>
                  <p className="text-on-surface-variant font-sans text-xs leading-relaxed mb-6">
                    A heavy-duty powerhouse configured for industrial parts, massive logistics weight loads, timber items, iron rods, and commercial warehouses.
                  </p>
                </div>
                
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">LOAD AREA (L x W)</span>
                    <span className="text-white">8.5 FT x 5.2 FT</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">TIRES & SUSP</span>
                    <span className="text-white">EXTENDED DUMPER REINFORCED</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-container text-[#5c0002] text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-10 h-full w-full">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="border-r border-[#5c0002]/40 h-full last:border-0" />
            ))}
          </div>
        </div>

        <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="font-display text-3xl md:text-[44px] font-black text-[#5c0002] mb-6 leading-none uppercase tracking-tight">
            GET MOVING TODAY
          </h2>
          <p className="font-sans text-sm md:text-base mb-10 max-w-xl leading-relaxed text-[#5c0002]/90 font-medium">
            Book an instant point-to-point passenger cab or dispatch a commercial goods transport unit across Delhi and Noida with a few simple clicks.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setTab('SERVICES')}
              className="bg-[#131313] text-white px-8 py-4 rounded-full font-bold tracking-widest hover:bg-[#201f1f] active:scale-95 transition-all uppercase text-[11px] shadow-lg"
            >
              BOOK SECURE CAB
            </button>
            <button
              onClick={() => setTab('LOGISTICS')}
              className="border-2 border-[#131313] text-[#131313] px-8 py-4 rounded-full font-bold tracking-widest hover:bg-[#131313] hover:text-white active:scale-95 transition-all uppercase text-[11px]"
            >
              TRACK EXISTING CARGO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
