import { supabase } from "../config/db.js";

export const getRecommendations = async (req, res) => {
  const userId = req.user.id;

  // 1) Get student profile
  const { data: student, error: profileErr } = await supabase
    .from("student_profiles")
    .select("skills, experience")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileErr) {
    console.error("Profile fetch error:", profileErr);
    return res.status(500).json({ error: "Profile fetch failed" });
  }

  if (!student || !student.skills) return res.json([]);

  const studentSkills = student.skills
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (studentSkills.length === 0) return res.json([]);

  // Normalize experience
  let experienceLevel = "entry";
  if (student.experience) {
    if (student.experience.includes("2") || student.experience.includes("3"))
      experienceLevel = "junior";
    if (student.experience.includes("5")) experienceLevel = "senior";
  }

  // 2) Get jobs
  const { data: jobs, error: jobsErr } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (jobsErr) {
    console.error("Jobs fetch error:", jobsErr);
    return res.status(500).json({ error: "Jobs fetch failed" });
  }

  const experienceKeywords = {
    entry: ["intern", "trainee", "entry"],
    junior: ["junior", "associate"],
    senior: ["senior", "lead"],
  };

  const recommendedJobs = (jobs || []).map((job) => {
    let score = 0;

    const jobText = `
  ${job.title}
  ${job.requirements || ""}
`.toLowerCase();

    const jobWords = jobText.split(/\s+/);

    // Skill matching (70%)
    let matchedSkills = 0;
    studentSkills.forEach((skill) => {
      if (jobWords.includes(skill)) matchedSkills++;
    });

    const skillScore =
      studentSkills.length === 0
        ? 0
        : Math.round((matchedSkills / studentSkills.length) * 70);

    score += skillScore;

    // Experience bonus (15%)
    const expKeywords = experienceKeywords[experienceLevel];
    if (expKeywords.some((k) => jobText.includes(k))) {
      score += 15;
    }

    return { ...job, matchScore: score };
  });

  // 3) Filter & sort
  const finalJobs = recommendedJobs
    .filter((job) => job.matchScore >= 10)
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json(finalJobs);
};
