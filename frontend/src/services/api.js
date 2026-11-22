const API_BASE = 'http://localhost:8001';

export async function fetchCohorts() {
  try {
    const res = await fetch(`${API_BASE}/api/cohorts`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchAhaMoments() {
  try {
    const res = await fetch(`${API_BASE}/api/aha-moments`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchClusters() {
  try {
    const res = await fetch(`${API_BASE}/api/clusters`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function simulateAdoption(boostPct, ahaId) {
  try {
    const res = await fetch(`${API_BASE}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featureAdoptionBoostPct: boostPct, targetAhaId: ahaId })
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}
