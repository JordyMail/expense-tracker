Link testing:
*deploy via 

Dibuat dengan mempertimbangkan pengembangan aplikasi kedepannya!
struktur ini akan memudahkann dalam:
- code ownership & team scaling (pembagian tugas coding dalam bentuk tim)
- mengatasi lazy loading (hanya load fitur yang diperlukan)
- mudah untuk modular testing
- mudah diextract ke monorepo
- masih terbilang mid level untuk dipelajari (developing)

*note:
- halaman Account, Settings dan juga integrasi user belum dibuat


# struktur

```bash
expense-tracker/
│
├── frontend/                                    # Frontend React application
│   ├── public/
│   │   ├── index.html                           # HTML template utama
│   │   └── favicon.ico                          # Icon browser tab
│   │
│   ├── src/
│   │   ├── features/                            # FITUR UTAMA (Modular)
│   │   │   │
│   │   │   ├── transactions/                    # FITUR TRANSACTION (core feature)
│   │   │   │   ├── components/                  # UI Components untuk transaction
│   │   │   │   │   ├── TransactionHeader.jsx    # Header dengan logo & navigasi
│   │   │   │   │   ├── TransactionInput.jsx     # Form input transaksi (date, account, category, note, amount)
│   │   │   │   │   ├── TransactionSummary.jsx   # Menampilkan total expense, income, balance
│   │   │   │   │   └── TransactionList.jsx      # Daftar transaksi dengan filter & search
│   │   │   │   │
│   │   │   │   ├── hooks/                       # Custom hooks untuk transaction logic
│   │   │   │   │   ├── useTransactions.js       # Fetch, add, delete transaksi (API calls)
│   │   │   │   │   ├── useTransactionForm.js    # Form state & logic (date, type, etc)
│   │   │   │   │   └── useTransactionFilter.js  # Filter & grouping logic (date/category/account)
│   │   │   │   │
│   │   │   │   ├── services/                    # API communication
│   │   │   │   │   └── transactionService.js    # HTTP requests ke backend
│   │   │   │   │
│   │   │   │   ├── utils/                       # Helper functions
│   │   │   │   │   └── transactionHelpers.js    # Calculate, group, sort, filter transactions
│   │   │   │   │
│   │   │   │   └── index.js                     # Public exports untuk transactions feature
│   │   │   │
│   │   │   └── shared/                          # SHARED RESOURCES (reusable across features)
│   │   │       ├── hooks/                       # Shared custom hooks
│   │   │       │   ├── useKeyboardNavigation.js # Keyboard navigation (Tab, Cmd+Arrow)
│   │   │       │   ├── useDropdown.js           # Dropdown state & keyboard handling
│   │   │       │   └── useAnimation.js          # Animation trigger untuk new transactions
│   │   │       │
│   │   │       ├── utils/                       # Shared utilities
│   │   │       │   ├── constants.js             # ACCOUNT_OPTIONS, CATEGORY_OPTIONS, FORM_FIELDS
│   │   │       │   ├── formatters.js            # formatCurrency, formatDateHeader, getYesterday
│   │   │       │   └── validators.js            # Validation functions (future use)
│   │   │       │
│   │   │       └── api/                         # API configuration
│   │   │           └── client.js                # Fetch wrapper with base URL
│   │   │
│   │   ├── pages/                               # PAGE COMPONENTS
│   │   │   └── TransactionPage.jsx              # Halaman utama yang meng-compose semua komponen
│   │   │
│   │   ├── styles/                              # CSS STYLES
│   │   │   ├── global.css                       # Global styles & CSS variables
│   │   │   ├── components/                      # Component-specific styles
│   │   │   │   ├── Header.css                   # Styling untuk header
│   │   │   │   ├── InputSection.css             # Styling untuk form input & dropdown
│   │   │   │   ├── Summary.css                  # Styling untuk summary bar
│   │   │   │   └── TransactionList.css          # Styling untuk transaction list
│   │   │   └── pages/                           # Page-specific styles
│   │   │       └── TransactionPage.css          # Styling untuk halaman (loading state)
│   │   │
│   │   ├── App.js                               # Root component (render TransactionPage)
│   │   ├── index.js                             # Entry point (render React ke DOM)
│   │   └── reportWebVitals.js                   # Performance monitoring (Web Vitals)
│   │
│   ├── package.json                             # Frontend dependencies & scripts
│   ├── package-lock.json                        # Lock file for dependencies
│   └── README.md                                # Frontend documentation
│
├── backend/                                     # BACKEND SERVER (Express.js)
│   ├── server.js                                # Main server file (routes & logic)
│   ├── package.json                             # Backend dependencies & scripts
│   ├── package-lock.json                        # Lock file for dependencies
│   └── README.md                                # Backend documentation
│
└── README.md                                    # Root documentation

```

# Terminal 1 - backend

cd backend


npm install express cors

node server.js

# Terminal 2 - frontend

cd frontend

npm install
npm install lucide-react

npm start
