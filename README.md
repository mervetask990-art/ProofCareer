<div align="center">
  <img src="https://api.iconify.design/lucide:terminal.svg?color=%232563eb" width="80" height="80" alt="ProofCareer Logo" />
  <h1 align="center">ProofCareer</h1>
  <p align="center">
    <strong>AI-Powered ATS CV Optimizer & Technical Interview Strategy Radar</strong>
  </p>
  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" /></a>
  </p>
</div>

<br />

ProofCareer is an advanced B2B-grade SaaS application designed to empower software engineers and professionals in their job search. It acts as an autonomous HR agent that analyzes job descriptions, strictly interrogates the candidate to extract verifiable evidence, and generates perfectly tailored, ATS-compliant CVs.

Engineered with a **"Linear/Stripe" caliber Light Theme**, it prioritizes depth, visual hierarchy, and absolute professionalism.

---

## ✨ Features (The WOW Factor)

### 🤖 Evidence-Based Interrogation Engine
Unlike typical "text-spinners", ProofCareer acts as a rigorous HR interviewer. If a job requires *Docker* and you don't mention it, the AI doesn't hallucinate it. Instead, it **interrogates you** ("Have you used Docker? Have you used similar tools?") until you provide evidence or admit a knowledge gap.

### 📄 ATS X-Ray Document Simulator
A breathtaking, real-time A4 document preview rendering your CV exactly how Applicant Tracking Systems will read it. Features a built-in "Demo Load" capability for instant one-click presentations.

### 🛡️ Stealth Mode (KVKK Masking Shield)
Currently employed? ProofCareer includes a **Stealth Mode** toggle. Enter your current company and competitors, and the system will automatically mask and anonymize them in the generated DOCX file to protect your identity.

### 🎯 Technical Interview Strategy Radar
If the AI detects missing technical skills, it automatically spins up a personalized interview survival guide. It predicts the toughest scenario-based questions you'll face for those exact missing skills and provides tactical "How to Answer" blueprints.

### 👻 Ghost Job Radar
Not all job postings are real. The built-in Ghost Job Radar analyzes the semantics of the job description to calculate a risk score, warning you if a posting is a "Ghost Job" meant for data harvesting rather than actual hiring.

### 📥 Native DOCX Generation
Generates raw, beautifully formatted `.docx` files on the backend using standard XML construction—no tables, no complex styling that breaks ATS parsers.

---

## 🏗️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strictly typed schemas for LLM outputs)
- **Styling:** Tailwind CSS (Modern Light Mode, Pastel Badges, Elevation Shadows)
- **AI Integration:** `@google/genai` (Gemini 2.5 Flash / Pro)
- **Document Engine:** `docx` (Server-side Buffer generation)
- **Icons:** `lucide-react`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/proofcareer.git
   cd proofcareer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🎨 Design Philosophy

ProofCareer rejects the "flat white" aesthetic. It leverages a multi-layered surface architecture:
- **Canvas:** `slate-50` for comfortable viewing.
- **Surfaces:** Pure `white` with `1px slate-200` borders and subtle elevation (`shadow-sm`).
- **Typography:** Deep `slate-900` for authoritative headings, readable `slate-600` for body text, and `font-mono` for metrics.
- **Pills & Badges:** Saturated text on pastel backgrounds (e.g., Emerald, Amber, Rose) to provide non-intrusive yet immediate state recognition.

---

<div align="center">
  <p>Built with precision to bridge the gap between human talent and algorithmic filters.</p>
  <i>"Don't just apply. Prove your career."</i>
</div>
