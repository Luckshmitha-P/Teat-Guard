const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  return response.json();
}

export const api = {
  getCows: () => request('/cows'),
  getCow: (cowId) => request(`/cows/${cowId}`),
  getCowReadings: (cowId) => request(`/cows/${cowId}/readings`),
  getAlerts: () => request('/alerts'),
  getHerdSummary: () => request('/herd-summary'),
  getTrend: (cowId) => request(`/cows/${cowId}/trend`),
  predict: (payload) => request('/predict', { method: 'POST', body: JSON.stringify(payload) }),
  sendSensorReading: (payload) => request('/sensor-reading', { method: 'POST', body: JSON.stringify(payload) }),
  createCow: (payload) => request('/cows', { method: 'POST', body: JSON.stringify(payload) }),
  getSettings: () => request('/settings'),
  setSettings: (payload) => request('/settings', { method: 'POST', body: JSON.stringify(payload) }),
  getMastitisDemo: () => request('/mastitis/demo'),
  uploadMastitisDataset: (formData) => fetch(`${API_BASE}/mastitis/upload-dataset`, { method: 'POST', body: formData }).then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Dataset upload failed');
    }
    return response.json();
  }),
  trainMastitisModel: (payload = {}) => request('/mastitis/train-model', { method: 'POST', body: JSON.stringify(payload) }),
  getMastitisHerdSummary: () => request('/mastitis/herd-summary'),
  getMastitisCow: (cowId) => request(`/mastitis/cow/${cowId}`),
  getMastitisTrend: (cowId) => request(`/mastitis/risk-trend/${cowId}`),
  predictMastitis: (payload = {}) => request('/mastitis/predict', { method: 'POST', body: JSON.stringify(payload) }),
};
