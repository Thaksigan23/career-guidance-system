import { db } from "../config/db.js";

// -------------------------------
// GET ALL USERS
// -------------------------------
export const getAllUsers = (req, res) => {
  const sql = `
    SELECT id, full_name, email, role, phone
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// -------------------------------
// ACTIVATE / DEACTIVATE USER
// -------------------------------
export const updateUserStatus = (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // optional change

  const sql = `UPDATE users SET role = ? WHERE id = ?`;

  db.query(sql, [role, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User updated successfully" });
  });
};

// -------------------------------
// GET ALL JOBS
// -------------------------------
export const getAllJobs = (req, res) => {
  const sql = `
    SELECT 
      j.id,
      j.title,
      j.company,
      j.location,
            j.status,        -- ✅ ADD THIS
      j.created_at,
      u.full_name AS employer
    FROM jobs j
    JOIN users u ON j.employer_id = u.id
    ORDER BY j.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Admin getAllJobs error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};


// -------------------------------
// APPROVE JOB
// -------------------------------
export const approveJob = (req, res) => {
  const { id } = req.params;

  console.log("APPROVE JOB ID:", id); // 🔥 DEBUG

  const sql = "UPDATE jobs SET status = 'approved' WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("APPROVE ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    console.log("AFFECTED ROWS:", result.affectedRows); // 🔥 DEBUG

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job approved successfully" });
  });
};


export const rejectJob = (req, res) => {
  const { id } = req.params;

  console.log("REJECT JOB ID:", id); // 🔥 DEBUG

  const sql = "UPDATE jobs SET status = 'rejected' WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("REJECT ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    console.log("AFFECTED ROWS:", result.affectedRows); // 🔥 DEBUG

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job rejected successfully" });
  });
};

export const blockUser = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE users SET status='blocked' WHERE id=?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User blocked successfully" });
    }
  );
};

export const unblockUser = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE users SET status='active' WHERE id=?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User unblocked successfully" });
    }
  );
};

export const deleteUser = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM users WHERE id=?",
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User deleted" });
    }
  );
};

