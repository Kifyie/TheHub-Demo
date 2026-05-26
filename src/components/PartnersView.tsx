/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, DragEvent, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, CheckCircle2, FileText, ChevronRight, User, ShieldAlert, Cpu } from 'lucide-react';
import { OPERATING_REGIONS } from '../data';
import { OnboardingData } from '../types';

export default function PartnersView() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    operatingRegion: OPERATING_REGIONS[0],
    vehicleType: 'Executive Sedan EV',
    vinNumber: '',
    registrationFile: null,
    registrationFileName: '',
    certified: false,
    agreed: false,
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Submit validation animation progress
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPercent, setSubmitPercent] = useState(0);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleFileProcess = (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);
    
    // Simple mock progress transition
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setFormData((prevData) => ({
            ...prevData,
            registrationFile: file,
            registrationFileName: file.name
          }));
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email) {
        alert('Please fill out your name and email.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.vinNumber || !formData.registrationFileName) {
        alert('Please enter your vehicle number and upload your registration document (RC).');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.certified || !formData.agreed) {
      alert('You must accept the terms of service and driver agreement to submit.');
      return;
    }

    setIsSubmitting(true);
    setSubmitPercent(0);

    const interval = setInterval(() => {
      setSubmitPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);
  };

  return (
    <div className="pt-32 lg:pt-36 px-6 md:px-16 max-w-7xl mx-auto pb-24">
      {/* Intro section */}
      <div className="mb-16">
        <span className="text-primary-container font-sans text-xs uppercase tracking-[0.2em] font-bold block mb-4">
          Driver & Fleet Partner Registration
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
          DRIVE WITH THE HUB
        </h1>
        <div className="h-1 bg-primary-container w-24 mb-6" />
        <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-2xl leading-relaxed">
          Register as a partner with THE HUB and start receiving high-paying ride bookings and delivery coordinates instantly. Simple onboarding process, flexible hours, and weekly payouts.
        </p>
      </div>

      {/* Wizard layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="partners-wizard-wrapper">
        
        {/* Step checklist tracking navigation column (left 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-white font-sans text-xs font-bold uppercase tracking-widest block mb-4">
            REGISTRATION STEPS
          </span>

          <ul className="space-y-4">
            <li className={`p-4 border-l-2 rounded-2xl transition-all duration-300 flex items-center justify-between ${
              step === 1 ? 'bg-white/[0.08] border-primary-container shadow-sm text-white' : 'bg-white/[0.01] border-white/[0.06] text-on-surface-variant'
            }`}>
              <span className="font-sans text-xs font-bold uppercase tracking-wider">01 // Personal Details</span>
              {step > 1 && <CheckCircle2 size={16} className="text-primary-container" />}
            </li>
            
            <li className={`p-4 border-l-2 rounded-2xl transition-all duration-300 flex items-center justify-between ${
              step === 2 ? 'bg-white/[0.08] border-primary-container shadow-sm text-white' : 'bg-white/[0.01] border-white/[0.06] text-on-surface-variant'
            }`}>
              <span className="font-sans text-xs font-bold uppercase tracking-wider">02 // Vehicle Info</span>
              {step > 2 && <CheckCircle2 size={16} className="text-primary-container" />}
            </li>

            <li className={`p-4 border-l-2 rounded-2xl transition-all duration-300 flex items-center justify-between ${
              step === 3 && !isSubmitting ? 'bg-white/[0.08] border-primary-container shadow-sm text-white' : 'bg-white/[0.01] border-white/[0.06] text-on-surface-variant'
            }`}>
              <span className="font-sans text-xs font-bold uppercase tracking-wider">03 // Partner Agreement</span>
              {submitPercent >= 100 && <CheckCircle2 size={16} className="text-primary-container" />}
            </li>
          </ul>

          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 font-sans text-xs text-on-surface-variant uppercase space-y-3 shadow-lg">
            <p className="text-white font-bold tracking-widest text-[10px]">WHY DRIVE WITH US?</p>
            <p className="leading-relaxed">✔ Easy weekly direct payouts to your bank.</p>
            <p className="leading-relaxed">✔ 24/7 Helpline & safety support center.</p>
          </div>
        </div>

        {/* Wizard Form Panel (right 8 cols) */}
        <div className="lg:col-span-8 bg-white/[0.06] backdrop-blur-3xl border border-white/[0.12] p-8 rounded-3xl min-h-[440px] flex flex-col justify-between shadow-2xl">
          
          <AnimatePresence mode="wait">
            {!isSubmitting ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6"
              >
                {/* STEP 1: IDENTITY DETAILS */}
                {step === 1 && (
                  <div className="space-y-6">
                    <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block uppercase">
                      PERSONAL DETAILS (STEP 01)
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                          FULL Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          placeholder="e.g., Jonathan Mercer"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="e.g., j.mercer@gmail.com"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                        Primary City / Region
                      </label>
                      <select
                        value={formData.operatingRegion}
                        onChange={(e) => setFormData({...formData, operatingRegion: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                      >
                        {OPERATING_REGIONS.map((region) => (
                          <option key={region} value={region} className="bg-neutral-900">
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 2: VEHICLE PROFILE */}
                {step === 2 && (
                  <div className="space-y-6">
                    <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block uppercase">
                      VEHICLE INFORMATION (STEP 02)
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                          Vehicle Model Name (e.g. Maruti Suzuki Dzire)
                        </label>
                        <input
                          type="text"
                          value={formData.vehicleType}
                          onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                          placeholder="e.g., Maruti Suzuki Dzire"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-sans text-white focus:outline-none focus:border-primary-container"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider mb-2">
                          Vehicle Number (e.g. DL 1CA 1234)
                        </label>
                        <input
                          type="text"
                          value={formData.vinNumber}
                          onChange={(e) => setFormData({...formData, vinNumber: e.target.value})}
                          placeholder="e.g., DL 1CA 1234"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs font-mono uppercase text-white focus:outline-none focus:border-primary-container"
                          required
                        />
                      </div>
                    </div>

                    {/* Drag and Drop Upload Component */}
                    <div className="space-y-2">
                      <label className="block text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-wider">
                        Upload Vehicle Registration Certificate (RC)
                      </label>
                      
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                          dragActive 
                            ? 'border-primary-container bg-primary-container/10' 
                            : 'border-white/[0.08] hover:border-white/50 bg-white/[0.01]'
                        }`}
                        onClick={() => document.getElementById('file-upload-input')?.click()}
                      >
                        <input
                          id="file-upload-input"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileInput}
                          className="hidden"
                        />

                        {isUploading ? (
                          <div className="space-y-3 w-48">
                            <div className="h-1 w-full bg-outline-variant overflow-hidden">
                              <div className="bg-primary-container h-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                            <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-primary-container animate-pulse">
                              UPLOADING FILE: {uploadProgress}%
                            </span>
                          </div>
                        ) : formData.registrationFileName ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="text-primary-container" size={32} />
                            <span className="font-sans text-xs font-bold text-white uppercase mt-1">
                              {formData.registrationFileName}
                            </span>
                            <span className="font-mono text-[9px] text-emerald-400 border border-emerald-400/20 px-2 py-0.5 mt-1 uppercase">
                              FILE RECEIVED & SAVED
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="text-on-surface-variant group-hover:text-white" size={28} />
                            <span className="font-sans text-xs font-bold text-white uppercase mt-3">
                              DRAG & DROP DOCUMENT HERE
                            </span>
                            <span className="font-sans text-[10px] text-on-surface-variant mt-1">
                              or Click to select file from computer
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: COMPLIANCE INTEGRATION */}
                {step === 3 && (
                  <div className="space-y-6">
                    <span className="text-primary-container font-sans text-[11px] font-bold tracking-widest block uppercase">
                      PARTNER AGREEMENT (STEP 03)
                    </span>

                    <div className="space-y-5 bg-white/[0.01]/40 border border-white/[0.06] rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <input
                          id="cert-check"
                          type="checkbox"
                          checked={formData.certified}
                          onChange={(e) => setFormData({...formData, certified: e.target.checked})}
                          className="mt-1 w-4 h-4 accent-primary-container rounded"
                          required
                        />
                        <label htmlFor="cert-check" className="text-on-surface-variant font-sans text-xs uppercase leading-relaxed cursor-pointer select-none">
                          I certify that all details and documents provided are genuine and correct.
                        </label>
                      </div>

                      <div className="flex items-start gap-4">
                        <input
                          id="agree-check"
                          type="checkbox"
                          checked={formData.agreed}
                          onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                          className="mt-1 w-4 h-4 accent-primary-container rounded"
                          required
                        />
                        <label htmlFor="agree-check" className="text-on-surface-variant font-sans text-xs uppercase leading-relaxed cursor-pointer select-none">
                          I agree to follow the standard driver guidelines and terms of service.
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Controls inside stepper */}
                <div className="flex justify-between border-t border-white/[0.08] pt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="border border-white/[0.1] hover:border-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase text-white hover:text-primary-container transition-all"
                    >
                      PREVIOUS STEP
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-primary-container text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_16px_rgba(255,85,69,0.35)]"
                    >
                      CONTINUE TO NEXT <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="bg-primary-container text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_16px_rgba(255,85,69,0.35)] animate-pulse"
                    >
                      SUBMIT REGISTRATION
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              // Validation progress & Summary block screen
              <div className="py-12 flex flex-col justify-between h-full">
                {submitPercent < 100 ? (
                  <div className="text-center space-y-8 flex-grow flex flex-col justify-center items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-primary-container border-t-transparent animate-spin" />
                    <div className="space-y-3">
                      <p className="font-sans text-xs font-bold tracking-[0.2em] text-primary-container uppercase">
                        SUBMITTING DETAILS... {submitPercent}%
                      </p>
                      <p className="text-on-surface-variant font-sans text-xs uppercase leading-relaxed max-w-sm mx-auto p-2 border-l border-primary-container">
                        Uploading document {formData.registrationFileName} and creating your driver partner account profile.
                      </p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center rounded-full mx-auto mb-4">
                      <CheckCircle2 size={36} />
                    </div>
                    
                    <div className="text-center">
                      <p className="font-display text-md font-black text-white uppercase tracking-wider text-glow">
                        REGISTRATION SUBMITTED SUCCESSFULLY
                      </p>
                      <p className="text-on-surface-variant font-sans text-xs uppercase mt-1">
                        We will review your details and contact you within 24 hours.
                      </p>
                    </div>

                    <div className="bg-[#181818] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                      <span className="text-primary-container font-mono text-[10px] uppercase font-bold tracking-widest">
                        REGISTRATION RECEIPT
                      </span>

                      <div className="grid grid-cols-2 gap-4 font-mono text-[11px] text-white">
                        <div>
                          <span className="text-on-surface-variant block text-[9px] font-sans">PARTNER NAME</span>
                          <span className="uppercase">{formData.fullName}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[9px] font-sans">EMAIL ADDRESS</span>
                          <span>{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[9px] font-sans">CITY / REGION</span>
                          <span className="uppercase">{formData.operatingRegion}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[9px] font-sans">UPLOADED DOCUMENT</span>
                          <span className="uppercase text-primary-container truncate block">{formData.registrationFileName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => {
                          setStep(1);
                          setFormData({
                            fullName: '',
                            email: '',
                            operatingRegion: OPERATING_REGIONS[0],
                            vehicleType: '',
                            vinNumber: '',
                            registrationFile: null,
                            registrationFileName: '',
                            certified: false,
                            agreed: false,
                          });
                          setIsSubmitting(false);
                          setSubmitPercent(0);
                        }}
                        className="bg-primary-container text-white text-xs font-bold tracking-[0.2em] px-8 py-3 rounded-full hover:brightness-110 uppercase active:scale-95 transition-all shadow-md"
                      >
                        REGISTER ANOTHER VEHICLE
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
