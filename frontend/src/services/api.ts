import { areas as mockAreas, alerts as mockAlerts, drains as mockDrains, waterBodies as mockWaterBodies, shelters as mockShelters, infrastructure as mockInfrastructure } from '../data/mock';

const BASE = String(import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const MOCK = String(import.meta.env.VITE_USE_MOCK_FALLBACK ?? 'false') === 'true';
const TOKEN_KEY = 'jalrakshak_token';

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function saveToken(token: string) { localStorage.setItem(TOKEN_KEY, token); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${BASE}${path}`, { ...options, headers });
  if (response.status === 401) {
    clearToken();
    window.dispatchEvent(new Event('jalrakshak-auth-expired'));
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `API ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function fallback(path: string) {
  if (path === '/dashboard') return { rainfall: { current: 68, peakForecast: 82, unit: 'mm/hr' }, kpis: { criticalZones: 1, highRiskZones: 2, maxWaterDepth: 0.74, roadsAffected: 7 }, areas: mockAreas, syntheticData: true };
  if (path === '/geo') return { areas: mockAreas, waterBodies: mockWaterBodies, shelters: mockShelters, infrastructure: mockInfrastructure, syntheticData: true };
  if (path === '/drainage') return { nodes: mockDrains, edges: [], syntheticData: true };
  if (path === '/water-bodies') return { waterBodies: mockWaterBodies, syntheticData: true };
  if (path === '/alerts') return { alerts: mockAlerts.map(a => ({ ...a, severity: a.level, message: a.detail })), syntheticData: true };
  if (path === '/history') return { monthly: [{ month: 'Jan', events: 2 }, { month: 'Feb', events: 1 }, { month: 'Mar', events: 3 }, { month: 'Apr', events: 4 }, { month: 'May', events: 2 }, { month: 'Jun', events: 5 }], syntheticData: true };
  if (path === '/models') return { activeModel: { name: 'Baseline Flood Risk Model', version: '1.0.0', status: 'READY' }, metrics: { accuracy: .91, precision: .89, recall: .87, f1: .88, mae: .09, rmse: .14 }, syntheticData: true };
  return {};
}

async function safe<T>(path: string, options?: RequestInit): Promise<T> {
  try { return await request<T>(path, options); }
  catch (error) {
    if (MOCK && !(error instanceof Error && /401|Authentication|Invalid or expired/i.test(error.message))) return fallback(path) as T;
    throw error;
  }
}

export const api = {
  login: async (email: string, password: string) => {
    const result = await request<{ token: string; user: { id: string; email: string; role: string } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    saveToken(result.token);
    return result;
  },
  me: () => request<{ user: { id: string; email: string; role: string } }>('/auth/me'),
  logout: clearToken,
  getDashboard: () => safe<any>('/dashboard'),
  getGeo: () => safe<any>('/geo'),
  getDrainage: () => safe<any>('/drainage'),
  getWaterBodies: () => safe<any>('/water-bodies'),
  getRainfall: () => safe<any>('/rainfall'),
  getAlerts: () => safe<any>('/alerts'),
  getHistory: () => safe<any>('/history'),
  getModels: () => safe<any>('/models'),
  getDataStatus: () => safe<any>('/data/status'),
  predict: (body: any) => safe<any>('/predictions', { method: 'POST', body: JSON.stringify(body) }),
  simulate: (body: any) => safe<any>('/simulation', { method: 'POST', body: JSON.stringify(body) }),
  route: (body: any) => safe<any>('/routes', { method: 'POST', body: JSON.stringify(body) }),
  chat: (body: any) => safe<any>('/chat/query', { method: 'POST', body: JSON.stringify(body) }),
  generateAlerts: () => safe<any>('/alerts/generate', { method: 'POST', body: JSON.stringify({}) }),
  health: () => request<any>('/health'),
  dbHealth: () => request<any>('/db/health'),
};
