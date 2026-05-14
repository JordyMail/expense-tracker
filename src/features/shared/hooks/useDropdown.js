// expanse-tracker2/src/features/shared/hooks/useDropdown.js
import { useState, useEffect, useRef } from 'react';

export const useDropdown = (options, onSelect) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ref = useRef(null);

  const handleSelect = (option, index) => {
    onSelect(option);
    setShowDropdown(false);
    setSelectedIndex(index);
  };

  const handleKeyDown = (e) => {
    if (showDropdown) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(options[selectedIndex], selectedIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowDropdown(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    showDropdown,
    setShowDropdown,
    selectedIndex,
    setSelectedIndex,
    ref,
    handleSelect,
    handleKeyDown
  };
};