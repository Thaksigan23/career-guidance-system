// controllers/studentController.js
import { supabase } from "../config/db.js";
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

// =====================================================
// GET PROFILE
// =====================================================
export const getProfile = async (req, res) => {
  const userId = req.user.id;

  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("full_name, email, phone")
    .eq("id", userId)
    .maybeSingle();

  if (userErr) {
    console.error(userErr);
    return res.status(500).json({ message: "Failed to load profile" });
  }

  const { data: sp, error: spErr } = await supabase
    .from("student_profiles")
    .select("education, degree, experience_years, skills, experience, cv_path")
    .eq("user_id", userId)
    .maybeSingle();

  if (spErr) {
    console.error(spErr);
    return res.status(500).json({ message: "Failed to load profile" });
  }

  const profile = { ...(user || {}), ...(sp || {}) };
  const cvUrl = profile.cv_path ? `/uploads/${profile.cv_path}` : null;
  res.json({ ...profile, cv_url: cvUrl });
};

// =====================================================
// UPDATE PROFILE
// =====================================================
export const updateProfile = async (req, res) => {
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

  // 1) Update users table
  const { error: userErr } = await supabase
    .from("users")
    .update({ full_name, phone })
    .eq("id", userId);

  if (userErr) return res.status(500).json({ error: userErr.message });

  // 2) Check if a student profile already exists
  const { data: existing, error: checkErr } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (checkErr) return res.status(500).json({ error: checkErr.message });

  if (!existing) {
    const { error: insertErr } = await supabase.from("student_profiles").insert({
      user_id: userId,
      education,
      degree,
      experience_years,
      skills,
      experience,
    });

    if (insertErr) return res.status(500).json({ error: insertErr.message });

    await sendEmail(
      userEmail,
      "Profile Created",
      `Hi ${full_name}, your profile has been created successfully.`
    );

    return res.json({ message: "Profile created" });
  }

  const { error: updateErr } = await supabase
    .from("student_profiles")
    .update({ education, degree, experience_years, skills, experience })
    .eq("user_id", userId);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  await sendEmail(
    userEmail,
    "Profile Updated",
    `Hi ${full_name}, your profile has been updated successfully.`
  );

  res.json({ message: "Profile updated" });
};

// =====================================================
// CV MANAGEMENT
// =====================================================
export const uploadProfileCV = async (req, res) => {
  const userId = req.user.id;
  if (!req.file) {
    return res.status(400).json({ message: "No CV uploaded" });
  }

  const newCvPath = path.posix.join("profile-cvs", req.file.filename);

  const { data: existing, error: fetchErr } = await supabase
    .from("student_profiles")
    .select("cv_path")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchErr) return res.status(500).json({ error: fetchErr.message });

  const previousCvPath = existing?.cv_path;

  const finalize = () =>
    res.json({
      message: "CV uploaded successfully",
      cv_url: `/uploads/${newCvPath}`,
      cv_file_name: req.file.originalname,
    });

  if (!existing) {
    const { error: insertErr } = await supabase
      .from("student_profiles")
      .insert({ user_id: userId, cv_path: newCvPath });
    if (insertErr) return res.status(500).json({ error: insertErr.message });
    return finalize();
  }

  const { error: updateErr } = await supabase
    .from("student_profiles")
    .update({ cv_path: newCvPath })
    .eq("user_id", userId);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  if (previousCvPath) {
    const oldCvAbsPath = path.resolve(process.cwd(), "uploads", previousCvPath);
    fs.unlink(oldCvAbsPath, () => {});
  }
  return finalize();
};

export const deleteProfileCV = async (req, res) => {
  const userId = req.user.id;

  const { data: existing, error: fetchErr } = await supabase
    .from("student_profiles")
    .select("cv_path")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchErr) return res.status(500).json({ error: fetchErr.message });
  if (!existing || !existing.cv_path) {
    return res.status(404).json({ message: "No CV found" });
  }

  const cvPath = existing.cv_path;

  const { error: updateErr } = await supabase
    .from("student_profiles")
    .update({ cv_path: null })
    .eq("user_id", userId);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  const absPath = path.resolve(process.cwd(), "uploads", cvPath);
  fs.unlink(absPath, () => {});
  return res.json({ message: "CV deleted successfully" });
};
