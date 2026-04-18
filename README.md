# 🧠 MindConnect – Social Counselling Platform

A **microservices-based social counselling web application** where users can connect, share feelings, interact socially, and subscribe to experts for professional counselling.

---

## 🚀 Overview

MindConnect combines **social networking + mental wellness + monetized expert counselling** into one platform.

Users can:
- Create accounts & manage profiles
- Add friends & view their activity
- Share thoughts, feelings & moods
- Comment and like posts
- Become certified experts
- Subscribe to experts for paid counselling sessions

---

## 🏗️ Architecture

This project follows a **Microservices Architecture** with an **API Gateway** as the single entry point.

```
mindconnect/
├── client/                   # React Frontend (Port 3000)
├── services/
│   ├── api-gateway/          # Entry point — routes to all services (Port 5000)
│   ├── auth-service/         # Authentication & JWT (Port 5001)
│   ├── user-service/         # Profiles, friends & subscriptions (Port 5002)
│   ├── social-service/       # Posts, comments & likes (Port 5003)
│   └── payment-service/      # Razorpay subscriptions (Port 5004)
├── .env.example              # Environment variable template
├── setup.sh                  # One-command install script
├── package.json              # Root scripts (runs all services)
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Payments | Razorpay |
| Architecture | Microservices + API Gateway |

---

## ✨ Features

### 👤 User Features
- Register & login with JWT authentication
- Edit profile (name, bio, avatar)
- Search and add friends
- Accept / decline friend requests

### 💬 Social Features
- Create posts with mood tags (happy, sad, anxious, hopeful...)
- Post anonymously
- Add hashtag-style topic tags
- Like and unlike posts
- Comment on posts, delete own comments

### 🧑‍⚕️ Expert System
- Any user can register as an Expert
- Set your own monthly subscription fee (₹)
- Add specializations (Anxiety, Depression, Relationships, etc.)
- Public expert profile visible to all users

### 💳 Payment System
- Razorpay integration for subscriptions
- Demo mode works without real Razorpay keys
- Payment history tracking

---

## 🔄 Microservices & Ports

| Service | Port | Responsibility |
|---|---|---|
| React Client | 3000 | Frontend UI |
| API Gateway | 5000 | Routes all requests from frontend |
| Auth Service | 5001 | Register, login, JWT, expert signup |
| User Service | 5002 | Friends, search, subscriptions |
| Social Service | 5003 | Posts, comments, likes |
| Payment Service | 5004 | Razorpay orders & verification |

---

## 📡 API Flow

```
React Client (3000)
      ↓
API Gateway (5000)
      ↓
 ┌────┴────┬──────────┬───────────┐
Auth     User      Social    Payment
(5001)  (5002)    (5003)    (5004)
      ↓
  MongoDB
```

**Route examples:**
```
POST /api/auth/register    → Auth Service
POST /api/auth/login       → Auth Service
GET  /api/users/search     → User Service
POST /api/users/friends/request/:id → User Service
GET  /api/social/posts     → Social Service
POST /api/social/posts     → Social Service
POST /api/payment/create-order → Payment Service
```

---

## 🧪 Local Setup

### Prerequisites
- **Node.js** >= 18  →  https://nodejs.org
- **MongoDB** running locally  →  https://www.mongodb.com/try/download/community
  - _Or use free MongoDB Atlas:_ https://www.mongodb.com/atlas

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/your-username/mindconnect.git
cd mindconnect
```

### Step 2 — Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
MONGODB_URI=mongodb://localhost:27017/mindconnect
JWT_SECRET=your_random_secret_here

# Optional — only needed for real payments
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
```

### Step 3 — Install & run everything

```bash
bash setup.sh
npm run dev
```

This installs all dependencies across all 5 microservices + the React client, then starts everything concurrently.

### Step 4 — Open the app

```
http://localhost:3000
```

---

## 💳 Razorpay Setup (Optional)

The payment service runs in **demo mode** by default — subscriptions are confirmed instantly without any real payment. To enable real payments:

1. Create a free account at https://razorpay.com
2. Get your test API keys from the dashboard
3. Add them to your `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
```

---

## 📦 Future Enhancements

- 🔔 Real-time notifications (WebSockets / Socket.io)
- 💬 Private chat between friends
- 📹 Video counselling sessions (WebRTC)
- 🤖 AI-based mood detection from post content
- 🧾 Expert earnings & subscription analytics dashboard
- 📱 Mobile app (React Native)

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

MIT License — free to use, modify and distribute.

---

## 🙌 Built With

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Razorpay](https://razorpay.com/)
