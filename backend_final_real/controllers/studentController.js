// controllers/studentController.js
import { db } from "../config/db.js";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// -------------------------
// EMAIL TRANSPORTER
// -------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------------------------
// SEND EMAIL
// -------------------------
async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({ to, subject, text });
  } catch (err) {
    console.log("Email error →", err.message);
  }
}

const ensureCvColumn = (callback) => {
  const sql = `
    ALTER TABLE student_profiles
    ADD COLUMN IF NOT EXISTS cv_path VARCHAR(255) NULL
  `;
  db.query(sql, () => callback());
};

// =====================================================
// ✅ GET PROFILE (EXPORT MUST EXIST)
// =====================================================
export const getProfile = (req, res) => {
  const userId = req.user.id;
  ensureCvColumn(() => {
    const sql = `
      SELECT 
        u.full_name,
        u.email,
        u.phone,
        sp.education,
        sp.degree,
        sp.experience_years,
        sp.skills,
        sp.experience,
        sp.cv_path
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      WHERE u.id = ?
    `;

    db.query(sql, [userId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to load profile" });
      }
      const profile = rows[0] || {};
      const cvUrl = profile.cv_path ? `/uploads/${profile.cv_path}` : null;
      res.json({ ...profile, cv_url: cvUrl });
    });
  });
};

// =====================================================
// ✅ UPDATE PROFILE (EXPORT MUST EXIST)
// =====================================================
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  const {
    full_name,
    phone,
    education,
    degree,
    experience_years,
    skills,
    experience,
  } = req.body;

  // 1️⃣ Update users table
  const updateUserSql = `
    UPDATE users 
    SET full_name = ?, phone = ?
    WHERE id = ?
  `;

  db.query(updateUserSql, [full_name, phone, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // 2️⃣ Check student_profiles
    const checkSql = "SELECT id FROM student_profiles WHERE user_id = ?";

    db.query(checkSql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // INSERT
      if (rows.length === 0) {
        const insertSql = `
          INSERT INTO student_profiles
          (user_id, education, degree, experience_years, skills, experience)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            userId,
            education,
            degree,
            experience_years,
            skills,
            experience,
          ],
          async (err) => {
            if (err) return res.status(500).json({ error: err.message });

            await sendEmail(
              userEmail,
              "Profile Created",
              `Hi ${full_name}, your profile has been created successfully.`
            );

            res.json({ message: "Profile created" });
          }
        );
      }

      // UPDATE
      else {
        const updateSql = `
          UPDATE student_profiles
          SET education = ?, degree = ?, experience_years = ?, skills = ?, experience = ?
          WHERE user_id = ?
        `;

        db.query(
          updateSql,
          [
            education,
            degree,
            experience_years,
            skills,
            experience,
            userId,
          ],
          async (err) => {
            if (err) return res.status(500).json({ error: err.message });

            await sendEmail(
              userEmail,
              "Profile Updated",
              `Hi ${full_name}, your profile has been updated successfully.`
            );

            res.json({ message: "Profile updated" });
          }
        );
      }
    });
  });
};

// =====================================================
// CV MANAGEMENT
// =====================================================
export const uploadProfileCV = (req, res) => {
  const userId = req.user.id;
  if (!req.file) {
    return res.status(400).json({ message: "No CV uploaded" });
  }

  ensureCvColumn(() => {
    const newCvPath = path.posix.join("profile-cvs", req.file.filename);
    const getExistingSql = "SELECT cv_path FROM student_profiles WHERE user_id = ?";

    db.query(getExistingSql, [userId], (fetchErr, rows) => {
      if (fetchErr) return res.status(500).json({ error: fetchErr.message });

      const previousCvPath = rows[0]?.cv_path;
      const finalize = () =>
        res.json({
          message: "CV uploaded successfully",
          cv_url: `/uploads/${newCvPath}`,
          cv_file_name: req.file.originalname,
        });

      if (rows.length === 0) {
        const insertSql = `
          INSERT INTO student_profiles (user_id, cv_path)
          VALUES (?, ?)
        `;
        return db.query(insertSql, [userId, newCvPath], (insertErr) => {
          if (insertErr) return res.status(500).json({ error: insertErr.message });
          return finalize();
        });
      }

      const updateSql = `
        UPDATE student_profiles
        SET cv_path = ?
        WHERE user_id = ?
      `;
      db.query(updateSql, [newCvPath, userId], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });
        if (previousCvPath) {
          const oldCvAbsPath = path.resolve(process.cwd(), "uploads", previousCvPath);
          fs.unlink(oldCvAbsPath, () => {});
        }
        return finalize();
      });
    });
  });
};

export const deleteProfileCV = (req, res) => {
  const userId = req.user.id;
  ensureCvColumn(() => {
    const getSql = "SELECT cv_path FROM student_profiles WHERE user_id = ?";

    db.query(getSql, [userId], (fetchErr, rows) => {
      if (fetchErr) return res.status(500).json({ error: fetchErr.message });
      if (!rows.length || !rows[0].cv_path) {
        return res.status(404).json({ message: "No CV found" });
      }

      const cvPath = rows[0].cv_path;
      db.query(
        "UPDATE student_profiles SET cv_path = NULL WHERE user_id = ?",
        [userId],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: updateErr.message });
          const absPath = path.resolve(process.cwd(), "uploads", cvPath);
          fs.unlink(absPath, () => {});
          return res.json({ message: "CV deleted successfully" });
        }
      );
    });
  });
};
