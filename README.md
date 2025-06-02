# 📚 Smart Library System

A full-stack library management system built in three architectural phases: **Monolithic**, **Microservices**, and a **Scalable/Deployable architecture** using modern DevOps tools.

---

## 🚀 Project Phases

### 🔹 Phase 1: Monolithic Architecture

A unified backend that handles all library operations — user management, book inventory, and loan tracking — under one tightly coupled system.

- 📦 Single codebase, shared runtime and relational database
- 🧩 Modules:
  - **User Management**: Register, update, and retrieve users
  - **Book Management**: Add, update, search, and delete books
  - **Loan Management**: Issue and return books, manage loan history
- 🔄 Internal Communication: Function calls between classes/modules
- 📡 RESTful API with consistent endpoints

### 🔹 Phase 2: Microservices Architecture

The system is restructured into 3 independent services, each with its own database:

| Service         | Base Path      | Responsibilities                          | Database  |
|----------------|----------------|-------------------------------------------|-----------|
| **User Service** | `/api/users`   | Register, update, and query users         | `user_db` |
| **Book Service** | `/api/books`   | Manage books, availability, and search    | `book_db` |
| **Loan Service** | `/api/loans`   | Issue/return books, query loan data       | `loan_db` |

- 🛠 Each service is independently deployable and scalable
- 🌐 Inter-service communication via HTTP/REST (synchronous)
- 🔐 Services validate external dependencies (e.g., Loan Service checks User and Book exist via REST)

### 🔹 Phase 3: Infrastructure & DevOps

> _This phase includes optional but highly recommended DevOps practices._

- 🐳 **Dockerized Microservices**
  - Each service has its own Dockerfile
  - Unified via a `docker-compose.yml`
- 📡 **API Gateway / Reverse Proxy** 
- ⚙️ **CI/CD Setup** (Optional)
  - GitHub Actions for automated testing and deployment
- ☁️ **Deployment-Ready**
  - Can be deployed locally or to any cloud container platform

---

## 🧪 API Documentation

All services follow RESTful design:
- ✅ Standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`)
- 🧾 JSON request/response format
- 📍 Status codes for success/errors
- 🗂 Organized under `/api/{resource}` pattern



---

## 🏗️ Tech Stack

- **Backend**: Node.js 
- **Database**: Mongodb (Monolith), Separate DBs for Microservices
- **Containerization**: Docker 
- **DevOps**: GitHub Actions, Docker Compose (optional)

---

## 🛠️ Getting Started

### 🔧 Run Monolithic Version

```bash
cd monolith
npm install
npm start
