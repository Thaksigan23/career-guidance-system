import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import employerRoutes from "./routes/employer.js";
import jobRoutes from "./routes/job.js";
import applicationRoutes from "./routes/application.js";
import savedRoutes from "./routes/saved.js";
import employerSummaryRoutes from "./routes/employerSummaryRoutes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import cvRoutes from "./routes/cv.js";
import careerRoutes from "./routes/career.js";
import adminRoutes from "./routes/adminRoutes.js";



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/cv", cvRoutes);
app.use("/api/career", careerRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/employer", employerSummaryRoutes);

app.use("/api/recommendations", recommendationRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
