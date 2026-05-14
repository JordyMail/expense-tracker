// expanse-tracker2/src/features/shared/hooks/useKeyboardNavigation.js
import { useState } from 'react';

export const useKeyboardNavigation = (fieldsCount, onFieldChange) => {
  const [activeField, setActiveField] = useState(0);

  const handleKeyDown = (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? e.metaKey : e.ctrlKey;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const newField = (activeField - 1 + fieldsCount) % fieldsCount;
        setActiveField(newField);
        onFieldChange?.(newField);
      } else {
        const newField = (activeField + 1) % fieldsCount;
        setActiveField(newField);
        onFieldChange?.(newField);
      }
      return;
    }

    if (modifierKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      if (e.key === 'ArrowLeft') {
        const newField = (activeField - 1 + fieldsCount) % fieldsCount;
        setActiveField(newField);
        onFieldChange?.(newField);
      } else {
        const newField = (activeField + 1) % fieldsCount;
        setActiveField(newField);
        onFieldChange?.(newField);
      }
      return;
    }
  };

  const setActiveFieldManually = (fieldIndex) => {
    setActiveField(fieldIndex);
    onFieldChange?.(fieldIndex);
  };

  return { activeField, handleKeyDown, setActiveFieldManually };
};