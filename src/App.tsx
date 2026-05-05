import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { CityScene } from "@/game/CityScene";
import type { District } from "@/game/CityScene";
import { DistrictScene } from "@/game/DistrictScene";
import { ParliamentScene } from "@/game/ParliamentScene";
import type { Delegate } from "@/data/types/delegate";
import type { DistrictData } from "@/data/types/district";
import { northDistrict } from "@/data/disctricts/north";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { LeftPanel } from "@/components/LeftPanel";
import { RightPanel } from "@/components/RightPanel";
import { Footer } from "@/components/Footer";
import { useGameStore } from "@/store/gameStore";
import "./App.css";

/**
 * All available districts.
 * To add a new district: create its data file and append it here.
 */
const ALL_DISTRICTS: DistrictData[] = [
  northDistrict,
  // southDistrict,
  // townCenterDistrict,
];

/** Lookup by CityScene district name. */
function findDistrictData(citySceneName: string): DistrictData | undefined {
  return ALL_DISTRICTS.find((d) => d.citySceneName === citySceneName);
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
  const [phoneOpen, setPhoneOpen] = useState(window.innerWidth >= 768);
  const [selectedBuilding, setSelectedBuilding] = useState<{
    instanceId: string;
    defKey: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(
    null,
  );
  const [activeScene, setActiveScene] = useState<
    "city" | "district" | "parliament"
  >("city");
  const [factionOverlay, setFactionOverlay] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let game: Game | null = null;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: w, height: h } = entry.contentRect;
      if (w <= 0 || h <= 0) return;

      if (!game) {
        const cityScene = new CityScene();
        const districtScene = new DistrictScene();
        const parliamentScene = new ParliamentScene();

        parliamentScene.setSelectCallback((delegate) => {
          setSelectedDelegate(delegate);
        });

        districtScene.setCallbacks({
          onBuildingClick: (instanceId, defKey) =>
            setSelectedBuilding({ instanceId, defKey }),
        });

        cityScene.setSelectCallback((district) => {
          setSelectedDistrict(district);
          setSelectedBuilding(null); // clear building when entering new district
          if (district) {
            useGameStore.getState().incrementGlobalClicks();
          }
          const districtData = district
            ? findDistrictData(district.name)
            : undefined;
          if (districtData && gameRef.current) {
            gameRef.current.scene.stop("CityScene");
            gameRef.current.scene.start("DistrictScene", { districtData });
          }
        });

        game = new Game({
          type: AUTO,
          width: w,
          height: h,
          backgroundColor: "#dfd9c4",
          parent: container,
          scene: [cityScene, districtScene, parliamentScene],
        });
        gameRef.current = game;
      } else {
        game.scale.resize(w, h);
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-stone-100 text-stone-900 select-none overflow-hidden">
      <Header
        onCityOverview={() => {
          if (!gameRef.current) return;
          gameRef.current.scene.stop("DistrictScene");
          gameRef.current.scene.stop("ParliamentScene");
          gameRef.current.scene.start("CityScene");
          setSelectedDistrict(null);
          setSelectedBuilding(null);
          setActiveScene("city");
          setFactionOverlay(false);
        }}
        onParliament={() => {
          if (!gameRef.current) return;
          gameRef.current.scene.stop("CityScene");
          gameRef.current.scene.stop("DistrictScene");
          gameRef.current.scene.start("ParliamentScene");
          setSelectedDistrict(null);
          setSelectedBuilding(null);
          setActiveScene("parliament");
          setFactionOverlay(false);
        }}
      />

      {/* Middle: left sidebar + phaser canvas + right sidebar */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left phone panel */}
        <LeftPanel
          selectedDistrict={selectedDistrict}
          selectedBuilding={selectedBuilding}
          selectedDelegate={selectedDelegate}
          open={phoneOpen}
          onToggle={() => setPhoneOpen((o) => !o)}
          onDialogOpenChange={setDialogOpen}
        />

        {/* Phaser canvas — grows to fill remaining space */}
        <main
          className={`relative flex-1 bg-stone-200 overflow-hidden min-w-0${dialogOpen ? " pointer-events-none" : ""}`}
        >
          <div ref={containerRef} className="w-full h-full" />
        </main>

        {/* Right sidebar context */}
        <SidebarProvider
          defaultOpen={window.innerWidth >= 768}
          style={{ "--sidebar-width": "20rem" } as CSSProperties}
          className="relative h-full"
        >
          <RightPanel />
        </SidebarProvider>
      </div>

      <Footer
        activeScene={activeScene}
        factionOverlay={factionOverlay}
        setFactionOverlay={setFactionOverlay}
        gameRef={gameRef}
      />
    </div>
  );
}

export default App;
