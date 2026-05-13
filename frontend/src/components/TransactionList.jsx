// frontend/src/components/TransactionList.jsx
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Search, Calendar, FolderKanban, CreditCard } from 'lucide-react';
import '../styles/components/TransactionList.css';

const TransactionList = ({ transactions, onDelete }) => {
  const [filterType, setFilterType] = useState('date'); // 'date', 'category', 'account'
  const [searchTerm, setSearchTerm] = useState('');
  const [newTransactionId, setNewTransactionId] = useState(null);

  // Detect new transaction and trigger animation
  useEffect(() => {
    if (transactions.length > 0) {
      const latestTransaction = transactions[transactions.length - 1];
      setNewTransactionId(latestTransaction.id);
      
      // Remove highlight after animation completes
      const timer = setTimeout(() => {
        setNewTransactionId(null);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [transactions]);

  // Format date to display
  const formatDateHeader = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateString === today) {
      return 'TODAY';
    }
    return dateString;
  };

  // Urutkan transaksi dari terbaru ke terlama berdasarkan ID (timestamp)
  // ID adalah Date.now() yang merupakan timestamp lengkap dalam milidetik
  const sortedTransactions = [...transactions].sort((a, b) => {
    return b.id - a.id; // Terbaru (ID lebih besar) di atas
  });

  const filteredTransactions = sortedTransactions.filter(t => {
    // Apply search filter
    const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.account.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Group by date for date filter view (sorted by date descending)
  const groupedByDate = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date || new Date().toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Sort dates descending (terbaru ke terlama)
  const sortedGroupedByDate = Object.keys(groupedByDate)
    .sort((a, b) => new Date(b) - new Date(a))
    .reduce((obj, key) => {
      // Urutkan items di dalam setiap group berdasarkan ID (timestamp) terbaru di atas
      obj[key] = [...groupedByDate[key]].sort((x, y) => y.id - x.id);
      return obj;
    }, {});

  // Group by category for category filter view
  const groupedByCategory = filteredTransactions.reduce((groups, transaction) => {
    const category = transaction.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(transaction);
    return groups;
  }, {});

  // Sort categories by latest transaction ID (most recent first)
  const sortedGroupedByCategory = Object.keys(groupedByCategory)
    .sort((a, b) => {
      const latestA = Math.max(...groupedByCategory[a].map(t => t.id));
      const latestB = Math.max(...groupedByCategory[b].map(t => t.id));
      return latestB - latestA;
    })
    .reduce((obj, key) => {
      // Urutkan items di dalam setiap category dari terbaru ke terlama berdasarkan ID
      obj[key] = [...groupedByCategory[key]].sort((x, y) => y.id - x.id);
      return obj;
    }, {});

  // Group by account for account filter view
  const groupedByAccount = filteredTransactions.reduce((groups, transaction) => {
    const account = transaction.account || 'Cash';
    if (!groups[account]) {
      groups[account] = [];
    }
    groups[account].push(transaction);
    return groups;
  }, {});

  // Sort accounts by latest transaction ID (most recent first)
  const sortedGroupedByAccount = Object.keys(groupedByAccount)
    .sort((a, b) => {
      const latestA = Math.max(...groupedByAccount[a].map(t => t.id));
      const latestB = Math.max(...groupedByAccount[b].map(t => t.id));
      return latestB - latestA;
    })
    .reduce((obj, key) => {
      // Urutkan items di dalam setiap account dari terbaru ke terlama berdasarkan ID
      obj[key] = [...groupedByAccount[key]].sort((x, y) => y.id - x.id);
      return obj;
    }, {});

  const getCurrentGroupedData = () => {
    if (filterType === 'category') return sortedGroupedByCategory;
    if (filterType === 'account') return sortedGroupedByAccount;
    return sortedGroupedByDate;
  };

  const getGroupHeader = (groupName) => {
    const items = getCurrentGroupedData()[groupName];
    const totalExpense = items.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
    const totalIncome = items.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : 0), 0);
    const total = totalIncome - totalExpense;
    return { total, totalIncome, totalExpense };
  };

  const renderTransactions = (items) => {
    return items.map(transaction => (
      <div 
        key={transaction.id} 
        className={`transaction-card ${newTransactionId === transaction.id ? 'transaction-card-new' : ''}`}
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
          {transaction.type === 'income' ? '+' : '-'}Rp{transaction.amount.toLocaleString()}
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
    const groupedData = getCurrentGroupedData();
    
    if (Object.keys(groupedData).length === 0) {
      return <div className="empty-state">No transactions found</div>;
    }

    return Object.entries(groupedData).map(([groupName, items]) => {
      const { total, totalIncome } = getGroupHeader(groupName);
      
      // For date filter, display formatted date (TODAY if current date)
      const displayName = filterType === 'date' ? formatDateHeader(groupName) : groupName;
      
      // Calculate total balance for the group (income - expense)
      const totalBalance = total;
      
      return (
        <div key={groupName}>
          <div className="date-header">
            <span>{displayName}</span>
            <span className={totalBalance >= 0 ? 'green' : 'red'}>
              {totalBalance >= 0 ? '+' : ''}{totalBalance !== 0 ? `Rp${Math.abs(totalBalance).toLocaleString()}` : 'Rp0'}
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
            {/* <Calendar size={12} style={{ marginRight: '4px' }} /> */}
            By Date
          </div>
          <div 
            className={`tab ${filterType === 'category' ? 'active' : ''}`}
            onClick={() => setFilterType('category')}
          >
            {/* <FolderKanban size={12} style={{ marginRight: '4px' }} /> */}
            By Category
          </div>
          <div 
            className={`tab ${filterType === 'account' ? 'active' : ''}`}
            onClick={() => setFilterType('account')}
          >
            {/* <CreditCard size={12} style={{ marginRight: '4px' }} /> */}
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