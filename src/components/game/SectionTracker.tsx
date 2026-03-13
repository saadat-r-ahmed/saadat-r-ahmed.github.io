"use client";

import { useEffect, useRef } from "react";
import { useGame, SECTIONS } from "./GameContext";

export default function SectionTracker() {
  const { visitSection } = useGame();
  const observed = useRef(false);

  useEffect(() => {
    if (observed.current) return;
    observed.current = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visitSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    // Small delay so DOM has rendered
    const timer = setTimeout(() => {
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [visitSection]);

  return null;
}
