"use client";

import { useState, useEffect, useCallback } from "react";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

let toastCounter = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let globalToasts: Toast[] = [];

function broadcast() {
  const snapshot = [...globalToasts];
  listeners.forEach((fn) => fn(snapshot));
}

export function addToast(message: string, type: Toast["type"] = "info", duration = 4000) {
  const id = `t-${++toastCounter}`;
  globalToasts = [...globalToasts, { id, message, type }];
  broadcast();
  setTimeout(() => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    broadcast();
  }, duration);
}

export function useToasts(): Toast[] {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Sync on mount
    setToasts([...globalToasts]);
    const fn = (next: Toast[]) => setToasts(next);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  return toasts;
}
