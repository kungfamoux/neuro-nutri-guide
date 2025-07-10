import { useState, useEffect } from 'react';

export const useProgressBar = (value: number, max: number = 1) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = Math.min(100, (value / max) * 100);
    setProgress(percentage);
  }, [value, max]);

  return {
    progress,
    progressClass: `progress-${Math.floor(progress)}`,
  };
};
