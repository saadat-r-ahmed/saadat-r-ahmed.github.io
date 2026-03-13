"use client";

import AnimatedSection from "./AnimatedSection";

interface Props {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ label, title, subtitle }: Props) {
  return (
    <AnimatedSection className="text-center mb-16">
      <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold gradient-text-subtle mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  );
}
