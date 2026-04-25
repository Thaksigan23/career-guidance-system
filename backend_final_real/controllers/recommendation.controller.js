import { db } from "../config/db.js";

export const getRecommendations = (req, res) => {
  const userId = req.user.id;

  // 1️⃣ Get student profile
  db.query(
    "SELECT skills, experience FROM student_profiles WHERE user_id = ?",
    [userId],
    (err, students) => {
      if (err) {
        console.error("Profile fetch error:", err);
        return res.status(500).json({ error: "Profile fetch failed" });
      }

      if (students.length === 0) return res.json([]);

      const student = students[0];

      if (!student.skills) return res.json([]);

      const studentSkills = student.skills
        .split(",")
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);

      if (studentSkills.length === 0) return res.json([]);

      // Normalize experience
      let experienceLevel = "entry";
      if (student.experience) {
        if (student.experience.includes("2") || student.experience.includes("3"))
          experienceLevel = "junior";
        if (student.experience.includes("5"))
          experienceLevel = "senior";
      }

      // 2️⃣ Get jobs
      db.query(
        "SELECT * FROM jobs ORDER BY created_at DESC",
        (err, jobs) => {
          if (err) {
            console.error("Jobs fetch error:", err);
            return res.status(500).json({ error: "Jobs fetch failed" });
          }

          const experienceKeywords = {
            entry: ["intern", "trainee", "entry"],
            junior: ["junior", "associate"],
            senior: ["senior", "lead"]
          };

          const recommendedJobs = jobs.map(job => {
            let score = 0;

            const jobText = `
  ${job.title}
  ${job.requirements || ""}
`.toLowerCase();



            const jobWords = jobText.split(/\s+/);

            // 🔹 Skill matching (70%)
            let matchedSkills = 0;
            studentSkills.forEach(skill => {
              if (jobWords.includes(skill)) matchedSkills++;
            });

            const skillScore =
              studentSkills.length === 0
                ? 0
                : Math.round((matchedSkills / studentSkills.length) * 70);

            score += skillScore;

            // 🔹 Experience bonus (15%)
            const expKeywords = experienceKeywords[experienceLevel];
            if (expKeywords.some(k => jobText.includes(k))) {
              score += 15;
            }

            return {
              ...job,
              matchScore: score
            };
          });

          // 3️⃣ Filter & sort
          const finalJobs = recommendedJobs
            .filter(job => job.matchScore >= 10)
            .sort((a, b) => b.matchScore - a.matchScore);

          res.json(finalJobs);
        }
      );
    }
  );
};
