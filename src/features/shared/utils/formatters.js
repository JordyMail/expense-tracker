// expanse-tracker2/src/features/shared/utils/formatters.js
export const formatCurrency = (amount) => {
  return `Rp${amount.toLocaleString()}`;
};

export const formatDateHeader = (dateString) => {
  const today = new Date().toISOString().split('T')[0];
  if (dateString === today) {
    return 'TODAY';
  }
  return dateString;
};

export const getYesterday = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - 1);
  return newDate.toISOString().split('T')[0];
};