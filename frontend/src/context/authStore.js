import { create } from 'zustand';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isLoading: false,

  setUser: (user) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.error || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  register: async (name, email, password, language) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.register({ name, email, password, language });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      toast.success(`Welcome to KDramaVerse, ${data.user.name}!`);
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.error || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
    toast.success('Logged out successfully');
  },

  refreshUser: async () => {
    try {
      const { data } = await authAPI.getMe();
      set({ user: data.user });
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      get().logout();
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.updateProfile(profileData);
      set({ user: data.user, isLoading: false });
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Profile updated!');
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      toast.error('Failed to update profile');
      return { success: false };
    }
  },

  isAdmin: () => get().user?.role === 'admin',
  isAuthenticated: () => !!get().token
}));

export default useAuthStore;
