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
2. Open **SQL Editor** and run the contents of `backend_final_real/supabase_schema.sql` to create the tables.
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
