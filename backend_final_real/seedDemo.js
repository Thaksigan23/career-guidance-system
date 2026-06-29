import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { supabase } from "./config/db.js";

dotenv.config();

// All demo accounts share this password for easy screenshotting.
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "Demo@123";
const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);

const employers = [
  {
    full_name: "Acme Recruiter",
    email: "employer@acme.com",
    phone: "+94 11 234 5678",
    company: "Acme Corp",
    position: "Senior Talent Acquisition",
  },
  {
    full_name: "TechWave HR",
    email: "hr@techwave.com",
    phone: "+94 11 987 6543",
    company: "TechWave Solutions",
    position: "HR Manager",
  },
];

const students = [
  {
    full_name: "Jane Doe",
    email: "jane.doe@student.com",
    phone: "+94 77 111 2222",
    education: "University of Colombo",
    degree: "BSc in Computer Science",
    experience_years: 2,
    skills: "React, Node.js, SQL, TypeScript, REST APIs",
    experience: "Frontend intern at a fintech startup; built dashboards in React.",
    headline: "Frontend Developer | React & TypeScript Enthusiast",
    location: "Colombo, Sri Lanka",
    open_to_work: true,
    about:
      "Final-year Computer Science student passionate about building clean, accessible web apps. I love turning designs into pixel-perfect, performant React interfaces and am currently looking for a frontend role.",
    experiences: [
      {
        title: "Frontend Developer Intern",
        company: "FinEdge (Fintech Startup)",
        location: "Colombo (Hybrid)",
        start_date: "Jun 2024",
        end_date: "Dec 2024",
        description:
          "Built reusable React components and analytics dashboards. Improved page load time by 35% with code-splitting.",
      },
      {
        title: "Freelance Web Developer",
        company: "Self-employed",
        location: "Remote",
        start_date: "2023",
        end_date: "Present",
        description:
          "Delivered landing pages and small web apps for local businesses using React and Tailwind.",
      },
    ],
    education_entries: [
      {
        school: "University of Colombo",
        degree: "BSc (Hons)",
        field: "Computer Science",
        start_year: "2021",
        end_year: "2025",
      },
    ],
  },
  {
    full_name: "John Smith",
    email: "john.smith@student.com",
    phone: "+94 77 333 4444",
    education: "SLIIT",
    degree: "BSc in Software Engineering",
    experience_years: 1,
    skills: "Java, Spring Boot, MySQL, Docker",
    experience: "Final-year project on a microservices-based e-commerce app.",
    headline: "Backend Engineer | Java & Spring Boot",
    location: "Malabe, Sri Lanka",
    open_to_work: true,
    about:
      "Software Engineering undergraduate focused on backend systems and clean architecture. Comfortable designing REST APIs and containerized services.",
    experiences: [
      {
        title: "Software Engineering Trainee",
        company: "TechWave Solutions",
        location: "Colombo",
        start_date: "Jan 2024",
        end_date: "Jul 2024",
        description:
          "Developed Spring Boot microservices and wrote integration tests. Dockerized services for local development.",
      },
    ],
    education_entries: [
      {
        school: "SLIIT",
        degree: "BSc (Hons)",
        field: "Software Engineering",
        start_year: "2021",
        end_year: "2025",
      },
    ],
  },
  {
    full_name: "Priya Kumar",
    email: "priya.k@student.com",
    phone: "+94 77 555 6666",
    education: "University of Moratuwa",
    degree: "BSc in IT",
    experience_years: 3,
    skills: "Python, Django, Pandas, Machine Learning, SQL",
    experience: "Data analyst intern; built reporting pipelines and ML models.",
    headline: "Data Analyst | Python, ML & Visualization",
    location: "Moratuwa, Sri Lanka",
    open_to_work: false,
    about:
      "IT graduate who turns messy data into clear, actionable insights. Experienced with Python data pipelines, dashboards, and basic machine learning models.",
    experiences: [
      {
        title: "Data Analyst Intern",
        company: "Insight Analytics",
        location: "Remote",
        start_date: "Feb 2023",
        end_date: "Feb 2024",
        description:
          "Built automated reporting pipelines in Python and trained churn-prediction models with scikit-learn.",
      },
    ],
    education_entries: [
      {
        school: "University of Moratuwa",
        degree: "BSc",
        field: "Information Technology",
        start_year: "2020",
        end_year: "2024",
      },
    ],
  },
];

