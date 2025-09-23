# SafeHouse – Secure Cloud-Native File Vault

> **A production-grade backend service** that stores and serves files **securely** using AES-256-GCM encryption and **AWS S3**, and acts as the **live client** for my [Feature-Flag & Experimentation Platform](https://github.com/maazkhnn/Feature-flags-experimentation-platform).


---

## Overview

SafeHouse is a cloud-native backend API that demonstrates how to build **secure, observable, and flag-driven** services:

* **Node.js / Express API** with JWT authentication and role-based access control.
* **End-to-end file security** – client uploads are encrypted in-memory with **AES-256-GCM** and stored in **AWS S3**, with on-the-fly decryption on download.
* **Feature-Flag aware** – integrates my custom **Node SDK** to consume live flags from the Feature-Flag platform:
  * Dynamic **rate limits**.
  * **Upload-size caps**.
  * **Logs page gating**.
  * **Upload-variant switching**.
* **Fully documented & observable** – live metrics, health checks, and interactive **Swagger/OpenAPI docs**.

This project doubles as the **client application** showcased in the Feature-Flag platform’s recruiter-facing **Live Tour** page: recruiters can flip a flag and instantly watch SafeHouse react.

---

## Key Features

| **Secure File Storage** | AES-256-GCM encryption, S3 object storage, streaming decryption |
| **Authentication & RBAC** | JWT-based login/registration, bcrypt password hashing |
| **Feature Flags Integration** | Real-time SSE snapshot updates via custom Node SDK |
| **Dynamic Behaviors** | Rate-limit, upload-size cap, logs-page access, upload-variant header |
| **Observability** | `/api/health`, `/api/metrics`, and live counters |
| **Interactive Docs** | Swagger UI at `/api/docs` |
| **Deployment Ready** | Dockerized and prepared for **AWS ECS Fargate** deployment |

---

## ⚡️ Endpoints (highlights)

| `POST /api/auth/register` | Register a new user |
| `POST /api/auth/login` | Obtain JWT |
| `GET /api/vaults` | List user vaults |
| `POST /api/vaults/:vaultId/files` | Upload & encrypt a file to S3 |
| `GET /api/vaults/:vaultId/files/:fileId/download` | Stream & decrypt a file |
| `GET /api/vaults/:vaultId/logs` | View download logs (flag-gated) |
| `GET /api/debug/*` | Flag-driven debug endpoints |
| `GET /api/health` | Service & DB health |
| `GET /api/metrics` | Live counters |
| `GET /api/docs` | Interactive Swagger/OpenAPI documentation |

---

## 🧪 Demo Data

A one-time seed script (`scripts/seedDemo.js`) creates:

* Demo user (`demo@safehouse.io` / `demo1234`)
* Demo vault + encrypted `hello.txt`
* Sample download log

---

## 🔧 Getting Started

### Prerequisites
* Node.js 18+
* MongoDB Atlas URI
* AWS S3 bucket + IAM user
* Docker (for containerized deployment)

### Environment Variables
Create a `.env` file:
PORT=4000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_REGION=<region>
S3_BUCKET=<bucket-name>

### Install & Run
```bash
npm install
npm run dev   # or node index.js
docker build -t safehouse .
docker run -p 4000:4000 safehouse
```

