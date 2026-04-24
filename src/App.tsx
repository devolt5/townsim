import { useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { CityScene } from "@/game/CityScene";
import type { District } from "@/game/CityScene";
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

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel selectedDistrict={selectedDistrict} />

        {/* Phaser canvas — fixed centre */}
        <main className="flex-1 bg-stone-200 flex items-center justify-center overflow-hidden">
          <div
            ref={containerRef}
            className="shadow-xl rounded overflow-hidden"
          />
        </main>

        <RightPanel />
      </div>

      <Footer />
    </div>
  );
}

export default App;
