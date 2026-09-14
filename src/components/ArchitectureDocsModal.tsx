import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Code2, Server, Database, Cloud, Terminal, CheckCircle2 } from 'lucide-react';

interface ArchitectureDocsModalProps {
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'deployment' | 'database' | 'apis'>('architecture');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative my-8"
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              WanderWise AI Architecture & Deployment
            </h2>
            <p className="text-xs text-slate-500">
              Full-Stack Technical Specifications, Database Schemas & Production Deployment Guide
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
          {[
            { id: 'architecture', label: 'System Architecture', icon: <Server className="w-4 h-4" /> },
            { id: 'deployment', label: 'Run & Deploy Guide', icon: <Cloud className="w-4 h-4" /> },
            { id: 'database', label: 'PostgreSQL Schema', icon: <Database className="w-4 h-4" /> },
            { id: 'apis', label: 'REST API Specs', icon: <Terminal className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Decoupled Service Architecture
              </h4>
              <p>
                WanderWise AI is engineered with a clean separation of concerns: a reactive client-side presentation layer (React 19 + Tailwind 4 + jsPDF), an Express API proxy, and a server-side AI optimization engine utilizing Google Gemini models (<code className="text-indigo-600 font-mono font-bold">gemini-2.5-flash</code>) with deterministic solver fallbacks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-600 block">1. Frontend Layer</span>
                <p className="font-bold text-slate-900">React 19 + Vite + Tailwind</p>
                <p className="text-slate-500 text-[11px]">
                  Client-side reactive state, dynamic vector route mapping, interactive budget tracker, jsPDF vector export, canvas-confetti.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">2. API & Server Engine</span>
                <p className="font-bold text-slate-900">Express.js Service</p>
                <p className="text-slate-500 text-[11px]">
                  Secure REST proxies, budget constraint solver, Gemini AI prompts, mock payment validation, digital voucher generation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-sky-600 block">3. Data & Persistence</span>
                <p className="font-bold text-slate-900">PostgreSQL / In-Memory Store</p>
                <p className="text-slate-500 text-[11px]">
                  Users, Trips, ItineraryItems, Bookings, and Wishlist tables with relational foreign keys.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Deployment Guide */}
        {activeTab === 'deployment' && (
          <div className="space-y-4 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-2">How to Run Locally</h4>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1">
                <p className="text-slate-400"># 1. Install dependencies</p>
                <p className="text-white">npm install</p>
                <p className="pt-2 text-slate-400"># 2. Start Full-Stack Dev Server (Express + Vite)</p>
                <p className="text-white">npm run dev</p>
                <p className="pt-2 text-indigo-300"># App will be accessible at http://localhost:3000</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-2">Production Deployment (Cloud Run / Vercel / Render)</h4>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-400 space-y-1">
                <p className="text-slate-400"># Build production bundle (Vite SPA + Bundled CommonJS Server):</p>
                <p className="text-white">npm run build</p>
                <p className="pt-2 text-slate-400"># Start production container:</p>
                <p className="text-white">npm start</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Database Schema */}
        {activeTab === 'database' && (
          <div className="space-y-3 text-xs">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto">
              <pre>{`-- WanderWise AI Production Database Schema (PostgreSQL)

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    destination VARCHAR(128) NOT NULL,
    country VARCHAR(64),
    start_date DATE NOT NULL,
    duration INTEGER NOT NULL,
    travelers INTEGER NOT NULL,
    total_budget NUMERIC(10, 2) NOT NULL,
    projected_cost NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) REFERENCES trips(id),
    confirmation_code VARCHAR(32) UNIQUE NOT NULL,
    total_paid NUMERIC(10, 2) NOT NULL,
    card_last4 VARCHAR(4),
    billing_email VARCHAR(255) NOT NULL,
    status VARCHAR(32) DEFAULT 'confirmed',
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}</pre>
            </div>
          </div>
        )}

        {/* Tab 4: REST API Specs */}
        {activeTab === 'apis' && (
          <div className="space-y-3 text-xs text-slate-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">POST</span>
                <p className="font-bold text-slate-900 mt-1.5">/api/trips/generate</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Generates budget-optimized itinerary using Gemini AI.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 font-bold">GET</span>
                <p className="font-bold text-slate-900 mt-1.5">/api/templates</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Returns curated city vacation plans (Tokyo, Paris, Rome, etc.).</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">POST</span>
                <p className="font-bold text-slate-900 mt-1.5">/api/bookings/checkout</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Validates checkout, generates confirmation code & dispatches email vouchers.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 font-bold">GET</span>
                <p className="font-bold text-slate-900 mt-1.5">/api/bookings</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Retrieves user's booked trips and receipts.</p>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </motion.div>
  );
};
