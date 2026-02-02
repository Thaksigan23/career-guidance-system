import fs from "fs";
import natural from "natural";
import stopword from "stopword";
import { db } from "../config/db.js";
import { generateAISuggestions } from "../services/aiService.js";
import { generateCVReportPDF } from "../services/pdfService.js";
import { createRequire } from "module";

// -----------------------------------
// pdf-parse (CommonJS safe import)
// -----------------------------------
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const TfIdf = natural.TfIdf;

/* ===================================
   SKILL DICTIONARY (IMPORTANT)
=================================== */
const SKILL_DICTIONARY = [
  "ui/ux", "figma", "wireframing", "prototyping", "user research",
  "adobe xd", "html", "css", "javascript", "react", "node",
  "mysql", "mongodb", "python", "java", "php",
  "aws", "git", "github", "api", "testing"
];

/* ===================================
   HELPER: KEYWORD EXTRACTION
=================================== */
const extractKeywords = (text = "") => {
  text = text.toLowerCase().replace(/[^a-z\s]/g, " ");
  let tokens = text.split(/\s+/);
  tokens = stopword.removeStopwords(tokens);
  return [...new Set(tokens)].filter(w => w.length > 2);
};

/* ===================================
   ANALYZE CV
=================================== */
export const analyzeCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No CV file uploaded" });
    }

    // 1️⃣ READ PDF
    const buffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(buffer);
    let cvText = (data.text || "").toLowerCase();

    // 2️⃣ CLEAN TEXT
    cvText = cvText.replace(/[^a-z\s]/g, " ");
    const cleanCV = stopword
      .removeStopwords(cvText.split(/\s+/))
      .join(" ");

    // 3️⃣ EXTRACT SKILLS (FILTERED)
    const rawKeywords = extractKeywords(cleanCV);

    const extractedSkills = SKILL_DICTIONARY.filter(skill =>
      rawKeywords.includes(skill)
    );

    // 4️⃣ SAVE SKILLS TO student_profiles
    await new Promise((resolve, reject) => {
      db.query(
        `
        UPDATE student_profiles
        SET skills = ?
        WHERE user_id = ?
        `,
        [extractedSkills.join(","), req.user.id],
        err => (err ? reject(err) : resolve())
      );
    });

    // 5️⃣ FETCH JOBS
    const jobs = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id, title, company, requirements FROM jobs",
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    // 6️⃣ TF-IDF MATCHING
    const tfidf = new TfIdf();
    tfidf.addDocument(cleanCV);

    jobs.forEach(job => {
      tfidf.addDocument((job.requirements || "").toLowerCase());
    });

    let recommendations = jobs.map((job, index) => {
      let score = 0;

      tfidf.tfidfs(cleanCV, (i, measure) => {
        if (i === index + 1) score = measure;
      });

      const jobKeywords = extractKeywords(job.requirements || "");

      const missingSkills = jobKeywords.filter(
        s => !extractedSkills.includes(s)
      );

      const tips = [];
      if (missingSkills.length) {
        tips.push(
          `Add these skills: ${missingSkills.slice(0, 5).join(", ")}`
        );
      }
      if (!cleanCV.includes("project")) {
        tips.push("Include academic or personal projects.");
      }
      if (!cleanCV.includes("experience")) {
        tips.push("Mention internships or work experience.");
      }

      return {
        job_id: job.id,
        title: job.title,
        company: job.company,
        match_score: Math.min(100, Math.round(score * 20)),
        improvement_tips: tips
      };
    });

    // 7️⃣ SORT + TOP 3
    recommendations = recommendations
      .filter(r => r.match_score >= 20)
      .sort((a, b) => b.match_score - a.match_score)
      .map((job, index) => ({
        ...job,
        top_match: index < 3
      }));

    // 8️⃣ AI FEEDBACK (SAFE)
    let aiFeedback = { mode: "disabled", suggestions: [] };
    try {
      aiFeedback = await generateAISuggestions({
        cvText: cleanCV,
        jobs: recommendations
      });
    } catch {
      aiFeedback = { mode: "disabled", suggestions: [] };
    }

    // 9️⃣ SAVE ANALYSIS HISTORY
    db.query(
      `
      INSERT INTO cv_analysis (user_id, cv_text, analysis_result)
      VALUES (?, ?, ?)
      `,
      [req.user.id, cleanCV, JSON.stringify(recommendations)]
    );

    // 🔟 CLEAN FILE
    fs.unlinkSync(req.file.path);

    // ✅ RESPONSE
    res.json({
      message: "CV analyzed successfully",
      extracted_skills: extractedSkills,
      total_jobs: recommendations.length,
      recommendations,
      ai_feedback: aiFeedback
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* ===================================
   CV HISTORY
=================================== */
export const getCVHistory = (req, res) => {
  db.query(
    `
    SELECT id, created_at, analysis_result
    FROM cv_analysis
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ history: rows });
    }
  );
};

/* ===================================
   DOWNLOAD PDF REPORT
=================================== */
export const downloadCVReport = (req, res) => {
  db.query(
    `
    SELECT analysis_result
    FROM cv_analysis
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [req.user.id],
    (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(404).json({ error: "No CV analysis found" });
      }

      generateCVReportPDF(res, {
        recommendations: JSON.parse(rows[0].analysis_result),
        ai_feedback: {
          suggestions: [
            "Customize CV per job",
            "Add measurable achievements",
            "Strengthen technical skills section"
          ]
        }
      });
    }
  );
};
