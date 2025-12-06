<div align="center">

# 🚗💨 Ride Pool

### *Campus Transportation Solution That Moves Together*

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Share+Rides.+Save+Money.+Stay+Safe.;Connect+With+Campus+Community;Real-Time+Chat+%26+Coordination;Verified+Students+Only" alt="Typing SVG" />

---

[![Made with React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

</div>

---

## 🌟 What Makes Ride Pool Special?

<table>
<tr>
<td width="50%">

### 🤝 **Community-Driven**
Connect with verified students traveling your route. Build campus connections while splitting costs!

### 💰 **Cost Effective**
Split cab fares among 3-4 students. Save up to **75%** on transportation costs.

</td>
<td width="50%">

### 🔒 **Verified & Safe**
College email verification + optional student ID upload ensures you ride with real students only.

### ⚡ **Real-Time Updates**
Live chat, instant notifications, and real-time seat availability tracking.

</td>
</tr>
</table>

---

<div align="center">

## 🎯 How It Works

```mermaid
graph LR
    A[🎓 Create Account] --> B[🔍 Find/Create Group]
    B --> C[💬 Chat & Coordinate]
    C --> D[💳 Split Payment]
    D --> E[🚗 Share Ride]
    style A fill:#8b5cf6
    style B fill:#6366f1
    style C fill:#3b82f6
    style D fill:#10b981
    style E fill:#f59e0b
```

</div>

---

## ✨ Key Features

<details open>
<summary><b>👥 Smart Group Ride Pooling</b></summary>

<br>

- 🎯 **Route Matching** - Find students going your way
- 🕐 **Time Coordination** - Match departure schedules  
- 👤 **4-Seat Capacity** - Perfect for standard cabs
- 🏷️ **Custom Groups** - Name your ride crew
- 🔔 **Auto Notifications** - Never miss your ride

</details>

<details>
<summary><b>💬 Real-Time Group Chat</b></summary>

<br>

- 💭 Live messaging with Socket.IO
- 📍 Share live locations instantly
- 🚕 Post cab numbers and details
- ⏰ Coordinate pickup times
- 📸 Share photos (coming soon)

</details>

<details>
<summary><b>💳 UPI Payment Tracking</b></summary>

<br>

> **No Payment Gateway Fees!** Direct UPI transfers between students.

```
┌─────────────────────────────────────┐
│  Group Creator Posts:               │
│  • UPI QR Code                      │
│  • UPI ID (e.g., name@paytm)       │
│  • Per-Person Cost                  │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Members:                           │
│  1. Click "Pay Now"                 │
│  2. UPI app opens automatically     │
│  3. Complete payment                │
│  4. Mark "I Have Paid"              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Creator Verifies Payment ✅        │
│  • Status: Verified                 │
│  • Seat Confirmed                   │
└─────────────────────────────────────┘
```

**Payment Status Tracking:**
- ⏳ Pending
- ✅ Verified  
- ❌ Cancelled
- 🔄 Refund Requested

</details>

<details>
<summary><b>🗺️ Smart Location Tools</b></summary>

<br>

- 🌍 **Geoapify Integration** - Accurate address autocomplete
- 🏫 **Campus Presets** - Quick-select popular locations
- 📍 **Live Maps** - Visual route planning
- 🎯 **Pickup Points** - Set exact meeting spots

</details>

<details>
<summary><b>🔐 Verification & Safety</b></summary>

<br>

| Feature | Description |
|---------|-------------|
| 📧 College Email | Mandatory .edu verification |
| 🆔 Student ID | Optional upload for trust |
| 👮 Admin Monitoring | Fraud detection system |
| 🚫 Block/Report | User safety controls |
| ⭐ Rating System | Post-ride feedback |

</details>

---

<div align="center">

## 🛠️ Tech Stack

</div>

### 🎨 **Frontend Arsenal**

```javascript
const frontend = {
  framework: "React 18 + TypeScript",
  styling: "Tailwind CSS v4 + Custom Animations",
  routing: "React Router v6",
  state: "Context API + Zustand",
  http: "Axios",
  realtime: "Socket.IO Client",
  build: "Vite ⚡",
  features: ["Dark Mode", "Responsive Design", "PWA Ready"]
};
```

### ⚙️ **Backend Power**

```javascript
const backend = {
  runtime: "Node.js 18+",
  framework: "Express.js + TypeScript",
  database: "MongoDB + Mongoose ODM",
  authentication: "JWT + Bcrypt",
  realtime: "Socket.IO",
  validation: "Joi",
  security: ["Helmet", "CORS", "Rate Limiting"],
  apis: ["Geoapify Maps", "Email Service"]
};
```

### ☁️ **Infrastructure**

| Service | Purpose | Provider |
|---------|---------|----------|
| 🗄️ Database | MongoDB Atlas | Cloud |
| 🌐 Backend API | REST + WebSocket | Render |
| 🎨 Frontend | Static Hosting | Vercel |
| 📧 Emails | Transactional | SendGrid |

---

<div align="center">

## 📂 Project Architecture

</div>

```
🏗️ cabGroups/
│
├── 🔧 backend/
│   ├── 📁 src/
│   │   ├── ⚙️ config/          # Database & environment configs
│   │   ├── 🎮 controllers/     # Business logic handlers
│   │   ├── 🛡️ middleware/      # Auth, validation, error handling
│   │   ├── 📊 models/          # MongoDB schemas
│   │   │   ├── User.ts         # Student profiles
│   │   │   ├── Group.ts        # Ride groups
│   │   │   ├── Payment.ts      # Payment tracking
│   │   │   └── Chat.ts         # Messages
│   │   ├── 🛣️ routes/          # API endpoints
│   │   ├── 🔧 utils/           # Helper functions
│   │   ├── 🔌 sockets/         # WebSocket handlers
│   │   └── 🚀 server.ts        # Entry point
│   ├── 📦 package.json
│   └── ⚡ tsconfig.json
│
├── 🎨 frontend/
│   ├── 📁 src/
│   │   ├── 🧩 components/      # Reusable UI components
│   │   │   ├── GroupCard.tsx
│   │   │   ├── ChatBox.tsx
│   │   │   ├── PaymentModal.tsx
│   │   │   └── MapPicker.tsx
│   │   ├── 📄 pages/           # Route pages
│   │   │   ├── Home.tsx
│   │   │   ├── Groups.tsx
│   │   │   ├── CreateGroup.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── 🌐 contexts/        # Global state
│   │   ├── 🔌 services/        # API calls
│   │   ├── 🎨 styles/          # CSS & themes
│   │   ├── 📱 App.tsx
│   │   └── ⚡ main.tsx
│   ├── 📦 package.json
│   └── ⚙️ vite.config.ts
│
└── 📖 README.md                # You are here! 👋
```

---

<div align="center">

## 🚀 Quick Start Guide

</div>

### 📋 Prerequisites

```bash
✅ Node.js 18+ installed
✅ MongoDB account (Atlas)
✅ Git installed
✅ Code editor (VS Code recommended)
```

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/ride-pool.git
cd ride-pool

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2️⃣ Environment Setup

**Backend `.env`:**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ridepool

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# APIs
GEOAPIFY_API_KEY=your_geoapify_api_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_GEOAPIFY_KEY=your_geoapify_api_key
```

### 3️⃣ Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# 🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm run dev
# ⚡ Vite dev server: http://localhost:5173
```

### 4️⃣ Open Browser

Navigate to **http://localhost:5173** and start building your ride pool! 🎉

---

<div align="center">

## 🌍 Deployment Guide

</div>

### 🔷 Backend → Render

<table>
<tr>
<td>

**Steps:**

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. New Web Service → Connect Repo
4. Configure settings →

</td>
<td>

| Setting | Value |
|---------|-------|
| Environment | Node |
| Build | `cd backend && npm install` |
| Start | `npm run start` |
| Branch | `main` |

</td>
</tr>
</table>

**Environment Variables:**
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=production
PORT=5000
GEOAPIFY_API_KEY=your_key
CLIENT_URL=https://your-vercel-app.vercel.app
```

### 🔷 Frontend → Vercel

<table>
<tr>
<td>

**Steps:**

1. Update `.env.production`
2. Go to [vercel.com](https://vercel.com)
3. Import project
4. Configure settings →

</td>
<td>

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root | `frontend` |
| Build | `npm run build` |
| Output | `dist` |

</td>
</tr>
</table>

**Environment Variable:**
```env
VITE_API_BASE_URL=https://your-app.onrender.com
VITE_SOCKET_URL=https://your-app.onrender.com
```

---

<div align="center">

## 🎮 API Documentation

</div>

### 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new student account |
| `POST` | `/api/auth/login` | Login with credentials |
| `POST` | `/api/auth/verify-email` | Verify college email |
| `GET` | `/api/auth/me` | Get current user |

### 👥 Group Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/groups` | List all available groups |
| `POST` | `/api/groups` | Create new ride group |
| `GET` | `/api/groups/:id` | Get group details |
| `POST` | `/api/groups/:id/join` | Join a group |
| `DELETE` | `/api/groups/:id/leave` | Leave group |

### 💬 Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chat/:groupId` | Get group messages |
| `POST` | `/api/chat/:groupId` | Send message |
| `WS` | `/socket.io` | Real-time chat |

### 💳 Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/initiate` | Create payment request |
| `PUT` | `/api/payments/:id/mark-paid` | User marks payment done |
| `PUT` | `/api/payments/:id/verify` | Admin verifies payment |

---

<div align="center">

## 🎨 Screenshots & Demos

</div>

> *Coming Soon: Visual showcase of the app in action!*

```
┌──────────────────────────────────────────┐
│  🏠 Homepage                             │
│  • Hero section with animated SVG        │
│  • Feature highlights                    │
│  • Call-to-action buttons                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  🔍 Browse Groups                        │
│  • Filter by route & time                │
│  • Available seats indicator             │
│  • Join with one click                   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  💬 Group Chat                           │
│  • Real-time messaging                   │
│  • Online status indicators              │
│  • Media sharing support                 │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  💳 Payment Dashboard                    │
│  • UPI QR code display                   │
│  • Payment status tracking               │
│  • Member contribution list              │
└──────────────────────────────────────────┘
```

---

<div align="center">

## 🔒 Security Best Practices

</div>

<table>
<tr>
<td width="50%">

### ✅ **DO's**

- ✔️ Use environment variables
- ✔️ Hash passwords with bcrypt
- ✔️ Implement rate limiting
- ✔️ Sanitize user inputs
- ✔️ Use HTTPS in production
- ✔️ Regular dependency updates
- ✔️ Add CORS restrictions
- ✔️ Validate JWTs properly

</td>
<td width="50%">

### ❌ **DON'Ts**

- ❌ Commit `.env` files
- ❌ Store passwords in plain text
- ❌ Skip input validation
- ❌ Use weak JWT secrets
- ❌ Expose API keys
- ❌ Disable security headers
- ❌ Trust client-side data
- ❌ Ignore security updates

</td>
</tr>
</table>

---

<div align="center">

## 🗺️ Roadmap

</div>

```mermaid
gantt
    title Ride Pool Development Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1
    Core Features          :done, 2024-01-01, 60d
    Authentication        :done, 2024-01-15, 30d
    Group Management      :done, 2024-02-01, 45d
    section Phase 2
    Payment Integration   :active, 2024-03-15, 30d
    Real-time Chat        :active, 2024-04-01, 25d
    section Phase 3
    Mobile App            :2024-05-01, 60d
    AI Matching           :2024-06-01, 45d
    Analytics Dashboard   :2024-07-01, 30d
```

### 🎯 Upcoming Features

- [ ] 📱 Mobile app (React Native)
- [ ] 🤖 AI-powered route matching
- [ ] 📊 Admin analytics dashboard
- [ ] 🌙 Enhanced dark mode
- [ ] 📸 In-chat photo sharing
- [ ] 🔔 Push notifications
- [ ] ⭐ Rating & review system
- [ ] 🎫 Ride history & receipts
- [ ] 🗺️ Live GPS tracking
- [ ] 💬 Voice messages

---

<div align="center">

## 🤝 Contributing

</div>

We love contributions! Here's how you can help:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m '✨ Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

### 📝 Contribution Guidelines

- 🎯 Follow the existing code style
- ✅ Write meaningful commit messages
- 🧪 Add tests for new features
- 📖 Update documentation
- 🔍 Test thoroughly before PR
- 💬 Be respectful and collaborative

---

<div align="center">

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/ride-pool?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/yourusername/ride-pool?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ride-pool?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ride-pool?style=for-the-badge)

</div>

---

<div align="center">

## 📄 License

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🔒 PROPRIETARY & CONFIDENTIAL                     │
│                                                     │
│  This project is proprietary software.             │
│  Unauthorized copying, distribution, or use        │
│  is strictly prohibited.                           │
│                                                     │
│  © 2024 Ride Pool Team. All rights reserved.      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

</div>

---

<div align="center">

## 💬 Support & Contact

Need help? We're here for you!

[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/ridepool)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@ridepool.com)
[![Docs](https://img.shields.io/badge/Documentation-000000?style=for-the-badge&logo=readthedocs&logoColor=white)](https://docs.ridepool.com)

</div>

---

<div align="center">

### 🌟 Star this repo if you find it useful!

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&pause=1000&color=10B981&center=true&vCenter=true&width=435&lines=Built+with+%E2%9D%A4%EF%B8%8F+for+college+students;Happy+Ride+Pooling!+%F0%9F%9A%97%F0%9F%92%A8" alt="Footer" />

**Made with 💜 by the Ride Pool Team**

</div>

---

<div align="center">

```
    🚗💨               🚗💨               🚗💨
   SHARE RIDES      SAVE MONEY       STAY SAFE
```

</div>
