import { useRef, useEffect, useCallback, useState } from "react";

/**
 * Returns a debounced version of a callback.
 * @param callback The function to debounce
 * @param delay Delay in milliseconds
 */
export function useDebouncedCallback(callback, delay) {
  const timer = useRef(null);

  const debounced = useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return debounced;
}

/**
 * A debounced useState hook.
 * @param {any} defaultValue - Initial state value
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {[any, function]} - [debouncedValue, setterFunction]
 */
export function useDebouncedState(defaultValue, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(defaultValue);
  const valueRef = useRef(defaultValue);
  const timerRef = useRef(null);

  const setValue = useCallback(
    (val) => {
      valueRef.current = val;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setDebouncedValue(val);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return [debouncedValue, setValue];
}
