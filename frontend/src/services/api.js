import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

// Response interceptor — handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// ─── Series ───────────────────────────────────────────────────────────────────
export const seriesAPI = {
  getAll: (params) => api.get('/series', { params }),
  getFeatured: () => api.get('/series/featured'),
  getTrending: () => api.get('/series/trending'),
  getByGenre: () => api.get('/series/by-genre'),
  getById: (id) => api.get(`/series/${id}`),
  search: (params) => api.get('/series/search', { params }),
  getRecommendations: (id) => api.get(`/series/${id}/recommendations`),
  trackTrailerView: (id, language) => api.post(`/series/${id}/trailer-view`, { language }),
  create: (data) => api.post('/series', data),
  update: (id, data) => api.put(`/series/${id}`, data),
  delete: (id) => api.delete(`/series/${id}`),
  fetchFromTMDB: (tmdbId) => api.post(`/series/tmdb/${tmdbId}`)
};

// ─── Favorites ────────────────────────────────────────────────────────────────
export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (id) => api.post(`/favorites/${id}`),
  remove: (id) => api.delete(`/favorites/${id}`),
  check: (id) => api.get(`/favorites/check/${id}`)
};

// ─── History ──────────────────────────────────────────────────────────────────
export const historyAPI = {
  getAll: () => api.get('/history'),
  add: (data) => api.post('/history', data),
  clear: () => api.delete('/history'),
  remove: (id) => api.delete(`/history/${id}`)
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  bulkImport: (data) => api.post('/admin/series/bulk-import', data)
};

export default api;
