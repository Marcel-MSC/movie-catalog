import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type ToastContextValue = {
  showSuccess: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

type ToastProviderProps = {
  children: ReactNode;
};

const TOAST_DURATION_MS = 3000;

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible || !message) return;

    const timeoutId = window.setTimeout(() => {
      setVisible(false);
    }, TOAST_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [visible, message]);

  const showSuccess = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess }}>
      {children}
      {visible && message && (
        <div className="fixed top-6 right-6 z-50">
          <div className="flex items-center gap-4 rounded-2xl bg-emerald-600 text-white shadow-2xl px-6 py-4 transform transition-all duration-300 ease-out">
            <CheckCircleIcon className="w-7 h-7 shrink-0" aria-hidden />
            <span className="text-base font-semibold">{message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

