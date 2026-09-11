# 🏫 CampusFix

> **A Smart Campus Issue Reporting & Management System**

CampusFix is a full-stack web application that helps students **report campus issues** and enables administrators to **track, manage, and resolve complaints** through a centralized platform.

## ✨ Features

* 👨‍🎓 Student issue reporting
* 📋 Issue tracking and status management
* 👨‍💼 Admin dashboard
* 🔐 User authentication & authorization
* 🏷️ Issue categorization and priority management
* 📊 Centralized complaint management
* 🐳 Docker & Docker Compose support
* 🔄 Jenkins CI/CD integration

## 🛠️ Tech Stack

**Frontend**

* React.js
* JavaScript
* HTML & CSS

**Backend**

* Node.js
* Express.js
* REST APIs

**Database**

* MongoDB

**DevOps**

* Git & GitHub
* Docker
* Docker Compose
* Jenkins
* Nginx

## 🏗️ Architecture

```text
Student
   │
   ▼
React Frontend
   │
   │ REST API
   ▼
Node.js + Express
   │
   ▼
MongoDB
   │
   ▼
Admin Dashboard
```

## 🔄 Issue Workflow

```text
Reported → Under Review → Assigned → In Progress → Resolved
```

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/sravan87121/CampusFix.git
cd CampusFix
```

### Install Dependencies

```bash
cd server
npm install
```

```bash
cd ../client
npm install
```

### Run the Application

Start the backend:

```bash
cd server
npm start
```

Start the frontend:

```bash
cd client
npm start
```

## 🐳 Run with Docker

```bash
docker compose up --build
```

To stop the application:

```bash
docker compose down
```

## 🔄 CI/CD

CampusFix includes a **Jenkins pipeline** to support automated build, testing, Docker image creation, and deployment workflows.

```text
GitHub → Jenkins → Build → Test → Docker → Deploy
```

## 🔮 Future Enhancements

* 🤖 AI-based issue categorization
* 📍 Location-based issue reporting
* 🔔 Real-time notifications
* 📸 Image-based issue reporting
* 📊 Advanced analytics
* 📱 Mobile application

## 👨‍💻 Author

**Ganjayi Shravan Kumar**

GitHub: [sravan87121](https://github.com/sravan87121)

---

⭐ If you find this project useful, consider giving it a star!
