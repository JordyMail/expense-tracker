// frontend/src/pages/TransactionPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import Summary from '../components/Summary';
import TransactionList from '../components/TransactionList';
import '../styles/pages/TransactionPage.css';

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch transactions from backend
    fetch('http://localhost:5001/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      });
  }, []);

  const addTransaction = (newTransaction) => {
    fetch('http://localhost:5001/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    })
      .then(res => res.json())
      .then(data => {
        setTransactions([...transactions, data]);
      })
      .catch(err => console.error('Error adding transaction:', err));
  };

  const deleteTransaction = (id) => {
    fetch(`http://localhost:5001/api/transactions/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTransactions(transactions.filter(t => t.id !== id));
      })
      .catch(err => console.error('Error deleting transaction:', err));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="container">
        <InputSection onSubmit={addTransaction} />
        <Summary transactions={transactions} />
        <TransactionList 
          transactions={transactions} 
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  );
};

export default TransactionPage;