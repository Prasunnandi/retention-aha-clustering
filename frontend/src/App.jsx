import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CohortHeatmapView from './pages/CohortHeatmapView';
import AhaMomentView from './pages/AhaMomentView';
import ClusterSegmentationView from './pages/ClusterSegmentationView';
import TelcoDatasetView from './pages/TelcoDatasetView';
import { fetchCohorts, fetchAhaMoments, fetchClusters } from './services/api';

const defaultCohorts = [
  { cohort: 'Jan 2025', size: 12450, rates: [100.0, 68.4, 59.2, 52.8, 48.1, 44.7, 42.0, 39.8, 38.2, 36.9, 35.7, 34.8, 34.0] },
  { cohort: 'Feb 2025', size: 11820, rates: [100.0, 69.1, 60.5, 53.4, 49.0, 45.3, 42.8, 40.5, 38.9, 37.4, 36.2, 35.1] },
  { cohort: 'Mar 2025', size: 13150, rates: [100.0, 71.2, 62.1, 55.0, 50.8, 46.9, 44.1, 41.9, 40.1, 38.5, 37.2] },
  { cohort: 'Apr 2025', size: 14200, rates: [100.0, 72.5, 63.8, 56.7, 52.1, 48.3, 45.6, 43.2, 41.5, 39.8] },
  { cohort: 'May 2025', size: 13900, rates: [100.0, 73.1, 64.4, 57.5, 53.0, 49.2, 46.4, 44.0, 42.1] },
  { cohort: 'Jun 2025', size: 15100, rates: [100.0, 74.8, 66.2, 59.1, 54.8, 50.9, 47.8, 45.2] },
  { cohort: 'Jul 2025', size: 16300, rates: [100.0, 75.9, 67.5, 60.8, 56.2, 52.4, 49.1] },
  { cohort: 'Aug 2025', size: 17250, rates: [100.0, 77.4, 69.0, 62.3, 57.9, 54.0] },
  { cohort: 'Sep 2025', size: 18100, rates: [100.0, 78.2, 70.1, 63.7, 59.2] },
  { cohort: 'Oct 2025', size: 19400, rates: [100.0, 79.5, 71.8, 65.2] },
  { cohort: 'Nov 2025', size: 20800, rates: [100.0, 81.1, 73.4] },
  { cohort: 'Dec 2025', size: 22500, rates: [100.0, 82.8] }
];

const defaultAhaMoments = [
  {
    id: 'aha_collab_invites',
    candidateRule: 'Send ≥ 3 Collaborator Invites in First 7 Days',
    feature: 'Collaborator Invites',
    timeWindowDays: 7,
    threshold: 3,
    retainedWithActionPct: 83.4,
    retainedWithoutActionPct: 24.1,
    oddsRatio: 6.84,
    f1Score: 0.792,
    adoptionRatePct: 41.2,
    precision: 0.834,
    recall: 0.755,
    status: 'OPTIMAL_AHA_MOMENT',
    verdict: 'Highest predictive power for 90-day LTV retention. Key activation lever for product-led onboarding.'
  },
  {
    id: 'aha_integration_connect',
    candidateRule: 'Connect ≥ 1 Third-Party Integration in First 3 Days',
    feature: 'App Integrations',
    timeWindowDays: 3,
    threshold: 1,
    retainedWithActionPct: 88.2,
    retainedWithoutActionPct: 31.8,
    oddsRatio: 7.95,
    f1Score: 0.824,
    adoptionRatePct: 38.5,
    precision: 0.882,
    recall: 0.773,
    status: 'OPTIMAL_AHA_MOMENT',
    verdict: 'Zero-churn lock-in signal. Connecting 1 tool increases Day-60 retention by +56.4%.'
  },
  {
    id: 'aha_dashboard_exports',
    candidateRule: 'Export ≥ 2 Automated Reports in First 14 Days',
    feature: 'Scheduled Exports',
    timeWindowDays: 14,
    threshold: 2,
    retainedWithActionPct: 76.8,
    retainedWithoutActionPct: 29.5,
    oddsRatio: 4.62,
    f1Score: 0.718,
    adoptionRatePct: 34.6,
    precision: 0.768,
    recall: 0.674,
    status: 'STRONG_CORRELATION',
    verdict: 'Indicates deep organizational workflow integration.'
  }
];

const defaultClusters = [
  {
    id: 'cluster_power_collaborators',
    name: 'Collaborative Power Champions',
    pctOfUserbase: 28.4,
    usersCount: 2001,
    avgWeeklySessions: 18.4,
    avgInvitesSent: 6.2,
    retention90dPct: 89.2,
    churnRisk: 'VERY_LOW',
    keyTrait: 'High multi-user sharing, multi-platform integrations enabled, multi-seat contracts.'
  },
  {
    id: 'cluster_habitual_solos',
    name: 'Habitual Solo Operators',
    pctOfUserbase: 32.1,
    usersCount: 2261,
    avgWeeklySessions: 9.8,
    avgInvitesSent: 0.4,
    retention90dPct: 62.5,
    churnRisk: 'MODERATE',
    keyTrait: 'Daily individual utility use, but susceptible to churn if sole user changes roles.'
  },
  {
    id: 'cluster_dormant_onboarders',
    name: 'Dormant Dropoffs (Stalled Onboarding)',
    pctOfUserbase: 24.5,
    usersCount: 1726,
    avgWeeklySessions: 1.2,
    avgInvitesSent: 0.1,
    retention90dPct: 14.8,
    churnRisk: 'CRITICAL',
    keyTrait: 'Abandoned onboarding prior to Day 3; failed to connect primary integration.'
  },
  {
    id: 'cluster_periodic_auditors',
    name: 'Periodic Month-End Auditors',
    pctOfUserbase: 15.0,
    usersCount: 1056,
    avgWeeklySessions: 3.1,
    avgInvitesSent: 1.1,
    retention90dPct: 47.6,
    churnRisk: 'ELEVATED',
    keyTrait: 'Spike activity around billing cycles and financial reporting cutoff dates.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('cohorts');
  const [cohorts, setCohorts] = useState(defaultCohorts);
  const [ahaMoments, setAhaMoments] = useState(defaultAhaMoments);
  const [clusters, setClusters] = useState(defaultClusters);

  const loadData = async () => {
    const cRes = await fetchCohorts();
    if (cRes?.cohorts) setCohorts(cRes.cohorts);
    const aRes = await fetchAhaMoments();
    if (aRes?.ahaMoments) setAhaMoments(aRes.ahaMoments);
    const clRes = await fetchClusters();
    if (clRes?.clusters) setClusters(clRes.clusters);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onRefresh={loadData} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'cohorts' && <CohortHeatmapView cohorts={cohorts} />}
          {activeTab === 'aha' && <AhaMomentView ahaMoments={ahaMoments} />}
          {activeTab === 'clusters' && <ClusterSegmentationView clusters={clusters} />}
          {activeTab === 'telco' && <TelcoDatasetView />}
        </main>
      </div>
    </div>
  );
}
