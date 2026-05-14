// netlify/functions/api.js
let transactions = []; // In-memory storage
let nextId = Date.now();

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Parse path - handle both /api/transactions and /.netlify/functions/api/transactions
  let path = event.path;
  if (path.includes('/.netlify/functions/api')) {
    path = path.replace('/.netlify/functions/api', '');
  }
  if (path.includes('/api')) {
    path = path.replace('/api', '');
  }
  
  const segments = path.split('/').filter(Boolean);

  // GET /api/transactions
  if (event.httpMethod === 'GET' && segments[0] === 'transactions') {
    console.log('GET transactions:', transactions.length);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(transactions)
    };
  }

  // POST /api/transactions
  if (event.httpMethod === 'POST' && segments[0] === 'transactions') {
    try {
      const body = JSON.parse(event.body);
      const newTransaction = {
        id: nextId++,
        ...body,
        amount: parseFloat(body.amount)
      };
      transactions.push(newTransaction);
      console.log('POST transaction:', newTransaction);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newTransaction)
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }
  }

  // DELETE /api/transactions/:id
  if (event.httpMethod === 'DELETE' && segments[0] === 'transactions' && segments[1]) {
    const id = parseInt(segments[1]);
    const initialLength = transactions.length;
    transactions = transactions.filter(t => t.id !== id);
    console.log('DELETE transaction:', id, 'removed:', initialLength !== transactions.length);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  }

  // 404
  console.log('404 Not Found:', event.httpMethod, event.path);
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found', path: event.path, method: event.httpMethod })
  };
};