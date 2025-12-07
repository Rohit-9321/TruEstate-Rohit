# Retail Sales Management System

A full-stack web application to explore and manage retail sales data with advanced search, filtering, sorting and pagination.

## 🏗 Tech Stack

**Frontend**
- React (Vite)
- Axios

**Backend**
- Node.js
- Express
- CSV parsing logic

**Data**
- `sales.csv` (1M sales records)


## Search Implementation Summary

Backend supports full-text, case-insensitive search on `Customer Name` and `Phone Number`. Search is implemented in the service layer and is combined with filters and sorting in a single pipeline.

## Filter Implementation Summary

Multi-select and range filters for customer region, gender, age range, product category, tags, payment method and date range. Filters are parsed from query params and applied in order on the in-memory dataset.

## Sorting Implementation Summary

Sorting is available for Date (Newest First), Quantity, and Customer Name (A–Z). Sorting is applied after filters and search, with configurable ascending/descending order while preserving active filters.

## Pagination Implementation Summary

Backend paginates the filtered & sorted result with a fixed page size of 10 items. Response includes `page`, `pageSize`, `totalItems`, and `totalPages`. Frontend shows Prev/Next while keeping search, filters, and sorting state.

## Setup Instructions


## 📁 Folder Structure

root/
│
├─ backend/
│   ├─ data/
│   │
│   ├─ node_modules/
│   │
│   ├─ src/
│   │   ├─ controllers/
│   │   ├─ models/
│   │   ├─ routes/
│   │   ├─ services/
│   │   ├─ utils/
│   │   └─ index.js
│   │
│   ├─ package-lock.json
│   ├─ package.json
│   └─ README.md
│
├─ docs/
│
├─ frontend/
│   ├─ node_modules/
│   │
│   ├─ public/
│   │
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   ├─ services/
│   │   ├─ styles/
│   │   ├─ App.jsx
│   │   └─ main.jsx
│   │
│   ├─ index.html
│   ├─ package-lock.json
│   ├─ package.json
│   ├─ README.md
│   └─ vite.config.js
│
└─ README.md


---

## ⚙️ Setup Instructions

### 1. Start Backend
```bash
cd backend
npm install
npm run dev


Backend runs at:

http://localhost:4000

2. Start Frontend
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173

API Routes
Endpoint	Description
GET /api/sales        	Fetch paginated & filtered data
GET /api/sales/filters	Fetch distinct dropdown filter values

## 🚀 Features Implemented (As Required)

| Requirement | Status |
|------------|--------|
| Multi-select filters (Region, Gender, Category, Tags, Payment Method) | ✔ Completed |
| Age & Date Range filtering | ✔ Completed |
| Search by Name / Phone No | ✔ Completed |
| Sorting (Date, Customer Name, Quantity) with state retention | ✔ Completed |
| Pagination (10 records per page, retaining filters) | ✔ Completed |
| Summary Cards (Total Units, Total Amount, Total Discount) | ✔ Completed |
| UI matches provided Figma layout (chips, scroll selectors, sidebar, cards) | ✔ Completed |
| Backend CSV processing (10,00,000 rows optimized) | ✔ Completed |
| Filters + results can work independently & combined | ✔ Completed |

---

![image alt]{https://github.com/Rohit-9321/TruEstate-Rohit/blob/f6def29708307da5fd653faa543331e6c9083644/output/WhatsApp%20Image%202025-12-07%20at%2019.41.02.jpeg}
