# 📦 PasteBox — Full-Stack File Sharing App

A mobile-friendly, full-stack file sharing application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Upload files, get short shareable links and QR codes instantly.

---

## ✨ Features

- **Drag & Drop Upload** — Upload any file up to 100MB
- **Short Links** — Each file gets a unique 8-character short code
- **QR Codes** — Auto-generated QR codes for every file
- **Password Protection** — Optional password lock on files
- **Auto-Expiry** — Files can expire in 1h, 24h, 7d, or 30d
- **Download Limits** — Set max download counts per file
- **Analytics** — Track views and downloads per file
- **User Accounts** — Register/login with JWT authentication
- **Dashboard** — Manage all your files in one place
- **Cloud Storage** — Files stored on Cloudinary
- **Fully Responsive** — Mobile-first UI

---

## 🚀 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, React Router v6         |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB + Mongoose                |
| Storage   | Cloudinary                        |
| Auth      | JWT (JSON Web Tokens)             |
| QR Codes  | `qrcode` npm package              |
| Upload    | Multer + multer-storage-cloudinary|
| UI        | Custom CSS, react-hot-toast       |

---

## 📁 Project Structure

```
pastebox/
├── server/
│   ├── index.js              # Express server entry
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── cloudinary.js     # Cloudinary + Multer setup
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── File.js           # File schema
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   └── routes/
│       ├── auth.js           # Register/Login/Me
│       ├── files.js          # Upload/Download/Delete
│       ├── paste.js          # Short link redirect
│       └── user.js           # Profile/Stats
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.js
│       ├── utils/
│       │   ├── api.js
│       │   └── format.js
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── FileCard.js
│       │   ├── UploadZone.js
│       │   └── StorageBar.js
│       └── pages/
│           ├── Home.js
│           ├── Upload.js
│           ├── Dashboard.js
│           ├── SharePage.js
│           ├── Login.js
│           ├── Register.js
│           └── Profile.js
├── package.json
├── .env.example
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** v16+ ([download](https://nodejs.org))
- **MongoDB** — local install OR free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Cloudinary** — free account at [cloudinary.com](https://cloudinary.com)

---

### Step 1 — Clone & Install

```bash
# In your terminal, navigate to the pastebox folder
cd pastebox

# Install server dependencies
npm install

# Install client dependencies
npm install --prefix client
```

---

### Step 2 — Configure Environment

```bash
# Copy the example env file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development

# MongoDB (local or Atlas)
MONGO_URI=mongodb://localhost:27017/pastebox

# JWT Secret (any long random string)
JWT_SECRET=your_super_secret_key_here

# Cloudinary credentials (from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# URLs
CLIENT_URL=http://localhost:3000
APP_URL=http://localhost:5000
```

#### Getting Cloudinary credentials:
1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy Cloud Name, API Key, API Secret

#### MongoDB Atlas (free cloud DB):
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Click Connect → Get connection string
4. Replace `MONGO_URI` with your Atlas URI

---

### Step 3 — Run the App

```bash
# Run both server and client concurrently
npm run dev
```

---

Live At - https://pastebox-mpx1.onrender.com

---

This starts:
- **Backend** at `http://localhost:5000`
- **Frontend** at `http://localhost:3000`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both server + client (development) |
| `npm run server` | Run only backend (with nodemon) |
| `npm run client` | Run only frontend |
| `npm run build` | Build React for production |
| `npm start` | Run production server |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/upload` | Upload a file |
| GET | `/api/files/my` | Get user's files |
| GET | `/api/files/:shortCode` | Get file info |
| POST | `/api/files/:shortCode/access` | Verify file password |
| POST | `/api/files/:shortCode/download` | Record a download |
| GET | `/api/files/:shortCode/qr` | Get QR code |
| DELETE | `/api/files/:id` | Delete a file |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/stats` | Get user stats |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/password` | Change password |

---

## 🌐 Production Deployment

### Environment
Set `NODE_ENV=production` and update URLs in `.env`.

### Build & Start
```bash
npm run build   # Builds React into client/build
npm start       # Serves both from port 5000
```

### Deploy to Render / Railway / Fly.io
1. Push to GitHub
2. Connect repo to your platform
3. Set all env variables in the platform dashboard
4. Deploy!

---

## 🙏 Built With

- [Express.js](https://expressjs.com) — Backend framework
- [React](https://reactjs.org) — Frontend library
- [Mongoose](https://mongoosejs.com) — MongoDB ODM
- [Cloudinary](https://cloudinary.com) — File storage
- [Multer](https://github.com/expressjs/multer) — File upload middleware
- [nanoid](https://github.com/ai/nanoid) — Short code generation
- [qrcode](https://github.com/soldair/node-qrcode) — QR generation
- [react-dropzone](https://react-dropzone.js.org) — Drag & drop upload
- [react-hot-toast](https://react-hot-toast.com) — Toast notifications

---

**PasteBox** — Share files instantly, beautifully. 🚀
