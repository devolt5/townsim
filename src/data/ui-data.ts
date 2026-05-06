// ---------------------------------------------------------------------------
// Building info — keyed by defKey (matches districts.config.json)
// ---------------------------------------------------------------------------

export interface BuildingInfo {
  label: string;
  description: string;
}

export const BUILDING_INFO: Record<string, BuildingInfo> = {
  building1: {
    label: "Wohnblock",
    description:
      "Ein mehrstöckiges Wohngebäude aus der Nachkriegszeit. Bietet Platz für rund 120 Familien und prägt das Erscheinungsbild des nördlichen Distrikts.",
  },
  house1: {
    label: "Einfamilienhaus",
    description:
      "Ein klassisches Einfamilienhaus mit kleinem Garten. Beliebt bei Familien, die ruhigeres Wohnen der Großstadthektik vorziehen.",
  },
  house2: {
    label: "Doppelhaus",
    description:
      "Ein modernes Doppelhaus mit energieeffizienter Bauweise. Zwei Wohneinheiten teilen sich eine Wand und einen gemeinsamen Innenhof.",
  },
  swimming_bath: {
    label: "Schwimmbad",
    description:
      "Das öffentliche Schwimmbad des Distrikts. Es bietet Freibecken, Umkleidekabinen und einen kleinen Kiosk — und ist an Sommertagen stark frequentiert.",
  },
  grass4: {
    label: "Grünfläche",
    description:
      "Eine gepflegte Grünfläche, die als Naherholungsgebiet für die Anwohner dient. Kein Zugang für Fahrzeuge.",
  },
  townhall: {
    label: "Rathaus",
    description:
      "Das Rathaus ist das administrative Herzstück des Distrikts. Hier werden Baugenehmigungen erteilt, Stadtratssitzungen abgehalten und Bürgeranliegen bearbeitet.",
  },
  park1: {
    label: "Stadtpark",
    description:
      "Ein weitläufiger Park mit Bäumen, Wegen und einer kleinen Bühne für Sommerveranstaltungen. Beliebter Treffpunkt aller Altersgruppen.",
  },
};
