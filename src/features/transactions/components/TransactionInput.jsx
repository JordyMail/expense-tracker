// expanse-tracker2/src/features/transactions/components/TransactionInput.jsx
import React, { useRef, useEffect } from 'react';
import { ACCOUNT_OPTIONS, CATEGORY_OPTIONS } from '../../shared/utils/constants';
import { useDropdown } from '../../shared/hooks/useDropdown';
import '../../../styles/components/InputSection.css';

const TransactionInput = ({
  formData,
  activeField,
  onSubmit,
  onFieldFocus,
  onFieldChange,
  onDateClick,
  onToggleType,
  onKeyDown
}) => {
  const dateInputRef = useRef(null);
  const accountInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const noteInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const dateFieldRef = useRef(null);

  const {
    showDropdown: showAccountDropdown,
    setShowDropdown: setShowAccountDropdown,
    selectedIndex: selectedAccountIndex,
    ref: accountRef,
    handleSelect: handleAccountSelect,
    handleKeyDown: handleAccountDropdownKeyDown
  } = useDropdown(ACCOUNT_OPTIONS, (option) => {
    onFieldChange('account', option.name);
    onFieldFocus(2);
  });

  const {
    showDropdown: showCategoryDropdown,
    setShowDropdown: setShowCategoryDropdown,
    selectedIndex: selectedCategoryIndex,
    ref: categoryRef,
    handleSelect: handleCategorySelect,
    handleKeyDown: handleCategoryDropdownKeyDown
  } = useDropdown(CATEGORY_OPTIONS, (option) => {
    onFieldChange('category', option.name);
    onFieldFocus(3);
  });

  useEffect(() => {
    if (activeField !== 1) setShowAccountDropdown(false);
    if (activeField !== 2) setShowCategoryDropdown(false);

    if (activeField === 1 && accountInputRef.current) {
      accountInputRef.current.focus();
    } else if (activeField === 2 && categoryInputRef.current) {
      categoryInputRef.current.focus();
    } else if (activeField === 3 && noteInputRef.current) {
      noteInputRef.current.focus();
    } else if (activeField === 4 && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [activeField, setShowAccountDropdown, setShowCategoryDropdown]);

  const getPlaceholder = (fieldIndex, fieldValue) => {
    if (fieldValue) return '';
    if (activeField !== fieldIndex) return '_';
    switch (fieldIndex) {
      case 1: return 'search to select';
      case 2: return 'search to select';
      case 3: return 'add notes';
      case 4: return 'add amount';
      default: return '_';
    }
  };

  const handleAccountChange = (e) => {
    const value = e.target.value;
    const matchedOption = ACCOUNT_OPTIONS.find(
      (opt) => opt.name.toLowerCase() === value.toLowerCase()
    );
    if (matchedOption) {
      onFieldChange('account', matchedOption.name);
    } else if (value === '') {
      onFieldChange('account', '');
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const matchedOption = CATEGORY_OPTIONS.find(
      (opt) => opt.name.toLowerCase() === value.toLowerCase()
    );
    if (matchedOption) {
      onFieldChange('category', matchedOption.name);
    } else if (value === '') {
      onFieldChange('category', '');
    }
  };

  const handleAccountKeyDown = (e) => {
    if (showAccountDropdown) {
      const handled = handleAccountDropdownKeyDown(e);
      if (handled) return;
    }
    if (!showAccountDropdown && activeField === 1 && e.key === 'ArrowDown') {
      e.preventDefault();
      setShowAccountDropdown(true);
      return;
    }
    onKeyDown(e);
  };

  const handleCategoryKeyDown = (e) => {
    if (showCategoryDropdown) {
      const handled = handleCategoryDropdownKeyDown(e);
      if (handled) return;
    }
    if (!showCategoryDropdown && activeField === 2 && e.key === 'ArrowDown') {
      e.preventDefault();
      setShowCategoryDropdown(true);
      return;
    }
    onKeyDown(e);
  };

  return (
    <>
      <div className="input-toolbar">
        <div className="btn-padding">
          <div className={`btn-mode ${formData.type}`} onClick={onToggleType}>
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

      <div className="input-grid">
        <div
          ref={dateFieldRef}
          className={`input-field ${activeField === 0 ? 'active-field' : ''}`}
          onClick={onDateClick}
          style={{ cursor: 'pointer' }}
        >
          <label className="label">DATE</label>
          <input
            ref={dateInputRef}
            type="date"
            className="input-value"
            value={formData.date}
            onChange={(e) => onFieldChange('date', e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => onFieldFocus(0)}
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
              onFieldFocus(1);
              setShowAccountDropdown(true);
            }}
            placeholder={getPlaceholder(1, formData.account)}
          />
          <div
            className={`dropdown-options ${
              showAccountDropdown && activeField === 1 ? 'dropdown-options-show' : ''
            }`}
          >
            {ACCOUNT_OPTIONS.map((option, idx) => (
              <div
                key={option.id}
                className={`dropdown-option ${
                  selectedAccountIndex === idx ? 'active-dropdown' : ''
                }`}
                onClick={() => handleAccountSelect(option, idx)}
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
              onFieldFocus(2);
              setShowCategoryDropdown(true);
            }}
            placeholder={getPlaceholder(2, formData.category)}
          />
          <div
            className={`dropdown-options ${
              showCategoryDropdown && activeField === 2 ? 'dropdown-options-show' : ''
            }`}
          >
            {CATEGORY_OPTIONS.map((option, idx) => (
              <div
                key={option.id}
                className={`dropdown-option ${
                  selectedCategoryIndex === idx ? 'active-dropdown' : ''
                }`}
                onClick={() => handleCategorySelect(option, idx)}
                style={{
                  background: selectedCategoryIndex === idx ? '#f0f0f0' : 'transparent'
                }}
              >
                {option.id} {option.name}
              </div>
            ))}
          </div>
        </div>

        <div className={`input-field ${activeField === 3 ? 'active-field' : ''}`}>
          <label className="label">NOTE</label>
          <input
            ref={noteInputRef}
            type="text"
            className="input-value"
            value={formData.note}
            onChange={(e) => onFieldChange('note', e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => onFieldFocus(3)}
            placeholder={getPlaceholder(3, formData.note)}
          />
        </div>

        <div className={`input-field ${activeField === 4 ? 'active-field' : ''}`}>
          <label className="label">AMOUNT</label>
          <input
            ref={amountInputRef}
            type="number"
            className="input-value"
            value={formData.amount}
            onChange={(e) => onFieldChange('amount', e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => onFieldFocus(4)}
            placeholder={getPlaceholder(4, formData.amount)}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionInput;