import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding realistic demo candidate & JD data...");

  // Clean existing tables
  await prisma.resumeVersion.deleteMany();
  await prisma.jobDescription.deleteMany();
  await prisma.candidateProfile.deleteMany();

  // Create Demo Candidate
  const candidate = await prisma.candidateProfile.create({
    data: {
      fullName: "Vedang Deshpande",
      email: "vedang.deshpande@example.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra, India",
      linkedIn: "https://linkedin.com/in/vedang2331",
      gitHub: "https://github.com/vedang2331",
      portfolio: "https://vedang-dev.vercel.app",
      summary: "Final-year Software Engineering student with hands-on experience building scalable backend microservices, REST APIs, and database schemas using Node.js, Express, PostgreSQL, and Redis.",
      skills: {
        create: [
          { skillName: "Node.js", category: "Languages", proficiency: "Advanced", yearsExperience: 2.5, explicitlyVerified: true },
          { skillName: "TypeScript", category: "Languages", proficiency: "Advanced", yearsExperience: 2.0, explicitlyVerified: true },
          { skillName: "JavaScript", category: "Languages", proficiency: "Expert", yearsExperience: 3.0, explicitlyVerified: true },
          { skillName: "Python", category: "Languages", proficiency: "Intermediate", yearsExperience: 1.5, explicitlyVerified: true },
          { skillName: "Express.js", category: "Frameworks", proficiency: "Advanced", yearsExperience: 2.5, explicitlyVerified: true },
          { skillName: "React", category: "Frameworks", proficiency: "Intermediate", yearsExperience: 1.5, explicitlyVerified: true },
          { skillName: "PostgreSQL", category: "Databases", proficiency: "Advanced", yearsExperience: 2.0, explicitlyVerified: true },
          { skillName: "Redis", category: "Databases", proficiency: "Familiar", yearsExperience: 1.0, explicitlyVerified: true },
          { skillName: "MongoDB", category: "Databases", proficiency: "Intermediate", yearsExperience: 1.5, explicitlyVerified: true },
          { skillName: "Docker", category: "DevOps", proficiency: "Familiar", yearsExperience: 1.0, explicitlyVerified: true },
          { skillName: "Git", category: "Tools", proficiency: "Advanced", yearsExperience: 3.0, explicitlyVerified: true },
          { skillName: "REST APIs", category: "Methodologies", proficiency: "Advanced", yearsExperience: 2.5, explicitlyVerified: true }
        ]
      },
      educations: {
        create: [
          {
            degree: "Bachelor of Technology (B.Tech)",
            institution: "Mumbai University",
            specialization: "Computer Engineering",
            gpa: "8.9 / 10",
            graduationYear: "2026",
            relevantCoursework: "Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Software Engineering"
          }
        ]
      },
      experiences: {
        create: [
          {
            company: "TechNexus Innovations",
            position: "Software Engineering Intern",
            startDate: "May 2025",
            endDate: "Aug 2025",
            location: "Mumbai, India",
            responsibilities: JSON.stringify([
              "Developed RESTful APIs using Node.js and Express.js to support structured backend authentication and data management.",
              "Designed relational database schemas in PostgreSQL using Prisma ORM, improving query performance.",
              "Implemented Redis caching for frequent user queries, reducing database load."
            ]),
            technologies: JSON.stringify(["Node.js", "Express.js", "PostgreSQL", "Redis", "TypeScript", "Prisma"]),
            achievements: JSON.stringify(["Improved backend API response times by optimizing database indices."])
          }
        ]
      },
      projects: {
        create: [
          {
            projectName: "AuthForge - OAuth & RBAC Authentication Gateway",
            description: "High-security production API gateway implementing JWT, Refresh Token rotation, Role-Based Access Control, and API key management.",
            technologies: JSON.stringify(["Node.js", "TypeScript", "Express.js", "PostgreSQL", "Redis", "Jest", "Docker"]),
            responsibilities: JSON.stringify([
              "Architected role-based middleware to enforce granular permission checks across API endpoints.",
              "Configured Redis rate limiting to mitigate brute-force authentication attacks.",
              "Integrated Docker containers for seamless database and cache orchestration."
            ]),
            githubUrl: "https://github.com/vedang2331/AuthForge"
          },
          {
            projectName: "DevFlow - Developer Collaboration & Workspace Engine",
            description: "Real-time task automation and issue tracking platform for developer teams with Socket.io communication.",
            technologies: JSON.stringify(["React", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Socket.io", "Tailwind CSS"]),
            responsibilities: JSON.stringify([
              "Built real-time activity streams and Kanban board synchronization using WebSocket events.",
              "Designed normalized database tables to manage organizations, projects, and nested issue comments."
            ]),
            githubUrl: "https://github.com/vedang2331/DevFlow"
          }
        ]
      },
      certifications: {
        create: [
          {
            name: "Meta Back-End Developer Specialization",
            issuer: "Coursera / Meta",
            issueDate: "2025"
          }
        ]
      }
    }
  });

  // Create Sample Job Description
  const sampleJdText = `
Job Title: Backend Software Engineer
Company: CloudScale Solutions
Location: Remote

About the Role:
We are seeking a Backend Software Engineer to design, build, and maintain scalable cloud APIs and database architectures.

Key Responsibilities:
- Design and implement high-performance RESTful APIs using Node.js and Express.js.
- Optimize relational database queries and schema designs using PostgreSQL.
- Collaborate with frontend engineers to integrate services and manage system workflows.
- Package services into Docker containers for cloud deployment.
- Maintain rigorous testing and documentation standards.

Mandatory Requirements:
- 0-2 years experience in Backend Software Engineering.
- Strong proficiency in Node.js, TypeScript, JavaScript, and Express.js.
- Solid experience with PostgreSQL database modeling and SQL optimization.
- Proficiency with Git version control and REST API architecture.

Preferred / Nice to Have:
- Hands-on experience with Redis caching strategies.
- Containerization experience with Docker.
- Basic exposure to AWS (Amazon Web Services) cloud infrastructure.
- Familiarity with Kubernetes (K8s) container orchestration.
  `;

  const sampleJd = await prisma.jobDescription.create({
    data: {
      roleTitle: "Backend Software Engineer",
      company: "CloudScale Solutions",
      location: "Remote",
      rawText: sampleJdText,
      experienceRequired: "0-2 years",
      educationRequired: "Bachelor's Degree in Computer Science or equivalent",
      mandatorySkills: JSON.stringify(["Node.js", "Express.js", "PostgreSQL", "TypeScript", "REST APIs", "Git"]),
      preferredSkills: JSON.stringify(["Redis", "Docker", "AWS", "Kubernetes"]),
      technologies: JSON.stringify(["Node.js", "Express.js", "PostgreSQL", "TypeScript", "REST APIs", "Git", "Redis", "Docker", "AWS", "Kubernetes"]),
      responsibilities: JSON.stringify([
        "Design and implement high-performance RESTful APIs using Node.js and Express.js.",
        "Optimize relational database queries and schema designs using PostgreSQL.",
        "Collaborate with frontend engineers to integrate services.",
        "Package services into Docker containers for cloud deployment."
      ]),
      domainKeywords: JSON.stringify(["Cloud", "API Gateway", "SaaS"]),
      softSkills: JSON.stringify(["collaboration", "problem solving"]),
      certifications: JSON.stringify([]),
      keywords: JSON.stringify(["Node.js", "Express.js", "PostgreSQL", "TypeScript", "REST APIs", "Git", "Redis", "Docker", "AWS", "Kubernetes"])
    }
  });

  console.log("✅ Seed completed! Candidate ID:", candidate.id, "| Sample JD ID:", sampleJd.id);
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
