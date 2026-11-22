import React from 'react';
import { Grid, Sparkles, Users, Database, TrendingUp, Layers, CheckCircle } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const items = [
    { id: 'cohorts', label: 'Triangular Cohort Heatmap', icon: Grid, badge: '12-Mo Matrix' },
    { id: 'aha', label: 'Aha! Moment Frontier', icon: Sparkles, badge: 'Odds Ratio 7.9x' },
    { id: 'clusters', label: 'Behavioral K-Means Clusters', icon: Users, badge: '4 Segments' },
    { id: 'telco', label: 'Kaggle Telco Churn Data', icon: Database, badge: '7,043 Accounts' }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-lg shadow-lg shadow-cyan-500/20 text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-wide">RetentionIQ</h1>
            <p className="text-xs text-cyan-400 font-mono">Aha! Moment Science</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Retention Engineering
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 m-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Optimal Activation Rule</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Users connecting ≥ 1 Integration in first 3 days show an <span className="text-emerald-400 font-semibold">+88.2%</span> 90-day retention rate.
        </p>
      </div>
    </aside>
  );
}
