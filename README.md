Link testing: https://expense-tracker-hangry.netlify.app/ </br>

Dibuat dengan mempertimbangkan pengembangan aplikasi kedepannya!
struktur ini akan memudahkann dalam:
- code ownership & team scaling (pembagian tugas coding dalam bentuk tim)
- mengatasi lazy loading (hanya load fitur yang diperlukan)
- mudah untuk modular testing
- mudah diextract ke monorepo
- masih terbilang mid level untuk dipelajari (developing)

*note:
- halaman Account, Settings dan juga integrasi user belum dibuat


# Terminal 1 - backend

cd backend


npm install express cors

node server.js

# Terminal 2 - frontend

cd frontend

npm install </br>
npm install lucide-react

npm start
