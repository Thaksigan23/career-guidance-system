export const recommendCareerPath = ({ skills }) => {
  const skillText = skills.join(" ").toLowerCase();

  // 🔹 RULE-BASED CAREER MAPPING
  const careers = [];

  if (skillText.includes("html") || skillText.includes("css") || skillText.includes("react")) {
    careers.push({
      career: "Frontend Developer",
      next_roles: [
        "Junior Frontend Developer",
        "Frontend Developer",
        "Senior Frontend Engineer"
      ],
      skills_to_learn: ["React", "TypeScript", "UI/UX", "Next.js"],
      certifications: ["Meta Front-End Certificate", "Google UX"]
    });
  }

  if (skillText.includes("node") || skillText.includes("express") || skillText.includes("mysql")) {
    careers.push({
      career: "Backend Developer",
      next_roles: [
        "Junior Backend Developer",
        "Backend Developer",
        "Senior Backend Engineer"
      ],
      skills_to_learn: ["Node.js", "REST APIs", "System Design"],
      certifications: ["AWS Developer Associate"]
    });
  }

  if (skillText.includes("python") || skillText.includes("machine") || skillText.includes("data")) {
    careers.push({
      career: "Data Scientist",
      next_roles: [
        "Data Analyst",
        "Data Scientist",
        "ML Engineer"
      ],
      skills_to_learn: ["Python", "ML", "Statistics"],
      certifications: ["IBM Data Science"]
    });
  }

  if (careers.length === 0) {
    careers.push({
      career: "General IT Professional",
      next_roles: ["IT Support", "Junior Developer"],
      skills_to_learn: ["Programming Basics", "Databases", "Git"],
      certifications: ["Google IT Support"]
    });
  }

  return careers;
};
