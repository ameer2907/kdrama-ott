import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, Info, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { seriesAPI, favoritesAPI } from '../../services/api';
import useAuthStore from '../../context/authStore';
import TrailerModal from './TrailerModal';
import toast from 'react-hot-toast';

export default function HeroBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured'],
    queryFn: () => seriesAPI.getFeatured().then(r => r.data.data),
    staleTime: 10 * 60 * 1000
  });

  const advance = useCallback(() => {
    if (featured?.length > 0) setCurrentIndex(i => (i + 1) % featured.length);
  }, [featured]);

  useEffect(() => {
    if (isPaused || !featured?.length) return;
    const timer = setInterval(advance, 7000);
    return () => clearInterval(timer);
  }, [advance, isPaused, featured]);

  const current = featured?.[currentIndex];

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      if (favorites.has(current._id)) {
        await favoritesAPI.remove(current._id);
        setFavorites(p => { const n = new Set(p); n.delete(current._id); return n; });
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(current._id);
        setFavorites(p => new Set([...p, current._id]));
        toast.success('Added to favorites!');
      }
    } catch { toast.error('Action failed'); }
  };

  if (isLoading) return <div className="relative h-screen skeleton rounded-none" />;
  if (!current) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: '600px', maxHeight: '900px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src={current.backdrop || current.poster}
            alt={current.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay — left strong, right fades */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(20,20,20,0.97) 0%, rgba(20,20,20,0.85) 35%, rgba(20,20,20,0.4) 65%, rgba(20,20,20,0.1) 100%)'
          }} />
          {/* Bottom fade */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.5) 15%, transparent 40%)'
          }} />
          {/* Top fade for navbar */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(20,20,20,0.6) 0%, transparent 20%)'
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Content — vertically centered */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-[1800px] mx-auto px-8 md:px-16 pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current._id}`}
              className="max-w-xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {current.isTrending && (
                  <span className="bg-netflix-red text-white text-xs font-bold px-3 py-1 rounded-sm tracking-widest">
                    🔥 TRENDING
                  </span>
                )}
                <span className="bg-white/10 backdrop-blur text-white text-xs px-3 py-1 rounded-sm">
                  {current.year}
                </span>
                {current.network && (
                  <span className="text-zinc-300 text-xs border border-white/20 px-2 py-0.5 rounded-sm">
                    {current.network}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
                {current.title}
              </h1>
              {current.titleKorean && (
                <p className="text-zinc-400 text-base md:text-lg mb-4 ko">{current.titleKorean}</p>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="font-bold">{current.rating}</span>
                </div>
                <span className="text-zinc-400">{current.episodes} {t('episodes')}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  current.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  current.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{t(current.status)}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {current.genres?.slice(0, 3).map(g => (
                  <span key={g} className={`genre-tag genre-${g} text-xs`}>{g}</span>
                ))}
              </div>

              {/* Description */}
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 max-w-lg">
                {current.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 flex-wrap">
                {current.trailers?.length > 0 && (
                  <motion.button
                    onClick={() => setTrailerOpen(true)}
                    className="btn-primary text-sm md:text-base px-6 md:px-8 py-3"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play size={16} fill="white" />
                    {t('watchTrailer')}
                  </motion.button>
                )}
                <motion.button
                  onClick={() => navigate(`/series/${current._id}`)}
                  className="btn-secondary text-sm md:text-base px-6 md:px-8 py-3"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Info size={16} />
                  {t('moreInfo')}
                </motion.button>
                <motion.button
                  onClick={handleFavorite}
                  className={`p-3 rounded-md border transition-all ${
                    favorites.has(current._id)
                      ? 'bg-netflix-red border-netflix-red text-white'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={16} fill={favorites.has(current._id) ? 'white' : 'none'} />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      {featured?.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(i => (i - 1 + featured.length) % featured.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur text-white p-3 rounded-full transition-all z-10"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setCurrentIndex(i => (i + 1) % featured.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur text-white p-3 rounded-full transition-all z-10"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {featured?.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-6 h-2 bg-netflix-red' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {trailerOpen && current && (
        <TrailerModal series={current} onClose={() => setTrailerOpen(false)} />
      )}
    </div>
  );
}