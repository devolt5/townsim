import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { CityScene } from "@/game/CityScene";
import type { District } from "@/game/CityScene";
import { DistrictScene } from "@/game/DistrictScene";
import type { DistrictData } from "@/data/districtTypes";
import { northDistrict } from "@/data/disctricts/north";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { LeftPanel } from "@/components/LeftPanel";
import { RightPanel } from "@/components/RightPanel";
import { Footer } from "@/components/Footer";
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
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null,
  );
  void selectedBuildingId; // will be used when GameDialog integration is wired up

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

        districtScene.setCallbacks({
          onBuildingClick: (buildingId) => setSelectedBuildingId(buildingId),
          onPlaceBuilding: (col, row) =>
            console.log("Place building at", col, row),
        });

        cityScene.setSelectCallback((district) => {
          setSelectedDistrict(district);
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
          scene: [cityScene, districtScene],
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
          gameRef.current.scene.start("CityScene");
          setSelectedDistrict(null);
        }}
      />

      {/* Middle: left sidebar + phaser canvas + right sidebar */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left phone panel */}
        <LeftPanel
          selectedDistrict={selectedDistrict}
          open={phoneOpen}
          onToggle={() => setPhoneOpen((o) => !o)}
        />

        {/* Phaser canvas — grows to fill remaining space */}
        <main className="flex-1 bg-stone-200 overflow-hidden min-w-0">
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

      <Footer />
    </div>
  );
}

export default App;
