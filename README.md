# MindConnect
MindConnect
Here’s a clean, production-style **README.md** for your project **MindConnect – Social Counselling Platform**. It’s structured so you can directly paste into your repo.

---

# 🧠 MindConnect – Social Counselling Platform

A **microservices-based social counselling web application** where users can connect, share feelings, interact socially, and subscribe to experts for professional counselling.

---

## 🚀 Overview

MindConnect combines **social networking + mental wellness + monetized expert counselling** into one platform.

Users can:

* Create accounts
* Add friends
* Share thoughts & feelings
* Comment and interact
* Become experts
* Subscribe to experts for paid counselling

---

## 🏗️ Architecture

This project follows a **Microservices Architecture** with an **API Gateway**.

```
mindconnect/
├── client/                # React Frontend
├── services/
│   ├── api-gateway/      # Entry point (routing)
│   ├── auth-service/     # Authentication (JWT)
│   ├── user-service/     # Profiles & friendships
│   ├── social-service/   # Posts & comments
│   └── payment-service/  # Subscriptions (Razorpay)
├── docker-compose.yml    # MongoDB & Redis
├── package.json          # Root scripts
└── README.md
```

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Redis (optional caching)
* JWT Authentication

### Frontend

* React.js
* Tailwind CSS
* Axios

### DevOps

* Docker & Docker Compose
* Microservices architecture
* API Gateway pattern

### Payments

* Razorpay (subscription-based)

---

## ✨ Features

### 👤 User Features

* User registration & login (JWT)
* Profile management
* Add/remove friends
* View friend activity feed

### 💬 Social Features

* Create posts (share feelings)
* Comment on posts
* Like/engage system (extendable)

### 🧑‍⚕️ Expert System

* Upgrade to "Expert"
* Set counselling price
* Public expert profiles
* Subscription-based access

### 💳 Payment System

* Razorpay integration
* Subscribe to experts
* Manage active subscriptions

### 🌐 API Gateway

* Central routing point
* Handles all microservices traffic

---

## 🧪 Local Setup (One Command Run)

### 🔧 Prerequisites

* Node.js (>= 16)
* Docker & Docker Compose
* npm or yarn

---

### ▶️ Installation

```bash
git clone https://github.com/your-username/mindconnect.git
cd mindconnect

npm install
```

---

### ▶️ Run Project

```bash
npm start
```

This will:

* Start MongoDB & Redis (Docker)
* Start all microservices
* Start frontend

---

### 🌍 Access App

```
Frontend: http://localhost:3000
API Gateway: http://localhost:3000/api
```

---

## 🔐 Environment Variables

Create `.env` in root:

```
JWT_SECRET=your_secret_key
MONGO_URI=mongodb://localhost:27017/mindconnect
REDIS_HOST=localhost
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
```

---

## 🔄 Microservices Ports

| Service         | Port |
| --------------- | ---- |
| API Gateway     | 3000 |
| Auth Service    | 3001 |
| User Service    | 3002 |
| Social Service  | 3003 |
| Payment Service | 3004 |

---

## 📡 API Flow

```
Client → API Gateway → Microservice → Database
```

Example:

```
POST /api/auth/login → Auth Service
GET /api/posts → Social Service
POST /api/subscribe → Payment Service
```

---

## 📦 Future Enhancements

* 🔔 Real-time notifications (WebSockets)
* 💬 Chat system (Socket.io)
* 📹 Video counselling (WebRTC)
* 🤖 AI-based mood detection
* 🧾 Subscription analytics dashboard

---

## 🧑‍💻 Contribution

1. Fork the repo
2. Create a branch
3. Commit changes
4. Open a PR

---

## 📜 License

MIT License

---

## 💡 Suggested Project Names (Optional Alternatives)

* MindConnect (current)
* HealSpace
* SoulCircle
* TalkNest
* FeelLink
* MindBridge

---

## 🙌 Acknowledgements

* MongoDB
* React
* Razorpay
* Express Community

---
**Just only follow below steps to execute this project**
cp .env.example .env   # fill in their own values
bash setup.sh

---
🚀 How to run
bashcd mindconnect

# Install everything
bash setup.sh

# Start all services
npm run dev

---

Then open http://localhost:3000

Requires: Node.js 18+, MongoDB running locally (or update MONGODB_URI in .env to use MongoDB Atlas free tier)


**💳 Razorpay Setup (optional for demo)**
The payment service works in demo mode without real keys — subscriptions are confirmed instantly. To enable real payments, add your Razorpay keys to .env.
