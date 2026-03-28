import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './utils/i18n';

import useAuthStore from './context/authStore';
import Layout from './components/layout/Layout';


// Pages
import Home from './pages/Home';
import SeriesDetail from './pages/SeriesDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  }
});

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (adminRequired && !isAdmin()) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const { user } = useAuthStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (user?.language) i18n.changeLanguage(user.language);
  }, [user]);

  useEffect(() => {
    const handleLogout = () => useAuthStore.getState().logout();
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' },
            success: { iconTheme: { primary: '#E50914', secondary: '#fff' } }
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/series/:id" element={<SeriesDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute><Favorites /></ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute adminRequired><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
