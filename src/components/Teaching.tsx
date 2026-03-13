"use client";

import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import { Award, Globe, Guitar, BookOpen } from "lucide-react";
import Collectible from "./game/Collectible";

const awards = [
  {
    title: "100% Merit-Based Scholarship",
    org: "BRAC University",
    period: "2020 – 2023",
    icon: Award,
  },
  {
    title: "Vice-Chancellor's Award (7 semesters)",
    org: "Perfect 4.00 CGPA each semester",
    period: "2020 – 2023",
    icon: Award,
  },
  {
    title: "Top 12 Worldwide — SemEval 2023 Task 10 (EDOS)",
    org: "Co-located with ACL 2023",
    period: "2023",
    icon: Award,
  },
];

const service = [
  {
    title: "BRACU CSE SDS Portal",
    desc: "Faculty management system centralizing admin forms, resource requests, and workflows",
  },
  {
    title: "Thesis Group Management System",
    desc: "End-to-end thesis lifecycle — registration, advisor assignment, proposal tracking, panel scheduling",
  },
  {
    title: "Peer Evaluation System",
    desc: "Anonymous faculty peer-review with LLM-based summarizer preserving reviewer anonymity",
  },
];

const leadership = [
  {
    title: "Lead Software Research Member",
    org: "Robotics & Intelligent Systems (RIS), BRAC University",
    period: "Dec 2021 – Dec 2023",
    desc: "Led software development for robotics projects; mentored junior members on embedded systems",
  },
  {
    title: "Senior Executive, IT Department",
    org: "BRAC University Adventure Club",
    period: "2021 – 2023",
    desc: null,
  },
];

export default function Teaching() {
  return (
    <section id="teaching" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Recognition"
          title="Awards & Service"
          subtitle="Academic honors, departmental service, and leadership"
        />

        {/* Awards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {awards.map((award, i) => (
            <AnimatedSection key={award.title} delay={i * 0.1}>
              <div className="glass glass-hover p-6 h-full text-center group">
                <div className="mx-auto w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <award.icon size={18} className="text-amber-400" />
                </div>
                <h3 className="font-semibold text-gray-200 text-sm mb-1">
                  {award.title}
                </h3>
                <p className="text-xs text-gray-500">{award.org}</p>
                <p className="text-xs text-gray-600 mt-1 font-mono">
                  {award.period}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Service to Department */}
        <AnimatedSection>
          <h3 className="text-lg font-bold text-gray-200 mb-6 text-center">
            Service to the Department
          </h3>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {service.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <div className="glass glass-hover p-6 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="text-indigo-400" />
                  <h4 className="font-semibold text-sm text-indigo-300">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Leadership */}
        <AnimatedSection>
          <div className="flex items-center justify-center gap-3 mb-6">
            <h3 className="text-lg font-bold text-gray-200">
              Leadership & Activities
            </h3>
            <Collectible id="c_teaching" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {leadership.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <div className="glass glass-hover p-6">
                <h4 className="font-semibold text-gray-200 text-sm mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mb-1">{item.org}</p>
                <p className="text-xs text-gray-600 font-mono mb-2">
                  {item.period}
                </p>
                {item.desc && (
                  <p className="text-xs text-gray-400">{item.desc}</p>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Personal */}
        <AnimatedSection delay={0.2}>
          <div className="glass p-6 text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-indigo-400" />
                <span>Bengali (native), English (fluent)</span>
              </div>
              <div className="flex items-center gap-2">
                <Guitar size={14} className="text-purple-400" />
                <span>Guitar, Harmonium, Musical composition</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
