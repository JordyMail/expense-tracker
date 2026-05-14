// expanse-tracker2/src/features/transactions/components/TransactionList.jsx
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { formatCurrency, formatDateHeader } from '../../shared/utils/formatters';
import { useAnimation } from '../../shared/hooks/useAnimation';
import '../../../styles/components/TransactionList.css';

const TransactionList = ({ 
  transactions, 
  filterType, 
  setFilterType, 
  searchTerm, 
  setSearchTerm,
  groupedData,
  getGroupTotal,
  onDelete 
}) => {
  const animatedId = useAnimation(transactions.length > 0 ? transactions[transactions.length - 1]?.id : null, 500);

  const renderTransactions = (items) => {
    return items.map(transaction => (
      <div 
        key={transaction.id} 
        className={`transaction-card ${animatedId === transaction.id ? 'transaction-card-new' : ''}`}
      >
        <div className="icon-circle">
          {transaction.type === 'expense' ? (
            <ArrowUpRight size={18} className="icon-arrow-up" />
          ) : (
            <ArrowDownLeft size={18} className="icon-arrow-down" />
          )}
        </div>
        <div className="details">
          <div className="details-top">
            <span style={{ color: '#1a73e8' }}>{transaction.account || 'Cash'}</span> 
            {' / '}{transaction.category}
          </div>
          <div className="details-bottom">{transaction.note}</div>
        </div>
        <div className={`amount ${transaction.type === 'income' ? 'green' : 'red'}`}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>
        <button 
          className="delete-btn"
          onClick={() => onDelete(transaction.id)}
        >
          ×
        </button>
      </div>
    ));
  };

  const renderGroupedList = () => {
    if (Object.keys(groupedData).length === 0) {
      return <div className="empty-state">No transactions found</div>;
    }

    return Object.entries(groupedData).map(([groupName, items]) => {
      const { total } = getGroupTotal(items);
      const displayName = filterType === 'date' ? formatDateHeader(groupName) : groupName;
      
      return (
        <div key={groupName}>
          <div className="date-header">
            <span>{displayName}</span>
            <span className={total >= 0 ? 'green' : 'red'}>
              {total >= 0 ? '+' : ''}{total !== 0 ? formatCurrency(Math.abs(total)) : 'Rp0'}
            </span>
          </div>
          {renderTransactions(items)}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="tabs">
          <div 
            className={`tab ${filterType === 'date' ? 'active' : ''}`}
            onClick={() => setFilterType('date')}
          >
            By Date
          </div>
          <div 
            className={`tab ${filterType === 'category' ? 'active' : ''}`}
            onClick={() => setFilterType('category')}
          >
            By Category
          </div>
          <div 
            className={`tab ${filterType === 'account' ? 'active' : ''}`}
            onClick={() => setFilterType('account')}
          >
            By Account
          </div>
        </div>

        <div className="search-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-box"
            placeholder="Search transaction"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="list-section">
        {renderGroupedList()}
      </div>
    </div>
  );
};

export default TransactionList;