import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setLoading(false);
    }
  };

  const addTransaction = async (newTransaction) => {
    try {
      const data = await transactionService.create(newTransaction);
      setTransactions([...transactions, data]);
      return data;
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.delete(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction
  };
};