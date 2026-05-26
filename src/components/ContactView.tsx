/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [pingState, setPingState] = useState<'STANDBY' | 'TRANSMITTING' | 'RESOLVED'>('STANDBY');

  const handlePingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required details.');
      return;
    }

    setPingState('TRANSMITTING');

    setTimeout(() => {
      setPingState('RESOLVED');
    }, 2800);
  };

  return (
    <div className="pt-32 lg:pt-36 px-6 md:px-16 max-w-7xl mx-auto pb-24">
      {/* Intro section */}
      <div className="mb-16">
        <span className="text-primary-container font-sans text-xs uppercase tracking-[0.2em] font-bold block mb-4">
          Get in Touch with our Team
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
          CONTACT US
        </h1>
        <div className="h-1 bg-primary-container w-24 mb-6" />
        <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-2xl leading-relaxed">
          Have an inquiry, booking question, or need helper assistance? Drop us a line below and our Greater Noida support center team will get back to you right away.
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-wrapper">
        
        {/* Support contacts (left 5 cols) */}
        <div className="lg:col-span-5 bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] p-8 rounded-3xl space-y-8 shadow-2xl">
          <div>
            <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block mb-6 uppercase">
              OUR SUPPORT HELPLINES
            </span>

            <ul className="space-y-6">
              <li className="flex gap-4 items-center group">
                <div className="w-10 h-10 bg-[#131313] border border-white/[0.08] rounded-full hover:border-primary-container flex items-center justify-center transition-colors">
                  <Mail className="text-primary-container" size={16} />
                </div>
                <div>
                  <span className="text-on-surface-variant font-sans text-[9px] block uppercase">EMAIL</span>
                  <span className="text-white font-mono text-xs uppercase hover:text-primary-container transition-colors">
                    support@thehub-transit.com
                  </span>
                </div>
              </li>

              <li className="flex gap-4 items-center group">
                <div className="w-10 h-10 bg-[#131313] border border-white/[0.08] rounded-full hover:border-primary-container flex items-center justify-center transition-colors">
                  <Phone className="text-primary-container" size={16} />
                </div>
                <div>
                  <span className="text-on-surface-variant font-sans text-[9px] block uppercase">PHONE SUPPORT</span>
                  <span className="text-white font-mono text-xs hover:text-primary-container transition-colors">
                    +91 (800) THE-HUB
                  </span>
                </div>
              </li>

              <li className="flex gap-4 items-center group">
                <div className="w-10 h-10 bg-[#131313] border border-white/[0.08] rounded-full hover:border-primary-container flex items-center justify-center transition-colors">
                  <MapPin className="text-primary-container" size={16} />
                </div>
                <div>
                  <span className="text-on-surface-variant font-sans text-[9px] block uppercase">OFFICE ADDRESS</span>
                  <span className="text-white font-sans text-xs uppercase">
                    Greater Noida Sector 62 Link office, NCR
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="border-t border-white/[0.08] pt-6 space-y-4">
            <span className="text-white font-sans text-xs font-bold uppercase tracking-wider block">
              FREQUENTLY ASKED QUESTIONS
            </span>

            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white/[0.01] p-4 rounded-xl border border-white/[0.06]">
                <p className="text-white font-bold flex items-center gap-2 uppercase">
                  <HelpCircle size={14} className="text-primary-container" />
                  How fast is the driver matching time?
                </p>
                <p className="text-on-surface-variant mt-2 leading-relaxed uppercase">
                  Our system matches you with the nearest driver within 5 to 12 minutes in Noida & Delhi.
                </p>
              </div>

              <div className="bg-white/[0.01] p-4 rounded-xl border border-white/[0.06]">
                <p className="text-white font-bold flex items-center gap-2 uppercase">
                  <HelpCircle size={14} className="text-primary-container" />
                  Are drivers verified?
                </p>
                <p className="text-on-surface-variant mt-2 leading-relaxed uppercase">
                  Yes, every taxi and mini-truck driver on our platform is background-checked and identity-verified.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transmission message form (right 7 cols) */}
        <div className="lg:col-span-7 bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] rounded-3xl p-8 min-h-[440px] flex flex-col justify-between shadow-2xl">
          <AnimatePresence mode="wait">
            {pingState === 'STANDBY' && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block mb-6 uppercase">
                  SEND US A MESSAGE
                </span>

                <form onSubmit={handlePingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                        YOUR Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Jonathan Miller"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                        YOUR EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g., miller@gmail.com"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                      YOUR Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify your booking questions, driver partner query, or corporate trip details..."
                      rows={5}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-container text-white py-4 rounded-full text-xs font-bold tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all uppercase cursor-pointer flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(255,85,69,0.35)]"
                  >
                    SEND MESSAGE <Send size={14} />
                  </button>
                </form>
              </motion.div>
            )}

            {pingState === 'TRANSMITTING' && (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center space-y-8 flex flex-col items-center justify-center flex-grow"
              >
                {/* Visual sound/signal antenna wave simulation */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <motion.div 
                    className="absolute inset-0 rounded-full border border-primary-container bg-primary-container/5"
                    animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  />
                  <motion.div 
                    className="absolute inset-4 rounded-full border border-[#fff]/30 bg-[#fff]/5"
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  />
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white relative z-10">
                    <Send size={16} className="animate-pulse" />
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs font-black tracking-[0.2em] text-primary-container uppercase animate-pulse">
                    SENDING MESSAGE...
                  </p>
                  <p className="text-on-surface-variant font-sans text-[11px] mt-2 max-w-xs mx-auto uppercase">
                    Delivering your feedback directly to our Greater Noida support center desk.
                  </p>
                </div>
              </motion.div>
            )}

            {pingState === 'RESOLVED' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center space-y-6 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center rounded-full text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <p className="font-sans text-xs font-black tracking-[0.2em] text-emerald-400 uppercase">
                    MESSAGE SENT SUCCESSFULLY
                  </p>
                  <p className="text-on-surface-variant font-sans text-[11px] mt-2 max-w-xs mx-auto uppercase leading-relaxed">
                    Thank you! We have received your query and will email you with a helpful response shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setEmail('');
                    setMessage('');
                    setPingState('STANDBY');
                  }}
                  className="border border-white/20 font-sans text-[11px] font-bold text-white tracking-widest px-6 py-2 rounded-full uppercase hover:border-white hover:text-primary-container"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
