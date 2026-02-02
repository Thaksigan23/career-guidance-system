import PDFDocument from "pdfkit";

export const generateCVReportPDF = (res, data) => {
  const doc = new PDFDocument({ margin: 40 });

  // Set headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=cv-analysis-report.pdf");

  doc.pipe(res);

  /* =====================
     TITLE
  ===================== */
  doc
    .fontSize(20)
    .text("CV Analysis Report", { align: "center" })
    .moveDown();

  doc
    .fontSize(12)
    .text(`Generated on: ${new Date().toLocaleString()}`)
    .moveDown();

  /* =====================
     JOB MATCHES
  ===================== */
  doc.fontSize(16).text("Job Matches", { underline: true });
  doc.moveDown();

  data.recommendations.forEach((job, index) => {
    doc
      .fontSize(12)
      .text(`${index + 1}. ${job.title} - ${job.company}`)
      .text(`Match Score: ${job.match_score}%`)
      .text(`Top Match: ${job.top_match ? "Yes ⭐" : "No"}`)
      .moveDown(0.5);

    if (job.improvement_tips?.length > 0) {
      doc.text("Improvement Tips:");
      job.improvement_tips.forEach(tip => {
        doc.text(`• ${tip}`);
      });
      doc.moveDown(0.5);
    }

    doc.moveDown();
  });

  /* =====================
     AI FEEDBACK
  ===================== */
  if (data.ai_feedback?.suggestions?.length > 0) {
    doc.addPage();
    doc.fontSize(16).text("AI Suggestions", { underline: true });
    doc.moveDown();

    data.ai_feedback.suggestions.forEach((tip, i) => {
      doc.fontSize(12).text(`${i + 1}. ${tip}`);
    });
  }

  doc.end();
};
