// Lightweight, dependency-free input validation helpers.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

// Validates the registration payload. Returns an array of error messages
// (empty when the payload is valid).
export function validateRegister({ full_name, email, password, role }) {
  const errors = [];

  if (!isNonEmptyString(full_name)) {
    errors.push("Full name is required.");
  }

  if (!isValidEmail(email)) {
    errors.push("A valid email is required.");
  }

  if (!isNonEmptyString(password) || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (role && !["student", "employer", "admin"].includes(role)) {
    errors.push("Invalid role.");
  }

  return errors;
}

export function validateLogin({ email, password }) {
  const errors = [];

  if (!isValidEmail(email)) {
    errors.push("A valid email is required.");
  }

  if (!isNonEmptyString(password)) {
    errors.push("Password is required.");
  }

  return errors;
}

export function validateJob({ title, description, requirements }) {
  const errors = [];

  if (!isNonEmptyString(title)) {
    errors.push("Job title is required.");
  }

  if (description && typeof description !== "string") {
    errors.push("Description must be text.");
  }

  if (requirements && typeof requirements !== "string") {
    errors.push("Requirements must be text.");
  }

  return errors;
}
