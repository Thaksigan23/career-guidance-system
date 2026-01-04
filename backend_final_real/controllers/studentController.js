import { db } from "../config/db.js";
import nodemailer from "nodemailer";

// -------------------------
// EMAIL TRANSPORTER
// -------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS
  }
});

// -------------------------
// SEND EMAIL (Safe Wrapper)
// -------------------------
async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({ to, subject, text });
  } catch (err) {
    console.log("Email error →", err.message);
  }
}

// -----------------------------------------------------
// GET PROFILE
// -----------------------------------------------------
export const getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      u.name,
      u.email,
      u.phone,
      sp.education,
      sp.skills,
      sp.experience
    FROM users u
    LEFT JOIN student_profiles sp ON sp.user_id = u.id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.json(rows[0] || {});
  });
};

// -----------------------------------------------------
// UPDATE PROFILE (FINAL)
// -----------------------------------------------------
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  const { name, phone, education, skills, experience } = req.body;

  // 1️⃣ UPDATE users TABLE
  const updateUserSql = `
    UPDATE users 
    SET name = ?, phone = ?
    WHERE id = ?
  `;

  db.query(updateUserSql, [name || null, phone || null, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // 2️⃣ CHECK IF PROFILE EXISTS
    const checkSql = "SELECT * FROM student_profiles WHERE user_id = ?";

    db.query(checkSql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // -----------------------------------------------------
      // CASE A — FIRST TIME → INSERT PROFILE
      // -----------------------------------------------------
      if (rows.length === 0) {
        const insertSql = `
          INSERT INTO student_profiles (user_id, education, skills, experience)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [userId, education || null, skills || null, experience || null],
          async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Send Email (SAFE)
            await sendEmail(
              userEmail,
              "Your Profile Has Been Created",
              `Hi ${name}, your student profile has been created successfully.`
            );

            return res.json({
              status: "created",
              message: "Profile created successfully",
              id: result.insertId,
            });
          }
        );
      }

      // -----------------------------------------------------
      // CASE B — UPDATE EXISTING PROFILE
      // -----------------------------------------------------
      else {
        const updateSql = `
          UPDATE student_profiles
          SET education = ?, skills = ?, experience = ?
          WHERE user_id = ?
        `;

        db.query(
          updateSql,
          [education || null, skills || null, experience || null, userId],
          async (err) => {
            if (err) return res.status(500).json({ error: err.message });

            await sendEmail(
              userEmail,
              "Profile Updated",
              `Hi ${name}, your student profile has been updated successfully.`
            );

            return res.json({
              status: "updated",
              message: "Profile updated successfully",
            });
          }
        );
      }
    });
  });
};
