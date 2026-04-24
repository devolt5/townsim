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
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new CityScene();
    scene.setSelectCallback(setSelectedDistrict);
    const game = new Game({
      type: AUTO,
      width: 460,
      height: 340,
      backgroundColor: "#dfd9c4",
      parent: containerRef.current,
      scene,
    });
    gameRef.current = game;
    return () => {
      game.destroy(true);
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
          defaultOpen
          style={{ "--sidebar-width": "18rem" } as CSSProperties}
          className="h-full"
        >
          <LeftPanel selectedDistrict={selectedDistrict} />
        </SidebarProvider>

        {/* Phaser canvas — grows to fill remaining space */}
        <main className="flex-1 bg-stone-200 flex items-center justify-center overflow-hidden">
          <div ref={containerRef} className="shadow-xl rounded overflow-hidden" />
        </main>

        {/* Right sidebar context */}
        <SidebarProvider
          defaultOpen
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
