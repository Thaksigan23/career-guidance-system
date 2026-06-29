import { supabase } from "../config/db.js";

/* =========================================================
   APPLY TO JOB (STUDENT)
========================================================= */
export const applyJob = async (req, res) => {
  const { job_id, message } = req.body;
  const student_id = req.user.id;

  if (!job_id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  // CHECK DUPLICATE FIRST
  const { data: existing, error: checkErr } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", job_id)
    .eq("student_id", student_id);

  if (checkErr) {
    console.error("Check apply error:", checkErr);
    return res.status(500).json({ error: "Server error" });
  }

  if (existing && existing.length > 0) {
    return res.status(200).json({
      success: false,
      message: "You have already applied for this job",
    });
  }

  const { error: insertErr } = await supabase.from("applications").insert({
    job_id,
    student_id,
    message: message || "",
  });

  if (insertErr) {
    console.error("Apply insert error:", insertErr);
    return res.status(500).json({ error: "Failed to apply" });
  }

  res.status(200).json({
    success: true,
    message: "Applied successfully",
  });
};

/* =========================================================
   GET APPLICATIONS FOR A JOB (EMPLOYER)
========================================================= */
export const getApplicationsForJob = async (req, res) => {
  const employer_id = req.user.id;
  const { job_id } = req.params;

  const { data: job, error: checkErr } = await supabase
    .from("jobs")
    .select("id")
    .eq("id", job_id)
    .eq("employer_id", employer_id)
    .maybeSingle();

  if (checkErr) return res.status(500).json({ error: checkErr.message });
  if (!job) return res.status(403).json({ error: "Unauthorized" });

  const { data, error } = await supabase
    .from("applications")
    .select("id, message, created_at, student:users!student_id(full_name, email, phone)")
    .eq("job_id", job_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const rows = (data || []).map(({ student, ...app }) => ({
    ...app,
    full_name: student?.full_name || null,
    email: student?.email || null,
    phone: student?.phone || null,
  }));

  res.json(rows);
};

/* =========================================================
   GET MY APPLICATIONS (STUDENT)
========================================================= */
export const getMyApplications = async (req, res) => {
  const student_id = req.user.id;

  const { data, error } = await supabase
    .from("applications")
    .select("id, message, created_at, job:jobs!job_id(title, company, location)")
    .eq("student_id", student_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const rows = (data || []).map(({ job, ...app }) => ({
    ...app,
    title: job?.title || null,
    company: job?.company || null,
    location: job?.location || null,
  }));

  res.json(rows);
};

/* =========================================================
   EMPLOYER DASHBOARD – ALL APPLICANTS
========================================================= */
export const getEmployerApplicants = async (req, res) => {
  const employer_id = req.user.id;

  const { data, error } = await supabase
    .from("applications")
    .select(
      "application_id:id, job_id, message, created_at, " +
        "job:jobs!job_id!inner(title, employer_id), " +
        "student:users!student_id(full_name, email, phone)"
    )
    .eq("job.employer_id", employer_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const rows = (data || []).map(({ job, student, ...app }) => ({
    application_id: app.application_id,
    job_id: app.job_id,
    message: app.message,
    created_at: app.created_at,
    full_name: student?.full_name || null,
    email: student?.email || null,
    phone: student?.phone || null,
    job_title: job?.title || null,
  }));

  res.json(rows);
};
