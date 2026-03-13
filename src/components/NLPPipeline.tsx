"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import Collectible from "./game/Collectible";
import { Play, RotateCcw, ChevronRight } from "lucide-react";

// ── Sample sentences ────────────────────────────────────
const SAMPLES = [
  { text: "This research paper is absolutely brilliant!", label: "Positive", emoji: "😊" },
  { text: "The model failed to converge on any benchmark.", label: "Negative", emoji: "😞" },
  { text: "The experiment results were published yesterday.", label: "Neutral", emoji: "😐" },
  { text: "আমি এই গবেষণাটি খুবই পছন্দ করেছি!", label: "Positive", emoji: "😊" },
  { text: "Low-resource NLP needs more attention from the community.", label: "Positive", emoji: "😊" },
  { text: "The training loss diverged after epoch 50.", label: "Negative", emoji: "😞" },
];

// ── Simulated tokenizer ─────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .replace(/([!.,?;:])/g, " $1")
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .slice(0, 10);
}

// ── Random embedding vector (deterministic from token) ──
function fakeEmbedding(token: string): number[] {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 31 + token.charCodeAt(i)) & 0xffff;
  }
  const dims: number[] = [];
  for (let i = 0; i < 8; i++) {
    hash = (hash * 7 + i * 13) & 0xffff;
    dims.push(((hash % 200) - 100) / 100);
  }
  return dims;
}

// ── Pipeline stages enum ────────────────────────────────
const STAGES = [
  "idle",
  "tokenizing",
  "embedding",
  "lstm_forward",
  "lstm_backward",
  "attention",
  "dense",
  "output",
  "done",
] as const;
type Stage = (typeof STAGES)[number];

const STAGE_LABELS: Record<Stage, string> = {
  idle: "Ready",
  tokenizing: "Tokenizing",
  embedding: "Generating Embeddings",
  lstm_forward: "BiLSTM Forward Pass",
  lstm_backward: "BiLSTM Backward Pass",
  attention: "Self-Attention",
  dense: "Dense + Softmax",
  output: "Prediction",
  done: "Complete",
};

// ── Color helpers ───────────────────────────────────────
function dimColor(val: number): string {
  if (val > 0.5) return "bg-indigo-400";
  if (val > 0) return "bg-indigo-400/50";
  if (val > -0.5) return "bg-purple-400/50";
  return "bg-purple-400";
}

function attentionOpacity(i: number, j: number, total: number): number {
  // Simulated attention: tokens attend more to nearby tokens and first/last
  const dist = Math.abs(i - j);
  const edge = i === 0 || i === total - 1 || j === 0 || j === total - 1 ? 0.2 : 0;
  return Math.max(0.05, Math.min(1, 1 / (dist + 1) + edge));
}

// ── LSTM Node Component ─────────────────────────────────
function LSTMNode({
  active,
  delay,
  label,
}: {
  active: boolean;
  delay: number;
  label: string;
}) {
  return (
    <motion.div
      className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border flex items-center justify-center text-[8px] md:text-[10px] font-mono transition-all duration-300 ${
        active
          ? "bg-indigo-500/30 border-indigo-400/60 text-indigo-300 shadow-md shadow-indigo-500/20"
          : "bg-white/[0.02] border-white/[0.06] text-gray-600"
      }`}
      animate={
        active
          ? { scale: [1, 1.15, 1], opacity: [0.5, 1, 1] }
          : { scale: 1, opacity: 1 }
      }
      transition={{ delay: delay * 0.08, duration: 0.3 }}
    >
      {label}
    </motion.div>
  );
}

// ── Connection line component ───────────────────────────
function ConnectionDot({ active, delay }: { active: boolean; delay: number }) {
  return (
    <motion.div
      className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
        active ? "bg-indigo-400" : "bg-gray-800"
      }`}
      animate={active ? { scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] } : {}}
      transition={{ delay: delay * 0.05, duration: 0.4, repeat: active ? 2 : 0 }}
    />
  );
}