const jobsByEmployer = {
  "employer@acme.com": [
    {
      title: "Senior React Developer",
      location: "Colombo",
      salary: "120000",
      description:
        "Build and maintain modern web applications using React and TypeScript. Collaborate with designers and backend engineers to ship features.",
      requirements: "React, TypeScript, REST APIs, 3+ years experience",
      status: "approved",
    },
    {
      title: "Backend Engineer (Node.js)",
      location: "Colombo (Hybrid)",
      salary: "110000",
      description:
        "Design scalable APIs and services. Work with PostgreSQL and cloud infrastructure.",
      requirements: "Node.js, Express, PostgreSQL, AWS basics",
      status: "approved",
    },
    {
      title: "DevOps Engineer",
      location: "Remote",
      salary: "140000",
      description:
        "Own CI/CD pipelines, container orchestration, and monitoring across environments.",
      requirements: "Docker, Kubernetes, GitHub Actions, Terraform",
      status: "pending",
    },
  ],
  "hr@techwave.com": [
    {
      title: "UI/UX Designer",
      location: "Kandy",
      salary: "90000",
      description:
        "Craft intuitive, beautiful interfaces. Run user research and build design systems.",
      requirements: "Figma, prototyping, design systems, portfolio required",
      status: "approved",
    },
    {
      title: "Mobile Developer (React Native)",
      location: "Colombo",
      salary: "115000",
      description:
        "Build cross-platform mobile apps and integrate with REST and GraphQL APIs.",
      requirements: "React Native, JavaScript, mobile release experience",
      status: "approved",
    },
    {
      title: "Data Analyst",
      location: "Remote",
      salary: "95000",
      description:
        "Turn raw data into insights with dashboards and reports for stakeholders.",
      requirements: "SQL, Python, Pandas, data visualization",
      status: "pending",
    },
  ],
};

async function upsertUser({ full_name, email, phone, role }) {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("users")
      .update({ full_name, password: hash, phone, role, status: "active" })
      .eq("id", existing.id);
    return existing.id;
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ full_name, email, password: hash, phone, role, status: "active" })
    .select("id")
    .single();

  if (error) throw new Error(`User ${email}: ${error.message}`);
  return data.id;
}

async function upsertEmployerProfile(userId, company, position) {
  const { data: existing } = await supabase
    .from("employer_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("employer_profiles")
      .update({ company, position })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("employer_profiles")
      .insert({ user_id: userId, company, position });
  }
}

async function upsertStudentProfile(userId, p) {
  const payload = {
    education: p.education,
    degree: p.degree,
    experience_years: p.experience_years,
    skills: p.skills,
    experience: p.experience,
    headline: p.headline ?? null,
    location: p.location ?? null,
    about: p.about ?? null,
    open_to_work: !!p.open_to_work,
  };

  const { data: existing } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("student_profiles").update(payload).eq("id", existing.id);
  } else {
    await supabase
      .from("student_profiles")
      .insert({ user_id: userId, ...payload });
  }
}

