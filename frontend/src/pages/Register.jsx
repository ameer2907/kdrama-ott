import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, User, Globe } from 'lucide-react';
import useAuthStore from '../context/authStore';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
];

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', language: 'en' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password, form.language);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('https://image.tmdb.org/t/p/original/dWjBFTEWOBSJABBcvMtkyb9x1Sy.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-netflix-dark via-netflix-dark/95 to-black" />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
          <h1 className="text-white text-2xl font-bold mb-2">{t('registerTitle')}</h1>
          <p className="text-zinc-500 text-sm mb-8">Join millions of K-Drama fans worldwide</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder={t('name')}
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className={`input-field pl-11 ${errors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder={t('emailAddress')}
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className={`input-field pl-11 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder={t('password')}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Language */}
            <div>
              <label className="text-zinc-400 text-xs mb-2 block flex items-center gap-1">
                <Globe size={12} /> {t('preferredLanguage')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, language: lang.code }))}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      form.language === lang.code
                        ? 'bg-netflix-red text-white border-netflix-red'
                        : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 text-base mt-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : t('registerTitle')}
            </motion.button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-netflix-red hover:text-red-400 font-semibold">{t('login')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
