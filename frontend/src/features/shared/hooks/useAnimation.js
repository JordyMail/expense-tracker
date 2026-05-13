// frontend/src/features/shared/hooks/useAnimation.js
import { useState, useEffect } from 'react';

export const useAnimation = (trigger, duration = 500) => {
  const [animatedId, setAnimatedId] = useState(null);

  useEffect(() => {
    if (trigger) {
      setAnimatedId(trigger);
      const timer = setTimeout(() => {
        setAnimatedId(null);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return animatedId;
};