import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Plus, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { favoritesAPI } from '../../services/api';
import useAuthStore from '../../context/authStore';
import TrailerModal from '../home/TrailerModal';
import toast from 'react-hot-toast';

export default function SeriesCard({ series, isFavorite: initFav = false, onFavoriteChange }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isFav, setIsFav] = useState(initFav);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      if (isFav) {
        await favoritesAPI.remove(series._id);
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(series._id);
        toast.success('Added to favorites!');
      }
      setIsFav(!isFav);
      onFavoriteChange?.(!isFav);
    } catch { toast.error('Failed'); }
  };

  const fallbackImg = `https://placehold.co/300x450/1a1a1a/333333?text=${encodeURIComponent(series.title)}`;

  return (
    <>
      <motion.div
        className="relative flex-shrink-0 w-40 sm:w-44 cursor-pointer"
        style={{ scrollSnapAlign: 'start' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/series/${series._id}`)}
        layout
      >
        {/* Card base */}
        <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-zinc-900">
          <img
            src={series.poster || fallbackImg}
            alt={series.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
            loading="lazy"
          />
          {/* Gradient */}
          <div className={`absolute inset-0 bg-card-gradient transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {series.isTrending && (
              <span className="bg-netflix-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded">🔥 HOT</span>
            )}
            {series.status === 'ongoing' && (
              <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">ON AIR</span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-xs">
            <Star size={9} fill="#F5C842" className="text-kdrama-gold" />
            <span className="text-white font-semibold">{series.rating}</span>
          </div>

          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex gap-2 justify-center mb-2">
                  {series.trailers?.length > 0 && (
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); setTrailerOpen(true); }}
                      className="bg-netflix-red text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play size={14} fill="white" />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-colors ${isFav ? 'bg-netflix-red text-white' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={14} fill={isFav ? 'white' : 'none'} />
                  </motion.button>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); navigate(`/series/${series._id}`); }}
                    className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Info size={14} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title below */}
        <div className="mt-2 px-0.5">
          <p className="text-white text-xs font-semibold truncate">{series.title}</p>
          {series.titleKorean && (
            <p className="text-zinc-500 text-[10px] ko truncate">{series.titleKorean}</p>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-zinc-500 text-[10px]">{series.year}</span>
            {series.genres?.[0] && (
              <span className="text-zinc-600 text-[10px]">{series.genres[0]}</span>
            )}
          </div>
        </div>
      </motion.div>

      {trailerOpen && (
        <TrailerModal series={series} onClose={() => setTrailerOpen(false)} />
      )}
    </>
  );
}
