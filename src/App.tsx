/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import LogisticsView from './components/LogisticsView';
import PartnersView from './components/PartnersView';
import ContactView from './components/ContactView';
import { ShaderAnimation } from './components/ui/shader-lines';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('HOME');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('hub-executive');

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
              <HomeView setTab={handleSetTab} onDeployFleet={handleDeployFleetTrigger} />
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
    </div>
  );
}
