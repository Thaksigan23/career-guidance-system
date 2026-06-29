import { useState } from "react";
import toast from "react-hot-toast";

export default function CVEvaluator() {
  const [cvText, setCvText] = useState("");
  const [analysis, setAnalysis] = useState(null);

  function analyzeCV() {
    if (!cvText.trim()) {
      toast.error("Please paste your CV content first.");
      return;
    }

    const wordCount = cvText.split(" ").length;
    const hasContact = /email|phone|contact/i.test(cvText);
    const hasSkills = /skills|experience|proficient/i.test(cvText);
    const hasEducation = /education|degree|university|college/i.test(cvText);

    let score = 60;
    if (hasContact) score += 10;
    if (hasSkills) score += 15;
    if (hasEducation) score += 10;
    if (wordCount > 200) score += 5;

    const result = {
      score: Math.min(score, 100),
      ats:
        score > 75 ? "Excellent" : score > 60 ? "Good" : "Needs Improvement",

      strengths: [
        hasContact && "Contact information is clearly provided",
        hasSkills && "Skills and experience are well described",
        hasEducation && "Educational background included",
        wordCount > 200 && "Comprehensive content length",
      ].filter(Boolean),

      improvements: [
        !hasContact && "Add clear contact information",
        !hasSkills && "Add more details about your skills",
        !hasEducation && "Include an education section",
        wordCount < 200 && "Add more details to strengthen your CV",
      ].filter(Boolean),

      recommendations: [
        "Use action verbs to describe achievements",
        "Quantify your accomplishments using numbers",
        "Tailor your CV to the job requirements",
        "Keep formatting clean and consistent",
      ],
    };

    setAnalysis(result);
  }

  return (
    <div className="aurora-page px-4">
      <div className="max-w-4xl mx-auto">
        <div className="panel p-8">
          <h2 className="page-title mb-8">AI CV Evaluator</h2>

          {/* Text Input */}
          <div className="mb-6">
            <label className="field-label">Paste your CV content here:</label>
            <textarea
              rows="12"
              className="field"
              placeholder="Copy & paste your CV here..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
            />
          </div>

          <button
            className="btn-glow font-semibold py-2.5 px-7 rounded-xl mb-8"
            onClick={analyzeCV}
          >
            Analyze CV
          </button>

          {/* Results */}
          {analysis && (
            <div>
              <h3 className="panel-title text-2xl mb-6">CV Analysis Results</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-6">
                  <h4 className="text-lg font-semibold text-cyan-200 mb-2">
                    Overall Score
                  </h4>
                  <div className="text-3xl font-bold text-white">
                    {analysis.score}/100
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h4 className="text-lg font-semibold text-emerald-200 mb-2">
                    ATS Compatibility
                  </h4>
                  <div className="text-3xl font-bold text-white">
                    {analysis.ats}
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Strengths
                  </h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {analysis.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-6">
                  <h4 className="text-lg font-semibold text-amber-200 mb-3">
                    Areas for Improvement
                  </h4>
                  <ul className="list-disc list-inside text-amber-100/80 space-y-1">
                    {analysis.improvements.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 p-6">
                  <h4 className="text-lg font-semibold text-violet-200 mb-3">
                    Recommendations
                  </h4>
                  <ul className="list-disc list-inside text-violet-100/80 space-y-1">
                    {analysis.recommendations.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
