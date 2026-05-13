// frontend/src/components/Summary.jsx
import React from 'react';
import '../styles/components/Summary.css';
import { 
    ArrowUpRight, 
    ArrowDownRight 
} from 'lucide-react';

const Summary = ({ transactions }) => {
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">EXPENSE <ArrowUpRight size={12}/></span>
        <span className="red">Rp{totalExpense.toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">INCOME <ArrowDownRight size={12}/></span>
        
        <span className="green">Rp{totalIncome.toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">TOTAL</span>
        <span className={balance >= 0 ? 'green' : 'red'}>
          Rp{balance.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default Summary;