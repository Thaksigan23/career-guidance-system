import { supabase } from "../config/db.js";

/* ===========================
   SAVE A JOB
=========================== */
export const saveJob = async (req, res) => {
  const user_id = req.user.id;
  const { job_id } = req.body;

  if (!job_id) {
    return res.status(400).json({ error: "Missing job_id" });
  }

  const { data: existing, error: checkErr } = await supabase
    .from("saved_jobs")
    .select("id")
    .eq("user_id", user_id)
    .eq("job_id", job_id);

  if (checkErr) return res.status(500).json({ error: checkErr.message });

  if (existing && existing.length > 0) {
    return res.json({ message: "Already saved" });
  }

  const { data, error } = await supabase
    .from("saved_jobs")
    .insert({ user_id, job_id })
    .select("id")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    message: "Job saved!",
    saved_id: data.id,
  });
};

/* ===========================
   GET SAVED JOBS
=========================== */
export const getSavedJobs = async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("saved_jobs")
    .select(
      "saved_id:id, job_id, job:jobs!job_id(title, company, location, salary, description)"
    )
    .eq("user_id", user_id)
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const rows = (data || []).map(({ job, saved_id, job_id }) => ({
    saved_id,
    job_id,
    title: job?.title || null,
    company: job?.company || null,
    location: job?.location || null,
    salary: job?.salary || null,
    description: job?.description || null,
  }));

  res.json(rows);
};

/* ===========================
   REMOVE SAVED JOB
=========================== */
export const removeSavedJob = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  const { data, error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id)
    .select("id");

  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Saved job not found" });
  }

  res.json({ message: "Removed from saved jobs" });
};
