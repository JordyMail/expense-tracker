// expanse-tracker2/src/pages/TransactionPage.jsx
import React, { useEffect } from 'react';
import {
  TransactionHeader,
  TransactionInput,
  TransactionSummary,
  TransactionList,
  useTransactions,
  useTransactionForm,
  useTransactionFilter
} from '../features/transactions';
import { useKeyboardNavigation } from '../features/shared/hooks/useKeyboardNavigation';
import { FORM_FIELDS } from '../features/shared/utils/constants';
import '../styles/pages/TransactionPage.css';

const TransactionPage = () => {
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();
  const {
    formData,
    toggleType,
    handleTodayPress,
    handleYesterdayPress,
    updateField,
    resetForm,
    prepareSubmitData
  } = useTransactionForm();

  const { filterType, setFilterType, searchTerm, setSearchTerm, groupedData, getGroupTotal } =
    useTransactionFilter(transactions);

  const { activeField, handleKeyDown, setActiveFieldManually } = useKeyboardNavigation(
    FORM_FIELDS.length,
    undefined
  );

  // Global keyboard handlers for T and Y
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (activeField === 0) {
        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          handleTodayPress();
        } else if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          handleYesterdayPress();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeField, handleTodayPress, handleYesterdayPress]);

  const handleSubmit = () => {
    const submitData = prepareSubmitData();
    if (submitData) {
      addTransaction(submitData);
      resetForm();
      setActiveFieldManually(0);
    }
  };

  const handleFormKeyDown = (e) => {
    const isDropdownOpen = document.querySelector('.dropdown-options-show');
    if (e.key === 'Enter' && !isDropdownOpen) {
      e.preventDefault();
      handleSubmit();
    }
    handleKeyDown(e);
  };

  const handleDateClick = () => {
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) dateInput.showPicker();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <TransactionHeader />
      <div className="container">
        <TransactionInput
          formData={formData}
          activeField={activeField}
          onSubmit={handleSubmit}
          onFieldFocus={setActiveFieldManually}
          onFieldChange={updateField}
          onDateClick={handleDateClick}
          onToggleType={toggleType}
          onKeyDown={handleFormKeyDown}
        />
        <TransactionSummary transactions={transactions} />
        <TransactionList
          transactions={transactions}
          filterType={filterType}
          setFilterType={setFilterType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          groupedData={groupedData}
          getGroupTotal={getGroupTotal}
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  );
};

export default TransactionPage;