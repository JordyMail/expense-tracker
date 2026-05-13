const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Data awal
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

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/transactions`);
});