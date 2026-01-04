import { db } from "../config/db.js";

// -----------------------------------------------------
// POST NEW JOB
// -----------------------------------------------------
export const postJob = (req, res) => {
  const { title, company, location, salary, description, requirements } = req.body;
  const employer_id = req.user.id;

  if (!title || !company || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO jobs 
    (employer_id, title, company, location, salary, description, requirements)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [employer_id, title, company, location, salary, description, requirements],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Job posted successfully", id: result.insertId });
    }
  );
};


// -----------------------------------------------------
// GET ALL JOBS
// -----------------------------------------------------
export const getJobs = (req, res) => {
  const sql = `
    SELECT 
      j.*, 
      u.name AS employer_name
    FROM jobs j
    JOIN users u ON j.employer_id = u.id
    ORDER BY j.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
};


// -----------------------------------------------------
// GET SINGLE JOB BY ID
// -----------------------------------------------------
export const getJob = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      j.*, 
      u.name AS employer_name,
      u.email AS employer_email
    FROM jobs j
    JOIN users u ON j.employer_id = u.id
    WHERE j.id = ?
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows[0] || null);
  });
};


// -----------------------------------------------------
// GET JOBS POSTED BY LOGGED EMPLOYER
// -----------------------------------------------------
export const getEmployerJobs = (req, res) => {
  const employer_id = req.user.id;

  const sql = `
    SELECT 
      j.*,
      (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applicant_count
    FROM jobs j
    WHERE j.employer_id = ?
    ORDER BY j.created_at DESC
  `;

  db.query(sql, [employer_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
};


// -----------------------------------------------------
// UPDATE JOB
// -----------------------------------------------------
export const updateJob = (req, res) => {
  const { id } = req.params;
  const employer_id = req.user.id;

  const { title, company, location, salary, description, requirements } = req.body;

  const sql = `
    UPDATE jobs
    SET title = ?, company = ?, location = ?, salary = ?, description = ?, requirements = ?
    WHERE id = ? AND employer_id = ?
  `;

  db.query(
    sql,
    [title, company, location, salary, description, requirements, id, employer_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0)
        return res.status(403).json({ error: "Not authorized to update this job" });

      res.json({ message: "Job updated successfully" });
    }
  );
};


// -----------------------------------------------------
// DELETE JOB
// -----------------------------------------------------
export const deleteJob = (req, res) => {
  const { id } = req.params;
  const employer_id = req.user.id;

  const sql = "DELETE FROM jobs WHERE id = ? AND employer_id = ?";

  db.query(sql, [id, employer_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0)
      return res.status(403).json({ error: "Not authorized to delete this job" });

    res.json({ message: "Job deleted successfully" });
  });
};
