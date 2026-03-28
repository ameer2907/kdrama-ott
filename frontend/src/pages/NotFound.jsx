import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-dark">
      <motion.div
        className="text-center px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-9xl font-display text-netflix-red mb-4">404</div>
        <h1 className="text-white text-3xl font-bold mb-3">Page Lost in the Drama</h1>
        <p className="text-zinc-400 mb-8">The page you're looking for has ended its run.</p>
        <Link to="/" className="btn-primary inline-flex">
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
