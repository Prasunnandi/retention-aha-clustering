import React, { useState } from 'react';
import { Sparkles, Sliders, TrendingUp, CheckCircle, ArrowRight, DollarSign, Activity } from 'lucide-react';
import { simulateAdoption } from '../services/api';

export default function AhaMomentView({ ahaMoments }) {
  const [selectedAha, setSelectedAha] = useState(ahaMoments[2] || ahaMoments[0]);
  const [boostPct, setBoostPct] = useState(15);
  const [simulation, setSimulation] = useState({
    currentAdoptionPct: 38.5,
    simulatedAdoptionPct: 53.5,
    currentOverallRetentionPct: 53.51,
    projectedOverallRetentionPct: 61.97,
    absoluteRetentionGainPct: 8.46,
    annualRecurringRevenueImpact: '$410,310'
  });

  const handleSimulate = async (val) => {
    setBoostPct(val);
    const res = await simulateAdoption(val, selectedAha.id);
    if (res) {
      setSimulation(res);
    } else {
      // Offline fallback calculation
      const currentRet = (selectedAha.adoptionRatePct / 100) * selectedAha.retainedWithActionPct +
                         ((100 - selectedAha.adoptionRatePct) / 100) * selectedAha.retainedWithoutActionPct;
      const newAdoption = Math.min(100, selectedAha.adoptionRatePct + Number(val));
      const projectedRet = (newAdoption / 100) * selectedAha.retainedWithActionPct +
                           ((100 - newAdoption) / 100) * selectedAha.retainedWithoutActionPct;
      setSimulation({
        currentAdoptionPct: selectedAha.adoptionRatePct,
        simulatedAdoptionPct: newAdoption,
        currentOverallRetentionPct: Number(currentRet.toFixed(2)),
        projectedOverallRetentionPct: Number(projectedRet.toFixed(2)),
        absoluteRetentionGainPct: Number((projectedRet - currentRet).toFixed(2)),
        annualRecurringRevenueImpact: `$${Math.round((projectedRet - currentRet) * 48500).toLocaleString()}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Aha! Moment Discovery Frontier</h2>
            <p className="text-xs text-slate-400">
              Identifying the exact threshold of early user actions (X actions in Y days) that maximizes long-term 90-day retention odds ratio.
            </p>
          </div>
        </div>
      </div>

      {/* Aha Candidates Table / List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center justify-between">
            <span>Candidate Behavioral Rules</span>
            <span className="text-xs font-mono text-cyan-400">Logistic Odds</span>
          </h3>
          <div className="space-y-2.5 overflow-y-auto max-h-[520px] pr-1">
            {ahaMoments.map((aha) => {
              const isSelected = selectedAha?.id === aha.id;
              return (
                <div
                  key={aha.id}
                  onClick={() => { setSelectedAha(aha); handleSimulate(boostPct); }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-sm shadow-cyan-950'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-xs text-slate-100">{aha.candidateRule}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{aha.feature} (≤{aha.timeWindowDays}d)</div>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        aha.status === 'OPTIMAL_AHA_MOMENT'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {aha.oddsRatio}x Odds
                    </span>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-700/40">
                    <div>
                      <span className="text-slate-500">Adoption:</span>{' '}
                      <span className="text-slate-200 font-mono">{aha.adoptionRatePct}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">F1 Score:</span>{' '}
                      <span className="text-cyan-300 font-mono">{aha.f1Score}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Dive & What-If Simulator */}
        {selectedAha && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{selectedAha.candidateRule}</h3>
                  <p className="text-xs text-cyan-400 mt-0.5">{selectedAha.verdict}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 font-mono border border-cyan-800/40">
                    Odds Ratio: {selectedAha.oddsRatio}x
                  </span>
                </div>
              </div>

              {/* Retained with Action vs Without Action Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400">Users who DID NOT complete action:</div>
                  <div className="text-3xl font-bold text-slate-400 font-mono mt-1">
                    {selectedAha.retainedWithoutActionPct}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">90-Day Retention Rate</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-slate-600 h-full rounded-full" style={{ width: `${selectedAha.retainedWithoutActionPct}%` }}></div>
                  </div>
                </div>

                <div className="bg-cyan-950/20 border border-cyan-800/50 p-4 rounded-xl">
                  <div className="text-xs text-cyan-300 font-medium">Users who COMPLETED Aha! Action:</div>
                  <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">
                    {selectedAha.retainedWithActionPct}%
                  </div>
                  <div className="text-[11px] text-cyan-300 mt-1">
                    +{(selectedAha.retainedWithActionPct - selectedAha.retainedWithoutActionPct).toFixed(1)}% absolute lift
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full" style={{ width: `${selectedAha.retainedWithActionPct}%` }}></div>
                  </div>
                </div>
              </div>

              {/* What-If Intervention Simulator */}
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-semibold text-slate-200">Onboarding Intervention Simulator</h4>
                  </div>
                  <span className="text-xs font-mono text-cyan-300">+{boostPct}% Feature Adoption Lift</span>
                </div>

                <div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={boostPct}
                    onChange={(e) => handleSimulate(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>Baseline (0%)</span>
                    <span>+25% Lift</span>
                    <span>+50% Maximized</span>
                  </div>
                </div>

                {/* Simulation Output Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Simulated Adoption:</span>
                    <span className="font-mono text-sm font-bold text-slate-200 mt-0.5 block">{simulation.simulatedAdoptionPct}%</span>
                    <span className="text-[10px] text-slate-500 font-mono">from {simulation.currentAdoptionPct}%</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Projected Retention:</span>
                    <span className="font-mono text-sm font-bold text-cyan-300 mt-0.5 block">{simulation.projectedOverallRetentionPct}%</span>
                    <span className="text-[10px] text-emerald-400 font-mono">+{simulation.absoluteRetentionGainPct}%</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 md:col-span-2">
                    <span className="text-[10px] text-slate-500 block">Estimated Annual ARR Impact:</span>
                    <span className="font-mono text-lg font-bold text-emerald-400 mt-0.5 block">{simulation.annualRecurringRevenueImpact}</span>
                    <span className="text-[10px] text-slate-400">Based on LTV expansion and reduced customer churn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
