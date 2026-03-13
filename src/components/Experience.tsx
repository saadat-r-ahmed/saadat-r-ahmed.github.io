"use client";

import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import { Briefcase, Users, ExternalLink } from "lucide-react";
import Collectible from "./game/Collectible";

const experiences = [
  {
    title: "ML Team Lead",
    company: "Innospace Infotech Ltd.",
    companyUrl: "https://innospace.tech/",
    period: "Nov 2024 – Present",
    type: "industry",
    description:
      "Leading AI/ML team building educational technology for Lecture Publications Ltd. and the Britto App (155K+ students).",
    highlights: [
      "Delivered QA Bot, Question Splitter, RAG Chatbot, and Analytics Platform",
      "Designed ETL pipelines reducing costs by 52%",
      "Built Transformer POS tagger achieving 3× speed improvement",
      "Student tracking system driving +23% engagement",
    ],
    tags: ["RAG", "LLMs", "ETL", "Transformers", "Analytics"],
  },
  {
    title: "Data Scientist",
    company: "Robi Axiata Ltd.",
    companyUrl: "https://www.robi.com.bd/en",
    period: "Mar 2024 – May 2024",
    type: "industry",
    description:
      "Built ML systems on massive-scale telecom data.",
    highlights: [
      "Churn prediction model on 47M users' transactional data (170 TB)",
      "User-facing AI chatbot with chain-of-thought reasoning",
      "HR-facing RAG system for internal query resolution",
    ],
    tags: ["Big Data", "Churn Prediction", "RAG", "CoT Reasoning"],
  },
  {
    title: "Lecturer, Department of CSE",
    company: "BRAC University",
    companyUrl: "https://cse.sds.bracu.ac.bd/faculty_profile/311/saadat_rafid_ahmed",
    period: "May 2024 – Present",
    type: "academic",
    description:
      "Full-time faculty member teaching 300+ students per semester and supervising 6 thesis groups.",
    highlights: [
      "Sole course designer for CSE440: NLP II Labs — full syllabus, assignments, and content from scratch",
      "Teaching CSE422 (ML/AI), CSE330 (Numerical Methods), CSE440 (NLP II), MAT120 (Discrete Math)",
      "Designed original labs: Polynomial Interpolation & Neural Network backpropagation exercises",
      "Created comprehensive LaTeX Beamer slide decks with university-branded formatting",
    ],
    tags: ["ML", "NLP", "Numerical Methods", "Curriculum Design"],
  },
  {
    title: "Undergraduate Teaching Assistant",
    company: "BRAC University",
    companyUrl: null,
    period: "Oct 2022 – Dec 2023",
    type: "academic",
    description:
      "Conducted lab sessions and led study groups for 300+ students.",
    highlights: [
      "CSE220 — Data Structures",
      "MAT215 — Mathematics for ML & Signal Processing",
      "PHY112 — Principles of Physics II",
    ],
    tags: ["Data Structures", "Mathematics", "Physics"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Experience"
          title="Industry & Academic"
          subtitle="Bridging the gap between cutting-edge research and real-world impact"
        />

        {/* Toggle-style labels */}
        <AnimatedSection className="flex justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Briefcase size={14} className="text-indigo-400" />
            <span>Industry</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={14} className="text-purple-400" />
            <span>Academic</span>
          </div>
          <Collectible id="c_experience" />
        </AnimatedSection>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <AnimatedSection key={exp.title + exp.company} delay={i * 0.1}>
              <div className="glass glass-hover p-6 md:p-8 group">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {exp.type === "industry" ? (
                        <Briefcase
                          size={14}
                          className="text-indigo-400 flex-shrink-0"
                        />
                      ) : (
                        <Users
                          size={14}
                          className="text-purple-400 flex-shrink-0"
                        />
                      )}
                      <span
                        className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full ${
                          exp.type === "industry"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {exp.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-1"
                        >
                          {exp.company}
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">
                          {exp.company}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-mono md:text-right flex-shrink-0">
                    {exp.period}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-4">{exp.description}</p>

                <ul className="space-y-1.5 mb-4">
                  {exp.highlights.map((point, j) => (
                    <li
                      key={j}
                      className="text-sm text-gray-400 leading-relaxed flex gap-2"
                    >
                      <span
                        className={`mt-1.5 flex-shrink-0 ${
                          exp.type === "industry"
                            ? "text-indigo-500"
                            : "text-purple-500"
                        }`}
                      >
                        &#9656;
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.04] border border-white/[0.06] text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
