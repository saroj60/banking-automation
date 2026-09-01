# Banking Automation - B2B Technology Products & Solutions Web App

A production-ready responsive B2B web platform and administration workspace for **Banking Automation**, a Nepal-based banking technology and automation products company.

---

## 🌟 Key Features

### 🏢 Customer-Facing Experience
* **Hero Product Showcase**: Composite layout featuring top currency counters, queue terminals, and counterfeit note detectors.
* **Product Catalog (2×2 Mobile Grid)**: Comprehensive filtering by brand, category, counting speed, hopper capacity, and counterfeit detection sensors (UV/MG).
* **Detailed Product Specifications**: Technical parameters matrix, key features, and 1-click WhatsApp quote enquiry.
* **Interactive B2B Quote Request**: Full quotation builder with file attachment upload support.
* **Client Case Studies & Projects**: Sector-wise implementations across banking, healthcare, government, and education sectors.
* **Nepal-Specific Localizations**: Direct WhatsApp routing, NRP currency formats, and local service support coordinates.

### 🛡️ Administration Portal
* **Secure Authentication**: JWT-based session management (`/admin/login`).
* **Products CRUD**: Add, edit, and delete machines with image uploading, spec grid constructor, and feature bullet builders.
* **Categories CRUD**: Manage catalog categories, descriptions, benefits checklists, and Lucide icons.
* **Projects CRUD**: Publish client deployment case studies with scope checklists.
* **B2B Global Settings**: Update company telephone numbers, mobile helplines, WhatsApp chat targets, emails, and Google Maps embed links.
* **Zero-Dependency High Availability**: Powered by an atomic JSON database manager with automatic fallback to static datasets if the backend is offline.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, Lucide React Icons
* **Backend**: Node.js, Express.js, Multer (file uploads), JSON Web Tokens (JWT), bcryptjs
* **Database**: Atomic JSON Database engine (zero external database binary dependencies)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/saroj60/banking-automation.git
cd banking-automation
```

### 2. Install Dependencies
Install frontend and backend dependencies:
```bash
# Install frontend packages
npm install

# Install backend packages
cd server
npm install
cd ..
```

### 3. Run the Development Servers
In two separate terminal windows:

**Terminal 1 (Backend API Server):**
```bash
cd server
node server.js
# API running on http://localhost:5000
```

**Terminal 2 (Frontend React App):**
```bash
npm run dev
# App running on http://localhost:5173
```

---

## 🔑 Admin Credentials (Default)

* **URL**: `http://localhost:5173/admin`
* **Username**: `admin`
* **Password**: `admin123`

*(You can customize these credentials in `server/.env`)*

---

## 📦 Production Build

```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License.
