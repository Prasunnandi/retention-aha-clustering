import express from 'express';
import cors from 'cors';
import { cohortMatrix, ahaMoments, customerClusters } from './data.js';

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'retention-aha-clustering', timestamp: new Date().toISOString() });
});

app.get('/api/cohorts', (req, res) => {
  res.json({
    cohorts: cohortMatrix,
    summary: {
      totalTrackedCohorts: cohortMatrix.length,
      baselineMonth1RetentionPct: 74.5,
      latestCohortMonth1RetentionPct: 82.8,
      retentionDeltaMoM: 8.3
    }
  });
});

app.get('/api/aha-moments', (req, res) => {
  res.json({
    ahaMoments,
    summary: {
      topAhaRule: 'Connect ≥ 1 Third-Party Integration in First 3 Days',
      maxOddsRatio: 7.95,
      potentialRetentionLiftPct: 38.6
    }
  });
});

app.get('/api/clusters', (req, res) => {
  res.json({
    clusters: customerClusters,
    totalSegmentedUsers: customerClusters.reduce((acc, c) => acc + c.usersCount, 0)
  });
});

app.post('/api/simulate', (req, res) => {
  const { featureAdoptionBoostPct = 15, targetAhaId = 'aha_integration_connect' } = req.body;
  const aha = ahaMoments.find(a => a.id === targetAhaId) || ahaMoments[0];

  const currentRet = (aha.adoptionRatePct / 100) * aha.retainedWithActionPct +
                     ((100 - aha.adoptionRatePct) / 100) * aha.retainedWithoutActionPct;

  const newAdoptionPct = Math.min(100, aha.adoptionRatePct + Number(featureAdoptionBoostPct));
  const projectedRet = (newAdoptionPct / 100) * aha.retainedWithActionPct +
                       ((100 - newAdoptionPct) / 100) * aha.retainedWithoutActionPct;

  res.json({
    currentAdoptionPct: aha.adoptionRatePct,
    simulatedAdoptionPct: newAdoptionPct,
    currentOverallRetentionPct: Number(currentRet.toFixed(2)),
    projectedOverallRetentionPct: Number(projectedRet.toFixed(2)),
    absoluteRetentionGainPct: Number((projectedRet - currentRet).toFixed(2)),
    annualRecurringRevenueImpact: `$${Math.round((projectedRet - currentRet) * 48500).toLocaleString()}`
  });
});

app.listen(PORT, () => {
  console.log(`Retention Aha Clustering API running on port ${PORT}`);
});
