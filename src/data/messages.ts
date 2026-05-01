export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  dialogId?: number;
  read: boolean;
}

// ── First Tutorial message ────────────────
export const messages: Message[] = [
  {
    id: 1,
    sender: "Stadtberaterin",
    content: "Willkommen im Amt!",
    timestamp: new Date(),
    dialogId: 1,
    read: false,
  },
];
