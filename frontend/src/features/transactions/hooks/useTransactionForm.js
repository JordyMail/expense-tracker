// frontend/src/features/transactions/hooks/useTransactionForm.js
import { useState, useCallback } from 'react';
import { getYesterday } from '../../shared/utils/formatters';

export const useTransactionForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    account: '',
    category: '',
    note: '',
    amount: '',
    type: 'expense'
  });
  const [yesterdayStack, setYesterdayStack] = useState([]);
  const [lastYPressTime, setLastYPressTime] = useState(0);

  const toggleType = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      type: prev.type === 'expense' ? 'income' : 'expense'
    }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setFormData(prev => ({ ...prev, date }));
    setYesterdayStack([]);
  }, []);

  const handleTodayPress = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
    setYesterdayStack([]);
  }, []);

  const handleYesterdayPress = useCallback(() => {
    const now = Date.now();
    
    if (now - lastYPressTime > 500 || !formData.date) {
      const yesterday = getYesterday(new Date());
      setFormData(prev => ({ ...prev, date: yesterday }));
      setYesterdayStack([yesterday]);
    } else {
      const lastDate = yesterdayStack[yesterdayStack.length - 1];
      const previousDay = getYesterday(new Date(lastDate));
      setFormData(prev => ({ ...prev, date: previousDay }));
      setYesterdayStack([...yesterdayStack, previousDay]);
    }
    setLastYPressTime(now);
  }, [formData.date, yesterdayStack, lastYPressTime]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      date: '',
      account: '',
      category: '',
      note: '',
      amount: '',
      type: 'expense'
    });
    setYesterdayStack([]);
  }, []);

  const prepareSubmitData = useCallback(() => {
    if (!formData.amount || !formData.date || !formData.account || !formData.category) {
      return null;
    }
    return {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now()
    };
  }, [formData]);

  return {
    formData,
    toggleType,
    handleDateChange,
    handleTodayPress,
    handleYesterdayPress,
    updateField,
    resetForm,
    prepareSubmitData
  };
};