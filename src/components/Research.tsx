"use client";

import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import { FileText, ExternalLink, Award } from "lucide-react";
import Collectible from "./game/Collectible";

const publications = [
  {
    id: 1,
    title:
      "destroR: Attacking Transfer Models with Obfuscous Examples to Discard Perplexity",
    authors: "S. R. Ahmed",
    venue: "arXiv preprint arXiv:2511.11309, 2025",
    status: "Under review",
    link: "https://arxiv.org/abs/2511.11309",
    highlight: true,
    tags: ["Adversarial NLP", "Bengali", "Transfer Learning"],
    description:
      "Pioneered integration of Bengali into adversarial attacks with three novel attack strategies exploiting morphology at character and word levels. Achieved 18–40% F1 degradation across BERT and LSTM models.",
  },
  {
    id: 2,
    title: "BSenti: A Comprehensive Bangla Sentiment Classification Library",
    authors: "S. R. Ahmed",
    venue: "Open-source Python library and benchmark",
    status: "Published",
    link: null,
    highlight: false,
    tags: ["Sentiment Analysis", "Bengali", "Open Source"],
    description:
      "Unifies fragmented Bangla sentiment datasets; provides comparative evaluation across statistical (SVM, NB, LR) and deep-learning (BiLSTM, BERT) architectures.",
  },
  {
    id: 3,
    title:
      "SemEval 2023 Task 10: Explainable Detection of Online Sexism (EDOS)",
    authors: "S. R. Ahmed",
    venue: "Proceedings of SemEval-2023, co-located with ACL 2023",
    status: "Published",
    link: null,
    highlight: false,
    tags: ["NLP", "Text Classification", "SemEval"],
    description:
      "Ranked Top 12 worldwide out of 80+ teams with Micro F1 of 53.47%.",
  },
];

const researchExperience = [
  {
    title: "Thesis Research — Adversarial NLP for Bengali",
    org: "BRAC University",
    period: "2022 – 2023",
    advisor: "Dr. Farig Yousuf Sadeque",
    points: [
      "Pioneered integration of Bengali into adversarial attacks and adversarial training, opening a new research direction for low-resource NLP security",
      "Devised three novel attack strategies exploiting Bengali morphology: homoglyph substitution, suffix perturbation, and semantic-preserving word replacement",
      "Achieved 18–40% F1 score degradation across BERT-based and LSTM-based classification models",
    ],
  },
  {
    title: "Thesis Supervision — 6 Undergraduate Groups",
    org: "BRAC University",
    period: "May 2024 – Present",
    advisor: null,
    points: [
      "Track A — AI-assisted Legal Aid: NLP-driven document analysis for legal accessibility in Bengali",
      "Track B — User Behavior & Update Systems: ML-based engagement modeling and behavioral analytics",
      "Themes span NLP, ML Bias & Ethics, Reinforcement Learning, and AI in Health & Education",
    ],
  },
  {
    title: "Applied Research — RAG & Educational AI",
    org: "Innospace Infotech Ltd.",
    period: "Nov 2024 – Present",
    advisor: null,
    points: [
      "Designed Hierarchical RAG architectures with BM25 reranking for Bangladesh's national curriculum (HSC/SSC)",
      "Developed HRAG validation pipeline using multi-hop reasoning for automated QA on 170K+ questions",
      "Built OCR + T5 pipeline for mixed Bengali-English document extraction",
    ],
  },
];

export default function Research() {
  return (
    <section id="research" className="section-padding bg-gray-950/50">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Research"
          title="Publications & Research"
          subtitle="Exploring the boundaries of NLP for underrepresented languages"
        />

        {/* Publications */}
        <div className="space-y-4 mb-20">
          {publications.map((pub, i) => (
            <AnimatedSection key={pub.id} delay={i * 0.1}>
              <div
                className={`glass glass-hover p-6 ${
                  pub.highlight ? "border-indigo-500/20 glow-sm" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText
                        size={14}
                        className="text-indigo-400 flex-shrink-0"
                      />
                      <span className="text-xs text-gray-500">
                        [{pub.id}]
                      </span>
                      {pub.highlight && (
                        <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {pub.status}
                        </span>
                      )}
                      {!pub.highlight && pub.status === "Published" && (
                        <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Published
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-200 mb-1">
                      {pub.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {pub.authors} &middot; <em>{pub.venue}</em>
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">
                      {pub.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {pub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.04] border border-white/[0.06] text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-indigo-500/10 text-gray-500 hover:text-indigo-400 transition-all flex-shrink-0"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Research Experience */}
        <AnimatedSection>
          <div className="flex items-center justify-center gap-3 mb-8">
            <h3 className="text-xl font-bold text-gray-200">
              Research Experience
            </h3>
            <Collectible id="c_research" />
          </div>
        </AnimatedSection>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent" />

          <div className="space-y-8">
            {researchExperience.map((exp, i) => (
              <AnimatedSection key={exp.title} delay={i * 0.1}>
                <div className="relative pl-12 md:pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-6.5 top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-gray-950 shadow-lg shadow-indigo-500/30" />

                  <div className="glass glass-hover p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-200">
                        {exp.title}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {exp.org} &middot; {exp.period}
                    </p>
                    {exp.advisor && (
                      <p className="text-xs text-indigo-400/70 mb-3">
                        Advisor: {exp.advisor}
                      </p>
                    )}
                    <ul className="space-y-1.5">
                      {exp.points.map((point, j) => (
                        <li
                          key={j}
                          className="text-sm text-gray-400 leading-relaxed flex gap-2"
                        >
                          <span className="text-indigo-500 mt-1.5 flex-shrink-0">
                            &#9656;
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
