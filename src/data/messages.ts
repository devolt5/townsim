export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  dialogId?: number;
}

export const messages: Message[] = [
  {
    id: 1,
    sender: "Stadtberaterin",
    content: "Willkommen beim TownSim",
    timestamp: new Date(),
    dialogId: 3,
  },
];
