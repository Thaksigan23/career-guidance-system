// controllers/profileController.js
// Public profiles, experience/education timelines and skill endorsements.
import { supabase } from "../config/db.js";

// =====================================================
// GET PUBLIC PROFILE (any logged-in user can view)
// =====================================================
export const getPublicProfile = async (req, res) => {
  const me = req.user.id;
  const userId = parseInt(req.params.id, 10);
  if (!userId) return res.status(400).json({ error: "Invalid user" });

  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("id, full_name, email, phone, role, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (userErr) return res.status(500).json({ error: userErr.message });
  if (!user) return res.status(404).json({ error: "User not found" });

  let extra = {};
  if (user.role === "student") {
    const { data } = await supabase
      .from("student_profiles")
      .select(
        "headline, about, location, open_to_work, education, degree, experience_years, skills, experience, cv_path"
      )
      .eq("user_id", userId)
      .maybeSingle();
    extra = data || {};
  } else if (user.role === "employer") {
    const { data } = await supabase
      .from("employer_profiles")
      .select("company, position")
      .eq("user_id", userId)
      .maybeSingle();
    extra = data || {};
  }

  const { data: experiences } = await supabase
    .from("experience_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const { data: education } = await supabase
    .from("education_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const { data: endorseRows } = await supabase
    .from("endorsements")
    .select("skill, endorser_id")
    .eq("endorsed_user_id", userId);

  const endorsements = {};
  (endorseRows || []).forEach((r) => {
    if (!endorsements[r.skill]) endorsements[r.skill] = { count: 0, mine: false };
    endorsements[r.skill].count += 1;
    if (r.endorser_id === me) endorsements[r.skill].mine = true;
  });

  const { count: connectionCount } = await supabase
    .from("connections")
    .select("id", { count: "exact", head: true })
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

  const { data: posts } = await supabase
    .from("posts")
    .select("id, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  const cvUrl = extra?.cv_path ? `/uploads/${extra.cv_path}` : null;

  res.json({
    ...user,
    ...extra,
    cv_url: cvUrl,
    experiences: experiences || [],
    education_entries: education || [],
    endorsements,
    connection_count: connectionCount || 0,
    posts: posts || [],
    is_me: userId === me,
  });
};

// =====================================================
// EXPERIENCE ENTRIES
// =====================================================
export const addExperience = async (req, res) => {
  const userId = req.user.id;
  const { title, company, location, start_date, end_date, description } =
    req.body || {};

  if (!title || !`${title}`.trim())
    return res.status(400).json({ error: "Job title is required" });

  const { data, error } = await supabase
    .from("experience_entries")
    .insert({
      user_id: userId,
      title: `${title}`.trim(),
      company: company || null,
      location: location || null,
      start_date: start_date || null,
      end_date: end_date || null,
      description: description || null,
    })
    .select("*")
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Experience added", entry: data });
};

export const deleteExperience = async (req, res) => {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from("experience_entries")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", userId)
    .select("id");

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Entry not found" });
  res.json({ message: "Experience removed" });
};

// =====================================================
// EDUCATION ENTRIES
// =====================================================
export const addEducation = async (req, res) => {
  const userId = req.user.id;
  const { school, degree, field, start_year, end_year } = req.body || {};

  if (!school || !`${school}`.trim())
    return res.status(400).json({ error: "School is required" });

  const { data, error } = await supabase
    .from("education_entries")
    .insert({
      user_id: userId,
      school: `${school}`.trim(),
      degree: degree || null,
      field: field || null,
      start_year: start_year || null,
      end_year: end_year || null,
    })
    .select("*")
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Education added", entry: data });
};

export const deleteEducation = async (req, res) => {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from("education_entries")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", userId)
    .select("id");

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Entry not found" });
  res.json({ message: "Education removed" });
};

// =====================================================
// SKILL ENDORSEMENTS
// =====================================================
export const endorseSkill = async (req, res) => {
  const me = req.user.id;
  const userId = parseInt(req.params.id, 10);
  const skill = (req.body?.skill || "").trim();

  if (!userId || userId === me)
    return res.status(400).json({ error: "You cannot endorse yourself" });
  if (!skill) return res.status(400).json({ error: "Skill is required" });

  const { error } = await supabase
    .from("endorsements")
    .insert({ endorsed_user_id: userId, endorser_id: me, skill });

  if (error && !`${error.message}`.toLowerCase().includes("duplicate"))
    return res.status(500).json({ error: error.message });

  res.json({ message: "Skill endorsed" });
};

export const removeEndorsement = async (req, res) => {
  const me = req.user.id;
  const userId = parseInt(req.params.id, 10);
  const skill = (req.body?.skill || "").trim();

  if (!skill) return res.status(400).json({ error: "Skill is required" });

  const { error } = await supabase
    .from("endorsements")
    .delete()
    .eq("endorsed_user_id", userId)
    .eq("endorser_id", me)
    .eq("skill", skill);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Endorsement removed" });
};
