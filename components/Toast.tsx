"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose?: () => void;
  action?: { label: string; href: string };
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
};

const COLORS: Record<ToastType, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-300",
  error:   "border-red-500/30 bg-red-500/10 text-red-300",
  info:    "border-orange-500/30 bg-orange-500/10 text-orange-300",
};

const ICON_COLORS: Record<ToastType, string> = {
  success: "bg-green-500/20 text-green-400",
  error:   "bg-red-500/20 text-red-400",
  info:    "bg-orange-500/20 text-orange-400",
};

export default function Toast({ message, type = "info", visible, onClose, action }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ${COLORS[type]} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${ICON_COLORS[type]}`}>
        {ICONS[type]}
      </div>
      <div className="flex-1 text-sm">
        <p className="font-medium leading-snug text-white">{message}</p>
        {action && (
          <a
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-xs underline opacity-70 hover:opacity-100"
          >
            {action.label} →
          </a>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 shrink-0 text-xs opacity-50 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    action?: { label: string; href: string };
    visible: boolean;
  }>({ message: "", type: "info", visible: false });

  const show = (message: string, type: ToastType = "info", action?: { label: string; href: string }) => {
    setToast({ message, type, action, visible: true });
  };

  const hide = () => setToast(t => ({ ...t, visible: false }));

  return { toast, show, hide };
}
