// frontend/src/features/transactions/components/TransactionSummary.jsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { calculateTotalExpense, calculateTotalIncome, calculateBalance } from '../utils/transactionHelpers';
import { formatCurrency } from '../../shared/utils/formatters';
import '../../../styles/components/Summary.css';

const TransactionSummary = ({ transactions }) => {
  const totalExpense = calculateTotalExpense(transactions);
  const totalIncome = calculateTotalIncome(transactions);
  const balance = calculateBalance(transactions);

  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">EXPENSE <ArrowUpRight size={12}/></span>
        <span className="red">{formatCurrency(totalExpense)}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">INCOME <ArrowDownRight size={12}/></span>
        <span className="green">{formatCurrency(totalIncome)}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">TOTAL</span>
        <span className={balance >= 0 ? 'green' : 'red'}>
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  );
};

export default TransactionSummary;