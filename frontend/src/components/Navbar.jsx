import React from 'react';
import { RefreshCw, Download, Calendar, Layers, ShieldCheck } from 'lucide-react';

export default function Navbar({ onRefresh }) {
  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-medium">Retention Model:</span>
          <span className="text-cyan-300 font-mono font-semibold">Triangular Cohort + Logistic Odds Ratio</span>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Window: 2025 Jan - 2025 Dec</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Recompute Frontier</span>
        </button>

        <a
          href="/data/kaggle_telco_retention_churn.csv"
          download
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 text-white rounded-lg text-xs font-medium transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Benchmark Data</span>
        </a>
      </div>
    </header>
  );
}
