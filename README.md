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

