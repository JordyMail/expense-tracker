// frontend/src/components/Header.jsx
import React from 'react';
import '../styles/components/Header.css';

const Header = () => {
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

export default Header;