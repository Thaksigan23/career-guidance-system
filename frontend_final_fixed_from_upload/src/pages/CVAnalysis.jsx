import { useState } from "react";
import API from "../api/api";

export default function CVAnalysis() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submitCV(e) {
    e.preventDefault();
    if (!file) return alert("Upload a PDF file");

    const formData = new FormData();
    formData.append("cv", file);

    setLoading(true);
    try {
      const res = await API.post("/cv/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      alert("Failed to analyze CV");
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen pt-20 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-xl">
        <h1 className="text-3xl font-bold mb-6">CV Analyzer</h1>

        <form onSubmit={submitCV}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <button className="btn-primary px-5 py-2 rounded text-white">
            Analyze CV
          </button>
        </form>

        {loading && <p className="mt-4">Analyzing...</p>}

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Score: {result.score}%</h2>

            <h3 className="text-lg font-semibold mt-4">Suggestions:</h3>
            <ul className="list-disc ml-6">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
