import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { favoritesAPI } from '../services/api';
import SeriesCard from '../components/common/SeriesCard';
import SkeletonCard from '../components/common/SkeletonCard';

export default function Favorites() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesAPI.getAll().then(r => r.data.data)
  });

  return (
    <div className="min-h-screen bg-netflix-dark pt-24 pb-16">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <Heart size={28} className="text-netflix-red" fill="currentColor" />
          <h1 className="text-white text-3xl font-bold">{t('myFavorites')}</h1>
          {!isLoading && (
            <span className="text-zinc-500 text-base ml-2">({favorites?.length || 0})</span>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : favorites?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="text-8xl mb-6">💔</div>
            <p className="text-white text-2xl font-bold mb-3">{t('noFavorites')}</p>
            <p className="text-zinc-500 mb-8">{t('addFavoritesMsg')}</p>
            <Link to="/search" className="btn-primary inline-flex">
              <Search size={16} />
              Browse K-Dramas
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {favorites.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <SeriesCard
                  series={s}
                  isFavorite={true}
                  onFavoriteChange={() => qc.invalidateQueries(['favorites'])}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
