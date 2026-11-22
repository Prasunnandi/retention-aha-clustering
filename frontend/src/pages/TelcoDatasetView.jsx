import React from 'react';
import { Database, ExternalLink, Table, ShieldCheck, Download } from 'lucide-react';

export default function TelcoDatasetView() {
  const sampleRows = [
    { id: '7590-VHVEG', gender: 'Female', tenure: 1, phone: 'No', internet: 'DSL', contract: 'Month-to-month', charges: '$29.85', churn: 'No' },
    { id: '5575-GNVDE', gender: 'Male', tenure: 34, phone: 'Yes', internet: 'DSL', contract: 'One year', charges: '$56.95', churn: 'No' },
    { id: '3668-QPYBK', gender: 'Male', tenure: 2, phone: 'Yes', internet: 'DSL', contract: 'Month-to-month', charges: '$53.85', churn: 'Yes' },
    { id: '7795-CFOCW', gender: 'Male', tenure: 45, phone: 'No', internet: 'DSL', contract: 'One year', charges: '$42.30', churn: 'No' },
    { id: '9237-HQITU', gender: 'Female', tenure: 2, phone: 'Yes', internet: 'Fiber optic', contract: 'Month-to-month', charges: '$70.70', churn: 'Yes' },
    { id: '9305-CDSKC', gender: 'Female', tenure: 8, phone: 'Yes', internet: 'Fiber optic', contract: 'Month-to-month', charges: '$99.65', churn: 'Yes' },
    { id: '1452-KIOVK', gender: 'Male', tenure: 22, phone: 'Yes', internet: 'Fiber optic', contract: 'Month-to-month', charges: '$89.10', churn: 'No' },
    { id: '6713-OKOMC', gender: 'Female', tenure: 10, phone: 'No', internet: 'DSL', contract: 'Month-to-month', charges: '$29.75', churn: 'No' },
    { id: '7892-POOKP', gender: 'Female', tenure: 28, phone: 'Yes', internet: 'Fiber optic', contract: 'Month-to-month', charges: '$104.80', churn: 'Yes' },
    { id: '6388-TABGU', gender: 'Male', tenure: 62, phone: 'Yes', internet: 'DSL', contract: 'One year', charges: '$56.15', churn: 'No' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Kaggle / IBM Open Benchmark</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Kaggle Telco Churn & Retention Dataset</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real customer profile and service telemetry across 7,043 accounts with contract types, tech support, online security, and churn status.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="https://www.kaggle.com/datasets/blastchar/telco-customer-churn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <span>Kaggle Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Total Customer Accounts</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">7,043</div>
          <div className="text-[11px] text-slate-500 mt-1">21 distinct features</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Retained Customers</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">5,174</div>
          <div className="text-[11px] text-slate-500 mt-1">73.5% retention baseline</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Churned Customers</div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">1,869</div>
          <div className="text-[11px] text-slate-500 mt-1">26.5% churn rate</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Local Benchmark Size</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">970 KB</div>
          <div className="text-[11px] text-slate-500 mt-1">In data/ directory</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-xs text-slate-200">Sample Records (First 10 of 7,043)</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Format: CSV</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-4">CustomerID</th>
                <th className="py-2.5 px-4">Gender</th>
                <th className="py-2.5 px-4">Tenure (Mos)</th>
                <th className="py-2.5 px-4">Phone</th>
                <th className="py-2.5 px-4">Internet Service</th>
                <th className="py-2.5 px-4">Contract</th>
                <th className="py-2.5 px-4">Monthly Charges</th>
                <th className="py-2.5 px-4">Churn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              {sampleRows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 text-slate-400">{r.id}</td>
                  <td className="py-2 px-4">{r.gender}</td>
                  <td className="py-2 px-4 font-semibold text-slate-200">{r.tenure}</td>
                  <td className="py-2 px-4">{r.phone}</td>
                  <td className="py-2 px-4 text-cyan-300">{r.internet}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      r.contract.includes('year') ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {r.contract}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-medium text-slate-200">{r.charges}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.churn === 'Yes' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {r.churn}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
