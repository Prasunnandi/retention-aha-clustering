import React from 'react';
import { TrendingUp, Users, ArrowUpRight, BarChart3, HelpCircle, Layers } from 'lucide-react';

export default function CohortHeatmapView({ cohorts }) {
  const months = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];

  const getHeatmapColor = (rate) => {
    if (rate === undefined || rate === null) return 'bg-transparent text-transparent';
    if (rate >= 80) return 'bg-cyan-600/80 text-white font-bold';
    if (rate >= 70) return 'bg-cyan-700/60 text-cyan-100';
    if (rate >= 60) return 'bg-indigo-700/60 text-indigo-100';
    if (rate >= 50) return 'bg-indigo-800/50 text-indigo-200';
    if (rate >= 40) return 'bg-slate-800 text-slate-300';
    return 'bg-slate-900/60 text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/20 to-slate-900 border border-cyan-800/40 p-6 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-medium mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Product Retention Cohort Matrix</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Triangular Cohort Retention Analysis
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Tracking customer cohort decay across 12 consecutive signup months. Month-1 retention improved from <span className="text-cyan-400 font-semibold">68.4%</span> in Jan 2025 to <span className="text-emerald-400 font-semibold">82.8%</span> in Dec 2025, driven by Aha! moment onboarding interventions.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Latest Month-1 Retention</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-baseline space-x-2">
            <span>82.8%</span>
            <span className="text-xs font-normal text-slate-400">(Dec 2025)</span>
          </div>
          <div className="text-[11px] text-emerald-500 mt-1 flex items-center space-x-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.4% vs Jan 2025 baseline</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">12-Month Terminal Retention</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1 flex items-baseline space-x-2">
            <span>34.0%</span>
            <span className="text-xs font-normal text-slate-400">stable floor</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Flattening curve indicates strong core product fit
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Total Tracked Customers</div>
          <div className="text-2xl font-bold text-white mt-1 flex items-baseline space-x-2">
            <span>194,920</span>
            <span className="text-xs font-normal text-slate-400">accounts</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across 12 monthly onboarding cohorts
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium">Average Decay Half-Life</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1 flex items-baseline space-x-2">
            <span>4.8 Mos</span>
            <span className="text-xs font-normal text-slate-400">to 50%</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Lengthened from 3.2 months in Q1
          </div>
        </div>
      </div>

      {/* Triangular Cohort Heatmap Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-xs text-slate-200">Triangular User Retention Matrix (% Active)</h3>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-cyan-600"></span>
              <span>≥80%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-cyan-700"></span>
              <span>70-79%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-indigo-700"></span>
              <span>60-69%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-800"></span>
              <span>&lt;60%</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Cohort</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Size</th>
                {months.map((m) => (
                  <th key={m} className="py-2.5 px-3 text-center whitespace-nowrap">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              {cohorts.map((row) => (
                <tr key={row.cohort} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-semibold text-slate-200 whitespace-nowrap">{row.cohort}</td>
                  <td className="py-2 px-3 text-right text-slate-400 whitespace-nowrap">{row.size.toLocaleString()}</td>
                  {months.map((_, idx) => {
                    const rate = row.rates[idx];
                    return (
                      <td key={idx} className="py-1 px-1.5 text-center">
                        {rate !== undefined ? (
                          <div className={`py-1 px-1.5 rounded transition ${getHeatmapColor(rate)}`}>
                            {rate.toFixed(1)}%
                          </div>
                        ) : (
                          <span className="text-slate-800 select-none">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
