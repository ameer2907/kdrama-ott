import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Film, Users, BarChart2, Plus, Edit, Trash2,
  Eye, Heart, Play, TrendingUp, Activity, Search, X, ChevronRight,
  Star, CheckCircle, XCircle, AlertTriangle, Download
} from 'lucide-react';
import { adminAPI, seriesAPI } from '../services/api';
import toast from 'react-hot-toast';

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, change }) {
  return (
    <motion.div
      className="glass-panel p-6 flex items-center gap-5"
      whileHover={{ scale: 1.02 }}
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-zinc-400 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-white text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {change && <p className="text-emerald-400 text-xs mt-0.5">↑ {change}</p>}
      </div>
    </motion.div>
  );
}

// ── Series Form ───────────────────────────────────────────────────────────────
function SeriesForm({ series: init, onSave, onCancel }) {
  const [form, setForm] = useState(init || {
    title: '', titleKorean: '', description: '', year: new Date().getFullYear(),
    rating: 0, episodes: 16, status: 'completed', network: '', director: '',
    poster: '', backdrop: '', genres: [], isTrending: false, isFeatured: false,
    trailers: []
  });
  const [saving, setSaving] = useState(false);
  const [tmdbId, setTmdbId] = useState('');

  const GENRES = ['Romance', 'Action', 'Fantasy', 'Thriller', 'Historical', 'Comedy', 'Crime', 'Mystery', 'Drama', 'Horror'];

  const toggleGenre = (g) => {
    setForm(p => ({
      ...p,
      genres: p.genres.includes(g) ? p.genres.filter(x => x !== g) : [...p.genres, g]
    }));
  };

  const fetchTMDB = async () => {
    if (!tmdbId) return;
    try {
      const { data } = await seriesAPI.fetchFromTMDB(tmdbId);
      setForm(p => ({ ...p, ...data.data }));
      toast.success('Data loaded from TMDB!');
    } catch { toast.error('TMDB fetch failed'); }
  };

  const handleSave = async () => {
    if (!form.title || !form.poster) { toast.error('Title and poster are required'); return; }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const I = ({ label, field, type = 'text', ...p }) => (
    <div>
      <label className="text-zinc-400 text-xs mb-1 block">{label}</label>
      <input
        type={type}
        value={form[field] || ''}
        onChange={e => setForm(prev => ({ ...prev, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
        className="input-field text-sm"
        {...p}
      />
    </div>
  );

  return (
    <div className="glass-panel p-6 max-h-[80vh] overflow-y-auto">
      <h3 className="text-white text-lg font-bold mb-5">{init ? 'Edit Series' : 'Add New Series'}</h3>

      {/* TMDB Import */}
      <div className="flex gap-3 mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <input
          placeholder="TMDB ID (e.g. 84356)"
          value={tmdbId}
          onChange={e => setTmdbId(e.target.value)}
          className="input-field flex-1 text-sm"
        />
        <button onClick={fetchTMDB} className="btn-primary whitespace-nowrap text-sm">
          <Download size={14} /> Import TMDB
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <I label="Title *" field="title" />
        <I label="Korean Title" field="titleKorean" />
        <I label="Year" field="year" type="number" />
        <I label="Rating (0-10)" field="rating" type="number" />
        <I label="Episodes" field="episodes" type="number" />
        <I label="Network" field="network" />
        <I label="Director" field="director" />
        <div>
          <label className="text-zinc-400 text-xs mb-1 block">Status</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
            className="input-field text-sm">
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <I label="Poster URL *" field="poster" />
        <I label="Backdrop URL" field="backdrop" />
        <div>
          <label className="text-zinc-400 text-xs mb-2 block">Description</label>
          <textarea
            value={form.description || ''}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="input-field text-sm min-h-24 resize-none"
            rows={4}
          />
        </div>

        {/* Genres */}
        <div>
          <label className="text-zinc-400 text-xs mb-2 block">Genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => (
              <button key={g} type="button" onClick={() => toggleGenre(g)}
                className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                  form.genres.includes(g) ? 'bg-netflix-red text-white border-netflix-red' : 'bg-white/5 text-zinc-300 border-white/10'
                }`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Trailer */}
        <div>
          <label className="text-zinc-400 text-xs mb-2 block">YouTube Trailer ID</label>
          <div className="flex gap-2">
            <input
              placeholder="e.g. 5GSmFuBDS_M"
              className="input-field flex-1 text-sm"
              onBlur={e => {
                if (e.target.value) {
                  setForm(p => ({
                    ...p,
                    trailers: [{ language: 'en', youtubeId: e.target.value, url: `https://www.youtube.com/watch?v=${e.target.value}`, title: 'Trailer' }]
                  }));
                }
              }}
              defaultValue={form.trailers?.[0]?.youtubeId || ''}
            />
          </div>
        </div>

        {/* Flags */}
        <div className="flex gap-6">
          {[['isTrending', '🔥 Trending'], ['isFeatured', '⭐ Featured']].map(([field, label]) => (
            <label key={field} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[field] || false}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.checked }))}
                className="w-4 h-4 accent-netflix-red" />
              <span className="text-zinc-300 text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (init ? 'Save Changes' : 'Add Series')}
        </button>
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingSeries, setEditingSeries] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const qc = useQueryClient();

  const { data: dash, isLoading: dashLoading } = useQuery({
    queryKey: ['adminDash'],
    queryFn: () => adminAPI.getDashboard().then(r => r.data.data),
    refetchInterval: 60000
  });

  const { data: seriesList, isLoading: seriesLoading } = useQuery({
    queryKey: ['adminSeries'],
    queryFn: () => seriesAPI.getAll({ limit: 100 }).then(r => r.data.data),
    enabled: activeTab === 'content'
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminAPI.getUsers({ limit: 100 }).then(r => r.data.data),
    enabled: activeTab === 'users'
  });

  const handleSaveSeries = async (formData) => {
    try {
      if (editingSeries) {
        await seriesAPI.update(editingSeries._id, formData);
        toast.success('Series updated!');
      } else {
        await seriesAPI.create(formData);
        toast.success('Series added!');
      }
      qc.invalidateQueries(['adminSeries']);
      qc.invalidateQueries(['trending']);
      qc.invalidateQueries(['featured']);
      setShowForm(false);
      setEditingSeries(null);
    } catch { toast.error('Save failed'); }
  };

  const handleDeleteSeries = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await seriesAPI.delete(id);
      toast.success('Deleted');
      qc.invalidateQueries(['adminSeries']);
    } catch { toast.error('Delete failed'); }
  };

  const handleToggleUser = async (id) => {
    try {
      await adminAPI.toggleUser(id);
      qc.invalidateQueries(['adminUsers']);
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'content', label: 'Content', icon: <Film size={16} /> },
    { id: 'users', label: 'Users', icon: <Users size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} /> },
  ];

  const filteredUsers = users?.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-netflix-dark pt-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage KDramaVerse platform</p>
          </div>
          {activeTab === 'content' && (
            <button onClick={() => { setEditingSeries(null); setShowForm(true); }} className="btn-primary">
              <Plus size={16} /> Add Series
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-xl w-fit overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-netflix-red text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Users" value={dash?.stats.totalUsers || 0}
                    icon={<Users size={22} className="text-white" />} color="bg-blue-600" />
                  <StatCard label="Total Series" value={dash?.stats.totalSeries || 0}
                    icon={<Film size={22} className="text-white" />} color="bg-purple-600" />
                  <StatCard label="Total Views" value={dash?.stats.totalViews || 0}
                    icon={<Eye size={22} className="text-white" />} color="bg-emerald-600" />
                  <StatCard label="Trailer Plays" value={dash?.stats.totalTrailerViews || 0}
                    icon={<Play size={22} className="text-white" />} color="bg-netflix-red" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Series */}
                  <div className="glass-panel p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <TrendingUp size={16} /> {t('topSeries')}
                    </h3>
                    <div className="space-y-3">
                      {dash?.topSeries?.map((s, i) => (
                        <div key={s._id} className="flex items-center gap-4">
                          <span className="text-zinc-600 text-sm w-5">{i + 1}</span>
                          <img src={s.poster} alt={s.title} className="w-10 h-14 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{s.title}</p>
                            <p className="text-zinc-500 text-xs">{s.views?.toLocaleString()} views</p>
                          </div>
                          <div className="text-zinc-400 text-xs flex items-center gap-1">
                            <Heart size={10} className="text-netflix-red" /> {s.favoriteCount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div className="glass-panel p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Users size={16} /> {t('recentUsers')}
                    </h3>
                    <div className="space-y-3">
                      {dash?.recentUsers?.map(u => (
                        <div key={u._id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-netflix-red flex items-center justify-center text-sm font-bold text-white">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{u.name}</p>
                            <p className="text-zinc-500 text-xs truncate">{u.email}</p>
                          </div>
                          <span className="text-zinc-600 text-xs">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Genre Stats */}
                {dash?.genreStats?.length > 0 && (
                  <div className="glass-panel p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Activity size={16} /> Genre Distribution
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {dash.genreStats.map(g => (
                        <div key={g._id} className="bg-white/5 rounded-xl p-4">
                          <p className="text-white font-semibold">{g._id}</p>
                          <p className="text-zinc-400 text-sm">{g.count} series</p>
                          <div className="mt-2 h-1.5 bg-zinc-700 rounded-full">
                            <div
                              className="h-full bg-netflix-red rounded-full"
                              style={{ width: `${Math.min((g.count / (dash?.stats?.totalSeries || 1)) * 100 * 3, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CONTENT ── */}
            {activeTab === 'content' && (
              <div>
                {(showForm || editingSeries) && (
                  <div className="mb-8">
                    <SeriesForm
                      series={editingSeries}
                      onSave={handleSaveSeries}
                      onCancel={() => { setShowForm(false); setEditingSeries(null); }}
                    />
                  </div>
                )}

                {seriesLoading ? (
                  <div className="grid grid-cols-1 gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="skeleton h-16 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-zinc-400 text-sm">{seriesList?.length} series total</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            {['Poster', 'Title', 'Year', 'Rating', 'Status', 'Views', 'Actions'].map(h => (
                              <th key={h} className="text-left text-zinc-500 text-xs font-semibold px-4 py-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {seriesList?.map(s => (
                            <tr key={s._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                              <td className="px-4 py-3">
                                <img src={s.poster} alt={s.title} className="w-8 h-11 object-cover rounded" />
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-white text-sm font-medium">{s.title}</p>
                                <p className="text-zinc-500 text-xs ko">{s.titleKorean}</p>
                              </td>
                              <td className="px-4 py-3 text-zinc-400 text-sm">{s.year}</td>
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-1 text-kdrama-gold text-sm">
                                  <Star size={12} fill="currentColor" /> {s.rating}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                  s.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                  s.status === 'ongoing' ? 'bg-sky-500/20 text-sky-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>{s.status}</span>
                              </td>
                              <td className="px-4 py-3 text-zinc-400 text-sm">{s.views?.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button onClick={() => { setEditingSeries(s); setShowForm(true); window.scrollTo(0, 0); }}
                                    className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors">
                                    <Edit size={14} />
                                  </button>
                                  <button onClick={() => handleDeleteSeries(s._id, s.title)}
                                    className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── USERS ── */}
            {activeTab === 'users' && (
              <div>
                <div className="relative max-w-sm mb-6">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    placeholder="Search users..."
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    className="input-field pl-10 text-sm"
                  />
                </div>

                {usersLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
                  </div>
                ) : (
                  <div className="glass-panel overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                              <th key={h} className="text-left text-zinc-500 text-xs font-semibold px-4 py-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers?.map(u => (
                            <tr key={u._id} className="border-b border-white/5 hover:bg-white/3">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-netflix-red flex items-center justify-center text-sm font-bold text-white">
                                    {u.name?.[0]?.toUpperCase()}
                                  </div>
                                  <span className="text-white text-sm font-medium">{u.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-zinc-400 text-sm">{u.email}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                  u.role === 'admin' ? 'bg-netflix-red/20 text-netflix-red' : 'bg-zinc-700 text-zinc-300'
                                }`}>{u.role}</span>
                              </td>
                              <td className="px-4 py-3 text-zinc-500 text-xs">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                {u.isActive
                                  ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={12} /> Active</span>
                                  : <span className="flex items-center gap-1 text-xs text-red-400"><XCircle size={12} /> Suspended</span>
                                }
                              </td>
                              <td className="px-4 py-3">
                                {u.role !== 'admin' && (
                                  <button
                                    onClick={() => handleToggleUser(u._id)}
                                    className={`text-xs px-3 py-1.5 rounded transition-all ${
                                      u.isActive
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                    }`}
                                  >
                                    {u.isActive ? 'Suspend' : 'Activate'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── ANALYTICS ── */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity breakdown */}
                  <div className="glass-panel p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Activity size={16} /> Weekly Activity
                    </h3>
                    <div className="space-y-3">
                      {dash?.activityStats?.map(a => (
                        <div key={a._id} className="flex items-center justify-between">
                          <span className="text-zinc-300 text-sm capitalize">{a._id.replace('_', ' ')}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-netflix-red rounded-full"
                                style={{ width: `${Math.min((a.count / 1000) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-white text-sm font-semibold w-12 text-right">{a.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily chart */}
                  <div className="glass-panel p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <BarChart2 size={16} /> 30-Day Activity
                    </h3>
                    <div className="flex items-end gap-1 h-32">
                      {dash?.dailyActivity?.slice(-20).map((d, i) => {
                        const max = Math.max(...(dash.dailyActivity.map(x => x.count) || [1]));
                        const pct = (d.count / max) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full bg-netflix-red/60 hover:bg-netflix-red rounded-sm transition-all"
                              style={{ height: `${pct}%` }}
                              title={`${d._id}: ${d.count}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-zinc-600 text-xs mt-2 text-center">Last 20 days</p>
                  </div>
                </div>

                {/* Genre performance */}
                <div className="glass-panel p-6">
                  <h3 className="text-white font-bold mb-4">Genre Performance</h3>
                  <div className="space-y-3">
                    {dash?.genreStats?.slice(0, 8).map(g => {
                      const maxViews = Math.max(...(dash.genreStats.map(x => x.totalViews) || [1]));
                      return (
                        <div key={g._id} className="flex items-center gap-4">
                          <span className="text-zinc-300 text-sm w-24 flex-shrink-0">{g._id}</span>
                          <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-netflix-red to-kdrama-rose rounded-full"
                              style={{ width: `${(g.totalViews / maxViews) * 100}%` }}
                            />
                          </div>
                          <span className="text-zinc-400 text-xs w-20 text-right">{g.totalViews?.toLocaleString()} views</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
