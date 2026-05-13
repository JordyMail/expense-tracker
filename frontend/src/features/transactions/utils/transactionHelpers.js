// frontend/src/features/transactions/utils/transactionHelpers.js
export const calculateTotalExpense = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateBalance = (transactions) => {
  return calculateTotalIncome(transactions) - calculateTotalExpense(transactions);
};

// Grouping
export const groupByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.date || new Date().toISOString().split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});
};

export const groupByCategory = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const category = transaction.category || 'Uncategorized';
    if (!groups[category]) groups[category] = [];
    groups[category].push(transaction);
    return groups;
  }, {});
};

export const groupByAccount = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const account = transaction.account || 'Cash';
    if (!groups[account]) groups[account] = [];
    groups[account].push(transaction);
    return groups;
  }, {});
};

// Sorting
export const sortByDateDescending = (groupedData) => {
  return Object.keys(groupedData)
    .sort((a, b) => new Date(b) - new Date(a))
    .reduce((obj, key) => {
      obj[key] = [...groupedData[key]].sort((x, y) => y.id - x.id);
      return obj;
    }, {});
};

export const sortByLatestTransaction = (groupedData) => {
  return Object.keys(groupedData)
    .sort((a, b) => {
      const latestA = Math.max(...groupedData[a].map(t => t.id));
      const latestB = Math.max(...groupedData[b].map(t => t.id));
      return latestB - latestA;
    })
    .reduce((obj, key) => {
      obj[key] = [...groupedData[key]].sort((x, y) => y.id - x.id);
      return obj;
    }, {});
};

// Filtering
export const filterBySearchTerm = (transactions, searchTerm) => {
  if (!searchTerm) return transactions;
  return transactions.filter(t => 
    t.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.account.toLowerCase().includes(searchTerm.toLowerCase())
  );
};