async function seed() {
  console.log("Seeding demo data...\n");

  // 1. Employers + profiles + their jobs
  const employerIds = {};
  for (const emp of employers) {
    const id = await upsertUser({
      full_name: emp.full_name,
      email: emp.email,
      phone: emp.phone,
      role: "employer",
    });
    employerIds[emp.email] = id;
    await upsertEmployerProfile(id, emp.company, emp.position);
    console.log(`Employer ready: ${emp.email} (${emp.company})`);
  }

  // 2. Students + profiles
  const studentIds = {};
  for (const st of students) {
    const id = await upsertUser({
      full_name: st.full_name,
      email: st.email,
      phone: st.phone,
      role: "student",
    });
    studentIds[st.email] = id;
    await upsertStudentProfile(id, st);
    console.log(`Student ready:  ${st.email}`);
  }

  // 3. Reset and insert jobs for each employer (cascades clear old apps/saves)
  const insertedJobs = [];
  for (const [email, jobs] of Object.entries(jobsByEmployer)) {
    const employerId = employerIds[email];
    const company = employers.find((e) => e.email === email).company;

    await supabase.from("jobs").delete().eq("employer_id", employerId);

    const rows = jobs.map((j) => ({ ...j, employer_id: employerId, company }));
    const { data, error } = await supabase.from("jobs").insert(rows).select("id, title, status");
    if (error) throw new Error(`Jobs for ${email}: ${error.message}`);
    insertedJobs.push(...data);
    console.log(`Posted ${data.length} jobs for ${company}`);
  }

  const approvedJobs = insertedJobs.filter((j) => j.status === "approved");

  // 4. Applications: each student applies to a couple of approved jobs
  const studentList = Object.values(studentIds);
  const applications = [];
  approvedJobs.forEach((job, idx) => {
    const studentId = studentList[idx % studentList.length];
    applications.push({
      job_id: job.id,
      student_id: studentId,
      message: `I'm excited to apply for ${job.title}. My skills are a strong match.`,
    });
  });
  if (applications.length) {
    const { error } = await supabase.from("applications").insert(applications);
    if (error) console.warn("Applications:", error.message);
    else console.log(`Created ${applications.length} applications`);
  }

  // 5. Saved jobs: first student saves first two approved jobs
  const saves = approvedJobs.slice(0, 2).map((job) => ({
    user_id: studentList[0],
    job_id: job.id,
  }));
  if (saves.length) {
    const { error } = await supabase.from("saved_jobs").insert(saves);
    if (error) console.warn("Saved jobs:", error.message);
    else console.log(`Created ${saves.length} saved jobs`);
  }

  // 6. Social graph + content (LinkedIn-style features) -----------------
  const allIds = [...Object.values(employerIds), ...Object.values(studentIds)];
  const idList = allIds.join(",");

  // Clear previous demo social data so re-seeding stays idempotent.
  await supabase.from("posts").delete().in("user_id", allIds); // cascades likes/comments
  await supabase.from("experience_entries").delete().in("user_id", allIds);
  await supabase.from("education_entries").delete().in("user_id", allIds);
  await supabase.from("endorsements").delete().in("endorser_id", allIds);
  await supabase.from("endorsements").delete().in("endorsed_user_id", allIds);
  await supabase
    .from("connections")
    .delete()
    .or(`requester_id.in.(${idList}),receiver_id.in.(${idList})`);

  // 6a. Experience & education timelines for students
  for (const st of students) {
    const uid = studentIds[st.email];
    if (st.experiences?.length) {
      await supabase
        .from("experience_entries")
        .insert(st.experiences.map((x) => ({ ...x, user_id: uid })));
    }
    if (st.education_entries?.length) {
      await supabase
        .from("education_entries")
        .insert(st.education_entries.map((x) => ({ ...x, user_id: uid })));
    }
  }
  console.log("Added experience & education timelines");

  const jane = studentIds["jane.doe@student.com"];
  const john = studentIds["john.smith@student.com"];
  const priya = studentIds["priya.k@student.com"];
  const acme = employerIds["employer@acme.com"];
  const techwave = employerIds["hr@techwave.com"];

  // 6b. Connections (accepted + pending invitations)
  const connections = [
    { requester_id: jane, receiver_id: john, status: "accepted" },
    { requester_id: jane, receiver_id: priya, status: "accepted" },
    { requester_id: acme, receiver_id: jane, status: "accepted" },
    { requester_id: john, receiver_id: priya, status: "pending" },
    { requester_id: techwave, receiver_id: jane, status: "pending" },
    { requester_id: priya, receiver_id: acme, status: "pending" },
  ];
  {
    const { error } = await supabase.from("connections").insert(connections);
    if (error) console.warn("Connections:", error.message);
    else console.log(`Created ${connections.length} connections`);
  }

  // 6c. Posts
  const postSeed = [
    {
      user_id: jane,
      content:
        "Just wrapped up my frontend internship at FinEdge! Learned so much about building accessible dashboards in React. Grateful for the mentorship and excited for what's next.",
    },
    {
      user_id: john,
      content:
        "Finished my microservices e-commerce project using Spring Boot + Docker. Open to backend engineering roles — would love to connect with hiring teams! #java #springboot",
    },
    {
      user_id: priya,
      content:
        "Quick tip: small, well-named functions beat one giant script every time. Refactored a 400-line data pipeline into clean modules today and it finally makes sense.",
    },
    {
      user_id: acme,
      content:
        "We're hiring! Acme Corp is looking for a Senior React Developer and a Backend Engineer (Node.js). Great team, hybrid in Colombo. Apply through the platform.",
    },
    {
      user_id: techwave,
      content:
        "TechWave Solutions is growing our design and mobile teams. If you love crafting clean UI or shipping React Native apps, let's talk!",
    },
  ];
  const { data: posts, error: postErr } = await supabase
    .from("posts")
    .insert(postSeed)
    .select("id, user_id");
  if (postErr) console.warn("Posts:", postErr.message);
  else console.log(`Created ${posts.length} posts`);

  const postBy = {};
  (posts || []).forEach((p) => {
    postBy[p.user_id] = p.id;
  });

  // 6d. Likes
  const likes = [
    { post_id: postBy[jane], user_id: john },
    { post_id: postBy[jane], user_id: priya },
    { post_id: postBy[jane], user_id: acme },
    { post_id: postBy[john], user_id: jane },
    { post_id: postBy[john], user_id: techwave },
    { post_id: postBy[acme], user_id: jane },
    { post_id: postBy[acme], user_id: john },
    { post_id: postBy[priya], user_id: jane },
  ].filter((l) => l.post_id);
  if (likes.length) {
    const { error } = await supabase.from("post_likes").insert(likes);
    if (error) console.warn("Likes:", error.message);
    else console.log(`Created ${likes.length} likes`);
  }

  // 6e. Comments
  const comments = [
    {
      post_id: postBy[jane],
      user_id: acme,
      content: "Congrats Jane! Your dashboard work looks impressive — we'll be in touch.",
    },
    { post_id: postBy[jane], user_id: priya, content: "So proud of you!" },
    {
      post_id: postBy[john],
      user_id: techwave,
      content: "Nice project John. Have you applied to our backend role yet?",
    },
    {
      post_id: postBy[acme],
      user_id: john,
      content: "Just applied for the Node.js role — really excited!",
    },
  ].filter((c) => c.post_id);
  if (comments.length) {
    const { error } = await supabase.from("post_comments").insert(comments);
    if (error) console.warn("Comments:", error.message);
    else console.log(`Created ${comments.length} comments`);
  }

  // 6f. Skill endorsements
  const endorsements = [
    { endorsed_user_id: jane, endorser_id: john, skill: "React" },
    { endorsed_user_id: jane, endorser_id: priya, skill: "React" },
    { endorsed_user_id: jane, endorser_id: acme, skill: "TypeScript" },
    { endorsed_user_id: jane, endorser_id: priya, skill: "Node.js" },
    { endorsed_user_id: john, endorser_id: jane, skill: "Java" },
    { endorsed_user_id: john, endorser_id: techwave, skill: "Spring Boot" },
    { endorsed_user_id: john, endorser_id: priya, skill: "Docker" },
    { endorsed_user_id: priya, endorser_id: jane, skill: "Python" },
    { endorsed_user_id: priya, endorser_id: john, skill: "Machine Learning" },
  ];
  {
    const { error } = await supabase.from("endorsements").insert(endorsements);
    if (error) console.warn("Endorsements:", error.message);
    else console.log(`Created ${endorsements.length} endorsements`);
  }

  console.log("\nDemo data seeded successfully!");
  console.log("------------------------------------------");
  console.log(`All demo accounts use password: ${DEMO_PASSWORD}`);
  console.log("Employers: employer@acme.com, hr@techwave.com");
  console.log("Students:  jane.doe@student.com, john.smith@student.com, priya.k@student.com");
  console.log("------------------------------------------");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
