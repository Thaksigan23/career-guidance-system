# 🎯 Career Guidance System

A full-stack web application that helps users get career recommendations based on their interests, skills, and inputs.

---

## 🚀 Features

* 👤 User registration & login
* 📊 Career recommendation system
* 🧠 Skill-based suggestions
* 📁 Dashboard with user data
* 🔗 Frontend + Backend integration
* 🌐 LinkedIn-style networking:
  * Rich profiles (headline, about, location, "Open to work" badge)
  * Experience & education timelines
  * Connections (send/accept requests, suggestions, network page)
  * Activity feed with posts, likes and comments
  * Skill endorsements on public profiles

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
* Supabase (PostgreSQL)

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

👉 Create a free Supabase project at https://supabase.com
👉 Add your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env`

---

### 3️⃣ Frontend Setup

```
cd frontend_final_fixed_from_upload
npm install
npm run dev
```

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of `backend_final_real/supabase_schema.sql` to create the core tables, then run `backend_final_real/social_schema.sql` to add the LinkedIn-style features (connections, posts, endorsements, experience/education timelines).
3. In **Project Settings → API**, copy the **Project URL** and the **service_role** key.
4. Add them to `backend_final_real/.env` (use `.env.example` as a template):

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=some-strong-secret
```

> ⚠️ The `service_role` key bypasses Row Level Security. Keep it server-side only —
> never expose it in the frontend or commit it to git.

Then start the backend and frontend:

```
cd backend_final_real && npm run dev
cd frontend_final_fixed_from_upload && npm run dev
```

---

## 👑 Admin Account

The sign-up form only creates **student** or **employer** accounts, so the admin
user is seeded separately.

### Default credentials

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `admin@careerguide.com` |
| Password | `Admin@123`             |

> ⚠️ These are development defaults. Change the password after your first login
> (or override the values before seeding — see below).

### Create the admin (recommended)

After the database schema is set up and your `.env` is configured, run:

```
cd backend_final_real
npm run seed:admin
```

This inserts the admin user with a securely hashed password. Running it again
simply resets the admin's password back to the default.

To use your own values instead of the defaults, set them inline:

```
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=YourStrongPass npm run seed:admin
```

On Windows PowerShell:

```
$env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="YourStrongPass"; npm run seed:admin
```

### Alternative: create the admin via SQL

If you prefer, run this in the Supabase **SQL Editor**. The hash below is the
bcrypt hash of `Admin@123`:

```sql
INSERT INTO users (full_name, email, password, role, status)
VALUES (
  'System Admin',
  'admin@careerguide.com',
  '$2a$10$BG.7QmnMrKsYdVidRVNsm.S7Z34Ewl3BO5VM4fuTXNbF393D3vX06',
  'admin',
  'active'
);
```

Once seeded, log in at `/login` with the credentials above to access the admin
dashboard, user management, and job approval pages.

---

## 📸 Screenshots

> Place your image files in `docs/screenshots/` using the names below and they
> will render automatically here on GitHub.

### 🏠 Landing Page

![Landing page](docs/screenshots/landing.png)

The Aurora Glow landing page with hero section, feature cards, and call-to-action.

### 🔐 Authentication

| Login | Register |
| ----- | -------- |
| ![Login page](docs/screenshots/login.png) | ![Register page](docs/screenshots/register.png) |

### 💼 Jobs & Applications

| Job Listings | Job Details |
| ------------ | ----------- |
| ![Jobs page](docs/screenshots/jobs.png) | ![Job details](docs/screenshots/job-details.png) |

### 🎓 Student Experience

| Student Profile | CV Analyzer |
| --------------- | ----------- |
| ![Student profile](docs/screenshots/student-profile.png) | ![CV analyzer](docs/screenshots/cv-analyzer.png) |

### 🏢 Employer & Admin Dashboards

| Employer Dashboard | Admin Dashboard |
| ------------------ | --------------- |
| ![Employer dashboard](docs/screenshots/employer-dashboard.png) | ![Admin dashboard](docs/screenshots/admin-dashboard.png) |

### Demo data for screenshots

Load sample users, jobs, applications, and saved jobs:

```
cd backend_final_real
npm run seed:demo
```

| Role     | Name           | Email                     | Password   |
| -------- | -------------- | ------------------------- | ---------- |
| Admin    | System Admin   | `admin@careerguide.com`   | `Admin@123` |
| Employer | Acme Recruiter | `employer@acme.com`       | `Demo@123` |
| Employer | TechWave HR    | `hr@techwave.com`         | `Demo@123` |
| Student  | Jane Doe       | `jane.doe@student.com`    | `Demo@123` |
| Student  | John Smith     | `john.smith@student.com`  | `Demo@123` |
| Student  | Priya Kumar    | `priya.k@student.com`     | `Demo@123` |

**What gets seeded:** 6 jobs (4 approved, 2 pending), student profiles with skills, applications, and saved jobs.

> Demo job example: **Senior React Developer** · Acme Corp · Colombo · Rs. 120,000

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
