"use client";

import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import { GraduationCap, Brain, Code2, BookOpen } from "lucide-react";
import Collectible from "./game/Collectible";

const highlights = [
  {
    icon: Brain,
    title: "Research Focus",
    desc: "Low-resource NLP, adversarial ML, and transfer learning robustness for Bengali language technology.",
  },
  {
    icon: Code2,
    title: "Industry Impact",
    desc: "Leading ML team building RAG-based educational AI systems serving 155K+ students across Bangladesh.",
  },
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    desc: "Perfect 4.00 CGPA with 100% merit scholarship. Vice-Chancellor's Award for 7 consecutive semesters.",
  },
  {
    icon: BookOpen,
    title: "Teaching",
    desc: "Teaching 300+ students per semester across ML, NLP, Numerical Methods, and Discrete Mathematics.",
  },
];

const interests = [
  "Low-Resource NLP",
  "Adversarial Machine Learning",
  "Retrieval-Augmented Generation",
  "Bengali Language Technology",
  "Transfer Learning Robustness",
  "AI for Education",
  "ML Fairness & Bias",
];

export default function About() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="About"
          title="Academic Profile"
          subtitle="Bridging academia and industry through impactful research and engineering"
        />

        <AnimatedSection className="glass p-6 md:p-8 mb-12">
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            Lecturer and researcher in Computer Science with a focus on{" "}
            <span className="text-indigo-400 font-medium">low-resource NLP</span>,{" "}
            <span className="text-indigo-400 font-medium">adversarial machine learning</span>, and{" "}
            <span className="text-indigo-400 font-medium">AI for education</span>. Currently
            teaching 300+ students per semester across ML, NLP, and Numerical Methods while
            supervising six undergraduate thesis groups. Concurrently leading an ML team building
            RAG-based educational AI systems serving 155K+ students. Research explores the
            robustness of transfer learning in Bengali, with published work on adversarial attacks
            and sentiment analysis.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {highlights.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <div className="glass glass-hover p-6 h-full group">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Research Interests
              </h3>
              <Collectible id="c_about" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {interests.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-300 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
