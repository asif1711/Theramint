import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  message: string;
  type?: NotificationType;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type = 'info', onClose }) => {
  const configs = {
    success: {
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-500" />,
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-100/50',
      text: 'text-emerald-900',
      glow: 'shadow-emerald-500/10'
    },
    error: {
      icon: <XCircle className="h-12 w-12 text-rose-500" />,
      bg: 'bg-rose-50/50',
      border: 'border-rose-100/50',
      text: 'text-rose-900',
      glow: 'shadow-rose-500/10'
    },
    warning: {
      icon: <AlertCircle className="h-12 w-12 text-amber-500" />,
      bg: 'bg-amber-50/50',
      border: 'border-amber-100/50',
      text: 'text-amber-900',
      glow: 'shadow-amber-500/10'
    },
    info: {
      icon: <Info className="h-12 w-12 text-sky-500" />,
      bg: 'bg-sky-50/50',
      border: 'border-sky-100/50',
      text: 'text-sky-900',
      glow: 'shadow-sky-500/10'
    }
  };

  const config = configs[type];

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/40 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative max-w-sm w-full p-10 rounded-[3rem] border border-white/50 shadow-2xl ${config.bg} ${config.glow} flex flex-col items-center text-center`}
      >
        <div className="mb-6 p-4 rounded-3xl bg-white/80 shadow-sm">
          {config.icon}
        </div>
        <p className={`text-xl font-bold serif ${config.text} leading-tight`}>
          {message}
        </p>
        <motion.div 
          className="mt-8 w-12 h-1 bg-black/10 rounded-full overflow-hidden"
          initial={{ width: 48 }}
          animate={{ width: 0 }}
          transition={{ duration: 3, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};
