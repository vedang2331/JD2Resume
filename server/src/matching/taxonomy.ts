export interface SkillCategoryDefinition {
  category: string;
  skills: string[];
}

export const TECHNICAL_TAXONOMY: Record<string, string[]> = {
  Languages: [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Golang",
    "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "HTML", "HTML5", "CSS", "CSS3", "Bash", "Shell"
  ],
  Frameworks: [
    "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Express", "Express.js",
    "Node.js", "NestJS", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel", "Ruby on Rails",
    "Tailwind CSS", "Bootstrap", "Redux", "Zustand"
  ],
  Databases: [
    "PostgreSQL", "Postgres", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle",
    "Microsoft SQL Server", "DynamoDB", "Cassandra", "Elasticsearch", "Prisma", "Sequelize", "TypeORM"
  ],
  Cloud: [
    "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Heroku", "Vercel", "Netlify", "DigitalOcean"
  ],
  DevOps: [
    "Docker", "Kubernetes", "K8s", "CI/CD", "GitHub Actions", "Jenkins", "Terraform", "Ansible", "Nginx", "Linux"
  ],
  Tools: [
    "Git", "GitHub", "GitLab", "Postman", "Swagger", "Jira", "Figma", "Docker", "VS Code", "Webpack", "Vite"
  ],
  "Data/ML": [
    "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Data Analysis", "Machine Learning", "NLP"
  ],
  Methodologies: [
    "Agile", "Scrum", "REST API", "RESTful APIs", "GraphQL", "Microservices", "TDD", "System Design", "OOP"
  ]
};

// Aliases mapping for canonical skill normalization
export const SKILL_ALIASES: Record<string, string> = {
  "postgres": "PostgreSQL",
  "postgresql": "PostgreSQL",
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "express": "Express.js",
  "expressjs": "Express.js",
  "express.js": "Express.js",
  "react": "React",
  "reactjs": "React",
  "react.js": "React",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "ts": "TypeScript",
  "js": "JavaScript",
  "py": "Python",
  "aws": "AWS",
  "k8s": "Kubernetes",
  "rest api": "REST APIs",
  "restful api": "REST APIs",
  "restful apis": "REST APIs",
  "rest apis": "REST APIs",
  "graphql": "GraphQL",
  "docker": "Docker",
  "redis": "Redis",
  "mongodb": "MongoDB",
  "mongo": "MongoDB",
  "git": "Git",
  "github": "GitHub",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "cicd": "CI/CD",
  "ci/cd": "CI/CD"
};

// Explicit Non-Equivalence Rules: These technologies should NEVER be treated as equal
export const STRICT_NON_EQUIVALENT_PAIRS: [string, string][] = [
  ["React", "Angular"],
  ["React", "Vue"],
  ["AWS", "Azure"],
  ["AWS", "GCP"],
  ["PostgreSQL", "MongoDB"],
  ["Python", "Java"],
  ["Docker", "Kubernetes"],
  ["Node.js", "Django"],
  ["Express.js", "Spring Boot"]
];

export function normalizeSkillName(name: string): string {
  const clean = name.trim().toLowerCase();
  if (SKILL_ALIASES[clean]) {
    return SKILL_ALIASES[clean];
  }
  // Title case fallback
  return name.trim();
}

export function areSkillsStrictlyNonEquivalent(skillA: string, skillB: string): boolean {
  const normA = normalizeSkillName(skillA);
  const normB = normalizeSkillName(skillB);

  for (const [pairA, pairB] of STRICT_NON_EQUIVALENT_PAIRS) {
    if ((normA === pairA && normB === pairB) || (normA === pairB && normB === pairA)) {
      return true;
    }
  }
  return false;
}
