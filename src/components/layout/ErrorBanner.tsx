import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  variant?: 'error' | 'success';
}

export function ErrorBanner({ message, onDismiss, variant = 'error' }: ErrorBannerProps) {
  const isSuccess = variant === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      role="status"
      aria-live="polite"
      className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm shadow-sm ${
        isSuccess
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          : 'bg-rose-50 border border-rose-200 text-rose-800'
      }`}
    >
      <div className="flex items-center gap-2">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
        )}
        <span>{message}</span>
      </div>
      <button onClick={onDismiss} className="font-bold p-1" type="button" aria-label="Dismiss">
        ✕
      </button>
    </motion.div>
  );
}
