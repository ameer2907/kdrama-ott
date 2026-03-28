import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-black/60 border-t border-white/5 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-display text-2xl text-netflix-red">K</span>
          <span className="text-white font-bold tracking-widest">DRAMAVERSE</span>
        </div>
        <p className="text-zinc-500 text-sm mb-4">
          The ultimate destination for Korean drama trailers
        </p>
        <div className="flex justify-center gap-6 text-xs text-zinc-600">
          <Link to="/" className="hover:text-zinc-400">{t('home')}</Link>
          <Link to="/search" className="hover:text-zinc-400">{t('search')}</Link>
          <Link to="/favorites" className="hover:text-zinc-400">{t('favorites')}</Link>
        </div>
        <p className="text-zinc-700 text-xs mt-6 flex items-center justify-center gap-1">
          Made with <Heart size={10} className="text-netflix-red" /> for K-Drama fans worldwide
        </p>
      </div>
    </footer>
  );
}
