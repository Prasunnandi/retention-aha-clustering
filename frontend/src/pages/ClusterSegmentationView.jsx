import React from 'react';
import { Users, ShieldAlert, CheckCircle2, TrendingUp, Layers, HelpCircle, Activity } from 'lucide-react';

export default function ClusterSegmentationView({ clusters }) {
  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'VERY_LOW':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'MODERATE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'ELEVATED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Behavioral Customer Archetypes (Unsupervised K-Means)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Cluster analysis based on 30-day session cadence, collaboration coefficient, and multi-tool integration usage.
        </p>
      </div>

      {/* Cluster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{c.name}</h3>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">
                    {c.pctOfUserbase}% of active users ({c.usersCount.toLocaleString()} accounts)
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${getRiskBadge(c.churnRisk)}`}>
                  {c.churnRisk} RISK
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500">Weekly Sessions</div>
                  <div className="font-mono text-base font-bold text-slate-200 mt-0.5">{c.avgWeeklySessions}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500">Avg Invites</div>
                  <div className="font-mono text-base font-bold text-cyan-300 mt-0.5">{c.avgInvitesSent}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500">90-Day Retention</div>
                  <div className="font-mono text-base font-bold text-emerald-400 mt-0.5">{c.retention90dPct}%</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                {c.keyTrait}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Automated Action:</span>
              <span className="text-cyan-300 font-medium font-mono">
                {c.churnRisk === 'CRITICAL' ? 'Trigger Re-engagement Sequence' : c.churnRisk === 'VERY_LOW' ? 'Upsell Enterprise Tier' : 'Nudge Integration Connect'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
