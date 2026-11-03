import React, { useEffect } from 'react';

// Modal accesible sin dependencias: se cierra con Escape o pulsando fuera.
const Modal = ({ open, onClose, title, subtitle, children, footer }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-pine-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-4xl animate-fade-up flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-pine-900/5 px-6 py-5 sm:px-8">
          <div>
            <h2 id="modal-title" className="text-2xl font-medium">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-pine-900/60">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="-mr-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-pine-900/60 hover:bg-pine-800/5 hover:text-pine-950" aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-pine-900/5 bg-paper-50 px-6 py-4 sm:px-8">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
