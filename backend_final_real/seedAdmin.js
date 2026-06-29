import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { supabase } from "./config/db.js";

dotenv.config();

// Default admin credentials (override via env if you want)
const ADMIN_NAME = process.env.ADMIN_NAME || "System Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@careerguide.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

async function seedAdmin() {
  const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

  const { data: existing, error: lookupError } = await supabase
    .from("users")
    .select("id")
    .eq("email", ADMIN_EMAIL)
    .maybeSingle();

  if (lookupError) {
    console.error("Lookup failed:", lookupError.message);
    process.exit(1);
  }

  if (existing) {
    const { error } = await supabase
      .from("users")
      .update({
        full_name: ADMIN_NAME,
        password: hashedPassword,
        role: "admin",
        status: "active",
      })
      .eq("id", existing.id);

    if (error) {
      console.error("Failed to update admin:", error.message);
      process.exit(1);
    }

    console.log(`Admin updated -> ${ADMIN_EMAIL} (password reset to default)`);
  } else {
    const { error } = await supabase.from("users").insert({
      full_name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    if (error) {
      console.error("Failed to create admin:", error.message);
      process.exit(1);
    }

    console.log(`Admin created -> ${ADMIN_EMAIL}`);
  }

  console.log("Login with:");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}

seedAdmin();
