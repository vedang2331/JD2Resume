# JD2Resume — Intelligent Job Description Based Resume Builder

> **Truth-First AI Resume Tailoring & ATS Optimization Platform**

JD2Resume helps candidates craft job-specific, ATS-optimized resumes from Job Descriptions while strictly grounding every claim in the candidate's verified skills, experience, and projects.

---

## 🌟 Core Features

- **Truth-First Grounding Directive**: Strictly prevents AI hallucinations. Unsupported skills or claims are flagged and placed in a learning roadmap rather than falsely injected into the resume.
- **Deterministic Keyword Taxonomy & Non-Equivalence Engine**: Differentiates between non-equivalent technologies (React $\neq$ Angular, AWS $\neq$ Azure, PostgreSQL $\neq$ MongoDB).
- **Three Resume Modes**:
  1. *Strict Profile Mode*: Safest mode, using only candidate's exact wording and verified data.
  2. *JD-Optimized Mode*: Tailors candidate bullets using JD phrasing for matched skills.
  3. *Learned-Skills Mode*: Only includes verified intermediate/advanced candidate skills.
- **Split-Screen Live ATS Resume Builder**: Real-time resume preview with single-bullet AI regeneration.
- **Resume ↔ JD Alignment Report**: Transparent match matrix, ATS compatibility score, and prioritized *"What Should I Learn First?"* roadmap.
- **Multi-Format Export**: PDF, DOCX, Plain Text, and Markdown.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, SQLite / PostgreSQL.
- **Parsers**: `pdf-parse`, `mammoth` (DOCX parser).
- **Testing**: `vitest` unit and truth-validation test suites.

---

## 🚀 Quick Start

### 1. Install & Seed Backend
```bash
cd server
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```

### 2. Install & Launch Frontend
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
