import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import useAuthStore from '../context/authStore';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://image.tmdb.org/t/p/original/m2rYfBkYiAiqp3WWJUMgWIPkK6Y.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-netflix-dark via-netflix-dark/95 to-black" />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="font-display text-4xl text-netflix-red">K</span>
            <div>
              <div className="text-white font-bold text-sm tracking-widest">DRAMA</div>
              <div className="text-netflix-red text-xs tracking-[0.3em]">VERSE</div>
            </div>
          </Link>
        </div>

        <div className="glass-panel p-8">
          <h1 className="text-white text-2xl font-bold mb-2">{t('loginTitle')}</h1>
          <p className="text-zinc-500 text-sm mb-8">
            Stream Korean drama trailers in your language
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                placeholder={t('emailAddress')}
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field pl-11"
                required
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder={t('password')}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-field pl-11 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 text-base"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : t('loginTitle')}
            </motion.button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <p className="text-zinc-400 text-xs mb-2 font-semibold">Demo accounts:</p>
            <button
              onClick={() => setForm({ email: 'demo@kdrama.com', password: 'Demo@123' })}
              className="text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded mr-2 transition-all"
            >
              👤 User
            </button>
            <button
              onClick={() => setForm({ email: 'ameermalikbahad07@gmail.com', password: 'Admin@123' })}
              className="text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-all"
            >
              🛡️ Admin
            </button>
          </div>

          <p className="text-zinc-500 text-sm text-center mt-6">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-netflix-red hover:text-red-400 font-semibold">
              {t('register')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
