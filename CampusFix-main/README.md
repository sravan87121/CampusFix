# 🏫 CampusFix — Campus Maintenance Ticket Management System

---

## 🏆 Project Highlights

* 🎫 Centralized Campus Maintenance Ticket Management
* 🔐 JWT-Based Authentication & Role-Based Access Control
* 👥 User, Admin & Maintenance Staff Roles
* 📊 Role-Based Dashboards & Analytics
* 🖼️ Secure Image Uploads for Maintenance Issues
* 🔄 Server-Side Ticket Status Workflow
* 💬 Ticket Comments & Notifications
* 🧪 Automated Backend Testing
* ⚙️ Jenkins-Based CI/CD Pipeline
* 🗄️ MongoDB Database with Mongoose

---

## 📄 Resources

📑 **Project Documentation**

➡️ [`docs/`](docs/)

🏗️ **Architecture**

➡️ [`docs/architecture.md`](docs/architecture.md)

🗄️ **Database Design**

➡️ [`docs/database.md`](docs/database.md)

🔌 **API Documentation**

➡️ [`docs/api.md`](docs/api.md)

🔄 **Ticket Workflow**

➡️ [`docs/ticket-workflow.md`](docs/ticket-workflow.md)

⚙️ **Jenkins CI/CD**

➡️ [`docs/jenkins.md`](docs/jenkins.md)

---

# 📖 Overview

Campus maintenance requests are often handled through verbal complaints, phone calls, WhatsApp messages, paper forms, or scattered emails. This makes it difficult to track complaints, prioritize urgent problems, assign maintenance staff, and verify whether an issue has been resolved.

**CampusFix** is a web-based campus maintenance ticket management system that centralizes the complete maintenance lifecycle into a single platform.

The system allows users to report maintenance issues, administrators to assign and monitor them, and maintenance staff to update the progress and resolution of assigned tasks.

The complete workflow is managed through:

```text
Report → Assign → Work → Resolve → Close
```

---

# 🎯 Applications

* 🏫 Campus Infrastructure Management
* 🔧 Maintenance Request Management
* ⚡ Electrical Issue Reporting
* 💧 Plumbing & Water Issue Management
* 🪑 Furniture & Classroom Maintenance
* 🌐 Network & Technical Issue Reporting
* 📊 Institutional Maintenance Analytics
* 🏢 Facility Management

---

# 👥 User Roles

| Role      | Capabilities                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| **USER**  | Register, log in, create tickets, upload images, view own tickets, cancel eligible tickets, comment, view notifications |
| **ADMIN** | View all tickets, assign staff, change priority/status, manage categories, manage users, view analytics                 |
| **STAFF** | View assigned tickets, update status, add resolution notes/images, comment                                              |

---

# 🎫 Ticket Management

CampusFix provides a complete ticket lifecycle with controlled status transitions.

```text
OPEN
  │
  ▼
ASSIGNED
  │
  ▼
IN_PROGRESS
  │
  ▼
RESOLVED
  │
  ▼
CLOSED
```

Tickets may also be marked as:

```text
CANCELLED
```

Ticket IDs are automatically generated in a human-readable format:

```text
CFX-2026-0001
CFX-2026-0002
CFX-2026-0003
```

Status transitions are validated on the **server side**, preventing invalid operations such as changing a `CLOSED` ticket back to `OPEN`.

---

# 🏗 System Architecture

CampusFix follows a three-layer web application architecture:

```text
                    ┌───────────────────┐
                    │       USER        │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   React + Vite    │
                    │    Frontend       │
                    └─────────┬─────────┘
                              │
                         REST API
                              │
                              ▼
                    ┌───────────────────┐
                    │ Node.js + Express │
                    │     Backend       │
                    └─────────┬─────────┘
                              │
                          Mongoose
                              │
                              ▼
                    ┌───────────────────┐
                    │     MongoDB       │
                    │     Database      │
                    └───────────────────┘
```

Uploaded images are served through the backend `/uploads` directory.

---

# ⚙ Methodology

