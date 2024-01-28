import { useEffect, useRef, useState } from 'react';

export const useSyncedState = (defValue, updateFn, successFn?) => {
  const timeout = useRef<any>(null);
  const [localValue, setLocalValue] = useState(defValue);
  const [loading, setLoading] = useState(false);
  const setValue = async (value) => {
    setLocalValue(value);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      setLoading(true);
      await updateFn(value);
      successFn?.(value);
    }, 1500);
  };

  useEffect(() => {
    setLocalValue(defValue);
    setLoading(false);
  }, [defValue]);

  return [localValue, setValue, { loading }];
};
