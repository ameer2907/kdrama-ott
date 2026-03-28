import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, X, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { seriesAPI } from '../services/api';
import SeriesCard from '../components/common/SeriesCard';
import SkeletonCard from '../components/common/SkeletonCard';

const GENRES = ['Romance', 'Action', 'Fantasy', 'Thriller', 'Historical', 'Comedy', 'Crime', 'Mystery', 'Drama', 'Horror', 'Sci-Fi', 'Medical', 'School'];
const YEARS = Array.from({ length: 15 }, (_, i) => 2024 - i);
const SORT_OPTIONS = [
  { value: '-rating', label: 'Top Rated' },
  { value: '-views', label: 'Most Viewed' },
  { value: '-year', label: 'Newest First' },
  { value: 'year', label: 'Oldest First' },
  { value: '-favoriteCount', label: 'Most Favorited' },
];

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-rating');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const hasFilters = genre || year || debouncedQuery;

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, genre, year, sort],
    queryFn: () => {
      const params = { sort };
      if (debouncedQuery) params.q = debouncedQuery;
      if (genre) params.genre = genre;
      if (year) params.year = year;
      if (!debouncedQuery && !genre && !year) {
        return seriesAPI.getAll({ sort, limit: 30 }).then(r => ({ data: { data: r.data.data } }));
      }
      return seriesAPI.search(params);
    },
    staleTime: 30000
  });

  const results = data?.data?.data || [];

  const clearFilters = () => {
    setQuery(''); setGenre(''); setYear(''); setSort('-rating');
  };

  return (
    <div className="min-h-screen bg-netflix-dark pt-24 pb-16">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">

        {/* Search header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-white text-3xl font-bold mb-6">
            {t('search')} <span className="text-netflix-red">K-Dramas</span>
          </h1>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="input-field pl-12 pr-12 text-base py-4"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter bar */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              showFilters ? 'bg-netflix-red border-netflix-red text-white' : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={15} />
            {t('filters')}
            {hasFilters && <span className="w-2 h-2 bg-white rounded-full ml-1" />}
          </button>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-2 rounded-lg outline-none"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Active filters display */}
          {genre && (
            <span className="flex items-center gap-2 bg-netflix-red/20 border border-netflix-red/30 text-netflix-red text-sm px-3 py-1.5 rounded-lg">
              {genre}
              <button onClick={() => setGenre('')}><X size={12} /></button>
            </span>
          )}
          {year && (
            <span className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm px-3 py-1.5 rounded-lg">
              {year}
              <button onClick={() => setYear('')}><X size={12} /></button>
            </span>
          )}
          {hasFilters && (
            <button onClick={clearFilters} className="text-zinc-500 text-sm hover:text-white">
              Clear all
            </button>
          )}
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-panel p-6 mb-8 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Genre filter */}
                <div>
                  <h3 className="text-zinc-300 text-sm font-semibold mb-3">{t('genre')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map(g => (
                      <button
                        key={g}
                        onClick={() => setGenre(genre === g ? '' : g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          genre === g
                            ? 'bg-netflix-red text-white border-netflix-red'
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year filter */}
                <div>
                  <h3 className="text-zinc-300 text-sm font-semibold mb-3">{t('year')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {YEARS.map(y => (
                      <button
                        key={y}
                        onClick={() => setYear(year === String(y) ? '' : String(y))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          year === String(y)
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-zinc-400 text-xl mb-2">{t('noResults')}</p>
            <p className="text-zinc-600 text-sm">{t('tryDifferent')}</p>
          </motion.div>
        ) : (
          <>
            <p className="text-zinc-500 text-sm mb-6">
              Found <span className="text-white font-semibold">{results.length}</span> results
              {debouncedQuery && <> for "<span className="text-netflix-red">{debouncedQuery}</span>"</>}
            </p>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {results.map((s, i) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                >
                  <SeriesCard series={s} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
