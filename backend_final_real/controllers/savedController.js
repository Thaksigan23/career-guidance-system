import { db } from "../config/db.js";

// -----------------------------------------------------------
// SAVE A JOB
// -----------------------------------------------------------
export const saveJob = (req, res) => {
  const user_id = req.user.id;
  const { job_id } = req.body;

  if (!job_id) {
    return res.status(400).json({ error: "Missing job_id" });
  }

  const checkSql = `
    SELECT * FROM saved_jobs 
    WHERE user_id = ? AND job_id = ?
  `;

  db.query(checkSql, [user_id, job_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length > 0) {
      return res.json({ message: "Already saved" });
    }

    const sql = `
      INSERT INTO saved_jobs (user_id, job_id)
      VALUES (?, ?)
    `;

    db.query(sql, [user_id, job_id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "Job saved!",
        id: result.insertId,
      });
    });
  });
};


// -----------------------------------------------------------
// GET SAVED JOBS  (FIXED VERSION)
// -----------------------------------------------------------
export const getSavedJobs = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT 
      s.id AS saved_id,
      j.id AS job_id,
      j.title,
      j.company,
      j.location,
      j.salary,
      j.description
    FROM saved_jobs s
    JOIN jobs j ON s.job_id = j.id
    WHERE s.user_id = ?
    ORDER BY s.id DESC
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
};


// -----------------------------------------------------------
// REMOVE SAVED JOB  (FIXED VERSION)
// -----------------------------------------------------------
export const removeSavedJob = (req, res) => {
  const user_id = req.user.id;
  const { saved_id } = req.params;

  const sql = `
    DELETE FROM saved_jobs
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [saved_id, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Removed from saved jobs" });
  });
};
