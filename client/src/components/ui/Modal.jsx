import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, subtitle, children, footer, maxWidth = 'max-w-2xl' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div 
            className={`w-full ${maxWidth} bg-white rounded-2xl shadow-xl border border-[#E2E8F0] text-[#0F172A] flex flex-col max-h-[88vh] my-auto relative`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-white flex-shrink-0 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">{title}</h3>
                {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
              </div>
              <button 
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer ml-3 flex-shrink-0" 
                onClick={onClose}
                aria-label="Close modal"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto bg-white flex-1 space-y-4 text-[#475569]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end gap-3 flex-shrink-0 rounded-b-2xl">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
