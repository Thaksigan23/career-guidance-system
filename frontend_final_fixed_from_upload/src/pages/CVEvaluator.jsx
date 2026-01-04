import { useState } from "react";

export default function CVEvaluator() {
  const [cvText, setCvText] = useState("");
  const [analysis, setAnalysis] = useState(null);

  function analyzeCV() {
    if (!cvText.trim()) {
      alert("Please paste your CV content first.");
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
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg card-shadow p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            AI CV Evaluator
          </h2>

          {/* Text Input */}
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Paste your CV content here:
            </label>
            <textarea
              rows="12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Copy & paste your CV here..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
            />
          </div>

          <button
            className="btn-primary text-white font-bold py-2 px-6 rounded-md mb-8"
            onClick={analyzeCV}
          >
            Analyze CV
          </button>

          {/* Results */}
          {analysis && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                CV Analysis Results
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">
                    Overall Score
                  </h4>
                  <div className="text-3xl font-bold text-blue-600">
                    {analysis.score}/100
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">
                    ATS Compatibility
                  </h4>
                  <div className="text-3xl font-bold text-green-600">
                    {analysis.ats}
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Strengths
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {analysis.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">
                    Areas for Improvement
                  </h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1">
                    {analysis.improvements.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">
                    Recommendations
                  </h4>
                  <ul className="list-disc list-inside text-purple-700 space-y-1">
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
