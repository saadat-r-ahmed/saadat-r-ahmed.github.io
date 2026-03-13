"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  xp: number;
}

interface GameState {
  xp: number;
  level: number;
  collectiblesFound: string[];
  sectionsVisited: string[];
  achievements: Achievement[];
  toastQueue: Achievement[];
  addXP: (amount: number) => void;
  collectItem: (id: string) => void;
  visitSection: (id: string) => void;
  dismissToast: () => void;
}

const SECTIONS = [
  "hero",
  "about",
  "education",
  "research",
  "experience",
  "skills",
  "teaching",
  "game",
  "contact",
];

const SECTION_ACHIEVEMENTS: Record<string, Achievement> = {
  hero: { id: "sec_hero", title: "First Impression", emoji: "👋", xp: 10 },
  about: { id: "sec_about", title: "Getting to Know Me", emoji: "🧑‍💻", xp: 15 },
  education: { id: "sec_education", title: "Academic Explorer", emoji: "🎓", xp: 15 },
  research: { id: "sec_research", title: "Paper Trail", emoji: "📄", xp: 20 },
  experience: { id: "sec_experience", title: "Career Path", emoji: "💼", xp: 20 },
  skills: { id: "sec_skills", title: "Skill Scanner", emoji: "⚡", xp: 15 },
  teaching: { id: "sec_teaching", title: "Honor Roll", emoji: "🏆", xp: 15 },
  game: { id: "sec_game", title: "Game On!", emoji: "🎮", xp: 25 },
  contact: { id: "sec_contact", title: "Journey Complete", emoji: "🎯", xp: 30 },
};

const COLLECTIBLE_XP = 20;

function computeLevel(xp: number): number {
  if (xp < 30) return 1;
  if (xp < 80) return 2;
  if (xp < 150) return 3;
  if (xp < 250) return 4;
  return 5;
}

const GameContext = createContext<GameState | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [collectiblesFound, setCollectiblesFound] = useState<string[]>([]);
  const [sectionsVisited, setSectionsVisited] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    setLevel(computeLevel(xp));
  }, [xp]);

  const pushAchievement = useCallback((a: Achievement) => {
    setAchievements((prev) => {
      if (prev.some((p) => p.id === a.id)) return prev;
      setToastQueue((q) => [...q, a]);
      return [...prev, a];
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setXP((prev) => prev + amount);
  }, []);

  const collectItem = useCallback(
    (id: string) => {
      setCollectiblesFound((prev) => {
        if (prev.includes(id)) return prev;
        addXP(COLLECTIBLE_XP);
        const count = prev.length + 1;
        if (count === 3) {
          pushAchievement({
            id: "collect_3",
            title: "Data Collector",
            emoji: "✨",
            xp: 15,
          });
          addXP(15);
        }
        if (count === 6) {
          pushAchievement({
            id: "collect_6",
            title: "Data Hoarder",
            emoji: "💎",
            xp: 30,
          });
          addXP(30);
        }
        if (count === 9) {
          pushAchievement({
            id: "collect_all",
            title: "Master Collector",
            emoji: "🌟",
            xp: 50,
          });
          addXP(50);
        }
        return [...prev, id];
      });
    },
    [addXP, pushAchievement]
  );

  const visitSection = useCallback(
    (id: string) => {
      setSectionsVisited((prev) => {
        if (prev.includes(id)) return prev;
        const ach = SECTION_ACHIEVEMENTS[id];
        if (ach) {
          addXP(ach.xp);
          pushAchievement(ach);
        }
        return [...prev, id];
      });
    },
    [addXP, pushAchievement]
  );

  const dismissToast = useCallback(() => {
    setToastQueue((q) => q.slice(1));
  }, []);

  return (
    <GameContext.Provider
      value={{
        xp,
        level,
        collectiblesFound,
        sectionsVisited,
        achievements,
        toastQueue,
        addXP,
        collectItem,
        visitSection,
        dismissToast,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export { SECTIONS };
