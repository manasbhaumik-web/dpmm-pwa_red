import { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error:   <AlertTriangle className="w-5 h-5 text-rose-400" />,
  info:    <Info className="w-5 h-5 text-sky-400" />,
};

export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), toast.duration || 4000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <div className="animate-slide-in-right flex items-start gap-3 bg-brand-800 border border-brand-700 rounded-2xl shadow-2xl px-4 py-1.5 max-w-sm w-full pointer-events-auto">
      <div className="mt-0.5">{ICONS[toast.type] || ICONS.info}</div>
      <div className="flex-1 min-w-0">
        {toast.title && <p className="text-sm font-semibold text-brand-50">{toast.title}</p>}
        <p className="text-xs text-brand-400 leading-relaxed">{toast.message}</p>
      </div>
      <button onClick={() => onDismiss(toast.id)} className="text-brand-500 hover:text-brand-300 transition-colors shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