```text
User Registration / Login
          │
          ▼
     Create Ticket
          │
          ├── Category
          ├── Location
          ├── Priority
          ├── Description
          └── Image
          │
          ▼
    Administrator
          │
          ├── Review Ticket
          ├── Set Priority
          └── Assign Staff
                  │
                  ▼
          Maintenance Staff
                  │
                  ├── Update Status
                  ├── Add Comments
                  ├── Add Resolution Notes
                  └── Upload Resolution Image
                  │
                  ▼
              RESOLVED
                  │
                  ▼
               CLOSED
```

---

# 🧠 System Components

| Component        | Purpose                   |
| ---------------- | ------------------------- |
| **React + Vite** | Frontend application      |
| **React Router** | Client-side routing       |
| **Tailwind CSS** | User interface styling    |
| **Axios**        | API communication         |
| **Context API**  | Frontend state management |
| **Recharts**     | Dashboard analytics       |
| **Node.js**      | Backend runtime           |
| **Express.js**   | REST API framework        |
| **JWT**          | Authentication            |
| **bcrypt**       | Password hashing          |
| **Multer**       | Image upload handling     |
| **MongoDB**      | Database                  |
| **Mongoose**     | Database modeling         |
| **Jest**         | Automated testing         |
| **Supertest**    | API testing               |
| **Jenkins**      | CI/CD automation          |

---

# 🔐 Authentication & Security

CampusFix implements multiple security mechanisms to protect users and application resources.

| Security Feature      | Implementation                    |
| --------------------- | --------------------------------- |
| Authentication        | JSON Web Tokens (JWT)             |
| Password Security     | bcrypt hashing                    |
| Authorization         | Role-Based Access Control         |
| HTTP Security         | Helmet                            |
| Cross-Origin Security | CORS                              |
| Rate Protection       | express-rate-limit                |
| Input Validation      | express-validator                 |
| File Validation       | Secure image type/size validation |
| API Protection        | Authentication middleware         |
| Status Protection     | Server-side transition validation |

Passwords are hashed before being stored and are never returned in API responses.

---

# 🗄️ Database

CampusFix uses **MongoDB** with **Mongoose** for database management.

### Core Collections

| Collection      | Purpose                                     |
| --------------- | ------------------------------------------- |
| `users`         | User authentication, profiles and roles     |
| `categories`    | Maintenance issue categories                |
| `tickets`       | Maintenance requests and ticket information |
| `comments`      | Ticket-related communication                |
| `notifications` | User notifications                          |
| `counters`      | Sequential ticket ID generation             |

The database uses schemas, references, validation, timestamps, and indexes for efficient data management.

---

# 🔌 API

The application exposes REST APIs for authentication, tickets, users, categories, comments, notifications, dashboards, and system health.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Tickets

```text
GET  /api/tickets
POST /api/tickets
GET  /api/tickets/my
GET  /api/tickets/assigned
```

### Ticket Management

```text
PUT /api/tickets/:id/assign
PUT /api/tickets/:id/status
PUT /api/tickets/:id/priority
PUT /api/tickets/:id/resolve
```

### Comments

```text
GET  /api/tickets/:id/comments
POST /api/tickets/:id/comments
```

### Notifications

```text
GET /api/notifications
PUT /api/notifications/:id/read
```

### Dashboards

```text
GET /api/dashboard/user
GET /api/dashboard/staff
GET /api/dashboard/admin
```

### Health Check

```text
GET /api/health
```

Full API documentation is available in [`docs/api.md`](docs/api.md).

---

# ⚙️ Experimental & Testing Setup

The backend is tested using:

* Jest
* Supertest
* mongodb-memory-server

```bash
cd server
npm test
```

The test suite covers:

* Authentication
* Ticket creation
* Ticket CRUD operations
* Access control
* Ticket assignment
* Priority management
* Status transitions
* Comments
* Categories
* Dashboards
* Health checks

The use of `mongodb-memory-server` allows backend tests to run without requiring an external MongoDB database.

---

# 📊 Dashboard & Analytics

CampusFix provides dedicated dashboards based on user roles.

### 👤 User Dashboard

Provides information about:

* Total tickets
* Open tickets
* Resolved tickets
* Closed tickets
* Recent maintenance requests

### 🛠️ Staff Dashboard

