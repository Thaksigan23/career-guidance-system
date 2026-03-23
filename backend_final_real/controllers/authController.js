import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";


// ---------------------------------------
// REGISTER
// ---------------------------------------
export const register = (req, res) => {
  const { full_name, email, password, role, phone } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      error: "Full name, email, and password are required",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // ✅ Always set status = 'active' explicitly
  const sql = `
    INSERT INTO users (full_name, email, password, phone, role, status)
    VALUES (?, ?, ?, ?, ?, 'active')
  `;

  db.query(
    sql,
    [full_name, email, hashedPassword, phone || null, role || "student"],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            error: "Email already exists",
          });
        }
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "User registered successfully",
        id: result.insertId,
      });
    }
  );
};


// ---------------------------------------
// LOGIN
// ---------------------------------------
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.query(sql, [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length === 0) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const user = rows[0];

    // 🚫 BLOCKED USER CHECK (CRITICAL)
    if (user.status === "blocked") {
      return res.status(403).json({
        error: "Your account has been blocked by admin",
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }

    // ✅ Include status in token (optional but useful)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  });
};
