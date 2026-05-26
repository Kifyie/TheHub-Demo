/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, Radio, Car, Truck } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onDeployFleet: () => void;
  onLaunchApp?: (category: 'transit' | 'courier' | 'logistics') => void;
}

export default function Header({ currentTab, setTab, onDeployFleet, onLaunchApp }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'HOME', label: 'HOME' },
    { id: 'SERVICES', label: 'SERVICES' },
    { id: 'LOGISTICS', label: 'LOGISTICS' },
    { id: 'PARTNERS', label: 'PARTNERS' },
    { id: 'CONTACT', label: 'CONTACT' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-[#131313]/65 backdrop-blur-xl border-b border-white/[0.06] flex justify-between items-center px-6 md:px-16 transition-colors duration-200">
      {/* Logo */}
      <div 
        onClick={() => setTab('HOME')} 
        className="flex items-center gap-2 cursor-pointer group"
        id="header-logo"
      >
        <span className="font-display text-2xl font-black tracking-tighter text-white group-hover:text-primary-container transition-colors">
          THE HUB
        </span>
        <div className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-10">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`font-sans text-[13px] font-bold tracking-widest transition-all uppercase relative py-2 active:scale-95 ${
                isActive
                  ? 'text-primary-container'
                  : 'text-on-surface-variant hover:text-primary-container'
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-container" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Button */}
      <div className="hidden md:block">
        <button
          onClick={onDeployFleet}
          className="bg-primary-container text-white text-[11px] font-bold tracking-[0.2em] px-6 py-3 rounded-full hover:brightness-110 active:scale-95 transition-all uppercase cursor-pointer"
        >
          DEPLOY FLEET
        </button>
      </div>

      {/* Mobile Toggle Button */}
      <div className="flex md:hidden items-center gap-4">
        <button
          onClick={onDeployFleet}
          className="bg-primary-container text-white text-[10px] font-bold tracking-widest px-4 py-2 rounded-full hover:brightness-110 transition-all uppercase"
        >
          DEPLOY
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-primary-container transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#131313]/98 backdrop-blur-2xl border-b border-white/[0.08] flex flex-col p-6 gap-5 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono font-black text-[#ff5545] uppercase tracking-[0.25em] block mb-2 text-glow">
              LAUNCH HUB APPS
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (onLaunchApp) onLaunchApp('transit');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-4 bg-[#ff5545] hover:bg-[#ff6c5e] text-white rounded-xl active:scale-95 transition-all text-left cursor-pointer shadow-lg shadow-black/40"
              >
                <Car size={18} className="shrink-0 text-white" />
                <div className="min-w-0">
                  <span className="text-[11px] font-black tracking-wider uppercase block leading-none">Rides App</span>
                  <span className="text-[8px] text-white/75 font-mono mt-1 block leading-none">Book Cab & SUV</span>
                </div>
              </button>
              <button
                onClick={() => {
                  if (onLaunchApp) onLaunchApp('logistics');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-4 bg-neutral-900 border border-white/10 text-white hover:border-white/25 rounded-xl active:scale-95 transition-all text-left hover:bg-neutral-800 cursor-pointer shadow-lg shadow-black/40"
              >
                <Truck size={18} className="shrink-0 text-[#ff5545]" />
                <div className="min-w-0">
                  <span className="text-[11px] font-black tracking-wider uppercase block leading-none">Logistics</span>
                  <span className="text-[8px] text-neutral-400 font-mono mt-1 block leading-none">Cargo Loader</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
