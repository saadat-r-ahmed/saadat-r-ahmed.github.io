"use client";

import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import { GraduationCap } from "lucide-react";
import Collectible from "./game/Collectible";

export default function Education() {
  return (
    <section id="education" className="section-padding bg-gray-950/50">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          label="Education"
          title="Academic Background"
        />

        <AnimatedSection>
          <div className="glass p-8 glow-sm border-indigo-500/10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 flex-shrink-0">
                <GraduationCap size={24} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-3">
                  <h3 className="text-lg font-bold text-gray-200">
                    BSc in Computer Science & Engineering
                  </h3>
                  <span className="text-xs text-gray-500 font-mono">
                    2020 – 2023
                  </span>
                </div>
                <p className="text-sm text-indigo-400 font-medium mb-4">
                  BRAC University, Dhaka
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="glass p-3 text-center">
                    <div className="text-2xl font-bold gradient-text">4.00</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                      CGPA / 4.00
                    </div>
                  </div>
                  <div className="glass p-3 text-center">
                    <div className="text-2xl font-bold gradient-text">100%</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                      Merit Scholarship
                    </div>
                  </div>
                  <div className="glass p-3 text-center">
                    <div className="text-2xl font-bold gradient-text">7×</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                      VC&apos;s Award
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Thesis
                    </p>
                    <p className="text-sm text-gray-300 italic">
                      destroR: Attacking Transfer Models with Obfuscous Examples
                      to Discard Perplexity
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        Advisor: Dr. Farig Yousuf Sadeque, Assistant Professor,
                        BRAC University
                      </p>
                      <Collectible id="c_education" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Selected Coursework
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Machine Learning",
                        "Neural Networks & Deep Learning",
                        "Natural Language Processing",
                        "Data Structures & Algorithms",
                        "Linear Algebra",
                        "Probability & Statistics",
                        "Signal Processing",
                      ].map((course) => (
                        <span
                          key={course}
                          className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.04] border border-white/[0.06] text-gray-400"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
