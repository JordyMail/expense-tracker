// expanse-tracker2/src/features/shared/api/client.js
// API Client dengan environment variable untuk production
const API_BASE_URL = '';  // Biarkan kosong untuk production

export const apiClient = {
  async get(endpoint) {
    // Pastikan endpoint dimulai dengan /api/
    const url = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
    console.log('GET Request to:', url);  // Tambahkan log untuk debugging
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async post(endpoint, data) {
    const url = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
    console.log('POST Request to:', url, data);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async delete(endpoint) {
    const url = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
    console.log('DELETE Request to:', url);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }
};