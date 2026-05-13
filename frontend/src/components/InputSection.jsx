// frontend/src/components/InputSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/InputSection.css';

const InputSection = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    account: '',
    category: '',
    note: '',
    amount: '',
    type: 'expense'
  });
  const [activeField, setActiveField] = useState(0);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  
  const accountRef = useRef(null);
  const categoryRef = useRef(null);
  const dateInputRef = useRef(null);
  const accountInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const noteInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const containerRef = useRef(null);
  const dateFieldRef = useRef(null);

  const fields = ['date', 'account', 'category', 'note', 'amount'];

  const accountOptions = [
    { id: 1, name: 'BCA' },
    { id: 2, name: 'BRI' },
    { id: 3, name: 'Mandiri' },
    { id: 4, name: 'Jago' }
  ];

  const categoryOptions = [
    { id: 1, name: 'food' },
    { id: 2, name: 'shopping' }
  ];

  // Helper function to get yesterday's date
  const getYesterday = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    return newDate.toISOString().split('T')[0];
  };

  // Track yesterday stack for multiple Y presses
  const [yesterdayStack, setYesterdayStack] = useState([]);
  const [lastYPressTime, setLastYPressTime] = useState(0);

  // Global keyboard event handler - handle T and Y always when date field is active
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Check if date field is the active field (not necessarily focused input)
      const isDateFieldActive = activeField === 0;
      
      // Handle T and Y only when date field is active
      if (isDateFieldActive) {
        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          const today = new Date().toISOString().split('T')[0];
          setFormData(prev => ({ ...prev, date: today }));
          setYesterdayStack([]);
          return;
        }
        
        if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          const now = Date.now();
          
          if (now - lastYPressTime > 500 || !formData.date) {
            // First press or after delay - start from today
            const yesterday = getYesterday(new Date());
            setFormData(prev => ({ ...prev, date: yesterday }));
            setYesterdayStack([yesterday]);
          } else {
            // Consecutive press within 500ms - go further back
            const lastDate = yesterdayStack[yesterdayStack.length - 1];
            const previousDay = getYesterday(new Date(lastDate));
            setFormData(prev => ({ ...prev, date: previousDay }));
            setYesterdayStack([...yesterdayStack, previousDay]);
          }
          setLastYPressTime(now);
          return;
        }
      }
    };

    // Add global event listener
    window.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [activeField, formData.date, yesterdayStack, lastYPressTime]);

  const handleKeyDown = (e) => {
    // Check for Cmd/Ctrl + Arrow keys
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? e.metaKey : e.ctrlKey;

    // Handle Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift + Tab for backward
        const newField = (activeField - 1 + fields.length) % fields.length;
        setActiveField(newField);
      } else {
        // Tab for forward
        const newField = (activeField + 1) % fields.length;
        setActiveField(newField);
      }
      // Close dropdowns when tabbing
      setShowAccountDropdown(false);
      setShowCategoryDropdown(false);
      return;
    }
    
    // Handle Cmd/Ctrl + Arrow (Back/Fwd)
    if (modifierKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      if (e.key === 'ArrowLeft') {
        // Back
        const newField = (activeField - 1 + fields.length) % fields.length;
        setActiveField(newField);
      } else if (e.key === 'ArrowRight') {
        // Fwd
        const newField = (activeField + 1) % fields.length;
        setActiveField(newField);
      }
      // Close dropdowns
      setShowAccountDropdown(false);
      setShowCategoryDropdown(false);
      return;
    }
    
    // Handle Enter for submit (only if not in dropdown)
    if (e.key === 'Enter' && !showAccountDropdown && !showCategoryDropdown) {
      e.preventDefault();
      handleSubmit();
      return;
    }
  };

  // Handle arrow keys for account dropdown navigation
  const handleAccountKeyDown = (e) => {
    if (showAccountDropdown) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAccountIndex((prev) => 
          prev < accountOptions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAccountIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleAccountSelect(accountOptions[selectedAccountIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowAccountDropdown(false);
      } else {
        handleKeyDown(e);
      }
    } else if (activeField === 1) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setShowAccountDropdown(true);
        setSelectedAccountIndex(0);
      } else {
        handleKeyDown(e);
      }
    } else {
      handleKeyDown(e);
    }
  };

  // Handle arrow keys for category dropdown navigation
  const handleCategoryKeyDown = (e) => {
    if (showCategoryDropdown) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCategoryIndex((prev) => 
          prev < categoryOptions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCategoryIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCategorySelect(categoryOptions[selectedCategoryIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowCategoryDropdown(false);
      } else {
        handleKeyDown(e);
      }
    } else if (activeField === 2) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setShowCategoryDropdown(true);
        setSelectedCategoryIndex(0);
      } else {
        handleKeyDown(e);
      }
    } else {
      handleKeyDown(e);
    }
  };

  const handleSubmit = () => {
    if (formData.amount && formData.date && formData.account && formData.category) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        id: Date.now()
      });
      setFormData({
        date: '',
        account: '',
        category: '',
        note: '',
        amount: '',
        type: 'expense'
      });
      setShowAccountDropdown(false);
      setShowCategoryDropdown(false);
      setSelectedAccountIndex(0);
      setSelectedCategoryIndex(0);
      setYesterdayStack([]);
      setActiveField(0);
    }
  };

  const toggleType = () => {
    setFormData({
      ...formData,
      type: formData.type === 'expense' ? 'income' : 'expense'
    });
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, date: e.target.value });
    setYesterdayStack([]);
  };

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleAccountSelect = (account) => {
    setFormData({ ...formData, account: account.name });
    setShowAccountDropdown(false);
    setSelectedAccountIndex(accountOptions.findIndex(opt => opt.name === account.name));
    setActiveField(2);
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category: category.name });
    setShowCategoryDropdown(false);
    setSelectedCategoryIndex(categoryOptions.findIndex(opt => opt.name === category.name));
    setActiveField(3);
  };

  const handleAccountChange = (e) => {
    const value = e.target.value;
    const matchedOption = accountOptions.find(opt => opt.name.toLowerCase() === value.toLowerCase());
    if (matchedOption) {
      setFormData({ ...formData, account: matchedOption.name });
    } else if (value === '') {
      setFormData({ ...formData, account: '' });
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const matchedOption = categoryOptions.find(opt => opt.name.toLowerCase() === value.toLowerCase());
    if (matchedOption) {
      setFormData({ ...formData, category: matchedOption.name });
    } else if (value === '') {
      setFormData({ ...formData, category: '' });
    }
  };

  const handleFieldFocus = (fieldIndex) => {
    setActiveField(fieldIndex);
  };

  const getPlaceholder = (fieldIndex, fieldValue) => {
    if (fieldValue) return '';
    if (activeField !== fieldIndex) return '_';
    
    switch(fieldIndex) {
      case 1:
        return 'search to select';
      case 2:
        return 'search to select';
      case 3:
        return 'add notes';
      case 4:
        return 'add amount';
      default:
        return '_';
    }
  };

  // Focus date field when activeField becomes 0
  useEffect(() => {
    if (activeField !== 1) {
      setShowAccountDropdown(false);
    }
    if (activeField !== 2) {
      setShowCategoryDropdown(false);
    }
    
    if (activeField === 0) {
      // Focus the date field container or keep it active
      // No need to focus hidden input, just keep visual active state
      if (dateFieldRef.current) {
        dateFieldRef.current.style.cursor = 'pointer';
      }
    } else if (activeField === 1 && accountInputRef.current) {
      accountInputRef.current.focus();
    } else if (activeField === 2 && categoryInputRef.current) {
      categoryInputRef.current.focus();
    } else if (activeField === 3 && noteInputRef.current) {
      noteInputRef.current.focus();
    } else if (activeField === 4 && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [activeField]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="input-toolbar">
        <div className='btn-padding'>
            <div className={`btn-mode ${formData.type}`} onClick={toggleType}>
            {formData.type === 'expense' ? 'Expense' : 'Income'}
            </div>
        </div>
        <div className="shortcuts">
            <div className="shortcut-divider"></div>
          <span><span className="key">Tab</span> Next</span>
          <span><span className="key">Enter</span> Submit</span>
          <div className="shortcut-divider"></div>
          <span><span className="key">⌘←</span> Back</span>
          <span><span className="key">⌘→</span> Fwd</span>
          <div className="shortcut-divider"></div>
          <span><span className="key">T</span> Today</span>
          <span><span className="key">Y</span> Yesterday</span>
        </div>
      </div>

      <div className="input-grid" ref={containerRef}>
        <div 
          ref={dateFieldRef}
          className={`input-field ${activeField === 0 ? 'active-field' : ''}`}
          onClick={handleDateClick}
          style={{ cursor: 'pointer' }}
        >
          <label className="label">DATE</label>
          <input
            ref={dateInputRef}
            type="date"
            className="input-value"
            value={formData.date}
            onChange={handleDateChange}
            onKeyDown={handleKeyDown}
            onFocus={() => handleFieldFocus(0)}
            style={{ 
              position: 'absolute', 
              opacity: 0, 
              width: '100%', 
              height: '100%',
              cursor: 'pointer',
              zIndex: 1,
              top: 0,
              left: 0
            }}
          />
          <div className="calendar-value">
            {formData.date || (activeField === 0 ? '' : '_')}
          </div>
        </div>

        <div 
          className={`input-field ${activeField === 1 ? 'active-field' : ''}`}
          ref={accountRef}
        >
          <label className="label">ACCOUNT</label>
          <input
            ref={accountInputRef}
            type="text"
            className="input-value"
            value={formData.account}
            onChange={handleAccountChange}
            onKeyDown={handleAccountKeyDown}
            onFocus={() => {
              handleFieldFocus(1);
              setShowAccountDropdown(true);
              setSelectedAccountIndex(0);
            }}
            placeholder={getPlaceholder(1, formData.account)}
          />
          <div className={`dropdown-options ${showAccountDropdown && activeField === 1 ? 'dropdown-options-show' : ''}`}>
            {accountOptions.map((option, idx) => (
              <div 
                key={option.id}
                className={`dropdown-option ${selectedAccountIndex === idx ? 'active-dropdown' : ''}`}
                onClick={() => handleAccountSelect(option)}
                style={{
                  background: selectedAccountIndex === idx ? '#f0f0f0' : 'transparent'
                }}
              >
                {option.id} {option.name}
              </div>
            ))}
          </div>
        </div>

        <div 
          className={`input-field ${activeField === 2 ? 'active-field' : ''}`}
          ref={categoryRef}
        >
          <label className="label">CATEGORY</label>
          <input
            ref={categoryInputRef}
            type="text"
            className="input-value"
            value={formData.category}
            onChange={handleCategoryChange}
            onKeyDown={handleCategoryKeyDown}
            onFocus={() => {
              handleFieldFocus(2);
              setShowCategoryDropdown(true);
              setSelectedCategoryIndex(0);
            }}
            placeholder={getPlaceholder(2, formData.category)}
          />
          <div className={`dropdown-options ${showCategoryDropdown && activeField === 2 ? 'dropdown-options-show' : ''}`}>
            {categoryOptions.map((option, idx) => (
              <div 
                key={option.id}
                className={`dropdown-option ${selectedCategoryIndex === idx ? 'active-dropdown' : ''}`}
                onClick={() => handleCategorySelect(option)}
                style={{
                  background: selectedCategoryIndex === idx ? '#f0f0f0' : 'transparent'
                }}
              >
                {option.id} {option.name}
              </div>
            ))}
          </div>
        </div>

        <div 
          className={`input-field ${activeField === 3 ? 'active-field' : ''}`}
        >
          <label className="label">NOTE</label>
          <input
            ref={noteInputRef}
            type="text"
            className="input-value"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            onKeyDown={handleKeyDown}
            onFocus={() => handleFieldFocus(3)}
            placeholder={getPlaceholder(3, formData.note)}
          />
        </div>

        <div 
          className={`input-field ${activeField === 4 ? 'active-field' : ''}`}
        >
          <label className="label">AMOUNT</label>
          <input
            ref={amountInputRef}
            type="number"
            className="input-value"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            onKeyDown={handleKeyDown}
            onFocus={() => handleFieldFocus(4)}
            placeholder={getPlaceholder(4, formData.amount)}
          />
        </div>
      </div>
    </>
  );
};

export default InputSection;