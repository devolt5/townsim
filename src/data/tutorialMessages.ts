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
      content: "Erste Schritte",
      dialogId: 2,
    },
  },
  {
    afterClickCount: 4,
    key: "tutorial-click-4",
    message: {
      sender: "Stadtberaterin",
      content: "Verschiedene Phasen",
      dialogId: 3,
    },
  },
  {
    afterClickCount: 8,
    key: "tutorial-click-8",
    message: {
      sender: "Stadtberaterin",
      content: "Was wichtig ist...",
      dialogId: 4,
    },
  },
  {
    afterClickCount: 10,
    key: "tutorial-click-10",
    message: {
      sender: "Stadtberaterin",
      content: "Versprechen & Konsequenzen",
      dialogId: 5,
    },
  },
  {
    afterClickCount: 12,
    key: "tutorial-click-12",
    message: {
      sender: "Stadtberaterin",
      content: "Du bist bereit",
      dialogId: 6,
    },
  },
];