Provides information about:

* Assigned tickets
* Pending tasks
* In-progress tickets
* Resolved maintenance requests

### 👨‍💼 Admin Dashboard

Provides:

* Total tickets
* Ticket status distribution
* Priority distribution
* Category statistics
* Staff workload
* Maintenance performance

---

# ⚙️ Jenkins CI/CD

CampusFix uses a **Jenkins declarative pipeline** for continuous integration and delivery.

```text
Checkout
   │
   ▼
Install Dependencies
   │
   ▼
Lint
   │
   ▼
Test
   │
   ▼
Build Frontend
   │
   ▼
Build Backend
   │
   ▼
Start Application
   │
   ▼
Smoke Test
   │
   ▼
Deploy
   │
   ▼
Health Check
```

### Pipeline Stages

| Stage                | Purpose                                 |
| -------------------- | --------------------------------------- |
| Checkout             | Retrieves the latest source code        |
| Install Dependencies | Installs project dependencies           |
| Lint                 | Checks code quality                     |
| Test                 | Executes automated tests                |
| Build Frontend       | Builds the React application            |
| Build Backend        | Prepares backend application            |
| Smoke Test           | Performs basic application verification |
| Deploy               | Deployment stage                        |
| Health Check         | Verifies application availability       |

The project currently uses **Jenkins** for CI/CD and does not use Docker or GitHub Actions.

---

# 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Context API
* Recharts
* Lucide Icons

### Backend

* Node.js
* Express.js
* JWT
* bcrypt
* Multer
* Helmet
* CORS
* express-rate-limit
* express-validator

### Database

* MongoDB
* Mongoose

### Testing

* Jest
* Supertest
* mongodb-memory-server

### DevOps

* Git
* GitHub
* Jenkins

---

# ⚙️ Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/jaswanth-227/CampusFix.git
cd CampusFix
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment

Create:

```text
server/.env
```

Example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/campusfix
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start Application

```bash
npm run dev
```

Application:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

Requires **Node.js 18+** and a reachable MongoDB instance.

---

# 📂 Repository Structure

```text
CampusFix
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── ticket-workflow.md
│   └── jenkins.md
│
├── uploads/
├── Jenkinsfile
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# 🌱 Sustainability Relevance

CampusFix can contribute to sustainable campus management by improving the efficiency of maintenance operations.

A centralized digital maintenance platform can help institutions:

* ♻️ Reduce paper-based complaint processing
* 💧 Identify recurring water and plumbing issues
* ⚡ Track electrical maintenance problems
* 🏫 Improve infrastructure maintenance efficiency
* 📊 Support data-driven resource allocation
* 🔧 Reduce delays in maintenance activities
* 📈 Identify recurring infrastructure problems
* 🌱 Support preventive and predictive maintenance in future versions

Future versions can incorporate AI/ML models for **predictive maintenance, automatic issue classification, priority prediction, and resource optimization**.

---

# 🚀 Future Work

* 🤖 AI-based automatic ticket classification
* 📊 ML-based ticket priority prediction
* 🔮 Predictive maintenance using historical ticket data
* 👥 Intelligent staff workload balancing
* 🔔 Real-time notifications using WebSockets
* 📧 Email notifications
* ⏱️ SLA-based automatic escalation
* 📱 Mobile application
* 📄 CSV/PDF report generation
* 🔍 AI-based duplicate complaint detection
* 📈 Advanced maintenance analytics

---

# 👨‍💻 Author

**Jaswanth Yadurla**

B.Tech — Artificial Intelligence & Machine Learning

Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad

📧 [yadurlajaswanth@gmail.com](mailto:yadurlajaswanth@gmail.com)

🔗 GitHub: [jaswanth-227](https://github.com/jaswanth-227)

---

# 🙏 Acknowledgements

* 🏫 Chaitanya Bharathi Institute of Technology (CBIT)
* 💻 Open-source React & Node.js ecosystem
* 🍃 MongoDB
* ⚙️ Jenkins
* 🧪 Jest & Supertest

---

⭐ If you found this project useful, please consider giving the repository a Star.

**Made with ❤️ by Jaswanth Yadurla**
