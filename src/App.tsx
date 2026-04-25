import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { CityScene } from "@/game/CityScene";
import type { District } from "@/game/CityScene";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { LeftPanel } from "@/components/LeftPanel";
import { RightPanel } from "@/components/RightPanel";
import { Footer } from "@/components/Footer";
import "./App.css";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
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
        const scene = new CityScene();
        scene.setSelectCallback(setSelectedDistrict);
        game = new Game({
          type: AUTO,
          width: w,
          height: h,
          backgroundColor: "#dfd9c4",
          parent: container,
          scene,
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
      <Header />

      {/* Middle: left sidebar + phaser canvas + right sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar context */}
        <SidebarProvider
          defaultOpen={window.innerWidth >= 768}
          style={{ "--sidebar-width": "18rem" } as CSSProperties}
          className="h-full"
        >
          <LeftPanel selectedDistrict={selectedDistrict} />
        </SidebarProvider>

        {/* Phaser canvas — grows to fill remaining space */}
        <main className="flex-1 bg-stone-200 overflow-hidden min-w-0">
          <div ref={containerRef} className="w-full h-full" />
        </main>

        {/* Right sidebar context */}
        <SidebarProvider
          defaultOpen={window.innerWidth >= 768}
          style={{ "--sidebar-width": "20rem" } as CSSProperties}
          className="h-full"
        >
          <RightPanel />
        </SidebarProvider>
      </div>

      <Footer />
    </div>
  );
}

export default App;
