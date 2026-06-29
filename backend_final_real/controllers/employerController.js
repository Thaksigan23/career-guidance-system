import { supabase } from "../config/db.js";

// -----------------------------------------------------
// GET EMPLOYER PROFILE
// -----------------------------------------------------
export const getProfile = async (req, res) => {
  const userId = req.user.id;

  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("full_name, email, phone")
    .eq("id", userId)
    .maybeSingle();

  if (userErr) return res.status(500).json({ error: userErr.message });

  const { data: ep, error: epErr } = await supabase
    .from("employer_profiles")
    .select("company, position")
    .eq("user_id", userId)
    .maybeSingle();

  if (epErr) return res.status(500).json({ error: epErr.message });

  res.json({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: ep?.company || "",
    position: ep?.position || "",
  });
};

// -----------------------------------------------------
// UPDATE EMPLOYER PROFILE
// -----------------------------------------------------
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, phone, company, position } = req.body;

  if (!company || !position) {
    return res.status(400).json({ error: "Company and Position are required." });
  }

  const { error: userErr } = await supabase
    .from("users")
    .update({ full_name: name || null, phone: phone || null })
    .eq("id", userId);

  if (userErr) return res.status(500).json({ error: userErr.message });

  const { data: existing, error: checkErr } = await supabase
    .from("employer_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (checkErr) return res.status(500).json({ error: checkErr.message });

  if (!existing) {
    const { data, error: insertErr } = await supabase
      .from("employer_profiles")
      .insert({ user_id: userId, company, position })
      .select("id")
      .single();

    if (insertErr) return res.status(500).json({ error: insertErr.message });

    return res.json({
      message: "Employer profile created successfully.",
      id: data.id,
    });
  }

  const { error: updateErr } = await supabase
    .from("employer_profiles")
    .update({ company, position })
    .eq("user_id", userId);

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  return res.json({ message: "Employer profile updated successfully." });
};
