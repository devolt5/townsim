import type { Message } from "@/data/messages";

export interface TimedTrigger {
  year: number;
  quarter: number;
  /** Unique key — prevents the same message from being delivered twice. */
  key: string;
  message: Omit<Message, "id" | "timestamp" | "read">;
}

export const TIMED_TRIGGERS: TimedTrigger[] = [
  {
    year: 2,
    quarter: 1,
    key: "timed-y2-q1-reporter",
    message: {
      sender: "Stadtredakteur",
      content: "Die Stadtzeitung möchte mit Ihnen sprechen.",
      dialogId: 7,
    },
  },
  {
    year: 3,
    quarter: 2,
    key: "timed-y3-q2-reporter",
    message: {
      sender: "Stadtredakteur",
      content: "Halbzeitbericht: Die Presse analysiert Ihre Amtszeit.",
      dialogId: 8,
    },
  },
];
