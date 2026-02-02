import { db } from "../config/db.js";

/* =========================================================
   APPLY TO JOB (STUDENT)
========================================================= */
export const applyJob = (req, res) => {
  const { job_id, message } = req.body;
  const student_id = req.user.id;

  if (!job_id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  // ✅ CHECK DUPLICATE FIRST
  const checkSql = `
    SELECT id FROM applications
    WHERE job_id = ? AND student_id = ?
  `;

  db.query(checkSql, [job_id, student_id], (err, rows) => {
    if (err) {
      console.error("Check apply error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (rows.length > 0) {
      return res.status(200).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // ✅ INSERT
    const insertSql = `
      INSERT INTO applications (job_id, student_id, message)
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [job_id, student_id, message || ""], (err) => {
      if (err) {
        console.error("Apply insert error:", err);
        return res.status(500).json({ error: "Failed to apply" });
      }

      // ✅ ALWAYS RETURN 200
      res.status(200).json({
        success: true,
        message: "Applied successfully"
      });
    });
  });
};


/* =========================================================
   GET APPLICATIONS FOR A JOB (EMPLOYER)
========================================================= */
export const getApplicationsForJob = (req, res) => {
  const employer_id = req.user.id;
  const { job_id } = req.params;

  const checkSql = `
    SELECT id FROM jobs
    WHERE id = ? AND employer_id = ?
  `;

  db.query(checkSql, [job_id, employer_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0)
      return res.status(403).json({ error: "Unauthorized" });

    const sql = `
      SELECT 
        a.id,
        a.message,
        a.created_at,
        u.full_name,
        u.email,
        u.phone
      FROM applications a
      JOIN users u ON a.student_id = u.id
      WHERE a.job_id = ?
      ORDER BY a.created_at DESC
    `;

    db.query(sql, [job_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
};

/* =========================================================
   GET MY APPLICATIONS (STUDENT)
========================================================= */
export const getMyApplications = (req, res) => {
  const student_id = req.user.id;

  const sql = `
    SELECT 
      a.id,
      a.message,
      a.created_at,
      j.title,
      j.company,
      j.location
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.student_id = ?
    ORDER BY a.created_at DESC
  `;

  db.query(sql, [student_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

/* =========================================================
   EMPLOYER DASHBOARD – ALL APPLICANTS
========================================================= */
export const getEmployerApplicants = (req, res) => {
  const employer_id = req.user.id;

  const sql = `
    SELECT 
      a.id AS application_id,
      a.job_id,
      a.message,
      a.created_at,
      u.full_name,
      u.email,
      u.phone,
      j.title AS job_title
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.student_id = u.id
    WHERE j.employer_id = ?
    ORDER BY a.created_at DESC
  `;

  db.query(sql, [employer_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
