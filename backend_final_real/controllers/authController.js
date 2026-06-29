import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/db.js";
import { validateRegister, validateLogin } from "../utils/validators.js";

// ---------------------------------------
// REGISTER
// ---------------------------------------
export const register = async (req, res) => {
  const { full_name, email, password, role, phone } = req.body;

  const validationErrors = validateRegister({ full_name, email, password, role });
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: validationErrors.join(" ") });
  }

  // Prevent self-registration as admin via the public endpoint.
  const safeRole = role === "employer" ? "employer" : "student";

  const hashedPassword = bcrypt.hashSync(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone: phone || null,
      role: safeRole,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    // 23505 = unique_violation (duplicate email)
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: "User registered successfully",
    id: data.id,
  });
};

// ---------------------------------------
// LOGIN
// ---------------------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  const validationErrors = validateLogin({ email, password });
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: validationErrors.join(" ") });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  if (user.status === "blocked") {
    return res.status(403).json({
      error: "Your account has been blocked by admin",
    });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid password" });
  }

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
};
