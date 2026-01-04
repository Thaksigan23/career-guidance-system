import { db } from "../config/db.js";

export const getEmployerSummary = (req, res) => {
  const employerId = req.user.id;

  const jobsQuery = "SELECT id, title FROM jobs WHERE employer_id = ?";

  db.query(jobsQuery, [employerId], (err, jobs) => {
    if (err) return res.status(500).json({ error: err.message });

    if (jobs.length === 0) {
      return res.json({
        total_jobs: 0,
        total_applicants: 0,
        jobs: []
      });
    }

    // Convert job IDs to comma-separated SQL string
    const jobIds = jobs.map(j => j.id);
    const jobIdList = jobIds.join(','); 

    const applicantsQuery = `
      SELECT job_id, COUNT(*) AS count
      FROM applications
      WHERE job_id IN (${jobIdList})
      GROUP BY job_id
    `;

    db.query(applicantsQuery, (err, applicantRows) => {
      if (err) return res.status(500).json({ error: err.message });

      const applicantMap = {};
      applicantRows.forEach((row) => {
        applicantMap[row.job_id] = row.count;
      });

      const jobDetails = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        applicant_count: applicantMap[job.id] || 0
      }));

      const totalApplicants = jobDetails.reduce(
        (sum, j) => sum + j.applicant_count,
        0
      );

      res.json({
        total_jobs: jobs.length,
        total_applicants: totalApplicants,
        jobs: jobDetails
      });
    });
  });
};
