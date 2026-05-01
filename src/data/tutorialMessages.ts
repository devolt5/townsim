import type { Message } from "@/data/messages";

export interface TutorialTrigger {
  /** Fire this trigger after this many global interactions have been recorded. */
  afterClickCount: number;
  /** Unique key — prevents the same message from being delivered twice. */
  key: string;
  message: Omit<Message, "id" | "timestamp" | "read">;
}

export const TUTORIAL_TRIGGERS: TutorialTrigger[] = [
  {
    afterClickCount: 2,
    key: "tutorial-click-2",
    message: {
      sender: "Stadtberaterin",
      content: "Denk auch an die Fraktionen im Stadtrat.",
      dialogId: 4,
    },
  },
  {
    afterClickCount: 4,
    key: "tutorial-click-4",
    message: {
      sender: "Stadtberaterin",
      content: "Ein wichtiger Hinweis zu Versprechen und Konsequenzen.",
      dialogId: 5,
    },
  },
  {
    afterClickCount: 6,
    key: "tutorial-click-6",
    message: {
      sender: "Stadtberaterin",
      content: "Ich glaube, du bist bereit. Viel Erfolg!",
      dialogId: 6,
    },
  },
];
