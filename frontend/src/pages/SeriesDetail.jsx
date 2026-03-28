import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Play, Heart, Star, ArrowLeft, Calendar, Tv, Film,
  Users, Clock, Award, ChevronDown, ChevronUp
} from 'lucide-react';
import { seriesAPI, favoritesAPI, historyAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import SeriesRow from '../components/common/SeriesRow';
import TrailerModal from '../components/home/TrailerModal';
import toast from 'react-hot-toast';

export default function SeriesDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const qc = useQueryClient();

  const { data: series, isLoading, error } = useQuery({
    queryKey: ['series', id],
    queryFn: () => seriesAPI.getById(id).then(r => r.data.data)
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', id],
    queryFn: () => seriesAPI.getRecommendations(id).then(r => r.data.data),
    enabled: !!id
  });

  const { data: favCheck } = useQuery({
    queryKey: ['favCheck', id],
    queryFn: () => favoritesAPI.check(id).then(r => r.data.isFavorite),
    enabled: isAuthenticated() && !!id
  });

  useEffect(() => {
    if (favCheck !== undefined) setIsFav(favCheck);
  }, [favCheck]);

  useEffect(() => {
    if (series && isAuthenticated()) {
      historyAPI.add({ seriesId: series._id, progress: 10 }).catch(() => {});
    }
    window.scrollTo(0, 0);
  }, [series]);

  const toggleFav = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      if (isFav) {
        await favoritesAPI.remove(id);
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(id);
        toast.success('Added to favorites! ❤️');
      }
      setIsFav(!isFav);
      qc.invalidateQueries(['favorites']);
    } catch { toast.error('Action failed'); }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-netflix-dark pt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="skeleton h-96 rounded-2xl mb-8" />
        <div className="skeleton h-8 w-64 rounded mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
    </div>
  );

  if (error || !series) return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-2xl mb-4">Series not found</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    </div>
  );

  const desc = series.description || '';
  const shortDesc = desc.length > 250 ? desc.slice(0, 250) + '...' : desc;

  return (
    <div className="min-h-screen bg-netflix-dark">
      {/* Backdrop hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={series.backdrop || series.poster}
          alt={series.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-6 md:left-12 bg-black/40 hover:bg-black/60 backdrop-blur text-white p-3 rounded-full transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10 max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {series.genres?.map(g => (
                <span key={g} className={`genre-tag genre-${g} text-xs`}>{g}</span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{series.title}</h1>
            {series.titleKorean && (
              <p className="text-zinc-400 text-xl mb-4 ko">{series.titleKorean}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-kdrama-gold">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-lg">{series.rating}</span>
                <span className="text-zinc-500 text-xs">({series.totalRatings?.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Calendar size={15} />
                <span>{series.year}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Film size={15} />
                <span>{series.episodes} {t('episodes')}</span>
              </div>
              {series.network && (
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Tv size={15} />
                  <span>{series.network}</span>
                </div>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                series.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                series.status === 'ongoing' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {t(series.status)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              {series.trailers?.length > 0 && (
                <motion.button
                  onClick={() => setTrailerOpen(true)}
                  className="btn-primary text-base px-8 py-3"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Play size={20} fill="white" />
                  {t('watchTrailer')}
                </motion.button>
              )}
              <motion.button
                onClick={toggleFav}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-base transition-all border ${
                  isFav
                    ? 'bg-netflix-red text-white border-netflix-red'
                    : 'bg-white/10 backdrop-blur text-white border-white/20 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Heart size={18} fill={isFav ? 'white' : 'none'} />
                {isFav ? t('removeFavorite') : t('addFavorite')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: description + cast */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-white text-xl font-bold mb-4">Synopsis</h2>
              <p className="text-zinc-300 leading-relaxed text-base">
                {showFullDesc ? desc : shortDesc}
              </p>
              {desc.length > 250 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="flex items-center gap-1 text-netflix-red text-sm mt-2 hover:text-red-400"
                >
                  {showFullDesc ? (
                    <><ChevronUp size={14} /> Show less</>
                  ) : (
                    <><ChevronDown size={14} /> Read more</>
                  )}
                </button>
              )}
            </div>

            {/* Cast */}
            {series.cast?.length > 0 && (
              <div>
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Users size={18} /> {t('cast')}
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {series.cast.map((member, i) => (
                    <motion.div
                      key={i}
                      className="flex-shrink-0 text-center w-24"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-zinc-800 mb-2 ring-2 ring-zinc-700">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-500">
                            {member.name?.[0]}
                          </div>
                        )}
                      </div>
                      <p className="text-white text-xs font-semibold leading-tight">{member.name}</p>
                      <p className="text-zinc-500 text-[10px] mt-0.5 leading-tight">{member.character}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailers list */}
            {series.trailers?.length > 0 && (
              <div>
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Play size={18} /> Trailers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {series.trailers.map((trailer, i) => (
                    <motion.div
                      key={i}
                      onClick={() => setTrailerOpen(true)}
                      className="relative rounded-xl overflow-hidden cursor-pointer group card-glow"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${trailer.youtubeId}/hqdefault.jpg`}
                        alt={trailer.title || 'Trailer'}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-netflix-red flex items-center justify-center shadow-xl">
                          <Play size={22} fill="white" className="ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-semibold">{trailer.title || 'Trailer'}</p>
                        <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                          {trailer.language === 'ko' ? '🇰🇷 한국어' :
                           trailer.language === 'ta' ? '🇮🇳 தமிழ்' :
                           trailer.language === 'ml' ? '🇮🇳 മലയാളം' : '🇺🇸 English'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: info panel */}
          <div className="space-y-6">
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-white font-bold text-lg border-b border-white/10 pb-3">Series Info</h3>
              {[
                { icon: <Calendar size={14} />, label: t('year'), value: series.year },
                { icon: <Film size={14} />, label: t('episodes'), value: series.episodes },
                { icon: <Tv size={14} />, label: t('network'), value: series.network || 'N/A' },
                { icon: <Award size={14} />, label: t('director'), value: series.director || 'N/A' },
                { icon: <Clock size={14} />, label: t('status'), value: t(series.status) },
                { icon: <Star size={14} />, label: t('rating'), value: `${series.rating} / 10` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-zinc-400 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-zinc-500 text-xs">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {series.tags?.length > 0 && (
              <div className="glass-panel p-6">
                <h3 className="text-white font-bold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {series.tags.map(tag => (
                    <span key={tag} className="bg-white/5 border border-white/10 text-zinc-400 text-xs px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Poster */}
            <div className="rounded-xl overflow-hidden">
              <img
                src={series.poster}
                alt={series.title}
                className="w-full rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="mt-12">
            <SeriesRow
              title={t('recommendations')}
              series={recommendations}
              emoji="💡"
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {trailerOpen && (
        <TrailerModal series={series} onClose={() => setTrailerOpen(false)} />
      )}
    </div>
  );
}
