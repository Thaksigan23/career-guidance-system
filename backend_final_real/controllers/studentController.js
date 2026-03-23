// controllers/studentController.js
import { db } from "../config/db.js";
import nodemailer from "nodemailer";

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

// =====================================================
// ✅ GET PROFILE (EXPORT MUST EXIST)
// =====================================================
export const getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      u.full_name,
      u.email,
      u.phone,
      sp.education,
      sp.degree,
      sp.experience_years,
      sp.skills,
      sp.experience
    FROM users u
    LEFT JOIN student_profiles sp ON sp.user_id = u.id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to load profile" });
    }
    res.json(rows[0] || {});
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
