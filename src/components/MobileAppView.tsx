/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

import { 
  MapPin, Navigation, Compass, Phone, MessageSquare, Plus, ChevronUp, 
  ChevronDown, CheckCircle, Clock, User, Shield, Info, X, Search, 
  Car, Bike, Truck, ArrowRight, Activity, Paperclip, AlertTriangle, Send,
  Briefcase, Plane, Package, Star, Globe
} from 'lucide-react';
import { DEFAULT_VEHICLES, DEFAULT_SHIPMENTS, OPERATING_REGIONS } from '../data';
import { FleetVehicle, Shipment } from '../types';
import GMap from './GMap';

interface MobileAppViewProps {
  setTab: (tab: string) => void;
  onExit?: () => void;
  initialTab?: 'BOOK' | 'TRACK' | 'JOIN' | 'SUPPORT';
  initialCategory?: 'transit' | 'courier' | 'logistics';
}

export default function MobileAppView({ 
  setTab, 
  onExit, 
  initialTab = 'BOOK', 
  initialCategory = 'transit' 
}: MobileAppViewProps) {
  // Navigation tabs of the simulated mobile app
  const [mobileTab, setMobileTab] = useState<'BOOK' | 'TRACK' | 'JOIN' | 'SUPPORT'>(initialTab);
  const [vehicleCat, setVehicleCat] = useState<'transit' | 'courier' | 'logistics'>(initialCategory);

  // Sync internal states with parent-provided props on tab/category changes
  useEffect(() => {
    if (initialTab) {
      setMobileTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialCategory) {
      setVehicleCat(initialCategory);
      // Automatically focus on the first vehicle compatible with the selected category
      const defaultMatch = DEFAULT_VEHICLES.find(v => v.category === initialCategory);
      if (defaultMatch) {
        setSelectedVehicle(defaultMatch);
      }
    }
  }, [initialCategory]);

  // Interactive booking flow parameters
  const [pickup, setPickup] = useState('Sector 18, Noida, UP');
  const [destination, setDestination] = useState('Connaught Place, Delhi');
  const [bookingStage, setBookingStage] = useState<'ROUTE' | 'VEHICLE' | 'MATCHING' | 'ACCEPTED'>('ROUTE');
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle>(DEFAULT_VEHICLES[0]);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [matchingStatus, setMatchingStatus] = useState('Initiating match protocols...');

  // Map state mirrors
  const [mapOrigin, setMapOrigin] = useState('Sector 18, Noida, UP');
  const [mapDestination, setMapDestination] = useState('Connaught Place, Delhi');
  const [activeShipmentId, setActiveShipmentId] = useState('');

  // Call simulation alert
  const [activeCallSIM, setActiveCallSIM] = useState<string | null>(null);

  // Chat/Messaging simulation state
  const [activeChatModal, setActiveChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver' | 'system'; text: string; time: string }>>([
    { sender: 'system', text: 'Secure chat activated. Drivers cannot view your phone number.', time: 'Just now' },
    { sender: 'driver', text: 'Hi! I am starting from the expressway parking lot. Be there in 4 mins.', time: 'Just now' }
  ]);
  const [typingMsg, setTypingMsg] = useState('');

  // Tracking tab parameters
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(DEFAULT_SHIPMENTS[0]);

  // Join tab driver form parameters
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverRegion, setDriverRegion] = useState(OPERATING_REGIONS[0]);
  const [driverVehicle, setDriverVehicle] = useState('sedan');
  const [driverLicenseInput, setDriverLicenseInput] = useState('');
  const [joinStep, setJoinStep] = useState<'FORM' | 'UPLOADS' | 'SUCCESS'>('FORM');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Support section FAQ & Chat state
  const [supportMessages, setSupportMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Hello! I am HUB-Assist, your virtual transport guide. How can I help you today in Delhi or Noida?' }
  ]);
  const [userSupportText, setUserSupportText] = useState('');

  // Support scroll ref and Gemini client ref
  const supportEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<any>(null);

  useEffect(() => {
    try {
      // Initialize Gemini SDK with user specified API key safely
      aiRef.current = new GoogleGenAI({ apiKey: "AIzaSyAVOzUIPoJWEaBsbj4y7bOJAzqYCXiEzTI" });
    } catch (e) {
      console.warn("Could not instantiate Gemini Client:", e);
    }
  }, []);

  // Auto-scroll logic for support chat
  useEffect(() => {
    if (supportEndRef.current) {
      supportEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [supportMessages]);

  // Sheet expandable state for premium details on mobile
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  // Suggested location select shortcut
  const handleLocationPreset = (from: string, to: string) => {
    setPickup(from);
    setDestination(to);
    setMapOrigin(from);
    setMapDestination(to);
  };

  // Switch Booking Sub-category filters
  const getFaresForCategory = () => {
    return DEFAULT_VEHICLES.filter(v => v.category === vehicleCat);
  };

  // Simulated Pricing Fares based on standard distance estimates
  const getFareMultiplier = (id: string): number => {
    switch (id) {
      case 'cargo-bike': return 120;
      case 'sedan': return 240;
      case 'suv-xl': return 450;
      case 'mini-truck': return 350;
      case 'pickup-truck': return 550;
      default: return 200;
    }
  };

  // Matching algorithm loops for driver assignment
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (bookingStage === 'MATCHING') {
      setDispatchProgress(0);
      setMatchingStatus('Locating nearby active GPS hubs...');
      
      const stages = [
        { progress: 15, msg: 'Comparing vehicle payload capabilities...' },
        { progress: 40, msg: 'Assigning nearest verified driver partner...' },
        { progress: 65, msg: 'Confirming Ravi Kumar (DL-3C-1284)...' },
        { progress: 85, msg: 'Securing flat-rate pricing guarantee value...' },
        { progress: 100, msg: 'Ravi Kumar is heading to your designated pickup spot!' }
      ];

      let currentIndex = 0;
      interval = setInterval(() => {
        if (currentIndex < stages.length) {
          const currentStage = stages[currentIndex];
          setDispatchProgress(currentStage.progress);
          setMatchingStatus(currentStage.msg);
          currentIndex++;
        } else {
          clearInterval(interval);
          setBookingStage('ACCEPTED');
        }
      }, 950);
    }
    return () => clearInterval(interval);
  }, [bookingStage]);

  // Driver chat autoreply simulation
  const sendUserChatMessage = () => {
    if (!typingMsg.trim()) return;
    const newMsg = { sender: 'user' as const, text: typingMsg, time: 'Now' };
    setChatMessages(prev => [...prev, newMsg]);
    setTypingMsg('');

    // Trigger driver auto-reply
    setTimeout(() => {
      let replyText = 'Understood. On my way!';
      if (newMsg.text.toLowerCase().includes('metro') || newMsg.text.toLowerCase().includes('gate')) {
        replyText = 'Excellent. I will park right next to the MCD Metro stairs.';
      } else if (newMsg.text.toLowerCase().includes('wait') || newMsg.text.toLowerCase().includes('time')) {
        replyText = 'No problem! I can wait for 5 minutes free of charge.';
      } else if (newMsg.text.toLowerCase().includes('delay') || newMsg.text.toLowerCase().includes('jam')) {
        replyText = 'Traffic is moving slowly near Noida Sect 18, but I’ve taken the back flyover.';
      }
      setChatMessages(prev => [...prev, { sender: 'driver' as const, text: replyText, time: 'Now' }]);
    }, 1200);
  };

  // Support chatbot logic with Gemini Live Core
  const handleSupportSend = async () => {
    if (!userSupportText.trim()) return;
    const promptText = userSupportText;
    const userMsg = { sender: 'user' as const, text: promptText };
    setSupportMessages(prev => [...prev, userMsg]);
    setUserSupportText('');

    // Push typing placeholder
    const botPlaceholder = { sender: 'bot' as const, text: 'Typing...' };
    setSupportMessages(prev => [...prev, botPlaceholder]);

    try {
      if (aiRef.current) {
        const response = await aiRef.current.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: promptText,
          config: {
            systemInstruction: "You are the automated assistant for 'THE HUB' transport and logistics app in Delhi-NCR (Delhi, Noida, Gurgaon, Ghaziabad, Faridabad). Answer user queries about cab bookings, cargo loaders, couriers helpfully, briefly (under 2 sentences) and professionally. Cabs are ₹16/km flat, Tata Ace loaders start at ₹349. Zero surge applies. If they ask about joining as a partner driver, tell them to tap on 'Join Hub' tab in the app.",
          }
        });
        const answer = response.text || "I am here to assist you with your THE HUB transport requests.";
        setSupportMessages(prev => {
          const removedLast = prev.slice(0, prev.length - 1);
          return [...removedLast, { sender: 'bot' as const, text: answer }];
        });
      } else {
        throw new Error("Gemini AI Client not initialized");
      }
    } catch (err) {
      console.warn("Gemini support chat failed or offline, launching safety fallback system.", err);
      setTimeout(() => {
        let botResponse = 'Thank you for writing. Your query is logged. Direct support is available at support@ncrhub.live.';
        const input = promptText.toLowerCase();
        if (input.includes('price') || input.includes('fare') || input.includes('rate')) {
          botResponse = 'Our pricing is strictly fixed. Cabs are ₹16/km, Loader trucks start from ₹349. Zero high-demand surge factor applies across Noida and Delhi.';
        } else if (input.includes('cancel') || input.includes('refund')) {
          botResponse = 'Rides canceled within 3 minutes of booking have absolutely zero charge. Post 3 mins, a flat booking offset fee of ₹30 might be credited next ride.';
        } else if (input.includes('register') || input.includes('join') || input.includes('attach')) {
          botResponse = 'To start driving with THE HUB, move into the "JOIN HUB" tab at the bottom of the screen. Upload your documents, and our Noida Sec 62 office will issue keys in 2 hours.';
        } else if (input.includes('safety') || input.includes('police') || input.includes('driver')) {
          botResponse = 'All drivers require regional credentials. If you experience emergency situations, immediately click the SOS button in your passenger ride sheet.';
        }
        setSupportMessages(prev => {
          const removedLast = prev.slice(0, prev.length - 1);
          return [...removedLast, { sender: 'bot' as const, text: botResponse }];
        });
      }, 750);
    }
  };

  // Onboarding File Upload simulation
  const startDocumentUpload = () => {
    setIsUploading(true);
    setUploadPercent(0);
    const run = setInterval(() => {
      setUploadPercent(p => {
        if (p >= 100) {
          clearInterval(run);
          setIsUploading(false);
          setUploadedFiles(prev => [...prev, 'Verified_Govt_ID_' + (Math.floor(Math.random() * 8000) + 1000) + '.pdf']);
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  // Sync maps on Track shipment switches
  const handleTrackSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setActiveShipmentId(shipment.id);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#111111] overflow-hidden text-white font-sans relative">
      
      {/* ────────────────── APP HEADER SECTION ────────────────── */}
      <div className="shrink-0 bg-[#131313] border-b border-white/[0.08] px-4 py-3.5 z-40 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5545] animate-pulse" />
          <span className="font-display text-xs font-black tracking-widest text-[#ff5545] text-glow">THE HUB</span>
          <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-neutral-400 font-mono">ACTIVE APP</span>
        </div>

        {/* Back to Home Button */}
        <button 
          onClick={onExit}
          className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 hover:border-white/20 active:scale-95 text-[10px] font-bold font-sans uppercase px-3.5 py-1.5 rounded-full transition-all text-neutral-300 cursor-pointer shadow-sm"
        >
          <Globe size={11} className="text-[#ff5545]" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* ────────────────── CENTRAL CONTENT LAYOUT (Split or Full) ────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* Render Map Layer only on BOOK and TRACK tabs */}
        {(mobileTab === 'BOOK' || mobileTab === 'TRACK') && (
          <div className="w-full h-[36vh] shrink-0 relative bg-[#131313] z-10 overflow-hidden rounded-none select-none">
            <GMap 
              origin={mobileTab === 'BOOK' ? mapOrigin : selectedShipment.origin}
              destination={mobileTab === 'BOOK' ? mapDestination : selectedShipment.destination}
              activeShipmentId={mobileTab === 'TRACK' ? selectedShipment.id : activeShipmentId}
              className="w-full h-full pointer-events-auto rounded-none"
            />
            
            {/* Overlay Latency Badge */}
            <div className="absolute top-4 right-4 bg-[#171717]/95 border border-white/5 backdrop-blur-md py-1 px-2.5 rounded-full text-[8px] text-emerald-400 font-mono font-bold tracking-wide shadow-md pointer-events-none z-25">
              9.8ms LATENCY
            </div>
            {/* Operating region badge */}
            <div className="absolute top-4 left-4 bg-[#171717]/95 border border-white/5 backdrop-blur-md py-1 px-2.5 rounded-full text-[8px] text-white/80 font-mono font-bold tracking-wide shadow-md pointer-events-none z-25">
              NCR ZONE
            </div>
          </div>
        )}

        {/* ────────────────── ACTION SELECTOR / CONTROL SHEET CONTAINER ────────────────── */}
        <div className="flex-grow min-h-0 bg-[#131313] overflow-y-auto pb-24 relative z-20 scrollbar-none">
          <AnimatePresence mode="wait">
            
            {/* BOOKING TAB CONTENT */}
            {mobileTab === 'BOOK' && (
              <motion.div 
                key="book-tab"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="w-full bg-[#131313] pb-12 overflow-hidden"
              >
                {/* Visual Notch Panel Indicator */}
                <div 
                  onClick={() => setIsSheetExpanded(!isSheetExpanded)}
                  className="w-full py-2 flex justify-center cursor-pointer items-center border-b border-white/[0.02]"
                >
                  <div className="w-10 h-0.5 bg-neutral-700 rounded-full hover:bg-neutral-500 transition-colors" />
                </div>

                <div className="px-5 pt-3 select-none">
                  
                  {/* Category switcher tabs */}
                  {bookingStage === 'ROUTE' && (
                    <div className="flex gap-2 p-1 bg-black/40 border border-white/[0.06] rounded-2xl mb-4">
                      <button 
                        onClick={() => setVehicleCat('transit')}
                        className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                          vehicleCat === 'transit' ? 'bg-[#ff5545] text-white' : 'text-neutral-400'
                        }`}
                      >
                        <Car size={13} />
                        <span>Rides</span>
                      </button>
                      <button 
                        onClick={() => setVehicleCat('courier')}
                        className={`flex-1 py-1 px-1.5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                          vehicleCat === 'courier' ? 'bg-[#ff5545] text-white' : 'text-neutral-400'
                        }`}
                      >
                        <Bike size={13} />
                        <span>Courier</span>
                      </button>
                      <button 
                        onClick={() => setVehicleCat('logistics')}
                        className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                          vehicleCat === 'logistics' ? 'bg-[#ff5545] text-white' : 'text-neutral-400'
                        }`}
                      >
                        <Truck size={13} />
                        <span>Freight</span>
                      </button>
                    </div>
                  )}

                  {/* STAGE 1: ROUTING ENTER VIEW */}
                  {bookingStage === 'ROUTE' && (
                    <div className="space-y-4">
                      {/* Input stack */}
                      <div className="bg-[#1e1e1e] border border-white/[0.08] rounded-2xl p-3.5 space-y-3 relative shadow-inner">
                        {/* Connecting Line */}
                        <div className="absolute left-6.5 top-10 bottom-10 w-[1px] border-dashed border-l border-neutral-600 z-10" />

                        <div className="flex items-center gap-3 relative z-20">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">PICKUP SPOT</span>
                            <input 
                              type="text" 
                              value={pickup} 
                              onChange={(e) => setPickup(e.target.value)}
                              className="w-full bg-transparent border-none text-xs font-semibold text-white focus:outline-none p-0 mt-0.5" 
                              placeholder="Where to pick you up?"
                            />
                          </div>
                          {pickup && <button onClick={() => setPickup('')} className="p-1 hover:bg-neutral-800 rounded-full"><X size={12} /></button>}
                        </div>

                        <div className="border-t border-white/[0.04]" />

                        <div className="flex items-center gap-3 relative z-20">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5545] flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">DESTINATION DROP</span>
                            <input 
                              type="text" 
                              value={destination} 
                              onChange={(e) => setDestination(e.target.value)}
                              className="w-full bg-transparent border-none text-xs font-semibold text-white focus:outline-none p-0 mt-0.5" 
                              placeholder="Where are you heading?"
                            />
                          </div>
                          {destination && <button onClick={() => setDestination('')} className="p-1 hover:bg-neutral-800 rounded-full"><X size={12} /></button>}
                        </div>
                      </div>

                      {/* Location Shortcuts presets */}
                      <div className="mb-1">
                        <span className="text-[9px] font-mono font-bold text-neutral-500 tracking-wider uppercase block mb-2">QUICK BOOKING PRESETS</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div 
                            onClick={() => handleLocationPreset('Sector 18, Noida, UP', 'Connaught Place, Delhi')}
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 cursor-pointer hover:bg-white/[0.05] flex items-center gap-2 transition-colors duration-250"
                          >
                            <Briefcase className="w-4 h-4 text-[#ff5545] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-white block truncate">Noida ➔ Delhi CP</span>
                              <span className="text-[8px] text-neutral-500 font-mono">Daily Commute Line</span>
                            </div>
                          </div>
                          <div 
                            onClick={() => handleLocationPreset('Sector 18, Noida, UP', 'Dwarka Sector 10, Delhi')}
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 cursor-pointer hover:bg-white/[0.05] flex items-center gap-2 transition-colors duration-250"
                          >
                            <Compass className="w-4 h-4 text-[#ff5545] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-white block truncate">Noida ➔ Dwarka</span>
                              <span className="text-[8px] text-neutral-500 font-mono">DND Flyway Route</span>
                            </div>
                          </div>
                          <div 
                            onClick={() => handleLocationPreset('IGI Airport T3, Delhi', 'Sector 150, Noida, UP')}
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 cursor-pointer hover:bg-white/[0.05] flex items-center gap-2 transition-colors duration-250"
                          >
                            <Plane className="w-4 h-4 text-[#ff5545] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-white block truncate">Airport ➔ Noida</span>
                              <span className="text-[8px] text-neutral-500 font-mono">Expressway Shuttle</span>
                            </div>
                          </div>
                          <div 
                            onClick={() => handleLocationPreset('Sector 18, Noida, UP', 'Sector 62, Noida, UP')}
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 cursor-pointer hover:bg-white/[0.05] flex items-center gap-2 transition-colors duration-250"
                          >
                            <Package className="w-4 h-4 text-[#ff5545] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-white block truncate">Sec 18 ➔ Sec 62</span>
                              <span className="text-[8px] text-neutral-500 font-mono">Local Cargo Direct</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Proceed Action */}
                      <button 
                        onClick={() => {
                          setMapOrigin(pickup);
                          setMapDestination(destination);
                          setBookingStage('VEHICLE');
                        }}
                        disabled={!pickup || !destination}
                        className="w-full bg-[#ff5545] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_24px_rgba(255,85,69,0.3)] cursor-pointer"
                      >
                        ESTIMATE FARES & VEHICLES
                      </button>
                    </div>
                  )}

                  {/* STAGE 2: VEHICLE CONFIRM TIER */}
                  {bookingStage === 'VEHICLE' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-mono text-[#ff5545] font-black uppercase tracking-widest block">AVAILABLE CRITERIA</span>
                          <h3 className="text-sm font-bold uppercase text-white font-display">CHOOSE RIDE OPTION</h3>
                        </div>
                        <button 
                          onClick={() => setBookingStage('ROUTE')} 
                          className="text-[10px] font-mono font-bold border border-white/10 hover:border-white px-2.5 py-1 text-neutral-400 rounded-lg hover:text-white uppercase"
                        >
                          Change Route
                        </button>
                      </div>

                      {/* Stack of categorised vehicles with live simulated rates */}
                      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {getFaresForCategory().map((vehicle) => {
                          const isSel = selectedVehicle.id === vehicle.id;
                          return (
                            <div 
                              key={vehicle.id}
                              onClick={() => setSelectedVehicle(vehicle)}
                              className={`p-3 border rounded-2xl cursor-pointer flex items-center justify-between transition-all ${
                                isSel
                                  ? 'bg-white/[0.08] border-white shadow-md'
                                  : 'bg-[#1a1a1a] border-white/5 opacity-80 hover:opacity-100 hover:border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-800 border border-white/15 rounded-xl">
                                  {vehicle.category === 'transit' ? <Car size={18} className="text-[#ff5545]" /> : vehicle.category === 'courier' ? <Bike size={18} className="text-[#ff5545]" /> : <Truck size={18} className="text-[#ff5545]" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white uppercase">{vehicle.name}</span>
                                    {vehicle.tag && (
                                      <span className="bg-[#ff5545]/15 border border-[#ff5545]/20 text-[#ff5545] text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider block">
                                        PROMO
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">Capacity: {vehicle.capacity}</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-xs font-bold text-white font-mono">₹{getFareMultiplier(vehicle.id)}</p>
                                <span className="text-[8px] text-neutral-400 block mt-0.5">4 mins away</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bottom disclaimer bar on details */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 flex items-start gap-2">
                        <Shield size={13} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[9px] text-neutral-400 leading-snug">
                          {selectedVehicle.description} Rates are fixed directly from Noida & Delhi transportation tables. Zero surge values added.
                        </p>
                      </div>

                      {/* Activate Booking Dispatch button */}
                      <button 
                        onClick={() => setBookingStage('MATCHING')}
                        className="w-full bg-[#ff5545] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_24px_rgba(255,85,69,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        CONFIRM BOOKING: ₹{getFareMultiplier(selectedVehicle.id)}
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}

                  {/* STAGE 3: RADAR DISPATCH MATCHING SCREEN */}
                  {bookingStage === 'MATCHING' && (
                    <div className="space-y-4">
                      {/* Matching Loader */}
                      <div className="py-6 flex flex-col items-center justify-center relative overflow-hidden">
                        
                        {/* Radar Ripple visual */}
                        <div className="absolute w-32 h-32 border-4 border-[#ff5545]/50 animate-ping rounded-full pointer-events-none opacity-20" />
                        <div className="absolute w-48 h-48 border border-[#ff5545]/40 animate-pulse rounded-full pointer-events-none opacity-10" />

                        <div className="w-16 h-16 bg-[#ff5545]/15 border border-[#ff5545]/40 rounded-full flex items-center justify-center text-[#ff5545] mb-4.5 relative z-10 animate-bounce">
                          <Activity size={24} className="animate-pulse" />
                        </div>

                        <span className="text-[10px] font-mono text-[#ff5545] font-black uppercase tracking-widest block text-center mb-1">
                          DISPATCHING SEARCH ENGINE
                        </span>
                        <h4 className="text-sm font-bold text-center text-white mb-2 uppercase tracking-wide">
                          {matchingStatus}
                        </h4>

                        {/* Custom visual horizontal progress meter */}
                        <div className="w-full max-w-[240px] h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-2 relative border border-white/5">
                          <div className="absolute top-0 left-0 h-full bg-[#ff5545] transition-all duration-300" style={{ width: `${dispatchProgress}%` }} />
                        </div>
                      </div>

                      {/* Match details block */}
                      <div className="bg-[#1b1b1b] border border-white/5 rounded-2xl p-3.5 space-y-2 text-center text-xs font-sans text-neutral-400">
                        <p>Route: <strong className="text-white">{pickup}</strong> to <strong className="text-white">{destination}</strong></p>
                        <p className="font-mono text-[10px] text-neutral-500">REQUEST_ID: REQ-{Math.floor(Math.random()*90000)+10000}-NCR</p>
                      </div>

                      {/* Crash escape loop */}
                      <button 
                        onClick={() => setBookingStage('VEHICLE')}
                        className="w-full border border-white/15 bg-white/5 text-neutral-400 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:text-white hover:border-white transition-all cursor-pointer"
                      >
                        Cancel Dispatch
                      </button>
                    </div>
                  )}

                  {/* STAGE 4: BOOKING ACCEPTED SHEET (NATIVE DRIVER INFO) */}
                  {bookingStage === 'ACCEPTED' && (
                    <div className="space-y-4">
                      {/* Header details */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            DRIVER BOOKED • 4 MINS AWAY
                          </span>
                          <p className="text-xs text-neutral-400 mt-0.5">Please share OTP at trip start only.</p>
                        </div>
                        <span className="bg-[#1c1c1c] border border-white/[0.08] px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-white relative flex shadow-sm">
                          OTP: <strong className="text-[#ff5545] font-black ml-1">4920</strong>
                        </span>
                      </div>

                      {/* Driver Card Body */}
                      <div className="p-4 bg-[#1e1e1e] border border-white/[0.08] rounded-3xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-neutral-800 rounded-full border border-white/15 overflow-hidden flex items-center justify-center text-[#ff5545] font-bold">
                              RK
                            </div>
                            <span className="absolute -bottom-1 -right-1 bg-emerald-500 border border-[#1e1e1e] rounded-full w-5.5 h-5.5 flex items-center justify-center text-white p-1">
                              <Star className="w-2.5 h-2.5 text-white fill-white" />
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wide border-b border-white/5 pb-0.5 mb-1 flex items-center gap-1.5">Ravi Kumar</h4>
                            <p className="text-[9px] font-mono text-neutral-400 uppercase">DL-3C-AW-9284 • SEDAN</p>
                            <p className="text-[8px] text-neutral-500 font-sans mt-1 flex items-center gap-1 uppercase tracking-wide">
                              Verified partner • 4.9 <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            </p>
                          </div>
                        </div>

                        {/* Interactive App Contacts panel */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setActiveCallSIM('Ravi Kumar (+91 98110-XXXXX)')}
                            className="w-9 h-9 rounded-full bg-neutral-800 border border-white/5 active:bg-neutral-700 transition-colors flex items-center justify-center text-white"
                          >
                            <Phone size={15} />
                          </button>
                          <button 
                            onClick={() => setActiveChatModal(true)}
                            className="w-9 h-9 rounded-full bg-[#ff5545]/15 border border-[#ff5545]/20 active:bg-[#ff5545]/30 transition-colors flex items-center justify-center text-[#ff5545]"
                          >
                            <MessageSquare size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Safe controls SOS & cancel */}
                      <div className="grid grid-cols-2 gap-3 pb-1">
                        <button 
                          onClick={() => setActiveCallSIM('POLICE EMERGENCY HELPLINE (112)')}
                          className="py-3 px-4 rounded-full border border-red-500/20 bg-red-950/20 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <Shield size={13} />
                          <span>SOS Emergency</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Cancel this active ride booking?')) {
                              setBookingStage('ROUTE');
                              setIsSheetExpanded(false);
                            }
                          }}
                          className="py-3 px-4 rounded-full border border-white/5 bg-[#171717] hover:bg-neutral-800 transition-colors text-neutral-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* TRACKING TAB CONTENT */}
            {mobileTab === 'TRACK' && (
              <motion.div 
                key="track-tab"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="w-full bg-[#131313] pb-12 overflow-hidden"
              >
                {/* Visual Notch Panel Indicator */}
                <div className="w-full py-2 flex justify-center border-b border-white/[0.02]">
                  <div className="w-10 h-0.5 bg-neutral-700 rounded-full" />
                </div>

                <div className="px-5 pt-3">
                  <span className="text-[9px] font-mono text-[#ff5545] font-black uppercase tracking-widest block">LOGISTICS RUN VIEWS</span>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase text-white font-display">TRACK PASSENGER & CARGO SHIPMENT</h3>
                    <span className="text-[8px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 px-1.5 py-0.5 rounded font-mono">MAP DYNAMIC</span>
                  </div>

                  {/* Horizontal Scroll Selector across cargo shipments */}
                  <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-800">
                    {DEFAULT_SHIPMENTS.map((s) => {
                      const isActive = selectedShipment.id === s.id;
                      return (
                        <div 
                          key={s.id}
                          onClick={() => handleTrackSelectShipment(s)}
                          className={`p-3 rounded-2xl cursor-pointer border flex flex-col justify-between min-w-[150px] transition-all overflow-hidden ${
                            isActive 
                              ? 'bg-white/[0.07] border-white shadow-md' 
                              : 'bg-[#1a1a1a] border-white/5 hover:border-white/10 opacity-80'
                          }`}
                        >
                          <div>
                            <span className="text-[8px] font-mono text-neutral-500 block truncate">{s.id}</span>
                            <span className="text-[10px] font-bold text-white block truncate uppercase mt-0.5">{s.destination.split(',')[0]}</span>
                          </div>
                          
                          <div className="flex items-center justify-between gap-1 mt-3">
                            <span className={`text-[8px] font-semibold px-2 py-0.5 rounded font-mono border ${
                              s.status === 'IN_TRANSIT' ? 'bg-amber-950/40 border-amber-500/20 text-amber-500' : s.status === 'DELIVERED' ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' : 'bg-red-950/40 border-red-500/20 text-red-500'
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipment detailed tracking timeline */}
                  <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 space-y-4 max-h-[160px] overflow-y-auto">
                    <div className="flex justify-between items-center text-xs font-sans pb-2 border-b border-white/[0.04]">
                      <div>
                        <p className="text-neutral-500 font-mono text-[9px] uppercase">ORIGIN DISPATCH POINT</p>
                        <p className="text-white font-bold truncate max-w-[170px]">{selectedShipment.origin}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-neutral-500 font-mono text-[9px] uppercase">ETA DELIVER TIME</p>
                        <p className="text-[#ff5545] font-mono font-bold">{selectedShipment.eta !== '00:00:00' ? selectedShipment.eta : 'DELIVERED'}</p>
                      </div>
                    </div>

                    {/* Timeline logs */}
                    <div className="space-y-4 pl-3 relative">
                      <div className="absolute left-1 top-2 bottom-2 w-[1px] bg-neutral-800" />
                      {selectedShipment.historyLogs.map((log, index) => (
                        <div key={index} className="relative flex gap-3 text-xs font-sans">
                          {/* Dot container */}
                          <div className={`absolute -left-2 top-1.5 w-2 h-2 rounded-full border ${
                            log.completed ? 'bg-emerald-500 border-white' : 'bg-neutral-800 border-neutral-600'
                          }`} />
                          
                          <div className="pl-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white uppercase">{log.status}</span>
                              <span className="text-[9px] font-mono text-neutral-500">{log.time}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{log.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* JOIN DRIVER PARTNER TAB */}
            {mobileTab === 'JOIN' && (
              <motion.div 
                key="join-tab"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="w-full bg-[#131313] pb-12 overflow-hidden"
              >
                {/* Visual Notch Panel Indicator */}
                <div className="w-full py-2 flex justify-center border-b border-white/[0.02]">
                  <div className="w-10 h-0.5 bg-neutral-700 rounded-full" />
                </div>

                <div className="px-5 pt-3">
                  <span className="text-[9px] font-mono text-[#ff5545] font-black uppercase tracking-widest block">ATTACH CABS / TRUCKS</span>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase text-white font-display">NCR TRANSPORTER ONboarding</h3>
                    <span className="text-[8px] bg-red-950/20 border border-red-500/20 px-2 py-0.5 rounded text-[#ff5545] font-mono uppercase">2hr Approval</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {/* STEP 1: FORM FIELDS */}
                    {joinStep === 'FORM' && (
                      <motion.div 
                        key="join-form" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="text-[8px] font-mono font-bold text-neutral-400 text-glow block mb-0.5 uppercase">DRIVER Full NAME</label>
                          <input 
                            type="text" 
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#ff5545]"
                            placeholder="e.g., Sunil Chaudhary"
                          />
                        </div>

                        <div>
                          <label className="text-[8px] font-mono font-bold text-neutral-400 text-glow block mb-0.5 uppercase">EMAIL ADDRESS</label>
                          <input 
                            type="email" 
                            value={driverEmail}
                            onChange={(e) => setDriverEmail(e.target.value)}
                            className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#ff5545]"
                            placeholder="sunil@gmail.com"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] font-mono font-bold text-neutral-400 text-glow block mb-0.5 uppercase">OPERATING ZONE</label>
                            <select 
                              value={driverRegion}
                              onChange={(e) => setDriverRegion(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#ff5545]"
                            >
                              {OPERATING_REGIONS.map((r, i) => (
                                <option key={i} value={r} className="bg-neutral-900">{r.split('(')[0]}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[8px] font-mono font-bold text-neutral-400 text-glow block mb-0.5 uppercase">VEHICLE TIER</label>
                            <select 
                              value={driverVehicle}
                              onChange={(e) => setDriverVehicle(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#ff5545]"
                            >
                              <option value="sedan" className="bg-neutral-900">Sedan Cab (City AC)</option>
                              <option value="suv-xl" className="bg-neutral-900">SUV XL (6 Seater)</option>
                              <option value="cargo-bike" className="bg-neutral-900">Courier (Small load)</option>
                              <option value="mini-truck" className="bg-neutral-900">Tata Ace (Loader)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[8px] font-mono font-bold text-neutral-400 text-glow block mb-0.5 uppercase">COMMERCIAL DRIVING LICENSE NUMBER</label>
                          <input 
                            type="text" 
                            value={driverLicenseInput}
                            onChange={(e) => setDriverLicenseInput(e.target.value)}
                            className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#ff5545]"
                            placeholder="e.g., DL142023004XXXX"
                          />
                        </div>

                        <button
                          onClick={() => setJoinStep('UPLOADS')}
                          disabled={!driverName || !driverEmail || !driverLicenseInput}
                          className="w-full bg-[#ff5545] text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#ff5545]/20 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none cursor-pointer mt-1 block text-center"
                        >
                          PROCEED TO UPLOADS
                        </button>
                      </motion.div>
                    )}

                    {/* STEP 2: DOCUMENT VERIFICATION ONBOARD */}
                    {joinStep === 'UPLOADS' && (
                      <motion.div 
                        key="join-doc" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-3 text-center">
                          <p className="text-[11px] text-neutral-300 mb-2 font-semibold">Upload clear photos of DL and registration credentials for immediate background match.</p>
                          
                          <div 
                            onClick={startDocumentUpload}
                            className="border-2 border-dashed border-[#ff5545]/30 bg-white/[0.02] hover:bg-white/[0.04] py-5 rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-all"
                          >
                            <Paperclip size={20} className="text-[#ff5545] mb-1.5 animate-bounce" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">TAP TO UPLOAD DOCUMENT PDF/IMAGE</span>
                            <span className="text-[8px] text-neutral-500 font-mono mt-0.5">Accepts PDF, JPG under 10MB</span>
                          </div>

                          {isUploading && (
                            <div className="mt-3">
                              <div className="flex justify-between items-center text-[8px] font-mono text-neutral-400 mb-1">
                                <span>VERIFYING SECURE STORAGE...</span>
                                <span>{uploadPercent}%</span>
                              </div>
                              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#ff5545]" style={{ width: `${uploadPercent}%` }} />
                              </div>
                            </div>
                          )}

                          {uploadedFiles.length > 0 && (
                            <div className="mt-2.5 space-y-1 text-left">
                              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block">UPLOADED DOCUMENTS</span>
                              {uploadedFiles.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 bg-neutral-900 border border-white/5 px-2 py-1 rounded-xl text-[9px] text-emerald-400 font-mono">
                                  <CheckCircle size={10} />
                                  <span className="truncate flex-1">{f}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <button 
                            onClick={() => setJoinStep('FORM')}
                            className="py-2.5 rounded-full border border-white/10 hover:border-white transition-colors text-neutral-400 text-xs font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Back
                          </button>
                          <button 
                            onClick={() => setJoinStep('SUCCESS')}
                            disabled={uploadedFiles.length === 0}
                            className="py-2.5 rounded-full bg-[#ff5545] hover:brightness-110 active:scale-95 transition-all text-white text-xs font-bold uppercase tracking-wider shadow-lg disabled:opacity-50 cursor-pointer"
                          >
                            SUBMIT APPLICATION
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: CONGRATS SUCCESS SCREEN */}
                    {joinStep === 'SUCCESS' && (
                      <motion.div 
                        key="join-success" 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0 }}
                        className="py-6 flex flex-col items-center justify-center text-center space-y-4"
                      >
                        <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
                          <CheckCircle size={28} />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold uppercase text-white font-display">APPLICATION LOGGED REGISTERED!</h4>
                          <p className="text-[11px] text-neutral-400 max-w-sm mt-1.5 leading-relaxed">
                            Superb comms. Sunil, your transport file DL-REG-{Math.floor(Math.random()*8000)+1000} has been created successfully. Our team will SMS your verified portal passwords details in 2 hours.
                          </p>
                        </div>

                        <button 
                          onClick={() => {
                            setDriverName('');
                            setDriverEmail('');
                            setDriverLicenseInput('');
                            setUploadedFiles([]);
                            setJoinStep('FORM');
                          }}
                          className="bg-[#1c1c1c] border border-white/10 hover:border-white text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer"
                        >
                          ONBOARD ANOTHER VEHICLE
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* CUSTOMER SUPPORT FAQ & HELP CHAT */}
            {mobileTab === 'SUPPORT' && (
              <motion.div 
                key="support-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#131313] flex flex-col z-30 font-sans"
              >
                {/* 1. Real Chat Client Header */}
                <div className="bg-[#181818] border-b border-white/[0.06] py-3.5 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-[#ff5545]/20 border border-[#ff5545]/30 flex items-center justify-center text-[#ff5545] font-black text-xs font-display">
                        HB
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#181818] rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide leading-tight">Hub bot Assist</h4>
                      <p className="text-[9px] text-[#ff5545] font-mono tracking-wider font-bold">Delhi NCR Dispatcher</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded tracking-widest uppercase">✓ ONLINE 24/7</span>
                  </div>
                </div>

                {/* 2. Messages List Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none bg-[#111111]/40 shadow-inner">
                  {supportMessages.map((m, index) => {
                    const isUser = m.sender === 'user';
                    return (
                      <div 
                        key={index} 
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed relative ${
                          isUser 
                            ? 'bg-[#ff5545] text-white rounded-tr-none shadow-md shadow-[#ff5545]/10' 
                            : 'bg-[#1e1e1e] text-neutral-200 border border-white/5 rounded-tl-none shadow-sm'
                        }`}>
                          <p className="pr-1">{m.text}</p>
                          
                          {/* Small timestamp and status double-ticks */}
                          <div className={`flex items-center justify-end gap-1 text-[8px] font-mono mt-1.5 ${
                            isUser ? 'text-white/70' : 'text-neutral-500'
                          }`}>
                            <span>18:54</span>
                            {isUser && (
                              <span className="text-white">✓✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={supportEndRef} />
                </div>

                {/* 3. Fast visual FAQs buttons click triggers query auto */}
                <div className="p-3 bg-[#131313] border-t border-white/[0.04] space-y-1 bg-black/10">
                  <span className="text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest block font-black">Quick Helpers</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    <button 
                      onClick={() => setUserSupportText('How do you calculate fixed prices?')}
                      className="bg-[#1c1c1c] border border-white/5 text-neutral-300 font-sans text-[9px] font-bold px-3 py-1.5 rounded-full hover:text-white hover:border-[#ff5545]/30 shrink-0 cursor-pointer transition-colors"
                    >
                      ₹ Flat Rates
                    </button>
                    <button 
                      onClick={() => setUserSupportText('What are the refund procedures?')}
                      className="bg-[#1c1c1c] border border-white/5 text-neutral-300 font-sans text-[9px] font-bold px-3 py-1.5 rounded-full hover:text-white hover:border-[#ff5545]/30 shrink-0 cursor-pointer transition-colors"
                    >
                      Cancel / Refunds
                    </button>
                    <button 
                      onClick={() => setUserSupportText('I want to attach my Tata Ace mini loader')}
                      className="bg-[#1c1c1c] border border-white/5 text-neutral-300 font-sans text-[9px] font-bold px-3 py-1.5 rounded-full hover:text-white hover:border-[#ff5545]/30 shrink-0 cursor-pointer transition-colors"
                    >
                      Attach Vector
                    </button>
                  </div>
                </div>

                {/* 4. Sending panel */}
                <div className="p-3 bg-[#181818] border-t border-white/[0.06] flex items-center gap-2 pb-5">
                  <button className="text-neutral-400 hover:text-white transition-colors shrink-0 p-1">
                    <Paperclip size={16} />
                  </button>
                  <input 
                    type="text" 
                    value={userSupportText}
                    onChange={(e) => setUserSupportText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSupportSend(); }}
                    placeholder="Ask about fixed pricing, regions, support..."
                    className="flex-1 bg-[#222222] border border-white/5 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5545]/30 font-sans"
                  />
                  <button 
                    onClick={handleSupportSend}
                    className="bg-[#ff5545] text-white w-8 h-8 rounded-full flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer shadow-md"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* ────────────────── DRIVER CORNER LIVE CHAT MODAL OVERLAY ────────────────── */}
      <AnimatePresence>
        {activeChatModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#151515] border border-white/[0.12] w-full max-w-sm rounded-[2rem] overflow-hidden flex flex-col justify-between shadow-2xl shadow-black h-[420px]"
            >
              {/* Modal header */}
              <div className="p-4 bg-neutral-900 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white font-display">CHATTING WITH RAVI KUMAR</h4>
                    <span className="text-[8px] font-mono text-neutral-400 uppercase">DRIVER OTP PROTOCOL: 4920</span>
                  </div>
                </div>
                <button onClick={() => setActiveChatModal(false)} className="text-neutral-400 hover:text-white bg-white/5 active:bg-white/10 rounded-full p-1.5 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Chat messages */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3 scrollbar-thin">
                {chatMessages.map((m, i) => {
                  if (m.sender === 'system') {
                    return (
                      <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-[10px] text-center text-neutral-500 font-mono flex items-center justify-center gap-1.5 uppercase leading-snug">
                        <Shield size={11} className="text-emerald-500" />
                        <span>{m.text}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${
                        m.sender === 'user' 
                          ? 'bg-[#ff5545] text-white rounded-tr-none' 
                          : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-white/5'
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[7px] font-mono text-neutral-500 mt-1 uppercase">{m.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chat shortcuts buttons for rapid driver reply triggers */}
              <div className="px-4 pb-2">
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                  <button onClick={() => setTypingMsg('I have reached. I am near the main entry gate.')} className="bg-neutral-900 border border-white/5 text-neutral-400 text-[8px] font-mono px-2 py-1 rounded-lg hover:text-white shrink-0">
                    At the gate
                  </button>
                  <button onClick={() => setTypingMsg('Please wait 2 mins. I am checking out.')} className="bg-neutral-900 border border-white/5 text-neutral-400 text-[8px] font-mono px-2 py-1 rounded-lg hover:text-white shrink-0">
                    Wait 2 mins
                  </button>
                  <button onClick={() => setTypingMsg('Are you stuck in ring road traffic?')} className="bg-neutral-900 border border-white/5 text-neutral-400 text-[8px] font-mono px-2 py-1 rounded-lg hover:text-white shrink-0">
                    Traffics jam?
                  </button>
                </div>
              </div>

              {/* Input section */}
              <div className="p-3 bg-neutral-900 border-t border-white/[0.08] flex gap-2">
                <input 
                  type="text" 
                  value={typingMsg}
                  onChange={(e) => setTypingMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendUserChatMessage(); }}
                  placeholder="Send direct message to Ravi..."
                  className="flex-1 bg-[#1e1e1e] border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
                <button 
                  onClick={sendUserChatMessage}
                  className="bg-[#ff5545] text-white w-9 h-9 rounded-xl flex items-center justify-center hover:brightness-110 active:scale-95 text-glow shrink-0 cursor-pointer"
                >
                  <Send size={13} />
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────────────────── SIMULATED VOICE CALL MODAL OVERLAY ────────────────── */}
      <AnimatePresence>
        {activeCallSIM && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex flex-col justify-between items-center py-20"
          >
            <div className="text-center space-y-2 mt-12 animate-pulse">
              <span className="text-[11px] font-mono text-emerald-400 block tracking-[0.2em] uppercase">SECURED NCR LINE ACTIVE</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-wide text-white">{activeCallSIM}</h2>
              <p className="text-xs text-neutral-500">Connecting call using masked VoIP server...</p>
            </div>

            {/* Pulsating telephone badge */}
            <div className="w-24 h-24 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center text-red-500 scale-[1.2] relative animate-pulse">
              <div className="absolute inset-0 border border-red-500/10 rounded-full scale-[1.4] animate-ping" />
              <Phone size={36} className="rotate-[135deg]" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[11px] font-mono text-neutral-400 max-w-xs text-center leading-relaxed">
                Remember, all drivers are fully registered with Delhi-NCR authorities. Stay polite and report any anomalies directly.
              </p>
              <button 
                onClick={() => setActiveCallSIM(null)}
                className="bg-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg active:scale-90 cursor-pointer mt-3"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────────────────── BOTTOM FLOATING APP NAVIGATION BAR ────────────────── */}
      <div className="absolute bottom-0 inset-x-0 bg-[#151515] border-t border-white/[0.08] p-2 flex items-center justify-around z-40 shadow-[0_-8px_32px_rgba(0,0,0,0.6)]">
        <button 
          onClick={() => { setMobileTab('BOOK'); setIsSheetExpanded(false); }}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${
            mobileTab === 'BOOK' ? 'text-[#ff5545] font-bold bg-[#ff5545]/5' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Navigation size={18} />
          <span className="text-[9px] font-sans uppercase tracking-wider mt-1 block">Book Ride</span>
        </button>

        <button 
          onClick={() => { setMobileTab('TRACK'); setIsSheetExpanded(false); }}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${
            mobileTab === 'TRACK' ? 'text-[#ff5545] font-bold bg-[#ff5545]/5' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Activity size={18} />
          <span className="text-[9px] font-sans uppercase tracking-wider mt-1 block">Track Trip</span>
        </button>

        <button 
          onClick={() => { setMobileTab('JOIN'); setIsSheetExpanded(false); }}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${
            mobileTab === 'JOIN' ? 'text-[#ff5545] font-bold bg-[#ff5545]/5' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <User size={18} />
          <span className="text-[9px] font-sans uppercase tracking-wider mt-1 block">Join Hub</span>
        </button>

        <button 
          onClick={() => { setMobileTab('SUPPORT'); setIsSheetExpanded(false); }}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${
            mobileTab === 'SUPPORT' ? 'text-[#ff5545] font-bold bg-[#ff5545]/5' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquare size={18} />
          <span className="text-[9px] font-sans uppercase tracking-wider mt-1 block">Support</span>
        </button>
      </div>

    </div>
  );
}
