// expanse-tracker2/src/features/transactions/components/TransactionHeader.jsx
import React from 'react';
import '../../../styles/components/Header.css';

const TransactionHeader = () => {
  return (
    <header>
      <div className="logo">Expense Tracker</div>
      <nav>
        <span className="active">Transaction</span>
        <span>Accounts</span>
        <span>Settings</span>
      </nav>
      <div className="user-profile">
        <div className="avatar-circle"></div>
        Jordy Mail
      </div>
    </header>
  );
};

export default TransactionHeader;