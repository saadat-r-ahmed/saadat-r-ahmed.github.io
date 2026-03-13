"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./GameContext";

interface CollectibleProps {
  id: string;
  className?: string;
}

export default function Collectible({ id, className = "" }: CollectibleProps) {
  const { collectiblesFound, collectItem } = useGame();
  const [burst, setBurst] = useState(false);
  const found = collectiblesFound.includes(id);

  const handleClick = () => {
    if (found) return;
    setBurst(true);
    collectItem(id);
    setTimeout(() => setBurst(false), 600);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <AnimatePresence>
        {!found && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={handleClick}
            className="relative w-7 h-7 rounded-full cursor-pointer group focus:outline-none"
            title="A hidden data point! Click to collect."
          >
            {/* Outer pulse */}
            <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
            {/* Core orb */}
            <span className="absolute inset-1 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-400/50 transition-shadow" />
            {/* Inner glow */}
            <span className="absolute inset-2 rounded-full bg-white/30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Burst particles */}
      <AnimatePresence>
        {burst && (
          <>
            {[...Array(6)].map((_, i) => {
              const angle = (360 / 6) * i;
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * 30;
              const y = Math.sin(rad) * 30;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x, y, scale: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 -translate-x-1/2 -translate-y-1/2"
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Collected checkmark */}
      {found && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center"
        >
          <span className="text-[10px]">✓</span>
        </motion.div>
      )}
    </div>
  );
}
