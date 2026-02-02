import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

// ---------------------------------------
// REGISTER  ✅ FIXED
// ---------------------------------------
export const register = (req, res) => {
  const { full_name, email, password, role, phone } = req.body;

  if (!email || !password || !full_name)
    return res
      .status(400)
      .json({ error: "Full name, email, and password required" });

  const hashed = bcrypt.hashSync(password, 10);

  // ✅ FIXED: full_name column
  const sql = `
    INSERT INTO users (full_name, email, password, phone, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [full_name, email, hashed, phone || null, role], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "User registered successfully",
      id: result.insertId,
    });
  });
};

// ---------------------------------------
// LOGIN  ✅ FIXED
// ---------------------------------------
export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = rows[0];

    // ❌ BLOCKED USER CHECK (IMPORTANT)
    if (user.status === "blocked") {
      return res.status(403).json({
        error: "Your account has been blocked by admin",
      });
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid password" });

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
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
        status: user.status, // optional but useful
      },
    });
  });
};
