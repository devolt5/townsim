import { Scene, GameObjects } from 'phaser';

export interface District {
  name: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: number;
}

export const DISTRICTS: District[] = [
  {
    name: 'Wohngebiet Nord',
    description: 'Mehrfamilienhäuser, Schulen und Spielplätze. Hohe Bevölkerungsdichte.',
    x: 0, y: 0, w: 140, h: 165,
    color: 0x8bc48a,
  },
  {
    name: 'Innenstadt',
    description: 'Haupteinkaufszone, Rathaus und öffentliche Plätze. Herzstück der Stadt.',
    x: 155, y: 0, w: 140, h: 165,
    color: 0xd4a853,
  },
  {
    name: 'Gewerbegebiet',
    description: 'Büros, Einzelhandel und Logistik. Größter Arbeitgeber der Stadt.',
    x: 310, y: 0, w: 150, h: 165,
    color: 0x7a9cc4,
  },
  {
    name: 'Wohngebiet Süd',
    description: 'Einfamilienhäuser und ruhige Wohnlage. Beliebtes Familienquartier.',
    x: 0, y: 180, w: 140, h: 160,
    color: 0xa8d4a0,
  },
  {
    name: 'Industriegebiet',
    description: 'Produktion, Handwerksbetriebe und Lagerung. Wirtschaftsmotor der Region.',
    x: 155, y: 180, w: 140, h: 160,
    color: 0xb08060,
  },
  {
    name: 'Grünanlage',
    description: 'Parks, Kleingärten und Naturschutzgebiet. Lunge der Stadt.',
    x: 310, y: 180, w: 150, h: 160,
    color: 0x5a9e5a,
  },
];

export class CityScene extends Scene {
  private selectCallback: ((district: District | null) => void) | null = null;
  private selectedName: string | null = null;
  private baseGraphics!: GameObjects.Graphics;
  private highlightGraphics!: GameObjects.Graphics;

  constructor() {
    super({ key: 'CityScene' });
  }

  setSelectCallback(cb: (district: District | null) => void) {
    this.selectCallback = cb;
  }

  create() {
    this.baseGraphics = this.add.graphics();
    this.drawBase();

    this.highlightGraphics = this.add.graphics();

    DISTRICTS.forEach(d => {
      const zone = this.add
        .zone(d.x + d.w / 2, d.y + d.h / 2, d.w, d.h)
        .setInteractive({ useHandCursor: true });

      this.add
        .text(d.x + d.w / 2, d.y + d.h / 2, d.name, {
          fontSize: '11px',
          color: '#1a1a1a',
          fontStyle: 'bold',
          wordWrap: { width: d.w - 12 },
          align: 'center',
          stroke: '#ffffff',
          strokeThickness: 3,
        })
        .setOrigin(0.5);

      zone.on('pointerover', () => {
        if (this.selectedName !== d.name) {
          this.highlightGraphics.clear();
          this.highlightGraphics.lineStyle(3, 0xffffff, 0.8);
          this.highlightGraphics.strokeRect(d.x + 2, d.y + 2, d.w - 4, d.h - 4);
          // Redraw selected highlight on top if one is already selected
          if (this.selectedName) {
            const sel = DISTRICTS.find(x => x.name === this.selectedName);
            if (sel) this.drawSelectedHighlight(sel);
          }
        }
      });

      zone.on('pointerout', () => {
        if (this.selectedName !== d.name) {
          this.highlightGraphics.clear();
          if (this.selectedName) {
            const sel = DISTRICTS.find(x => x.name === this.selectedName);
            if (sel) this.drawSelectedHighlight(sel);
          }
        }
      });

      zone.on('pointerdown', () => {
        if (this.selectedName === d.name) {
          this.selectedName = null;
          this.highlightGraphics.clear();
          this.selectCallback?.(null);
        } else {
          this.selectedName = d.name;
          this.highlightGraphics.clear();
          this.drawSelectedHighlight(d);
          this.selectCallback?.(d);
        }
      });
    });
  }

  private drawBase() {
    const g = this.baseGraphics;

    // Roads
    g.fillStyle(0xb0a898, 1);
    g.fillRect(140, 0, 15, 340);   // vertical road west
    g.fillRect(295, 0, 15, 340);   // vertical road east
    g.fillRect(0, 165, 460, 15);   // horizontal road

    // Road lines (dashed center)
    g.lineStyle(1, 0xd0c8be, 0.6);
    g.lineBetween(147, 0, 147, 165);
    g.lineBetween(147, 180, 147, 340);
    g.lineBetween(302, 0, 302, 165);
    g.lineBetween(302, 180, 302, 340);
    g.lineBetween(0, 172, 140, 172);
    g.lineBetween(155, 172, 295, 172);
    g.lineBetween(310, 172, 460, 172);

    // Districts
    DISTRICTS.forEach(d => {
      g.fillStyle(d.color, 1);
      g.fillRect(d.x, d.y, d.w, d.h);
      g.lineStyle(1, 0x4a4035, 0.5);
      g.strokeRect(d.x, d.y, d.w, d.h);
    });
  }

  private drawSelectedHighlight(d: District) {
    const g = this.highlightGraphics;
    g.lineStyle(3, 0x000000, 0.5);
    g.strokeRect(d.x + 3, d.y + 3, d.w - 6, d.h - 6);
    g.lineStyle(3, 0xffffff, 1);
    g.strokeRect(d.x + 1, d.y + 1, d.w - 2, d.h - 2);
  }
}
