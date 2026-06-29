# 🎯 Career Guidance System

A full-stack career platform where **students** build professional profiles and find
matching jobs, **employers** post jobs and review applicants, and **admins** moderate
the platform. It blends a job board, an AI-style CV/skill matcher, and a
LinkedIn-style professional network — wrapped in a modern "Aurora Glow" UI.

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Quick Start](#-quick-start)
5. [Database Setup (Supabase)](#-database-setup-supabase)
6. [Environment Variables](#-environment-variables)
7. [Admin Account](#-admin-account)
8. [Demo Data](#-demo-data)
9. [User Roles](#-user-roles)
10. [API Overview](#-api-overview)
11. [Screenshots](#-screenshots)
12. [Author & License](#-author--license)

---

## 🚀 Features

### Core
- 🔐 **Authentication** — JWT login/registration with bcrypt-hashed passwords and role-based access (student, employer, admin).
- 💼 **Job board** — employers post jobs; admins approve/reject; students browse, search, save, and apply.
- 🧠 **AI-style job matching** — jobs are scored against a student's skills and experience to surface the best matches.
- 📄 **CV tools** — upload a CV/résumé and get a skill-based analysis and history.

### LinkedIn-style networking
- 👤 **Rich profiles** — headline, about, location, and an "Open to work" badge.
- 🗂️ **Timelines** — add multiple experience and education entries.
- 🤝 **Connections** — send/accept requests, "people you may know" suggestions, and a network page.
- 📰 **Activity feed** — post updates with likes and comments.
- 👍 **Skill endorsements** — connections can endorse skills on public profiles.

### Dashboards & insights
- 🏠 **Home feed** with a personalized **match/hiring insights graph** (gauge + bar chart).
- 🏢 **Employer dashboard** — job stats and applicant tracking.
- 🛡️ **Admin dashboard** — platform stats, user management, and job moderation.

### UX & security
- 🎨 Consistent **Aurora Glow** theme (glassmorphism, gradients, Clash Display + Satoshi fonts).
- 🔔 Toast notifications and client-side routing throughout.
- 🛡️ `helmet` security headers, rate limiting, input validation, and CORS allow-listing.

---

## 🛠️ Tech Stack

| Layer        | Technologies                                                        |
| ------------ | ------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, React Router, Tailwind CSS, lucide-react, Recharts, react-hot-toast, Axios |
| **Backend**  | Node.js, Express.js, JSON Web Tokens, bcrypt, Multer, Helmet, express-rate-limit |
| **Database** | Supabase (PostgreSQL) via `@supabase/supabase-js`                   |
| **Tooling**  | Git & GitHub, nodemon                                               |

---

## 🏗️ Project Structure

```
career-guidance-system/
├── frontend_final_fixed_from_upload/   # React + Vite client
│   └── src/
│       ├── api/            # Axios instance + API helpers
│       ├── components/     # NavBar, HomeInsights, ProtectedRoute, ...
│       ├── context/        # AppContext (auth + global state)
│       ├── pages/          # Landing, Feed, Network, Jobs, dashboards, ...
│       └── styles.css      # Aurora Glow theme + helper classes
│
├── backend_final_real/                 # Express API
│   ├── config/db.js        # Supabase client
│   ├── controllers/        # auth, jobs, social, connections, profile, admin, ...
│   ├── middleware/         # auth (JWT), role guards
│   ├── routes/             # REST route definitions
│   ├── utils/              # validators, helpers
│   ├── supabase_schema.sql # Core tables
│   ├── social_schema.sql   # Networking tables (run after the core schema)
│   ├── seedAdmin.js        # Creates the admin user
│   └── seedDemo.js         # Loads demo users, jobs, posts, connections
│
└── README.md
```

---

## ⚡ Quick Start

> **Prerequisites:** Node.js 18+ and a free Supabase project.

```bash
# 1. Clone
git clone https://github.com/Thaksigan23/career-guidance-system.git
cd career-guidance-system

# 2. Backend
cd backend_final_real
npm install
#   → create .env (see Environment Variables below)
npm run dev          # starts the API on http://localhost:5000

# 3. Frontend (in a second terminal)
cd frontend_final_fixed_from_upload
npm install
npm run dev          # starts the app on http://localhost:5173
```

Before logging in, set up the database and seed an admin (next sections).

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run, in order:
   - `backend_final_real/supabase_schema.sql` — core tables (users, jobs, applications, …).
   - `backend_final_real/social_schema.sql` — networking tables (connections, posts, likes, comments, endorsements, experience/education timelines).
3. In **Project Settings → API**, copy the **Project URL** and the **service_role** key into your `.env` (next section).

> ⚠️ The `service_role` key bypasses Row Level Security. Keep it **server-side only** —
> never expose it in the frontend or commit it to git.

---

## 🔑 Environment Variables

Create `backend_final_real/.env` (use `.env.example` as a template):

```env
# Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth
JWT_SECRET=a-long-random-secret

# Server
PORT=5000
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Email (optional — used for profile notifications)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
```

Optionally set `VITE_API_BASE_URL` in the frontend if your API is not on
`http://localhost:5000/api`.

---

## 👑 Admin Account

The sign-up form only creates **student** or **employer** accounts, so the admin is seeded separately.

**Default credentials**

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `admin@careerguide.com` |
| Password | `Admin@123`             |

**Create the admin:**

```bash
cd backend_final_real
npm run seed:admin
```

Re-running resets the admin password to the default. To use custom values:

```bash
# macOS / Linux
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=YourStrongPass npm run seed:admin

# Windows PowerShell
$env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="YourStrongPass"; npm run seed:admin
```

> ⚠️ Change the default password after your first login.

---

## 🌱 Demo Data

Load sample users, profiles, jobs, applications, posts, connections, and endorsements:

```bash
cd backend_final_real
npm run seed:demo
```

| Role     | Name           | Email                    | Password    |
| -------- | -------------- | ------------------------ | ----------- |
| Admin    | System Admin   | `admin@careerguide.com`  | `Admin@123` |
| Employer | Acme Recruiter | `employer@acme.com`      | `Demo@123`  |
| Employer | TechWave HR    | `hr@techwave.com`        | `Demo@123`  |
| Student  | Jane Doe       | `jane.doe@student.com`   | `Demo@123`  |
| Student  | John Smith     | `john.smith@student.com` | `Demo@123`  |
| Student  | Priya Kumar    | `priya.k@student.com`    | `Demo@123`  |

**What gets seeded:** employer & student profiles (with skills, experience and education timelines), 6 jobs (4 approved, 2 pending), applications, saved jobs, feed posts with likes & comments, connections, and skill endorsements.

> Run `social_schema.sql` first — the networking data needs those tables to exist.

---

## 👥 User Roles

| Role         | Can do                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------- |
| **Student**  | Build a profile, browse/search/save/apply to jobs, see AI matches, use CV tools, post & network |
| **Employer** | Post jobs, view applicants, contact candidates, manage company profile, post & network          |
| **Admin**    | Approve/reject jobs, block/unblock/delete users, view platform statistics                        |

Logged-in students and employers land on the **Home feed**; admins land on the **Admin dashboard**.

---

## 🔌 API Overview

Base URL: `http://localhost:5000/api`

| Prefix              | Purpose                               |
| ------------------- | ------------------------------------- |
| `/auth`             | Register, login                       |
| `/students`         | Student profile + CV upload           |
| `/employers`        | Employer profile                      |
| `/jobs`             | Job listings & employer job CRUD      |
| `/applications`     | Apply to jobs / view applicants       |
| `/saved`            | Saved jobs                            |
| `/recommendations`  | Skill-based job matches               |
| `/cv`, `/career`    | CV analysis & career path tools       |
| `/social`           | Feed posts, likes, comments           |
| `/connections`      | Requests, suggestions, network        |
| `/profile`          | Public profiles, timelines, endorsements |
| `/admin`            | User management & job moderation      |

Protected routes require an `Authorization: Bearer <token>` header (handled automatically by the frontend Axios interceptor).

---

## 📸 Screenshots

> Place image files in `docs/screenshots/` using the names below and they render automatically on GitHub.

### 🏠 Landing Page
![Landing page](docs/screenshots/landing.png)

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

---

## 👨‍💻 Author & License

- **Thaksigan** — [github.com/Thaksigan23](https://github.com/Thaksigan23)
- This project is for **educational purposes**.
