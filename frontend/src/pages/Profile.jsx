import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Globe, Lock, Trash2, Clock } from 'lucide-react';
import { historyAPI, authAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import SeriesCard from '../components/common/SeriesCard';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
];

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, isLoading } = useAuthStore();
  const qc = useQueryClient();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', language: user?.language || 'en' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });

  const { data: history } = useQuery({
    queryKey: ['history'],
    queryFn: () => historyAPI.getAll().then(r => r.data.data)
  });

  const handleProfileSave = async () => {
    const result = await updateProfile(form);
    if (result.success) {
      i18n.changeLanguage(form.language);
      localStorage.setItem('language', form.language);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await authAPI.changePassword(pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch { toast.error('Failed to change password'); }
  };

  const clearHistory = async () => {
    await historyAPI.clear();
    qc.invalidateQueries(['history']);
    toast.success('History cleared');
  };

  const TABS = [
    { id: 'profile', label: t('profile'), icon: <User size={16} /> },
    { id: 'history', label: t('watchHistory'), icon: <Clock size={16} /> },
    { id: 'security', label: t('changePassword'), icon: <Lock size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-netflix-dark pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-netflix-red flex items-center justify-center text-3xl font-bold text-white ring-4 ring-netflix-red/30">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">{user?.name}</h1>
            <p className="text-zinc-400">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="bg-netflix-red/20 text-netflix-red border border-netflix-red/30 text-xs px-3 py-1 rounded-full mt-1 inline-block font-semibold">
                🛡️ Administrator
              </span>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab.id === tab
                  ? 'bg-netflix-red text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="glass-panel p-8 max-w-xl">
              <h2 className="text-white text-xl font-bold mb-6">{t('editProfile')}</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-zinc-400 text-xs mb-2 block flex items-center gap-1">
                    <User size={12} /> {t('name')}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-2 block flex items-center gap-1">
                    <Mail size={12} /> Email
                  </label>
                  <input type="email" value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-2 block flex items-center gap-1">
                    <Globe size={12} /> {t('preferredLanguage')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setForm(p => ({ ...p, language: lang.code }))}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-all ${
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
                <button
                  onClick={handleProfileSave}
                  disabled={isLoading}
                  className="btn-primary w-full justify-center py-3"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('saveChanges')}
                </button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {tab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-bold">{t('watchHistory')}</h2>
                {history?.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-netflix-red transition-colors"
                  >
                    <Trash2 size={14} />
                    {t('clearHistory')}
                  </button>
                )}
              </div>
              {history?.length === 0 ? (
                <div className="text-center py-20">
                  <Clock size={48} className="text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">No watch history yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {history?.map(h => h.series && (
                    <div key={h._id} className="relative">
                      <SeriesCard series={h.series} />
                      {h.progress > 0 && (
                        <div className="mt-1 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-netflix-red rounded-full" style={{ width: `${h.progress}%` }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="glass-panel p-8 max-w-xl">
              <h2 className="text-white text-xl font-bold mb-6">{t('changePassword')}</h2>
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="text-zinc-400 text-xs mb-2 block">Current Password</label>
                  <input
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-2 block">New Password</label>
                  <input
                    type="password"
                    value={pwForm.newPassword}
                    onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="input-field"
                    minLength={6}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3">
                  Update Password
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
