-- =====================================================================
-- LinkedIn-style features — additive migration for Supabase (PostgreSQL)
-- Run this once in the Supabase Dashboard → SQL Editor (after the base
-- supabase_schema.sql). Safe to re-run: everything uses IF NOT EXISTS.
-- =====================================================================

-- RICHER STUDENT PROFILE FIELDS --------------------------------------
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS headline     TEXT;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS about        TEXT;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS location     TEXT;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS open_to_work BOOLEAN NOT NULL DEFAULT false;

-- CONNECTIONS (the social graph) -------------------------------------
CREATE TABLE IF NOT EXISTS connections (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    requester_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (requester_id, receiver_id)
);

-- POSTS (activity feed) ----------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POST LIKES ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_likes (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id     BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (post_id, user_id)
);

-- POST COMMENTS -------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_comments (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id     BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- EXPERIENCE TIMELINE -------------------------------------------------
CREATE TABLE IF NOT EXISTS experience_entries (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    company      TEXT,
    location     TEXT,
    start_date   TEXT,
    end_date     TEXT,
    description  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- EDUCATION TIMELINE --------------------------------------------------
CREATE TABLE IF NOT EXISTS education_entries (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school       TEXT NOT NULL,
    degree       TEXT,
    field        TEXT,
    start_year   TEXT,
    end_year     TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SKILL ENDORSEMENTS --------------------------------------------------
CREATE TABLE IF NOT EXISTS endorsements (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    endorsed_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endorser_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill             TEXT NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (endorsed_user_id, endorser_id, skill)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_conn_requester  ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_conn_receiver   ON connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_posts_user      ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post      ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post   ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_exp_user        ON experience_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_edu_user        ON education_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_endorse_user    ON endorsements(endorsed_user_id);

-- NOTE: RLS stays disabled — the backend uses the SERVICE ROLE key and
-- enforces access control via JWT middleware.
