import { recommendCareerPath } from "../services/careerService.js";

export const getCareerPath = (req, res) => {
  const { skills } = req.body;

  if (!skills || skills.length === 0) {
    return res.status(400).json({ error: "Skills are required" });
  }

  const careers = recommendCareerPath({ skills });

  res.json({
    message: "Career path recommendation generated",
    careers
  });
};
