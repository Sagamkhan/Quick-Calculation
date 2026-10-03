import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. typing in inputs).
 * Prevents heavy calculations from choking the main thread on every single keystroke.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
