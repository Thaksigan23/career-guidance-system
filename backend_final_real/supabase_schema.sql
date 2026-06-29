-- =====================================================================
-- Career Guidance Platform — Supabase (PostgreSQL) schema
-- Run this once in the Supabase Dashboard → SQL Editor.
-- =====================================================================

-- USERS ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    phone       TEXT,
    role        TEXT NOT NULL CHECK (role IN ('student', 'employer', 'admin')),
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- STUDENT PROFILES -----------------------------------------------------
CREATE TABLE IF NOT EXISTS student_profiles (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id           BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    education         TEXT,
    degree            TEXT,
    experience_years  INTEGER,
    skills            TEXT,
    experience        TEXT,
    cv_path           TEXT
);

-- EMPLOYER PROFILES ----------------------------------------------------
CREATE TABLE IF NOT EXISTS employer_profiles (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id   BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company   TEXT,
    position  TEXT
);

-- JOBS -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employer_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    company       TEXT,
    location      TEXT,
    salary        TEXT,
    description   TEXT,
    requirements  TEXT,
    status        TEXT NOT NULL DEFAULT 'pending',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- APPLICATIONS ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    job_id      BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SAVED JOBS -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_jobs (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id      BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, job_id)
);

-- CV ANALYSIS HISTORY --------------------------------------------------
CREATE TABLE IF NOT EXISTS cv_analysis (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cv_text          TEXT,
    analysis_result  TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_jobs_employer  ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_apps_job       ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_apps_student   ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_saved_user     ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_user        ON cv_analysis(user_id);

-- NOTE on security:
-- The backend connects with the Supabase SERVICE ROLE key and enforces
-- access control itself via JWT middleware, so Row Level Security is left
-- disabled here. Do NOT expose the service role key to the frontend.
