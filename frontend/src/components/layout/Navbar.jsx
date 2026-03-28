import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Heart, User, LogOut, Shield, Menu, X, Globe, ChevronDown } from 'lucide-react';
import useAuthStore from '../../context/authStore';

const LANG_OPTIONS = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' }
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setLangOpen(false);
  };

  const currentLang = LANG_OPTIONS.find(l => l.code === i18n.language) || LANG_OPTIONS[0];

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/search', label: t('search') },
    ...(isAuthenticated() ? [{ to: '/favorites', label: t('favorites') }] : []),
    ...(isAdmin() ? [{ to: '/admin', label: t('admin') }] : [])
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-netflix-dark/95 backdrop-blur-md shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* ── PREMIUM LOGO ── */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <motion.div
              className="relative flex items-center gap-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* Badge */}
              <div className="relative">
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(229,9,20,0.5)', filter: 'blur(10px)', zIndex: 0 }}
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Main box */}
                <motion.div
                  className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #ff2020 0%, #E50914 45%, #9b0000 100%)',
                    boxShadow: '0 6px 24px rgba(229,9,20,0.7), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.3)'
                  }}
                  animate={{ boxShadow: [
                    '0 6px 24px rgba(229,9,20,0.5)',
                    '0 6px 32px rgba(229,9,20,0.9)',
                    '0 6px 24px rgba(229,9,20,0.5)'
                  ]}}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {/* Top shine */}
                  <div className="absolute top-0 left-0 right-0 h-5 rounded-t-xl"
                    style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' }}
                  />
                  {/* K letter */}
                  <motion.span
                    style={{
                      fontFamily: 'Bebas Neue, Impact, sans-serif',
                      fontSize: '28px',
                      color: 'white',
                      lineHeight: 1,
                      textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      position: 'relative',
                      zIndex: 1
                    }}
                    animate={{ textShadow: [
                      '0 2px 8px rgba(0,0,0,0.6)',
                      '0 0 20px rgba(255,255,255,0.4)',
                      '0 2px 8px rgba(0,0,0,0.6)'
                    ]}}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    K
                  </motion.span>
                  {/* Bottom shine */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 rounded-b-xl"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }}
                  />
                </motion.div>
              </div>

              {/* Text */}
              <motion.div
                className="leading-none"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '20px',
                  letterSpacing: '5px',
                  color: 'white',
                  lineHeight: 1,
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                }}>
                  DRAMA
                </div>
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '7px',
                  background: 'linear-gradient(90deg, #ff4444, #E50914, #ff4444)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.4
                }}>
                  VERSE
                </div>
              </motion.div>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 ml-10">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link relative ${location.pathname === link.to ? 'text-white' : ''}`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-netflix-red"
                    layoutId="navUnderline"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/search')} className="text-zinc-300 hover:text-white transition-colors p-1.5">
              <Search size={19} />
            </button>

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors text-sm p-1.5"
              >
                <Globe size={16} />
                <span className="hidden sm:block">{currentLang.flag}</span>
                <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-40 glass-panel py-1 shadow-2xl"
                  >
                    {LANG_OPTIONS.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 flex items-center gap-2 ${
                          i18n.language === lang.code ? 'text-netflix-red' : 'text-zinc-300'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth */}
            {isAuthenticated() ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-netflix-red flex items-center justify-center text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-panel py-1 shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-semibold text-sm">{user?.name}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{user?.email}</p>
                      </div>
                      {[
                        { to: '/profile', icon: <User size={14} />, label: t('profile') },
                        { to: '/favorites', icon: <Heart size={14} />, label: t('favorites') },
                        ...(isAdmin() ? [{ to: '/admin', icon: <Shield size={14} />, label: t('admin') }] : [])
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/10">
                          {item.icon}{item.label}
                        </Link>
                      ))}
                      <div className="border-t border-white/10 mt-1">
                        <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-netflix-red hover:bg-white/5">
                          <LogOut size={14} />{t('logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden sm:flex">{t('login')}</Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-1">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-netflix-dark/98 border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 font-medium">
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated() && (
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-netflix-red font-semibold">{t('login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}