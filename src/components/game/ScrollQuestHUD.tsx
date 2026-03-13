"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, SECTIONS } from "./GameContext";
import { Gamepad2, X, ChevronUp } from "lucide-react";

const LEVEL_THRESHOLDS = [0, 30, 80, 150, 250];
const LEVEL_NAMES = ["Novice", "Explorer", "Researcher", "Specialist", "Master"];
const TOTAL_COLLECTIBLES = 9;

const SECTION_ICONS: Record<string, string> = {
  hero: "🏠",
  about: "🧑‍💻",
  education: "🎓",
  research: "📄",
  experience: "💼",
  skills: "⚡",
  teaching: "🏆",
  game: "🎮",
  contact: "📬",
};

export default function ScrollQuestHUD() {
  const {
    xp,
    level,
    collectiblesFound,
    sectionsVisited,
    toastQueue,
    dismissToast,
  } = useGame();

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-show hint after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasInteracted) setOpen(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [hasInteracted]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toastQueue.length === 0) return;
    const t = setTimeout(dismissToast, 2500);
    return () => clearTimeout(t);
  }, [toastQueue, dismissToast]);

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 100;
  const progress = Math.min(
    ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100,
    100
  );

  return (
    <>
      {/* Achievement Toast */}
      <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toastQueue.length > 0 && (
            <motion.div
              key={toastQueue[0].id}
              initial={{ opacity: 0, x: 80, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="glass px-4 py-3 flex items-center gap-3 border-indigo-500/20 shadow-lg shadow-indigo-500/10 min-w-[200px]"
            >
              <span className="text-xl">{toastQueue[0].emoji}</span>
              <div>
                <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-medium">
                  Achievement Unlocked
                </p>
                <p className="text-sm text-gray-200 font-semibold">
                  {toastQueue[0].title}
                </p>
                <p className="text-[10px] text-gray-500">
                  +{toastQueue[0].xp} XP
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating toggle button (when minimized) */}
      <AnimatePresence>
        {minimized && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => {
              setMinimized(false);
              setHasInteracted(true);
            }}
            className="fixed bottom-4 right-4 z-[55] w-12 h-12 rounded-full bg-indigo-600/80 backdrop-blur-lg border border-indigo-500/40 shadow-lg shadow-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-500/80 transition-colors"
          >
            <Gamepad2 size={18} />
            {collectiblesFound.length < TOTAL_COLLECTIBLES && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-[9px] font-bold flex items-center justify-center animate-pulse">
                {collectiblesFound.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main HUD Panel */}
      <AnimatePresence>
        {!minimized && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 z-[55] w-64"
          >
            <div className="glass border-indigo-500/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-indigo-600/10 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Gamepad2 size={14} className="text-indigo-400" />
                  <span className="text-xs font-semibold text-gray-300">
                    Explorer Quest
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setOpen(!open);
                      setHasInteracted(true);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <ChevronUp
                      size={12}
                      className={`transition-transform ${open ? "" : "rotate-180"}`}
                    />
                  </button>
                  <button
                    onClick={() => setMinimized(true)}
                    className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Compact bar (always visible) */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-indigo-400">
                      Lv.{level}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {LEVEL_NAMES[level - 1]}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    {xp} XP
                  </span>
                </div>
                {/* XP bar */}
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-3">
                      {/* Section progress */}
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
                          Sections Explored
                        </p>
                        <div className="grid grid-cols-9 gap-1">
                          {SECTIONS.map((sec) => {
                            const visited = sectionsVisited.includes(sec);
                            return (
                              <a
                                key={sec}
                                href={`#${sec}`}
                                title={sec}
                                className={`aspect-square rounded-md flex items-center justify-center text-xs transition-all ${
                                  visited
                                    ? "bg-indigo-500/20 border border-indigo-500/30 scale-100"
                                    : "bg-white/[0.03] border border-white/[0.06] opacity-40 hover:opacity-70"
                                }`}
                              >
                                {SECTION_ICONS[sec] || "?"}
                              </a>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1">
                          {sectionsVisited.length}/{SECTIONS.length} visited
                        </p>
                      </div>

                      {/* Collectibles */}
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                          Data Points
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(TOTAL_COLLECTIBLES)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full transition-all ${
                                i < collectiblesFound.length
                                  ? "bg-gradient-to-br from-indigo-400 to-purple-400 shadow-sm shadow-indigo-500/30"
                                  : "bg-white/[0.06] border border-white/[0.08]"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1">
                          {collectiblesFound.length}/{TOTAL_COLLECTIBLES}{" "}
                          collected — look for glowing orbs!
                        </p>
                      </div>

                      {/* Hint */}
                      <p className="text-[10px] text-gray-600 italic leading-relaxed">
                        Scroll through sections and find hidden data points to
                        earn XP and unlock achievements ✨
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
