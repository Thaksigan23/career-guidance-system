import { supabase } from "../config/db.js";

// -------------------------------
// GET ALL USERS
// -------------------------------
export const getAllUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role, phone, status, created_at")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
};

// -------------------------------
// UPDATE USER ROLE
// -------------------------------
export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // optional change

  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "User updated successfully" });
};

// -------------------------------
// GET ALL JOBS
// -------------------------------
export const getAllJobs = async (req, res) => {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, title, company, location, status, created_at, employer:users!employer_id(full_name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin getAllJobs error:", error);
    return res.status(500).json({ error: error.message });
  }

  const rows = (data || []).map(({ employer, ...job }) => ({
    ...job,
    employer: employer?.full_name || null,
  }));

  res.json(rows);
};

// -------------------------------
// APPROVE JOB
// -------------------------------
export const approveJob = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("jobs")
    .update({ status: "approved" })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("APPROVE ERROR:", error);
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json({ message: "Job approved successfully" });
};

// -------------------------------
// REJECT JOB
// -------------------------------
export const rejectJob = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("jobs")
    .update({ status: "rejected" })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("REJECT ERROR:", error);
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json({ message: "Job rejected successfully" });
};

export const blockUser = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .update({ status: "blocked" })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "User blocked successfully" });
};

export const unblockUser = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .update({ status: "active" })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "User unblocked successfully" });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "User deleted" });
};
