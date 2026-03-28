import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SeriesCard from './SeriesCard';
import SkeletonCard from './SkeletonCard';

export default function SeriesRow({ title, series, isLoading, emoji }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      const amount = dir === 'left' ? -600 : 600;
      rowRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (isLoading) return (
    <div className="mb-10">
      <div className="h-5 w-48 skeleton rounded mb-4" />
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  if (!series?.length) return null;

  return (
    <motion.section
      className="mb-10 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Row header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-white text-lg md:text-xl font-bold flex items-center gap-2">
          {emoji && <span>{emoji}</span>}
          {title}
          <span className="text-zinc-600 text-sm font-normal ml-1">({series.length})</span>
        </h2>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div className="relative">
        {/* Left shadow */}
        <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-netflix-dark to-transparent z-10 pointer-events-none" />
        
        <div
          ref={rowRef}
          className="row-scroll px-1"
        >
          {series.map((s) => (
            <SeriesCard key={s._id} series={s} />
          ))}
        </div>

        {/* Right shadow */}
        <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-netflix-dark to-transparent z-10 pointer-events-none" />
      </div>
    </motion.section>
  );
}
