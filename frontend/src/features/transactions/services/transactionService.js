// frontend/src/features/transactions/services/transactionService.js
import { apiClient } from '../../shared/api/client';

export const transactionService = {
  getAll() {
    return apiClient.get('/transactions');
  },

  create(transaction) {
    return apiClient.post('/transactions', transaction);
  },

  delete(id) {
    return apiClient.delete(`/transactions/${id}`);
  }
};