import { supabase } from "../config/db.js";

export const getEmployerSummary = async (req, res) => {
  const employerId = req.user.id;

  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, applications(count)")
    .eq("employer_id", employerId);

  if (error) return res.status(500).json({ error: error.message });

  const jobs = data || [];

  const jobDetails = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    applicant_count: job.applications?.[0]?.count || 0,
  }));

  const totalApplicants = jobDetails.reduce(
    (sum, j) => sum + j.applicant_count,
    0
  );

  res.json({
    total_jobs: jobs.length,
    total_applicants: totalApplicants,
    jobs: jobDetails,
  });
};
