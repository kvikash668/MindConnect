# 🧠 MindConnect — Social Counselling Platform

> A production-grade microservices platform combining social networking, mental wellness, and monetized expert counselling — deployed via a full DevSecOps + GitOps pipeline.

[![CI/CD](https://img.shields.io/github/actions/workflow/status/kvikash668/MindConnect/ci.yml?branch=main&label=CI%2FCD&logo=githubactions)](https://github.com/kvikash668/MindConnect/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green?logo=mongodb)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [CI/CD Pipeline](#-cicd-pipeline)
- [DevOps Infrastructure](#-devops-infrastructure)
- [Docker & Kubernetes](#-docker--kubernetes)
- [Monitoring & Observability](#-monitoring--observability)
- [Security](#-security)
- [Roadmap](#-roadmap)

---

## 🚀 Overview

MindConnect is a **microservices-based** social counselling web app where users connect, share feelings, and subscribe to certified mental health experts.

```
Developer → Push Code → GitHub Actions CI
                              ↓
                     Build Docker Images
                              ↓
                    Push → Azure Container Registry
                              ↓
                  Update Helm values (GitOps repo)
                              ↓
                         ArgoCD Sync
                              ↓
                         AKS Cluster
                              ↓
               Prometheus + Grafana Monitoring
```

---

## 🏗️ Architecture

```
mindconnect/
├── client/                   # React Frontend (Port 3001)
├── services/
│   ├── api-gateway/          # Single entry point — routes all traffic (Port 3000)
│   ├── auth-service/         # JWT auth, registration, expert signup (Port 5001)
│   ├── user-service/         # Profiles, friends, subscriptions (Port 5002)
│   ├── social-service/       # Posts, comments, likes (Port 5003)
│   └── payment-service/      # Razorpay subscriptions (Port 5004)
├── docker/                   # Dockerfiles per service
├── .github/workflows/        # GitHub Actions CI/CD
├── helm/                     # Helm charts (GitOps)
├── terraform/                # Azure infra as code
├── .env.example
├── setup.sh
└── package.json
```

### Request Flow

```
Browser (3001)
     ↓
API Gateway (3000)          ← single entry point, JWT passthrough
     ↓
 ┌───┴────┬──────────┬────────────┐
Auth    User      Social      Payment
(5001)  (5002)   (5003)      (5004)
     ↓
  MongoDB
```

---

## ⚙️ Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | React 18, React Router v6, Axios        |
| Backend        | Node.js 18, Express.js                  |
| Database       | MongoDB (Mongoose ODM)                  |
| Auth           | JWT (jsonwebtoken + bcryptjs)           |
| Payments       | Razorpay (demo mode supported)          |
| Gateway        | http-proxy-middleware                   |
| Containerisation | Docker, Docker Compose                |
| Orchestration  | Kubernetes (AKS)                        |
| CI/CD          | GitHub Actions                          |
| GitOps         | ArgoCD + Helm                           |
| IaC            | Terraform (Azure)                       |
| Registry       | Azure Container Registry (ACR)          |
| Monitoring     | Prometheus + Grafana                    |
| Secrets        | Azure Key Vault                         |

---

## ✨ Features

### 👤 User
- Register & login with JWT authentication
- Edit profile — name, bio, avatar
- Search users and send friend requests
- Accept / decline friend requests

### 💬 Social
- Create posts with mood tags (happy, sad, anxious, hopeful...)
- Post anonymously
- Hashtag-style topic tagging
- Like / unlike posts
- Comment and delete own comments

### 🧑‍⚕️ Expert System
- Any user can register as a certified expert
- Set monthly subscription fee (₹)
- Add specialisations (Anxiety, Depression, Relationships, etc.)
- Public expert profile visible to all users

### 💳 Payments
- Razorpay integration for expert subscriptions
- **Demo mode** works without real Razorpay keys
- Full payment history tracking

---

## 🧪 Local Setup

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | https://nodejs.org |
| MongoDB | ≥ 6 | https://mongodb.com or Atlas |
| Git | any | https://git-scm.com |

### Step 1 — Clone

```bash
git clone https://github.com/kvikash668/MindConnect.git
cd MindConnect
```

### Step 2 — Environment variables

```bash
cp .env.example .env
# Edit .env with your values (see Environment Variables section)
```

### Step 3 — Install & run

```bash
# Install all dependencies across all services
npm run install:all

# Start everything concurrently
npm run dev
```

### Step 4 — Open app

```
http://localhost:3001
```

### Verify all services are healthy

```bash
curl http://localhost:3000/                      # Gateway
curl http://localhost:5001/health               # Auth
curl http://localhost:5002/health               # User
curl http://localhost:5003/health               # Social
curl http://localhost:5004/health               # Payment
```

---

## 🔐 Environment Variables

Create a `.env` file at the project root:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/mindconnect

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_chars
JWT_EXPIRES_IN=7d

# Service Ports
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=5001
USER_SERVICE_PORT=5002
SOCIAL_SERVICE_PORT=5003
PAYMENT_SERVICE_PORT=5004

# Razorpay (optional — demo mode works without these)
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Production only
REACT_APP_API_URL=http://localhost:3000
```

> ⚠️ Never commit your `.env` file. It is in `.gitignore`.

---

## 📡 API Reference

### Auth Service — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user | ✅ JWT |
| PUT | `/api/auth/update-profile` | Update profile | ✅ JWT |
| POST | `/api/auth/become-expert` | Register as expert | ✅ JWT |

### User Service — `/api/users`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/search?q=name` | Search users | ✅ JWT |
| GET | `/api/users/:id` | Get user by ID | ✅ JWT |
| POST | `/api/users/friends/request/:id` | Send friend request | ✅ JWT |
| PUT | `/api/users/friends/:friendshipId` | Accept/reject request | ✅ JWT |
| GET | `/api/users/friends/list` | My friends | ✅ JWT |
| GET | `/api/users/friends/pending` | Pending requests | ✅ JWT |
| GET | `/api/users/experts/all` | All experts | ✅ JWT |
| GET | `/api/users/subscriptions/my` | My subscriptions | ✅ JWT |

### Social Service — `/api/social`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/social/posts` | Create post | ✅ JWT |
| GET | `/api/social/posts` | Get feed | ✅ JWT |
| GET | `/api/social/posts/mine` | My posts | ✅ JWT |
| GET | `/api/social/posts/:id` | Get post | ✅ JWT |
| DELETE | `/api/social/posts/:id` | Delete post | ✅ JWT |
| POST | `/api/social/posts/:id/like` | Like/unlike | ✅ JWT |
| POST | `/api/social/posts/:id/comments` | Add comment | ✅ JWT |
| DELETE | `/api/social/posts/:postId/comments/:commentId` | Delete comment | ✅ JWT |

### Payment Service — `/api/payment`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payment/create-order` | Create Razorpay order | ✅ JWT |
| POST | `/api/payment/verify` | Verify payment | ✅ JWT |
| GET | `/api/payment/history` | Payment history | ✅ JWT |

---

## 🔁 CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

```yaml
name: MindConnect CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ${{ secrets.ACR_LOGIN_SERVER }}
  IMAGE_TAG: ${{ github.sha }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm run install:all

      - name: Run tests
        run: npm test --if-present

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    strategy:
      matrix:
        service: [auth-service, user-service, social-service, payment-service, api-gateway]

    steps:
      - uses: actions/checkout@v4

      - name: Login to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_LOGIN_SERVER }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build & push ${{ matrix.service }}
        run: |
          docker build \
            -f docker/${{ matrix.service }}.Dockerfile \
            -t ${{ env.REGISTRY }}/mindconnect/${{ matrix.service }}:${{ env.IMAGE_TAG }} \
            -t ${{ env.REGISTRY }}/mindconnect/${{ matrix.service }}:latest \
            ./services/${{ matrix.service }}
          docker push ${{ env.REGISTRY }}/mindconnect/${{ matrix.service }}:${{ env.IMAGE_TAG }}
          docker push ${{ env.REGISTRY }}/mindconnect/${{ matrix.service }}:latest

  update-gitops:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Checkout GitOps repo
        uses: actions/checkout@v4
        with:
          repository: kvikash668/MindConnect-gitops
          token: ${{ secrets.GITOPS_TOKEN }}

      - name: Update image tags in Helm values
        run: |
          for service in auth-service user-service social-service payment-service api-gateway; do
            sed -i "s|tag:.*|tag: ${{ env.IMAGE_TAG }}|g" \
              helm/environments/prod/${service}-values.yaml
          done

      - name: Commit and push
        run: |
          git config user.email "ci@mindconnect.app"
          git config user.name "GitHub Actions"
          git commit -am "ci: update image tags to ${{ env.IMAGE_TAG }}"
          git push
```

### Pipeline Stages

```
Push to main
     │
     ▼
┌─────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────┐
│  Tests  │───▶│ Docker Build │───▶│  Push to ACR   │───▶│  GitOps  │
│  (Jest) │    │  (5 images)  │    │  (5 services)  │    │  Update  │
└─────────┘    └──────────────┘    └────────────────┘    └────┬─────┘
                                                               │
                                                               ▼
                                                        ┌────────────┐
                                                        │   ArgoCD   │
                                                        │  Auto Sync │
                                                        └─────┬──────┘
                                                              │
                                                              ▼
                                                        ┌────────────┐
                                                        │    AKS     │
                                                        │  Deployed  │
                                                        └────────────┘
```

---

## 🏗️ DevOps Infrastructure

### Terraform — Azure Infrastructure (`terraform/`)

```
terraform/
├── modules/
│   ├── aks/          # Azure Kubernetes Service cluster
│   ├── acr/          # Azure Container Registry
│   ├── vnet/         # Virtual Network + subnets
│   └── keyvault/     # Azure Key Vault for secrets
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── backend.tf        # Remote state in Azure Storage
```

**Provision infrastructure:**

```bash
cd terraform/environments/prod
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

### GitOps Repo Structure (Helm + ArgoCD)

```
gitops-repo/
├── helm/
│   ├── auth-service/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── ingress.yaml
│   │       └── hpa.yaml
│   ├── user-service/
│   ├── social-service/
│   ├── payment-service/
│   └── api-gateway/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── argocd/
    ├── project.yaml
    └── applications/
        ├── auth-app.yaml
        ├── user-app.yaml
        ├── social-app.yaml
        ├── payment-app.yaml
        └── gateway-app.yaml
```

---

## 🐳 Docker & Kubernetes

### Docker Compose (local dev alternative)

```bash
docker-compose up --build
```

### Build individual service

```bash
docker build -f docker/auth-service.Dockerfile \
  -t mindconnect/auth-service:local ./services/auth-service
```

### Kubernetes — Deploy to AKS

```bash
# Connect to AKS cluster
az aks get-credentials --resource-group mindconnect-rg --name mindconnect-aks

# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply ArgoCD applications (triggers GitOps sync)
kubectl apply -f gitops/argocd/applications/

# Watch rollout
kubectl rollout status deployment/auth-service -n mindconnect
```

### Useful kubectl commands

```bash
# Get all pods
kubectl get pods -n mindconnect

# Check logs
kubectl logs -f deployment/auth-service -n mindconnect

# Scale a service
kubectl scale deployment/social-service --replicas=3 -n mindconnect

# Port forward for debugging
kubectl port-forward svc/auth-service 5001:5001 -n mindconnect
```

---

## 📊 Monitoring & Observability

### Prometheus + Grafana (via Helm)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

### Access Grafana dashboard

```bash
kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring
# Default: admin / prom-operator
```

### Health check endpoints

All services expose `/health`:

```bash
GET /health  →  { "status": "ok", "service": "auth-service" }
```

### Key metrics to monitor

| Metric | Alert threshold |
|--------|----------------|
| API Gateway response time | > 500ms |
| Error rate (5xx) | > 1% |
| MongoDB connection pool | > 80% |
| Pod memory usage | > 80% |
| Pod CPU usage | > 70% |

---

## 🔐 Security

| Layer | Implementation |
|-------|---------------|
| Auth | JWT with 7-day expiry, bcrypt password hashing (salt 12) |
| Transport | HTTPS via Ingress TLS (cert-manager + Let's Encrypt) |
| Secrets | Azure Key Vault (never in code or `.env` in prod) |
| Image scanning | Trivy in CI pipeline (blocks on CRITICAL vulns) |
| Network | Kubernetes NetworkPolicies — services only talk to gateway |
| Rate limiting | API Gateway — 100 req/min per IP |
| CORS | Restricted to frontend origin in production |

### Add Trivy scanning to CI

```yaml
- name: Scan image for vulnerabilities
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.REGISTRY }}/mindconnect/auth-service:${{ env.IMAGE_TAG }}
    severity: CRITICAL,HIGH
    exit-code: 1
```

---

## 🗺️ Roadmap

| Feature | Status |
|---------|--------|
| Core microservices (auth, user, social, payment) | ✅ Done |
| API Gateway with path rewriting | ✅ Done |
| JWT authentication | ✅ Done |
| Razorpay integration | ✅ Done |
| Docker + Docker Compose | 🔄 In Progress |
| GitHub Actions CI/CD | 🔄 In Progress |
| Terraform (Azure AKS + ACR) | 📋 Planned |
| Helm charts + ArgoCD GitOps | 📋 Planned |
| Prometheus + Grafana monitoring | 📋 Planned |
| Real-time notifications (Socket.io) | 📋 Planned |
| Private messaging between friends | 📋 Planned |
| Video counselling (WebRTC) | 📋 Planned |
| AI mood detection from post content | 📋 Planned |
| Mobile app (React Native) | 📋 Planned |

---

## 🤝 Contributing

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request against main
```

**Branch naming convention:**
- `feature/` — new features
- `fix/` — bug fixes
- `infra/` — DevOps / infrastructure changes
- `docs/` — documentation updates

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Author

**Vikash Kumar**
- GitHub: [@kvikash668](https://github.com/kvikash668)
- Project: [MindConnect](https://github.com/kvikash668/MindConnect)

---

> Built with Node.js · React · MongoDB · Docker · Kubernetes · GitHub Actions · ArgoCD · Terraform · Azure
