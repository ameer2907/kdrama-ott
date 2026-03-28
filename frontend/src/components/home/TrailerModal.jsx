import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Download, Globe, ExternalLink } from 'lucide-react';
import ReactPlayer from 'react-player/youtube';
import { seriesAPI } from '../../services/api';

const LANG_FLAGS = { en: '🇺🇸', ko: '🇰🇷', ta: '🇮🇳', ml: '🇮🇳' };
const LANG_LABELS = { en: 'English', ko: '한국어', ta: 'தமிழ்', ml: 'മലയാളം' };

export default function TrailerModal({ series, onClose }) {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [isPlaying, setIsPlaying] = useState(true);

  const trailers = series?.trailers || [];
  const currentTrailer = trailers.find(tr => tr.language === selectedLang) || trailers[0];

  useEffect(() => {
    if (currentTrailer) {
      seriesAPI.trackTrailerView(series._id, selectedLang).catch(() => {});
    }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleDownload = () => {
  if (!currentTrailer?.youtubeId) return;
  const url = `https://www.youtube.com/watch?v=${currentTrailer.youtubeId}`;
  window.open(`https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp4`, '_blank');
};

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] modal-backdrop flex items-center justify-center p-2 md:p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-zinc-900 rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl border border-white/10 mx-4"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <h2 className="text-white font-bold text-lg">{series.title}</h2>
              {series.titleKorean && (
                <p className="text-zinc-400 text-sm ko">{series.titleKorean}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Player */}
          <div className="relative aspect-video bg-black">
            {currentTrailer?.youtubeId ? (
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${currentTrailer.youtubeId}`}
                width="100%"
                height="100%"
                playing={isPlaying}
                controls
                config={{
                  youtube: {
                    playerVars: { showinfo: 1, origin: window.location.origin }
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <p>No trailer available for this language</p>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            {/* Language switcher */}
            {trailers.length > 1 && (
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-zinc-400" />
                <span className="text-zinc-400 text-xs">{t('selectLanguage')}:</span>
                <div className="flex gap-2">
                  {trailers.map(tr => (
                    <button
                      key={tr.language}
                      onClick={() => setSelectedLang(tr.language)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedLang === tr.language
                          ? 'bg-netflix-red text-white'
                          : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                      }`}
                    >
                      <span>{LANG_FLAGS[tr.language]}</span>
                      <span>{LANG_LABELS[tr.language]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 ml-auto">
              {/* Open in YouTube */}
              {currentTrailer?.youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${currentTrailer.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
                >
                  <ExternalLink size={14} />
                  YouTube
                </a>
              )}
              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 text-xs bg-netflix-red/20 hover:bg-netflix-red text-netflix-red hover:text-white px-4 py-2 rounded-lg transition-all border border-netflix-red/30 hover:border-netflix-red"
              >
                <Download size={14} />
                {t('downloadTrailer')}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
