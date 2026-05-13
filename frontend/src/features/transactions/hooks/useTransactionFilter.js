// frontend/src/features/transactions/hooks/useTransactionFilter.js
import { useState, useMemo } from 'react';
import {
  groupByDate,
  groupByCategory,
  groupByAccount,
  sortByDateDescending,
  sortByLatestTransaction,
  filterBySearchTerm
} from '../utils/transactionHelpers';

export const useTransactionFilter = (transactions) => {
  const [filterType, setFilterType] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return filterBySearchTerm(transactions, searchTerm);
  }, [transactions, searchTerm]);

  const groupedData = useMemo(() => {
    if (filterType === 'category') {
      const grouped = groupByCategory(filteredTransactions);
      return sortByLatestTransaction(grouped);
    }
    if (filterType === 'account') {
      const grouped = groupByAccount(filteredTransactions);
      return sortByLatestTransaction(grouped);
    }
    const grouped = groupByDate(filteredTransactions);
    return sortByDateDescending(grouped);
  }, [filteredTransactions, filterType]);

  const getGroupTotal = useMemo(() => {
    return (items) => {
      const totalExpense = items.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
      const totalIncome = items.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : 0), 0);
      return {
        total: totalIncome - totalExpense,
        totalIncome,
        totalExpense
      };
    };
  }, []);

  return {
    filterType,
    setFilterType,
    searchTerm,
    setSearchTerm,
    groupedData,
    getGroupTotal
  };
};