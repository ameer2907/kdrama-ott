import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { seriesAPI, historyAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import HeroBanner from '../components/home/HeroBanner';
import SeriesRow from '../components/common/SeriesRow';

export default function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => seriesAPI.getTrending().then(r => r.data.data)
  });

  const { data: byGenre, isLoading: genreLoading } = useQuery({
    queryKey: ['byGenre'],
    queryFn: () => seriesAPI.getByGenre().then(r => r.data.data)
  });

  const { data: topRated, isLoading: topLoading } = useQuery({
    queryKey: ['topRated'],
    queryFn: () => seriesAPI.getAll({ sort: '-rating', limit: 15 }).then(r => r.data.data)
  });

  const { data: history } = useQuery({
    queryKey: ['history'],
    queryFn: () => historyAPI.getAll().then(r => r.data.data),
    enabled: isAuthenticated()
  });

  const { data: newReleases, isLoading: newLoading } = useQuery({
    queryKey: ['newReleases'],
    queryFn: () => seriesAPI.getAll({ sort: '-year', limit: 15 }).then(r => r.data.data)
  });

  const continueWatching = history
    ?.filter(h => h.progress > 0 && h.progress < 95)
    .map(h => h.series)
    .filter(Boolean) || [];

  const GENRE_EMOJIS = {
    Romance: '💕', Action: '⚔️', Fantasy: '✨', Thriller: '🔪',
    Historical: '🏯', Comedy: '😄', Crime: '🔍', Mystery: '🕵️',
    Drama: '🎭', Horror: '👻', School: '🎓', Family: '👨‍👩‍👧‍👦',
    Medical: '🏥', Political: '🏛️'
  };

  return (
    <div className="min-h-screen bg-netflix-dark">

      {/* Hero — full screen */}
      <HeroBanner />

      {/* Content rows — start right after hero */}
      <div
        className="relative z-10 pb-16"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #141414 60px)' }}
      >
        <div className="px-4 md:px-10 lg:px-14 pt-10 max-w-[1800px] mx-auto">

          {/* Continue Watching — only shown if logged in and has history */}
          {continueWatching.length > 0 && (
            <SeriesRow
              title="Continue Watching"
              series={continueWatching}
              emoji="▶️"
            />
          )}

          {/* Trending Now */}
          <SeriesRow
            title={t('trending')}
            series={trending}
            isLoading={trendingLoading}
            emoji="🔥"
          />

          {/* Top Rated */}
          <SeriesRow
            title={t('topRated')}
            series={topRated}
            isLoading={topLoading}
            emoji="⭐"
          />

          {/* New Releases */}
          <SeriesRow
            title={t('newReleases')}
            series={newReleases}
            isLoading={newLoading}
            emoji="🆕"
          />

          {/* Genre Rows */}
          {genreLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SeriesRow key={i} isLoading title="" series={[]} />
              ))
            : byGenre?.map(({ genre, series }) => (
                series?.length > 0 && (
                  <SeriesRow
                    key={genre}
                    title={t(genre.toLowerCase()) || genre}
                    series={series}
                    emoji={GENRE_EMOJIS[genre] || '🎬'}
                  />
                )
              ))
          }

        </div>
      </div>
    </div>
  );
}