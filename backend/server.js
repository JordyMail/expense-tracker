// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory data store
let transactions = [];

// Routes
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
  const newTransaction = {
    id: Date.now(),
    ...req.body
  };
  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  transactions = transactions.filter(t => t.id !== parseInt(id));
  res.status(200).json({ message: 'Transaction deleted' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});