export interface DialogData {
  id: number;
  title: string;
  text: string;
}

export const welcomeDialog: DialogData = {
  id: 1,
  title: "Willkommen in TownSim",
  text: "Willkommen! Hier beginnt dein Abenteuer als Bürgermeister. Triff kluge Entscheidungen, gewinne das Vertrauen deiner Bürger und forme das Schicksal deiner Stadt.",
};

export const dialogsById: Record<number, DialogData> = {
  1: welcomeDialog,
};
