import { supabase } from "../config/db.js";
import { validateJob } from "../utils/validators.js";

export const postJob = async (req, res) => {
  const employerId = req.user.id; // from JWT
  const { title, company, location, salary, description, requirements } = req.body;

  const validationErrors = validateJob({ title, description, requirements });
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: validationErrors.join(" ") });
  }

  const parsedSalary =
    salary === null || salary === undefined || salary === ""
      ? null
      : String(salary);

  const { error } = await supabase.from("jobs").insert({
    employer_id: employerId,
    title,
    company: company || null,
    location: location || null,
    salary: parsedSalary,
    description: description || null,
    requirements: requirements || null,
  });

  if (error) {
    console.error("POST JOB ERROR:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Job posted successfully" });
};

// -----------------------------------------------------
// GET ALL JOBS
// -----------------------------------------------------
export const getJobs = async (req, res) => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, employer:users!employer_id(full_name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET JOBS ERROR:", error);
    return res.status(500).json({ error: error.message });
  }

  const rows = (data || []).map(({ employer, ...job }) => ({
    ...job,
    employer_name: employer?.full_name || null,
  }));

  res.json(rows);
};

// -----------------------------------------------------
// GET SINGLE JOB BY ID
// -----------------------------------------------------
export const getJob = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("jobs")
    .select("*, employer:users!employer_id(full_name, email)")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  if (!data) return res.json(null);

  const { employer, ...job } = data;
  res.json({
    ...job,
    employer_name: employer?.full_name || null,
    employer_email: employer?.email || null,
  });
};

// -----------------------------------------------------
// GET JOBS POSTED BY LOGGED EMPLOYER
// -----------------------------------------------------
export const getEmployerJobs = async (req, res) => {
  const employer_id = req.user.id;

  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications(count)")
    .eq("employer_id", employer_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const rows = (data || []).map(({ applications, ...job }) => ({
    ...job,
    applicant_count: applications?.[0]?.count || 0,
  }));

  res.json(rows);
};

// -----------------------------------------------------
// UPDATE JOB
// -----------------------------------------------------
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const employer_id = req.user.id;

  const { title, company, location, salary, description, requirements } = req.body;

  const { data, error } = await supabase
    .from("jobs")
    .update({ title, company, location, salary, description, requirements })
    .eq("id", id)
    .eq("employer_id", employer_id)
    .select("id");

  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0)
    return res.status(403).json({ error: "Not authorized to update this job" });

  res.json({ message: "Job updated successfully" });
};

// -----------------------------------------------------
// DELETE JOB
// -----------------------------------------------------
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const employer_id = req.user.id;

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .eq("employer_id", employer_id)
    .select("id");

  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0)
    return res.status(403).json({ error: "Not authorized to delete this job" });

  res.json({ message: "Job deleted successfully" });
};
