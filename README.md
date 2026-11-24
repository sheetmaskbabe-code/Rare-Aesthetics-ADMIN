# Rare Aesthetics - Dedicated Admin App

A dedicated standalone Admin Portal & Content Management System (CMS) for **My Rare Aesthetics**, connected to the Express backend (`http://localhost:5000`).

## Port Configuration

- **Admin App:** `http://localhost:5174` (configured in `vite.config.ts` to avoid conflict with main website at `5173`)
- **Backend API:** `http://localhost:5000` (auto-proxied via `/api`)
- **Main Website:** `http://localhost:5173`

## Features

1. **Dashboard Overview:** Live metric counters for articles, portfolio projects, client enquiries, and stored media files with real-time MongoDB & Cloudinary infrastructure diagnostics.
2. **Blog CMS:** Create, edit, publish/draft toggle, search, and delete cosmetic science articles with Cloudinary image upload.
3. **Portfolio Showcase:** Manage formulation projects, client work, categories, and homepage feature toggles.
4. **Customer Enquiries & Form Submissions:** Review incoming consultation requests, client details, attachments, change lead statuses (`new`, `contacted`, `in-progress`, `closed`), and save internal team notes.
5. **Home Page CMS:** Dynamic editor for homepage hero CTAs, introductory content, and value propositions.
6. **About Page CMS:** Dynamic editor for founder details (Lindi-Grace), company story, and mission.
7. **Media Asset Library:** Direct file & image upload to Cloudinary/local fallback, URL clipboard copier, and asset deletion.
8. **Settings & Health:** Brand metadata configuration, contact details, and backend service verification.

## How to Run

### 1. Ensure Backend is Running
In terminal 1:
```powershell
cd "C:\skyweb files\rere 1\backend"
npm run dev
```

### 2. Start Admin App
In terminal 2:
```powershell
cd "C:\skyweb files\rere 1\admin"
npm run dev
```

Then open `http://localhost:5174` in your browser.

### Credentials
- **Password:** `Rare1357` (from `backend/.env`)
