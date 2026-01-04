import pdfParse from "pdf-parse";
import fs from "fs";

export const analyzeCV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const pdfBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    // ----------- BASIC CV CHECKS -----------
    const score = {
      length: text.length,
      hasEducation: text.toLowerCase().includes("education"),
      hasSkills: text.toLowerCase().includes("skills"),
      hasExperience: text.toLowerCase().includes("experience"),
      hasProjects: text.toLowerCase().includes("projects"),
      hasContact:
        text.toLowerCase().includes("email") ||
        text.toLowerCase().includes("phone"),
    };

    let suggestions = [];

    if (!score.hasEducation) suggestions.push("Add an Education section.");
    if (!score.hasSkills) suggestions.push("Add a Skills section.");
    if (!score.hasExperience) suggestions.push("Include Work Experience.");
    if (!score.hasProjects) suggestions.push("Add academic / personal Projects.");
    if (!score.hasContact) suggestions.push("Add Email / Phone at the top.");

    // CV quality score (very simple)
    const quality =
      Object.values(score).filter((v) => v === true).length / 5 * 100;

    res.json({
      status: "success",
      score: Math.floor(quality),
      suggestions,
      text: text.substring(0, 500) + "..." // preview
    });

    fs.unlinkSync(filePath); // Delete uploaded file after processing
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not analyze CV" });
  }
};
