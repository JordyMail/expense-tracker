// src/features/transactions/services/transactionService.js
const STORAGE_KEY = 'expense_tracker_transactions';

const getAll = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const save = (transactions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const transactionService = {
  getAll() {
    return Promise.resolve(getAll());
  },

  create(transaction) {
    const transactions = getAll();
    const newTransaction = { ...transaction, id: Date.now() };
    transactions.push(newTransaction);
    save(transactions);
    return Promise.resolve(newTransaction);
  },

  delete(id) {
    const transactions = getAll();
    save(transactions.filter(t => t.id !== id));
    return Promise.resolve({ success: true });
  }
};