// ── Main Component ──────────────────────────────────────
export default function NLPPipeline() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [customText, setCustomText] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [tokens, setTokens] = useState<string[]>([]);
  const [embeddings, setEmbeddings] = useState<number[][]>([]);
  const [activeToken, setActiveToken] = useState(-1);
  const [lstmStep, setLstmStep] = useState(-1);
  const [attentionVisible, setAttentionVisible] = useState(false);
  const [prediction, setPrediction] = useState<{
    label: string;
    emoji: string;
    scores: { label: string; score: number }[];
  } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const inputText = customText || SAMPLES[sampleIdx].text;
  const expectedLabel = customText
    ? null
    : SAMPLES[sampleIdx];

  const running = stage !== "idle" && stage !== "done";

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setStage("idle");
    setTokens([]);
    setEmbeddings([]);
    setActiveToken(-1);
    setLstmStep(-1);
    setAttentionVisible(false);
    setPrediction(null);
  }, [cleanup]);

  const runPipeline = useCallback(() => {
    if (running) return;
    reset();

    const text = inputText;
    const toks = tokenize(text);
    const embs = toks.map((t) => fakeEmbedding(t));

    // Determine prediction based on simple heuristic
    const lower = text.toLowerCase();
    const posWords = ["brilliant", "excellent", "great", "love", "পছন্দ", "ভালো", "amazing", "attention", "needs"];
    const negWords = ["failed", "diverged", "terrible", "bad", "horrible", "loss", "খারাপ"];
    let posScore = 0.33, negScore = 0.33, neuScore = 0.34;
    posWords.forEach((w) => { if (lower.includes(w)) posScore += 0.25; });
    negWords.forEach((w) => { if (lower.includes(w)) negScore += 0.25; });
    const total = posScore + negScore + neuScore;
    posScore /= total;
    negScore /= total;
    neuScore /= total;

    let predLabel = "Neutral";
    let predEmoji = "😐";
    if (posScore > negScore && posScore > neuScore) {
      predLabel = "Positive";
      predEmoji = "😊";
    } else if (negScore > posScore && negScore > neuScore) {
      predLabel = "Negative";
      predEmoji = "😞";
    }

    // Sequential pipeline animation
    const steps: { stage: Stage; duration: number; action?: () => void }[] = [
      {
        stage: "tokenizing",
        duration: 600,
        action: () => {
          // Reveal tokens one by one
          toks.forEach((_, i) => {
            setTimeout(() => {
              setTokens((prev) => [...prev.slice(0, i), toks[i], ...prev.slice(i + 1)]);
              setActiveToken(i);
            }, i * 120);
          });
          setTimeout(() => setTokens(toks), toks.length * 120);
        },
      },
      {
        stage: "embedding",
        duration: 800,
        action: () => {
          embs.forEach((_, i) => {
            setTimeout(() => {
              setEmbeddings((prev) => [...prev, embs[i]]);
              setActiveToken(i);
            }, i * 100);
          });
        },
      },
      {
        stage: "lstm_forward",
        duration: 1000,
        action: () => {
          toks.forEach((_, i) => {
            setTimeout(() => setLstmStep(i), i * 120);
          });
        },
      },
      {
        stage: "lstm_backward",
        duration: 1000,
        action: () => {
          for (let i = toks.length - 1; i >= 0; i--) {
            setTimeout(() => setLstmStep(i), (toks.length - 1 - i) * 120);
          }
        },
      },
      {
        stage: "attention",
        duration: 1200,
        action: () => setAttentionVisible(true),
      },
      {
        stage: "dense",
        duration: 800,
        action: () => {},
      },
      {
        stage: "output",
        duration: 600,
        action: () =>
          setPrediction({
            label: predLabel,
            emoji: predEmoji,
            scores: [
              { label: "Positive", score: Math.round(posScore * 100) },
              { label: "Negative", score: Math.round(negScore * 100) },
              { label: "Neutral", score: Math.round(neuScore * 100) },
            ],
          }),
      },
      { stage: "done", duration: 0, action: () => {} },
    ];

    let elapsed = 200;
    steps.forEach((step) => {
      setTimeout(() => {
        setStage(step.stage);
        step.action?.();
      }, elapsed);
      elapsed += step.duration;
    });
  }, [running, inputText, reset]);

  const stageIndex = STAGES.indexOf(stage);

  return (
    <section id="game" className="section-padding bg-gray-950/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          label="Interactive Lab"
          title="NLP Pipeline Visualizer"
          subtitle="Watch a sentiment analysis neural network process text in real-time"
        />

        <div className="flex justify-center mb-6">
          <Collectible id="c_game" />
        </div>

        <AnimatedSection>
          <div className="glass p-5 md:p-8">
            {/* ── Input Section ─────────────────────────── */}
            <div className="mb-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                Input Text
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {SAMPLES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (!running) {
                          setSampleIdx(i);
                          setCustomText("");
                          reset();
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all ${
                        sampleIdx === i && !customText
                          ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                          : "bg-white/[0.02] border-white/[0.06] text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {s.emoji} {s.text.slice(0, 25)}…
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => {
                    if (!running) {
                      setCustomText(e.target.value);
                      reset();
                    }
                  }}
                  placeholder="Or type your own text..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            {/* ── Pipeline Stage Indicator ────────────── */}
            <div className="mb-6">
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {(
                  [
                    "tokenizing",
                    "embedding",
                    "lstm_forward",
                    "attention",
                    "dense",
                    "output",
                  ] as Stage[]
                ).map((s, i) => {
                  const sIdx = STAGES.indexOf(s);
                  const isActive = stage === s || (s === "lstm_forward" && stage === "lstm_backward");
                  const isPast = stageIndex > sIdx;
                  return (
                    <div key={s} className="flex items-center gap-1">
                      {i > 0 && (
                        <div className="flex gap-0.5">
                          <ConnectionDot active={isPast || isActive} delay={i} />
                          <ConnectionDot active={isPast || isActive} delay={i + 1} />
                          <ConnectionDot active={isPast || isActive} delay={i + 2} />
                        </div>
                      )}
                      <div
                        className={`px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-medium border whitespace-nowrap transition-all duration-300 ${
                          isActive
                            ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-500/10"
                            : isPast
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-white/[0.02] border-white/[0.06] text-gray-600"
                        }`}
                      >
                        {isPast && !isActive ? "✓ " : ""}
                        {STAGE_LABELS[s === "lstm_forward" ? "lstm_forward" : s].replace("BiLSTM Forward Pass", "BiLSTM")}
                      </div>
                    </div>
                  );
                })}
              </div>
              {stage !== "idle" && stage !== "done" && (
                <motion.p
                  key={stage}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-indigo-400 mt-2 font-medium"
                >
                  ⏳ {STAGE_LABELS[stage]}...
                </motion.p>
              )}
            </div>

            {/* ── Visualization Area ─────────────────── */}
            <div className="space-y-4 mb-6 min-h-[280px]">
              {/* Stage 1: Tokenization */}
              <AnimatePresence>
                {stageIndex >= STAGES.indexOf("tokenizing") && stage !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="glass p-4"
                  >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                      🔤 Tokenizer Output
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(tokens.length > 0 ? tokens : tokenize(inputText).map(() => "")).map(
                        (tok, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                              opacity: tok ? 1 : 0.2,
                              scale: activeToken === i && stage === "tokenizing" ? 1.1 : 1,
                            }}
                            className={`px-2 py-1 rounded-md text-xs font-mono border ${
                              activeToken === i && stage === "tokenizing"
                                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                                : tok
                                ? "bg-white/[0.04] border-white/[0.08] text-gray-300"
                                : "bg-white/[0.02] border-white/[0.04] text-gray-700"
                            }`}
                          >
                            {tok || "···"}
                          </motion.span>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 2: Embeddings */}
              <AnimatePresence>
                {stageIndex >= STAGES.indexOf("embedding") && stage !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="glass p-4"
                  >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                      📊 Embedding Vectors <span className="text-gray-600">(8-dim)</span>
                    </p>
                    <div className="space-y-1">
                      {tokens.map((tok, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-[10px] font-mono text-gray-500 w-16 truncate">
                            {tok}
                          </span>
                          <div className="flex gap-0.5">
                            {(embeddings[i] || []).map((val, j) => (
                              <motion.div
                                key={j}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.06 + j * 0.02 }}
                                className={`w-4 h-4 md:w-5 md:h-5 rounded-sm ${dimColor(val)}`}
                                style={{ opacity: 0.3 + Math.abs(val) * 0.7 }}
                                title={`${val.toFixed(2)}`}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 3: BiLSTM */}
              <AnimatePresence>
                {stageIndex >= STAGES.indexOf("lstm_forward") && stage !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="glass p-4"
                  >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                      🔄 Bidirectional LSTM{" "}
                      <span className="text-gray-600">
                        ({stage === "lstm_forward" ? "→ forward" : stage === "lstm_backward" ? "← backward" : "done"})
                      </span>
                    </p>
                    <div className="space-y-2">
                      {/* Forward row */}
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-indigo-400 w-6">→</span>
                        {tokens.map((_, i) => (
                          <div key={i} className="flex items-center gap-0.5">
                            <LSTMNode
                              active={
                                (stage === "lstm_forward" && i <= lstmStep) ||
                                stageIndex > STAGES.indexOf("lstm_backward")
                              }
                              delay={i}
                              label={`h${i}`}
                            />
                            {i < tokens.length - 1 && (
                              <ChevronRight size={8} className="text-gray-700" />
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Backward row */}
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-purple-400 w-6">←</span>
                        {tokens.map((_, i) => (
                          <div key={i} className="flex items-center gap-0.5">
                            <LSTMNode
                              active={
                                (stage === "lstm_backward" && i >= lstmStep) ||
                                stageIndex > STAGES.indexOf("lstm_backward")
                              }
                              delay={tokens.length - i}
                              label={`h${i}'`}
                            />
                            {i < tokens.length - 1 && (
                              <ChevronRight size={8} className="text-gray-700 rotate-180" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 4: Attention */}
              <AnimatePresence>
                {stageIndex >= STAGES.indexOf("attention") && stage !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="glass p-4"
                  >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                      👁 Self-Attention Matrix
                    </p>
                    <div className="overflow-x-auto">
                      <div className="inline-block">
                        {/* Header row */}
                        <div className="flex items-center gap-0.5 mb-0.5">
                          <div className="w-14" />
                          {tokens.map((tok, j) => (
                            <div
                              key={j}
                              className="w-7 md:w-9 text-[7px] md:text-[8px] font-mono text-gray-500 text-center truncate"
                            >
                              {tok.slice(0, 4)}
                            </div>
                          ))}
                        </div>
                        {/* Matrix rows */}
                        {tokens.map((tok, i) => (
                          <div key={i} className="flex items-center gap-0.5 mb-0.5">
                            <div className="w-14 text-[8px] font-mono text-gray-500 truncate text-right pr-1">
                              {tok.slice(0, 6)}
                            </div>
                            {tokens.map((_, j) => {
                              const opacity = attentionOpacity(i, j, tokens.length);
                              return (
                                <motion.div
                                  key={j}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={
                                    attentionVisible
                                      ? { opacity: 1, scale: 1 }
                                      : { opacity: 0, scale: 0 }
                                  }
                                  transition={{
                                    delay: (i * tokens.length + j) * 0.015,
                                    duration: 0.2,
                                  }}
                                  className="w-7 h-7 md:w-9 md:h-9 rounded-sm bg-indigo-500"
                                  style={{ opacity: opacity * 0.8 }}
                                  title={`attn(${tok}, ${tokens[j]}) = ${opacity.toFixed(2)}`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 5: Dense + Softmax */}
              <AnimatePresence>
                {stageIndex >= STAGES.indexOf("dense") && stage !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="glass p-4"
                  >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                      🧠 Dense Layer + Softmax
                    </p>
                    <div className="flex items-center justify-center gap-3 md:gap-6">
                      {/* Hidden neurons */}
                      <div className="flex flex-col gap-1">
                        {[0, 1, 2, 3].map((n) => (
                          <motion.div
                            key={n}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: n * 0.1, type: "spring" }}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center"
                          >
                            <motion.div
                              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-indigo-400"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                delay: n * 0.15,
                                duration: 0.8,
                                repeat: stage === "dense" ? Infinity : 0,
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Connections */}
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ width: 0 }}
                            animate={{ width: 40 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                            className="h-px bg-gradient-to-r from-indigo-500/40 to-emerald-500/40"
                          />
                        ))}
                      </div>

                      {/* Output neurons */}
                      <div className="flex flex-col gap-1">
                        {["Pos", "Neg", "Neu"].map((label, n) => (
                          <motion.div
                            key={n}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + n * 0.1, type: "spring" }}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-[8px] text-emerald-400 font-medium"
                          >
                            {label}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 6: Output / Prediction */}
              <AnimatePresence>
                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, height: 0 }}
                    animate={{ opacity: 1, scale: 1, height: "auto" }}
                    className="glass p-5 border-emerald-500/10"
                  >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                      📤 Prediction Result
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{prediction.emoji}</span>
                      <div>
                        <p className="text-lg font-bold text-gray-200">
                          {prediction.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          Sentiment Classification
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {prediction.scores.map((s) => (
                        <div key={s.label} className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 w-16">
                            {s.label}
                          </span>
                          <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${s.score}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                s.label === "Positive"
                                  ? "bg-emerald-500"
                                  : s.label === "Negative"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                              }`}
                            />
                          </div>
                          <span className="text-xs font-mono text-gray-400 w-10 text-right">
                            {s.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Idle state */}
              {stage === "idle" && (
                <div className="glass p-8 md:p-12 text-center border-dashed border-white/[0.06]">
                  <p className="text-2xl mb-2">🧠</p>
                  <p className="text-sm text-gray-500">
                    Select a sample or type text, then click{" "}
                    <span className="text-indigo-400 font-medium">Run Pipeline</span>{" "}
                    to watch the neural network process it step by step
                  </p>
                </div>
              )}
            </div>

            {/* ── Action Buttons ──────────────────────── */}
            <div className="flex items-center gap-3">
              <button
                onClick={runPipeline}
                disabled={running || !inputText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 disabled:shadow-none hover:-translate-y-0.5 disabled:translate-y-0"
              >
                <Play size={14} />
                {running ? "Running..." : "Run Pipeline"}
              </button>
              <button
                onClick={reset}
                disabled={running}
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
