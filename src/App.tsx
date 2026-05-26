/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation, X, Car, Truck } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import LogisticsView from './components/LogisticsView';
import PartnersView from './components/PartnersView';
import ContactView from './components/ContactView';
import { ShaderAnimation } from './components/ui/shader-lines';
import MobileAppView from './components/MobileAppView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('HOME');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('hub-executive');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showAppView, setShowAppView] = useState<boolean>(false);
  const [showOptionPopup, setShowOptionPopup] = useState<boolean>(false);
  const [appInitialTab, setAppInitialTab] = useState<'BOOK' | 'TRACK' | 'JOIN' | 'SUPPORT'>('BOOK');
  const [appInitialCategory, setAppInitialCategory] = useState<'transit' | 'courier' | 'logistics'>('transit');

  useEffect(() => {
    const checkMobileWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobileWidth();
    window.addEventListener('resize', checkMobileWidth);
    return () => window.removeEventListener('resize', checkMobileWidth);
  }, []);

  const handleDeployFleetTrigger = () => {
    // Navigate user to Services and focus on the deployment maps console
    setSelectedVehicleId('hub-executive');
    setCurrentTab('SERVICES');
    
    // Smooth scroll down to deployment coordinate form terminal after rendering
    setTimeout(() => {
      const element = document.getElementById('deployment-terminal');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleSetTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleLaunchApp = (category: 'transit' | 'courier' | 'logistics') => {
    setAppInitialTab('BOOK');
    setAppInitialCategory(category);
    setShowAppView(true);
  };

  if (isMobile && showAppView) {
    return (
      <MobileAppView 
        setTab={handleSetTab} 
        onExit={() => setShowAppView(false)} 
        initialTab={appInitialTab}
        initialCategory={appInitialCategory}
      />
    );
  }

  return (
    <div className="min-h-screen text-[#e5e2e1] font-sans flex flex-col selection:bg-primary-container selection:text-white relative overflow-x-hidden antialiased">
      {/* Base Background Solid Color */}
      <div className="fixed inset-0 bg-[#131313] -z-30 pointer-events-none" />

      {/* Subtle Live GL Shader Background Accent */}
      <div className="fixed inset-0 pointer-events-none -z-20 opacity-[0.22] blur-[1px]" id="app-shader-bg">
        <ShaderAnimation />
      </div>

      {/* Dynamic Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary-container/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-primary-container/4 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Primary Header Segment */}
      <Header 
        currentTab={currentTab} 
        setTab={handleSetTab} 
        onDeployFleet={handleDeployFleetTrigger} 
        onLaunchApp={handleLaunchApp}
      />

      {/* Main Container Workspace */}
      <main className="flex-grow relative">
        {/* Glowing page progress bar effect on page switches */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentTab + "-loader"}
            className="absolute top-0 left-0 right-0 h-[3px] bg-primary-container z-50 origin-left shadow-[0_0_8px_rgba(255,85,69,0.6)]"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ 
              scaleX: [0, 0.4, 0.9, 1], 
              opacity: [1, 1, 0.8, 0] 
            }}
            transition={{ 
              duration: 0.55,
              times: [0, 0.3, 0.8, 1],
              ease: "easeInOut"
            }}
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {currentTab === 'HOME' && (
              <HomeView 
                setTab={handleSetTab} 
                onDeployFleet={handleDeployFleetTrigger} 
                isMobile={isMobile}
                onTriggerPopup={() => setShowOptionPopup(true)}
              />
            )}
            {currentTab === 'SERVICES' && (
              <ServicesView initialSelectVehicleId={selectedVehicleId} />
            )}
            {currentTab === 'LOGISTICS' && (
              <LogisticsView />
            )}
            {currentTab === 'PARTNERS' && (
              <PartnersView />
            )}
            {currentTab === 'CONTACT' && (
              <ContactView />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer Segment */}
      <Footer setTab={handleSetTab} />

      {/* Dynamic App Emulator Launcher on Mobile */}
      {isMobile && !showAppView && (
        <motion.button
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          onClick={() => setShowOptionPopup(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#ff5545] hover:bg-[#ff6c5e] text-white rounded-full p-4 shadow-[0_8px_32px_rgba(255,85,69,0.5)] flex items-center justify-center gap-2 font-sans font-bold text-xs uppercase tracking-wider transition-all border border-white/20 active:scale-95 cursor-pointer shadow-lg animate-pulse"
        >
          <Navigation size={15} className="animate-bounce text-white font-black" />
          <span>Launch Booking App</span>
        </motion.button>
      )}

      {/* Immersive Mobile Option Chooser Modal */}
      <AnimatePresence>
        {showOptionPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#171717] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative"
            >
              <button 
                onClick={() => setShowOptionPopup(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white mt-1 mr-1"
              >
                <X size={18} />
              </button>
              
              <div className="text-center mb-6">
                <span className="text-[10px] font-mono text-[#ff5545] font-black uppercase tracking-widest block mb-1">
                  HUB ROUTE ENGINE
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                  Select Channel
                </h3>
                <p className="text-xs text-neutral-400 mt-2">
                  What kind of transport dispatch network do you need to launch today?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowOptionPopup(false);
                    handleLaunchApp('transit');
                  }}
                  className="w-full bg-[#ff5545] hover:bg-[#ff6c5e] text-white p-4 rounded-2xl flex items-center gap-3 active:scale-98 transition-all text-left shadow-lg"
                >
                  <Car className="text-white bg-white/10 rounded-lg p-1.5 shrink-0" size={32} />
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider block">Passenger Transit</span>
                    <span className="text-[10px] text-white/80 block mt-0.5 truncate">AC Cabs & premium SUVs</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowOptionPopup(false);
                    handleLaunchApp('logistics');
                  }}
                  className="w-full bg-neutral-900 border border-white/10 hover:border-white/20 text-white p-4 rounded-2xl flex items-center gap-3 active:scale-98 transition-all text-left shadow-inner"
                >
                  <Truck className="text-[#ff5545] bg-white/5 rounded-lg p-1.5 shrink-0" size={32} />
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider block">Logistics Cargo</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5 truncate">Tata Ace & Couriers</span>
                  </div>
                </button>
              </div>

              <div className="mt-5 border-t border-white/[0.04] pt-4 text-center">
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
                  THE HUB Delhi-NCR Dispatch System
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
