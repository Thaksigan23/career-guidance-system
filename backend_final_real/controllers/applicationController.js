import { db } from "../config/db.js";

// -----------------------------------------------------------
// APPLY TO JOB (Students)
// -----------------------------------------------------------
export const applyJob = (req, res) => {
  const student_id = req.user.id;
  const { job_id, message } = req.body;

  if (!job_id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  const checkSql = `
    SELECT * FROM applications 
    WHERE job_id = ? AND student_id = ?
  `;

  db.query(checkSql, [job_id, student_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length > 0) {
      return res.json({ message: "Already applied" });
    }

    const sql = `
      INSERT INTO applications (job_id, student_id, message)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [job_id, student_id, message], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "Application submitted",
        id: result.insertId,
      });
    });
  });
};


// -----------------------------------------------------------
// GET APPLICATIONS FOR A SPECIFIC JOB (Employer only)
// -----------------------------------------------------------
export const getApplicationsForJob = (req, res) => {
  const employer_id = req.user.id;
  const { job_id } = req.params;

  const checkSql = `
    SELECT * FROM jobs WHERE id = ? AND employer_id = ?
  `;

  db.query(checkSql, [job_id, employer_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const sql = `
      SELECT 
        a.id,
        a.message,
        a.created_at,
        u.name,
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


// -----------------------------------------------------------
// GET APPLICATIONS BY LOGGED-IN STUDENT
// -----------------------------------------------------------
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


// -----------------------------------------------------------
// GET ALL APPLICANTS FOR ALL JOBS (Employer Dashboard)
// -----------------------------------------------------------
export const getEmployerApplicants = (req, res) => {
  const employer_id = req.user.id;

  const sql = `
    SELECT 
      a.id AS application_id,
      a.job_id,
      a.message,
      a.created_at,
      u.name,
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
