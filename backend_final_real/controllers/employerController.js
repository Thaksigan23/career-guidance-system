import { db } from "../config/db.js";

// -----------------------------------------------------
// GET EMPLOYER PROFILE
// -----------------------------------------------------
export const getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      u.name,
      u.email,
      u.phone,
      ep.company_name AS company,
      ep.position
    FROM users u
    LEFT JOIN employer_profiles ep ON ep.user_id = u.id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Avoid sending null to the frontend
    const data = rows[0] || {
      name: "",
      email: "",
      phone: "",
      company: "",
      position: ""
    };

    return res.json(data);
  });
};

// -----------------------------------------------------
// UPDATE EMPLOYER PROFILE
// -----------------------------------------------------
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name, phone, company, position } = req.body;

  if (!company || !position) {
    return res.status(400).json({ error: "Company and Position are required." });
  }

  // Update user table
  const updateUserSql = `
    UPDATE users 
    SET name = ?, phone = ?
    WHERE id = ?
  `;

  db.query(updateUserSql, [name || null, phone || null, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Check if employer profile exists
    const checkSql = "SELECT * FROM employer_profiles WHERE user_id = ?";

    db.query(checkSql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // CREATE NEW PROFILE
      if (rows.length === 0) {
        const insertSql = `
          INSERT INTO employer_profiles (user_id, company_name, position)
          VALUES (?, ?, ?)
        `;

        db.query(insertSql, [userId, company, position], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          return res.json({
            message: "Employer profile created successfully.",
            id: result.insertId,
          });
        });
      }

      // UPDATE EXISTING PROFILE
      else {
        const updateSql = `
          UPDATE employer_profiles
          SET company_name = ?, position = ?
          WHERE user_id = ?
        `;

        db.query(updateSql, [company, position, userId], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          return res.json({
            message: "Employer profile updated successfully.",
          });
        });
      }
    });
  });
};
