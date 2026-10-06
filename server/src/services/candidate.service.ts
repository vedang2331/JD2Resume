import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOrCreateDefaultCandidate() {
  let candidate = await prisma.candidateProfile.findFirst({
    include: {
      skills: true,
      educations: true,
      experiences: true,
      projects: true,
      certifications: true,
      achievements: true,
      courseworks: true
    }
  });

  if (!candidate) {
    candidate = await prisma.candidateProfile.create({
      data: {
        fullName: "Vedang Deshpande",
        email: "vedang@example.com",
        phone: "+91 98765 43210",
        location: "Mumbai, India",
        linkedIn: "https://linkedin.com/in/vedang2331",
        gitHub: "https://github.com/vedang2331",
        portfolio: "https://vedang-portfolio.dev",
        summary: "Software Engineer with experience building backend services, APIs, and scalable web applications."
      },
      include: {
        skills: true,
        educations: true,
        experiences: true,
        projects: true,
        certifications: true,
        achievements: true,
        courseworks: true
      }
    });
  }

  return candidate;
}

export async function updateCandidateProfile(id: string, data: any) {
  const { fullName, email, phone, location, linkedIn, gitHub, portfolio, summary, skills, educations, experiences, projects } = data;

  // Transaction to update profile and child relations cleanly
  return await prisma.$transaction(async (tx) => {
    // Update core candidate fields
    await tx.candidateProfile.update({
      where: { id },
      data: { fullName, email, phone, location, linkedIn, gitHub, portfolio, summary }
    });

    if (skills && Array.isArray(skills)) {
      await tx.candidateSkill.deleteMany({ where: { candidateId: id } });
      await tx.candidateSkill.createMany({
        data: skills.map((s: any) => ({
          candidateId: id,
          skillName: s.skillName,
          category: s.category || "Technical Skills",
          proficiency: s.proficiency || "Intermediate",
          yearsExperience: s.yearsExperience ? parseFloat(s.yearsExperience) : null,
          explicitlyVerified: s.explicitlyVerified !== false,
          notes: s.notes || null
        }))
      });
    }

    if (educations && Array.isArray(educations)) {
      await tx.education.deleteMany({ where: { candidateId: id } });
      await tx.education.createMany({
        data: educations.map((e: any) => ({
          candidateId: id,
          degree: e.degree,
          institution: e.institution,
          specialization: e.specialization || null,
          gpa: e.gpa || null,
          graduationYear: e.graduationYear,
          relevantCoursework: e.relevantCoursework || null
        }))
      });
    }

    if (experiences && Array.isArray(experiences)) {
      await tx.experience.deleteMany({ where: { candidateId: id } });
      await tx.experience.createMany({
        data: experiences.map((exp: any) => ({
          candidateId: id,
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          location: exp.location || null,
          responsibilities: JSON.stringify(Array.isArray(exp.responsibilities) ? exp.responsibilities : [exp.responsibilities]),
          technologies: JSON.stringify(Array.isArray(exp.technologies) ? exp.technologies : []),
          achievements: exp.achievements ? JSON.stringify(Array.isArray(exp.achievements) ? exp.achievements : [exp.achievements]) : null,
          metrics: exp.metrics ? JSON.stringify(Array.isArray(exp.metrics) ? exp.metrics : [exp.metrics]) : null
        }))
      });
    }

    if (projects && Array.isArray(projects)) {
      await tx.project.deleteMany({ where: { candidateId: id } });
      await tx.project.createMany({
        data: projects.map((p: any) => ({
          candidateId: id,
          projectName: p.projectName,
          description: p.description,
          problemSolved: p.problemSolved || null,
          technologies: JSON.stringify(Array.isArray(p.technologies) ? p.technologies : []),
          responsibilities: JSON.stringify(Array.isArray(p.responsibilities) ? p.responsibilities : [p.responsibilities]),
          githubUrl: p.githubUrl || null,
          liveUrl: p.liveUrl || null
        }))
      });
    }

    return await tx.candidateProfile.findUnique({
      where: { id },
      include: {
        skills: true,
        educations: true,
        experiences: true,
        projects: true,
        certifications: true,
        achievements: true,
        courseworks: true
      }
    });
  });
}
