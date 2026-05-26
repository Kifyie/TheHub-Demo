/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Terminal, Globe, Share2 } from 'lucide-react';

interface FooterProps {
  setTab: (tab: string) => void;
}

export default function Footer({ setTab }: FooterProps) {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant py-16 px-6 md:px-16 w-full mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Branch Info */}
        <div className="md:col-span-1">
          <span className="font-display text-xl font-black text-white uppercase mb-4 block tracking-tighter">
            THE HUB
          </span>
          <p className="text-on-surface-variant font-sans text-xs uppercase leading-relaxed mb-6">
            NCR Local Transit & Courier Service.<br />
            Connecting Delhi & Noida Everyday.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setTab('LOGISTICS')}
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:border-primary-container text-on-surface-variant hover:text-primary-container transition-all"
              title="Track Goods Delivery"
            >
              <Terminal size={18} />
            </button>
            <button 
              onClick={() => setTab('SERVICES')}
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:border-primary-container text-on-surface-variant hover:text-primary-container transition-all"
              title="Book standard cabs"
            >
              <Globe size={18} />
            </button>
            <button 
              onClick={() => alert('THE HUB Transit details copied to clipboard!')}
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:border-primary-container text-on-surface-variant hover:text-primary-container transition-all"
              title="Share links"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Network Column */}
        <div>
          <span className="font-sans text-xs uppercase text-primary-container mb-6 block font-bold tracking-widest">
            QUICK LINKS
          </span>
          <ul className="space-y-3">
            <li>
              <button 
                onClick={() => setTab('LOGISTICS')} 
                className="text-on-surface-variant font-sans text-xs uppercase hover:text-white hover:border-l-4 hover:border-primary-container hover:pl-2 transition-all block text-left"
              >
                ACTIVE DELIVERIES
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTab('LOGISTICS')} 
                className="text-on-surface-variant font-sans text-xs uppercase hover:text-white hover:border-l-4 hover:border-primary-container hover:pl-2 transition-all block text-left"
              >
                LIVE DELIVERY MAP
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTab('PARTNERS')} 
                className="text-on-surface-variant font-sans text-xs uppercase hover:text-white hover:border-l-4 hover:border-primary-container hover:pl-2 transition-all block text-left"
              >
                DRIVER REGISTRATION
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTab('SERVICES')} 
                className="text-on-surface-variant font-sans text-xs uppercase hover:text-white hover:border-l-4 hover:border-primary-container hover:pl-2 transition-all block text-left"
              >
                BOOK CAB OR TRUCK
              </button>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <span className="font-sans text-xs uppercase text-primary-container mb-6 block font-bold tracking-widest">
            RESOURCES
          </span>
          <ul className="space-y-3">
            <li>
              <a 
                href="#docs" 
                onClick={(e) => { e.preventDefault(); alert('Loading current booking guidelines...'); }}
                className="text-on-surface-variant font-sans text-xs uppercase hover:text-white hover:border-l-4 hover:border-primary-container hover:pl-2 transition-all block text-left"
              >
                BOOKING HELP
              </a>
            </li>
            <li>
              <a 
                href="#legal" 
                onClick={(e) => { e.preventDefault(); alert('Loading general regulatory legal framework guidelines...'); }}
                className="text-on-surface-variant font-sans text-xs uppercase hover:text-white hover:border-l-4 hover:border-primary-container hover:pl-2 transition-all block text-left"
              >
                DRIVER GUIDELINES
              </a>
            </li>
            <li>
              <a 
                href="#privacy" 
                onClick={(e) => { e.preventDefault(); alert('Loading Privacy policy statement (GDPR/Neo-Tech Compliant)...'); }}
                className="text-on-surface-variant font-sans text-xs uppercase hover:text-white hover:border-l-4 hover:border-primary-container hover:pl-2 transition-all block text-left"
              >
                PRIVACY POLICY
              </a>
            </li>
            <li>
              <a 
                href="#security" 
                onClick={(e) => { e.preventDefault(); alert('Viewing Security details...'); }}
                className="text-on-surface-variant font-sans text-xs uppercase hover:text-white hover:border-l-4 hover:border-primary-container hover:pl-2 transition-all block text-left"
              >
                RIDE SECURITY
              </a>
            </li>
          </ul>
        </div>

        {/* Operations Hub Address */}
        <div>
          <span className="font-sans text-xs uppercase text-primary-container mb-6 block font-bold tracking-widest">
            OFFICE
          </span>
          <p className="text-on-surface-variant font-sans text-xs mb-4 leading-relaxed uppercase">
            DELHI & NOIDA HEADQUARTERS <br />
            Greater Noida Expressway Sector 62 Link, <br />
            Delhi-NCR, India
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="border border-outline-variant px-2 py-1 text-[10px] font-sans font-medium text-white tracking-wider">
              AUTO-CAB
            </span>
            <span className="border border-outline-variant px-2 py-1 text-[10px] font-sans font-medium text-white tracking-wider">
              MINI-TRUCK
            </span>
            <span className="border border-outline-variant px-2 py-1 text-[10px] font-sans font-medium text-white tracking-wider">
              BIKE-COURIER
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-sans text-[11px] text-on-surface-variant font-bold uppercase tracking-widest text-center md:text-left">
          © {new Date().getFullYear()} THE HUB TRANSIT NETWORK. ALL SYSTEMS OPERATIONAL.
        </p>
        <div className="flex gap-4">
          <span className="text-[10px] text-on-surface-variant font-bold border border-outline-variant px-2 py-1 uppercase tracking-wider">
            EN // NCR
          </span>
          <span className="text-[10px] text-primary-container font-bold border border-primary-container px-2 py-1 uppercase tracking-wider">
            EST. 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
