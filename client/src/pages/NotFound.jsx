import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <section className="not-found">
      {/* Decorative floating orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '15%',
        width: 150, height: 150, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,166,77,0.06) 0%, transparent 70%)',
        animation: 'float 5s ease-in-out infinite 1s',
        pointerEvents: 'none'
      }} />

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        404
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '1.75rem', fontWeight: 700,
          color: '#1E1E1E', marginBottom: '0.75rem'
        }}>
          Page Not Found
        </h2>
        <p style={{
          fontSize: '1rem', color: '#9CA3AF',
          marginBottom: '2.5rem', maxWidth: 420,
          lineHeight: 1.7
        }}>
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
            <FiArrowLeft /> Go Home
          </Link>
          <Link to="/dashboard" className="btn btn-ghost btn-lg">
            Dashboard
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default NotFound;
