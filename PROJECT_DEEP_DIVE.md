# PROJECT_DEEP_DIVE: JD2Resume — Intelligent Job Description Based Resume Builder

## 1. Executive Summary & Core Philosophy

JD2Resume addresses a fundamental flaw in generic AI resume generators: **hallucination of candidate qualifications**. Traditional tools blindly inject Job Description (JD) keywords into resumes, creating false claims that candidates cannot defend during technical interviews.

JD2Resume operates under a strict **Truth-First Architecture**:
- **Candidate Profile** determines *WHAT IS TRUE*.
- **Job Description** determines *WHAT MATTERS*.
- **Deterministic & AI Engines** decide *HOW TO PRESENT IT*.

---

## 2. Technical Architecture & Component Interplay

```
                             +-----------------------+
                             |    CANDIDATE MASTER   |
                             |        PROFILE        |
                             +-----------+-----------+
                                         |
                                         v
+-----------------------+    +-----------+-----------+    +-----------------------+
|    JOB DESCRIPTION    |--->|  MATCH MATRIX ENGINE  |<---|  TAXONOMY & NON-EQUIV |
|    PARSER & KEYWORDS  |    |  Multi-Category 0-100 |    |     RULES ENGINE      |
+-----------------------+    +-----------+-----------+    +-----------------------+
                                         |
                                         v
                             +-----------+-----------+
                             |  TRUTH-SAFETY CLAIM   |
                             |  AUDITOR VALIDATOR    |
                             +-----------+-----------+
                                         |
                                         v
                             +-----------+-----------+
                             |  JD-OPTIMIZED RESUME  |
                             |  + ALIGNMENT REPORT   |
                             +-----------------------+
```

---

## 3. Truth-Safety Claim Auditor Pipeline

Every generated resume undergoes an automated claim validation check prior to rendering:
1. **Extraction**: Collects all skills, tools, and experience claims in the generated resume payload.
2. **Cross-Referencing**: Matches claims against verified items in `CandidateProfile`.
3. **Action**: If an unsupported claim is found (e.g. candidate only knows Docker but AI added Kubernetes), it is flagged, removed from the resume, and placed in the **"What Should I Learn?" Roadmap**.

---

## 4. Test Suite Verification

Run the test suite using:
```bash
cd server
npm test
```
- `tests/matching.test.ts`: Validates skill taxonomy, alias normalization (`postgres` $\rightarrow$ `PostgreSQL`), non-equivalence enforcement (`React` $\neq$ `Angular`), and match scores.
- `tests/truth-validation.test.ts`: Verifies that unsupported AI-injected claims are successfully caught and flagged.
