"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import { RotateCcw, Timer, MousePointerClick, Trophy, Sparkles } from "lucide-react";
import Collectible from "./game/Collectible";

interface Card {
  id: number;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ML_PAIRS = [
  { emoji: "🧠", label: "Neural Net" },
  { emoji: "🗣️", label: "NLP" },
  { emoji: "🤖", label: "Transformer" },
  { emoji: "🎯", label: "Attention" },
  { emoji: "📊", label: "Loss Fn" },
  { emoji: "🔥", label: "PyTorch" },
  { emoji: "⚡", label: "GPU" },
  { emoji: "🎲", label: "Dropout" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createBoard(): Card[] {
  const doubled = [...ML_PAIRS, ...ML_PAIRS];
  const shuffled = shuffleArray(doubled);
  return shuffled.map((item, i) => ({
    id: i,
    emoji: item.emoji,
    label: item.label,
    isFlipped: false,
    isMatched: false,
  }));
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(createBoard);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const lockRef = useRef(false);

  // Timer
  useEffect(() => {
    if (!isPlaying || gameWon) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isPlaying, gameWon]);

  // Load best score
  useEffect(() => {
    const saved = localStorage.getItem("memgame_best");
    if (saved) setBestScore(Number(saved));
  }, []);

  // Check match
  useEffect(() => {
    if (flipped.length !== 2) return;
    lockRef.current = true;
    const [a, b] = flipped;
    const cardA = cards[a];
    const cardB = cards[b];

    if (cardA.emoji === cardB.emoji && cardA.label === cardB.label) {
      // Match!
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, isMatched: true } : c
          )
        );
        setMatches((m) => m + 1);
        setFlipped([]);
        lockRef.current = false;
      }, 500);
    } else {
      // No match — flip back
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, isFlipped: false } : c
          )
        );
        setFlipped([]);
        lockRef.current = false;
      }, 800);
    }
  }, [flipped, cards]);

  // Win check
  useEffect(() => {
    if (matches === ML_PAIRS.length && matches > 0) {
      setGameWon(true);
      if (!bestScore || moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem("memgame_best", String(moves));
      }
    }
  }, [matches, moves, bestScore]);

  const handleFlip = useCallback(
    (idx: number) => {
      if (lockRef.current) return;
      if (cards[idx].isFlipped || cards[idx].isMatched) return;
      if (flipped.length >= 2) return;

      if (!isPlaying) setIsPlaying(true);

      setCards((prev) =>
        prev.map((c) => (c.id === idx ? { ...c, isFlipped: true } : c))
      );
      setFlipped((prev) => [...prev, idx]);
      setMoves((m) => m + 1);
    },
    [cards, flipped, isPlaying]
  );

  const resetGame = useCallback(() => {
    setCards(createBoard());
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setIsPlaying(false);
    setGameWon(false);
    lockRef.current = false;
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <section id="game" className="section-padding bg-gray-950/50">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          label="Mini Game"
          title="ML Memory Challenge"
          subtitle="Match the ML concept pairs — test your memory while exploring my world"
        />

        <div className="flex justify-center mb-4">
          <Collectible id="c_game" />
        </div>

        <AnimatedSection>
          <div className="glass p-6 md:p-8">
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <MousePointerClick size={14} className="text-indigo-400" />
                  <span className="font-mono">{moves}</span>
                  <span className="text-gray-600">moves</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Timer size={14} className="text-purple-400" />
                  <span className="font-mono">{formatTime(seconds)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Sparkles size={14} className="text-pink-400" />
                  <span className="font-mono">
                    {matches}/{ML_PAIRS.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {bestScore !== null && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Trophy size={12} className="text-yellow-500" />
                    Best: {bestScore} moves
                  </div>
                )}
                <button
                  onClick={resetGame}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-4 gap-2.5 md:gap-3">
              {cards.map((card) => (
                <motion.button
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  className="relative aspect-square rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  whileHover={
                    !card.isFlipped && !card.isMatched
                      ? { scale: 1.05 }
                      : {}
                  }
                  whileTap={
                    !card.isFlipped && !card.isMatched
                      ? { scale: 0.95 }
                      : {}
                  }
                >
                  <AnimatePresence mode="wait">
                    {card.isFlipped || card.isMatched ? (
                      <motion.div
                        key="front"
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: 90, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1 border ${
                          card.isMatched
                            ? "bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                            : "bg-white/[0.06] border-white/[0.1]"
                        }`}
                      >
                        <span className="text-2xl md:text-3xl">
                          {card.emoji}
                        </span>
                        <span
                          className={`text-[9px] md:text-[10px] font-mono font-medium tracking-wide ${
                            card.isMatched
                              ? "text-indigo-300"
                              : "text-gray-400"
                          }`}
                        >
                          {card.label}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/[0.08] flex items-center justify-center hover:border-white/[0.15] transition-colors"
                      >
                        <div className="text-xl md:text-2xl text-white/20 font-bold select-none">
                          ?
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* Win Overlay */}
            <AnimatePresence>
              {gameWon && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 glass p-6 text-center border-indigo-500/20"
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <h4 className="text-lg font-bold gradient-text mb-1">
                    Well done!
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Completed in{" "}
                    <span className="text-white font-mono">{moves}</span> moves
                    and{" "}
                    <span className="text-white font-mono">
                      {formatTime(seconds)}
                    </span>
                  </p>
                  <button
                    onClick={resetGame}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                  >
                    <RotateCcw size={14} />
                    Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
