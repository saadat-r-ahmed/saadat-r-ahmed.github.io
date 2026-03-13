"use client";

import { GameProvider } from "./GameContext";
import SectionTracker from "./SectionTracker";
import ScrollQuestHUD from "./ScrollQuestHUD";

export default function GameWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GameProvider>
      <SectionTracker />
      <ScrollQuestHUD />
      {children}
    </GameProvider>
  );
}
