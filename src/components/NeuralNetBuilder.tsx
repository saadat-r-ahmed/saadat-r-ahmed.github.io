"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import Collectible from "./game/Collectible";
import {
  Plus,
  X,
  Play,
  RotateCcw,
  Trophy,
  Zap,
  ChevronRight,
  Layers,
  Brain,
  Sparkles,
} from "lucide-react";

// ── Layer definitions ───────────────────────────────────
interface LayerDef {
  type: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  params: number;
  desc: string;
}

const LAYER_DEFS: LayerDef[] = [
  { type: "dense", label: "Dense", emoji: "🔗", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", params: 128, desc: "Fully connected layer" },
  { type: "conv2d", label: "Conv2D", emoji: "🔲", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", params: 256, desc: "2D convolution filter" },
  { type: "lstm", label: "LSTM", emoji: "🔄", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", params: 512, desc: "Long short-term memory" },
  { type: "dropout", label: "Dropout", emoji: "💧", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", params: 0, desc: "Regularization layer" },
  { type: "batchnorm", label: "BatchNorm", emoji: "📊", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", params: 4, desc: "Normalize activations" },
  { type: "flatten", label: "Flatten", emoji: "📏", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", params: 0, desc: "Reshape to 1D" },
  { type: "attention", label: "Attention", emoji: "👁", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", params: 384, desc: "Self-attention mechanism" },
  { type: "embedding", label: "Embedding", emoji: "📝", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", params: 1024, desc: "Token embedding layer" },
];

// ── Challenges ──────────────────────────────────────────
interface Challenge {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  requiredTypes: string[];
  minLayers: number;
  maxLayers: number;
  bonusTypes: string[];
  perfectScore: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: "img",
    title: "Image Classifier",
    desc: "Build a CNN to classify images",
    emoji: "🖼️",
    requiredTypes: ["conv2d", "flatten", "dense"],
    minLayers: 4,
    maxLayers: 8,
    bonusTypes: ["batchnorm", "dropout"],
    perfectScore: 98,
  },
  {
    id: "nlp",
    title: "Sentiment Analyzer",
    desc: "Classify text sentiment with NLP",
    emoji: "💬",
    requiredTypes: ["embedding", "lstm", "dense"],
    minLayers: 4,
    maxLayers: 8,
    bonusTypes: ["attention", "dropout"],
    perfectScore: 96,
  },
  {
    id: "transformer",
    title: "Transformer Block",
    desc: "Build a transformer encoder block",
    emoji: "⚡",
    requiredTypes: ["embedding", "attention", "dense", "batchnorm"],
    minLayers: 5,
    maxLayers: 10,
    bonusTypes: ["dropout"],
    perfectScore: 99,
  },
];

// ── Layer instance ──────────────────────────────────────
interface LayerInstance {
  id: string;
  def: LayerDef;
}

// ── Score computation (client-side, deterministic) ──────
function computeScore(layers: LayerInstance[], challenge: Challenge): number {
  if (layers.length === 0) return 0;

  const types = layers.map((l) => l.def.type);
  const uniqueTypes = new Set(types);

  // Check required layers present
  const hasRequired = challenge.requiredTypes.every((t) => uniqueTypes.has(t));
  if (!hasRequired) return Math.min(35, layers.length * 5);

  let score = 50;

  // Bonus for required types
  score += challenge.requiredTypes.length * 5;

  // Bonus for bonus types
  const bonusCount = challenge.bonusTypes.filter((t) => uniqueTypes.has(t)).length;
  score += bonusCount * 8;

  // Layer count sweet spot
  if (layers.length >= challenge.minLayers && layers.length <= challenge.maxLayers) {
    score += 15;
  } else if (layers.length > challenge.maxLayers) {
    score -= (layers.length - challenge.maxLayers) * 3;
  }

  // Penalty for duplicate non-regularization layers at start
  if (types[0] === types[1] && types[0] !== "dropout" && types[0] !== "batchnorm") {
    score -= 5;
  }

  // Bonus: dropout after dense/conv/lstm
  for (let i = 1; i < types.length; i++) {
    if (types[i] === "dropout" && ["dense", "conv2d", "lstm"].includes(types[i - 1])) {
      score += 3;
    }
    if (types[i] === "batchnorm" && ["conv2d", "dense"].includes(types[i - 1])) {
      score += 3;
    }
  }

  // Diversity bonus
  score += Math.min(uniqueTypes.size * 2, 12);

  return Math.max(0, Math.min(challenge.perfectScore, score));
}

// ── Main Component ──────────────────────────────────────
export default function NeuralNetBuilder() {
  const [layers, setLayers] = useState<LayerInstance[]>([]);
  const [challenge, setChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [training, setTraining] = useState(false);
  const [trained, setTrained] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [activeData, setActiveData] = useState<number>(-1);
  const idCounter = useRef(0);

  // Load best scores from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nn_builder_best");
      if (saved) setBestScores(JSON.parse(saved));
    } catch {}
  }, []);

  const saveBest = useCallback(
    (challengeId: string, score: number) => {
      setBestScores((prev) => {
        const next = { ...prev };
        if (!next[challengeId] || score > next[challengeId]) {
          next[challengeId] = score;
          try {
            localStorage.setItem("nn_builder_best", JSON.stringify(next));
          } catch {}
        }
        return next;
      });
    },
    []
  );

  const addLayer = useCallback((def: LayerDef) => {
    if (training) return;
    setTrained(false);
    setAccuracy(0);
    setEpoch(0);
    setLayers((prev) => {
      if (prev.length >= 12) return prev;
      idCounter.current += 1;
      return [...prev, { id: `l${idCounter.current}`, def }];
    });
  }, [training]);

  const removeLayer = useCallback((id: string) => {
    if (training) return;
    setTrained(false);
    setAccuracy(0);
    setEpoch(0);
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }, [training]);

  const reset = useCallback(() => {
    setLayers([]);
    setTraining(false);
    setTrained(false);
    setAccuracy(0);
    setEpoch(0);
    setActiveData(-1);
  }, []);

  const train = useCallback(() => {
    if (layers.length === 0 || training) return;
    setTraining(true);
    setTrained(false);
    setAccuracy(0);
    setEpoch(0);

    const finalScore = computeScore(layers, challenge);
    const totalEpochs = 20;
    let currentEpoch = 0;

    const interval = setInterval(() => {
      currentEpoch++;
      setEpoch(currentEpoch);

      // Animate data flowing through layers
      setActiveData(currentEpoch % layers.length);

      // Simulated accuracy curve (logarithmic growth)
      const progress = currentEpoch / totalEpochs;
      const currentAcc = finalScore * (1 - Math.exp(-3 * progress));
      setAccuracy(Math.round(currentAcc * 10) / 10);

      if (currentEpoch >= totalEpochs) {
        clearInterval(interval);
        setAccuracy(finalScore);
        setTraining(false);
        setTrained(true);
        setActiveData(-1);
        saveBest(challenge.id, finalScore);
      }
    }, 150);
  }, [layers, training, challenge, saveBest]);

  const totalParams = layers.reduce((sum, l) => sum + l.def.params, 0);
  const best = bestScores[challenge.id] || 0;

  return (
    <section id="game" className="section-padding bg-gray-950/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          label="Interactive Lab"
          title="Neural Network Builder"
          subtitle="Design a neural network architecture — click layers to build, then train!"
        />

        <div className="flex justify-center mb-4">
          <Collectible id="c_game" />
        </div>

        {/* Challenge Selector */}
        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CHALLENGES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  if (!training) {
                    setChallenge(c);
                    reset();
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
                  challenge.id === c.id
                    ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-lg shadow-indigo-500/10"
                    : "bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]"
                }`}
              >
                <span className="mr-1.5">{c.emoji}</span>
                {c.title}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass p-6 md:p-8">
            {/* Challenge Info */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{challenge.emoji}</span>
                  <h3 className="font-semibold text-gray-200">
                    {challenge.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500">{challenge.desc}</p>
                <p className="text-[10px] text-gray-600 mt-1">
                  Required:{" "}
                  {challenge.requiredTypes.map((t) => {
                    const def = LAYER_DEFS.find((d) => d.type === t);
                    return def ? `${def.emoji} ${def.label}` : t;
                  }).join(" → ")}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Params</div>
                  <div className="font-mono text-indigo-400 text-sm">
                    {totalParams >= 1000
                      ? `${(totalParams / 1000).toFixed(1)}K`
                      : totalParams}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Layers</div>
                  <div className="font-mono text-purple-400 text-sm">
                    {layers.length}/12
                  </div>
                </div>
                {best > 0 && (
                  <div className="text-center">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Trophy size={10} className="text-amber-400" /> Best
                    </div>
                    <div className="font-mono text-amber-400 text-sm">
                      {best}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Layer Palette */}
            <div className="mb-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                Click to add layers
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LAYER_DEFS.map((def) => {
                  const isRequired = challenge.requiredTypes.includes(def.type);
                  const isBonus = challenge.bonusTypes.includes(def.type);
                  return (
                    <button
                      key={def.type}
                      onClick={() => addLayer(def)}
                      disabled={training || layers.length >= 12}
                      className={`group relative px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${def.bg} ${def.border} ${def.color}`}
                      title={def.desc}
                    >
                      <span className="mr-1">{def.emoji}</span>
                      {def.label}
                      {isRequired && (
                        <span className="ml-1 text-[8px] text-amber-400">★</span>
                      )}
                      {isBonus && !isRequired && (
                        <span className="ml-1 text-[8px] text-emerald-400">+</span>
                      )}
                      <Plus
                        size={10}
                        className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Network Visualization */}
            <div className="mb-6 min-h-[140px]">
              <div className="flex items-center gap-1 mb-2">
                <Layers size={12} className="text-gray-500" />
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  Your Architecture
                </p>
              </div>

              {layers.length === 0 ? (
                <div className="glass p-8 text-center border-dashed border-white/[0.08]">
                  <Brain size={24} className="mx-auto text-gray-700 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click layers above to start building
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1">
                  {/* Input node */}
                  <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                    📥 Input
                  </div>

                  {layers.map((layer, i) => (
                    <div key={layer.id} className="flex items-center gap-1">
                      <ChevronRight size={12} className="text-gray-700 flex-shrink-0" />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: -10 }}
                        animate={{
                          opacity: 1,
                          scale: activeData === i ? 1.08 : 1,
                          y: 0,
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`relative group px-3 py-2 rounded-lg text-xs font-medium border transition-all ${layer.def.bg} ${layer.def.border} ${layer.def.color} ${
                          activeData === i
                            ? "ring-2 ring-indigo-400/50 shadow-lg shadow-indigo-500/20"
                            : ""
                        }`}
                      >
                        <span className="mr-1">{layer.def.emoji}</span>
                        {layer.def.label}
                        {!training && (
                          <button
                            onClick={() => removeLayer(layer.id)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          >
                            <X size={8} />
                          </button>
                        )}
                        {/* Data pulse animation */}
                        {activeData === i && (
                          <motion.div
                            className="absolute inset-0 rounded-lg bg-white/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.div>
                    </div>
                  ))}

                  {/* Output node */}
                  <ChevronRight size={12} className="text-gray-700 flex-shrink-0" />
                  <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium">
                    📤 Output
                  </div>
                </div>
              )}
            </div>

            {/* Training Status / Accuracy */}
            {(training || trained) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6"
              >
                <div className="glass p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {training ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap size={14} className="text-amber-400" />
                        </motion.div>
                      ) : (
                        <Sparkles size={14} className="text-emerald-400" />
                      )}
                      <span className="text-xs text-gray-400">
                        {training ? `Training... Epoch ${epoch}/20` : "Training Complete!"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-gray-500">Accuracy</span>
                        <span
                          className={`ml-2 font-mono text-sm font-bold ${
                            accuracy >= 90
                              ? "text-emerald-400"
                              : accuracy >= 70
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Accuracy bar */}
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        accuracy >= 90
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          : accuracy >= 70
                          ? "bg-gradient-to-r from-amber-500 to-amber-400"
                          : "bg-gradient-to-r from-red-500 to-red-400"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${accuracy}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Feedback */}
                  {trained && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3"
                    >
                      {accuracy >= 90 ? (
                        <p className="text-xs text-emerald-400">
                          🎉 Excellent architecture! Your model achieves high accuracy.
                        </p>
                      ) : accuracy >= 70 ? (
                        <p className="text-xs text-amber-400">
                          👍 Good start! Try adding regularization (Dropout, BatchNorm) to improve.
                        </p>
                      ) : accuracy >= 50 ? (
                        <p className="text-xs text-orange-400">
                          🤔 Missing some key layers. Check the required layers for this challenge.
                        </p>
                      ) : (
                        <p className="text-xs text-red-400">
                          ❌ Architecture needs work. Make sure you include all required layer types.
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={train}
                disabled={layers.length === 0 || training}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 disabled:shadow-none hover:-translate-y-0.5 disabled:translate-y-0"
              >
                {training ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap size={14} />
                    </motion.div>
                    Training...
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Train Model
                  </>
                )}
              </button>
              <button
                onClick={reset}
                disabled={training}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-400 text-sm font-medium transition-all duration-300 disabled:opacity-30"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
