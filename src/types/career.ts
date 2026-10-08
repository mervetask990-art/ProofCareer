import { z } from 'zod';

export const SkillMatchSchema = z.object({
  skill: z.string(),
  status: z.enum(['found', 'partial', 'missing']),
  evidence: z.string().optional()
});

export const JobAnalysisSchema = z.object({
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  mustHave: z.array(SkillMatchSchema),
  niceToHave: z.array(SkillMatchSchema),
  matchScore: z.number(),
  ghostJobScore: z.number().optional(),
  ghostAnalysis: z.string().optional(),
  scoreBreakdown: z.object({
    mustHave: z.number(),
    niceToHave: z.number(),
    atsFormat: z.number()
  }).optional()
});

export type JobAnalysis = z.infer<typeof JobAnalysisSchema>;

export const InterviewEvaluationSchema = z.object({
  score: z.number(),
  feedback: z.string(),
  exampleAnswer: z.string()
});

export type InterviewEvaluation = z.infer<typeof InterviewEvaluationSchema>;

export const StealthConfigSchema = z.object({
  enabled: z.boolean(),
  currentCompany: z.string().optional(),
  competitors: z.array(z.string()).optional()
});

export type StealthConfig = z.infer<typeof StealthConfigSchema>;


export const ExperienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.array(z.string()),
});

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  proofUrl: z.string().url().optional().describe("Doğrulama amaçlı eklenecek link (GitHub, Canlı vb.)")
});

export const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  graduationDate: z.string()
});

export const TailoredCvSchema = z.object({
  fullName: z.string(),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    website: z.string().url().optional()
  }),
  summary: z.string().describe("Profesyonel özet. Dürüstlük kalkanı kurallarına göre adayın genel adaptasyon gücünü vurgulayabilir."),
  experiences: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(z.string()),
  education: z.array(EducationSchema),
  certifications: z.array(z.string()).optional()
});

export type TailoredCv = z.infer<typeof TailoredCvSchema>;
