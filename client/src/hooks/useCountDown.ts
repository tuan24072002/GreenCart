import { useState, useEffect, useCallback } from "react";

export function useCountdown(key: string, duration: number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const t0 = localStorage.getItem(key);
    if (t0) {
      const delta = Math.floor((Date.now() - +t0) / 1000);
      if (delta < duration) setRemaining(duration - delta);
      else localStorage.removeItem(key);
    }
  }, [key, duration]);

  useEffect(() => {
    if (!remaining) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    if (remaining === 1) localStorage.removeItem(key);
    return () => clearTimeout(id);
  }, [remaining, key]);

  const start = useCallback(() => {
    localStorage.setItem(key, Date.now().toString());
    setRemaining(duration);
  }, [key, duration]);

  return [remaining, start] as const;
}
