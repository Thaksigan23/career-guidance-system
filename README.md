# 🎯 Career Guidance System

A full-stack web application that helps users get career recommendations based on their interests, skills, and inputs.

---

## 🚀 Features

* 👤 User registration & login
* 📊 Career recommendation system
* 🧠 Skill-based suggestions
* 📁 Dashboard with user data
* 🔗 Frontend + Backend integration

---

## 🏗️ Project Structure

```
final/
 ├── frontend_final_fixed_from_upload/   # React app
 ├── backend_final_real/                 # Express + MySQL API
 ├── setup-local-db.ps1                  # Initialize local DB (Windows)
 └── start-local.ps1                     # Start DB + backend + frontend
```

---

## 🛠️ Technologies Used

### Frontend:

* React.js
* HTML, CSS, JavaScript

### Backend:

* Node.js
* Express.js
* MySQL

### Tools:

* Git & GitHub
* MySQL Workbench

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/Thaksigan23/career-guidance-system.git
cd career-guidance-system
```

---

### 2️⃣ Backend Setup

```
cd backend_final_real
npm install
npm start
```

👉 Make sure MySQL is running
👉 Update your database config (`.env` or `db.js`)

---

### 3️⃣ Frontend Setup

```
cd frontend_final_fixed_from_upload
npm install
npm run dev
```

---

## 🗄️ Database Setup

* Create a MySQL database named `career_platform`
* Import `backend_final_real/schema.sql`
* Update backend `.env` (or use `.env.example` as template)

Example:

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=career_platform
DB_PORT=3308
```

### Local one-command startup (Windows)

```powershell
.\setup-local-db.ps1
.\start-local.ps1
```

---

## 📸 Screenshots (Optional)

*Add screenshots of your UI here*

---

## 📌 Future Improvements

* AI-based recommendations
* Admin dashboard
* Better UI/UX design

---

## 👨‍💻 Author

* **Thaksigan**
* GitHub: https://github.com/Thaksigan23

---

## 📄 License

This project is for educational purposes.
