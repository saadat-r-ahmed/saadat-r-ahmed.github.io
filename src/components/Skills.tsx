"use client";

import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import Collectible from "./game/Collectible";

const skillCategories = [
  {
    title: "Languages",
    color: "indigo",
    skills: ["Python", "C", "C++", "TypeScript", "JavaScript", "Dart", "WolframScript"],
  },
  {
    title: "ML & NLP",
    color: "purple",
    skills: [
      "Scikit-learn",
      "HuggingFace Transformers",
      "TensorFlow",
      "TextAttack",
      "NLTK",
      "LangChain",
      "vLLM",
    ],
  },
  {
    title: "RAG & Vector Stores",
    color: "pink",
    skills: ["ChromaDB", "Qdrant", "BM25", "Hierarchical RAG", "Multi-hop Reasoning"],
  },
  {
    title: "MLOps & Cloud",
    color: "blue",
    skills: ["AWS SageMaker", "AWS Redshift", "Docker", "Kubernetes", "Kubeflow", "Paperspace"],
  },
  {
    title: "Data Engineering",
    color: "emerald",
    skills: ["ETL Pipelines", "PostgreSQL", "MongoDB", "BigQuery", "Metabase"],
  },
  {
    title: "Frameworks",
    color: "amber",
    skills: ["Flask", "FastAPI", "GraphQL", "Flutter", "CrewAI", "GROQ", "MistralAI"],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
    dot: "bg-pink-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
};

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-gray-950/50">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Skills"
          title="Technical Proficiency"
          subtitle="Tools and technologies I work with daily"
        />

        <div className="flex justify-end mb-2 -mt-4">
          <Collectible id="c_skills" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((cat, i) => {
            const colors = colorMap[cat.color] || colorMap.indigo;
            return (
              <AnimatedSection key={cat.title} delay={i * 0.08}>
                <div className="glass glass-hover p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <h3 className={`font-semibold text-sm ${colors.text}`}>
                      {cat.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg ${colors.bg} ${colors.border} border ${colors.text} hover:scale-105 transition-transform cursor-default`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
