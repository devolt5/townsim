import { useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import type { PanelImperativeHandle } from "react-resizable-panels";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CityScene } from "@/game/CityScene";
import type { District } from "@/game/CityScene";
import { Header } from "@/components/Header";
import { LeftPanel } from "@/components/LeftPanel";
import { RightPanel } from "@/components/RightPanel";
import { Footer } from "@/components/Footer";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );

  const leftPanelRef = useRef<PanelImperativeHandle>(null);
  const rightPanelRef = useRef<PanelImperativeHandle>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

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

      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1 overflow-hidden"
      >
        {/* Left panel */}
        <ResizablePanel
          panelRef={leftPanelRef}
          defaultSize={18}
          minSize={0}
          collapsible
          collapsedSize={0}
          onResize={(size) => setLeftCollapsed(size.asPercentage === 0)}
        >
          <LeftPanel selectedDistrict={selectedDistrict} />
        </ResizablePanel>

        {/* Left handle with toggle button */}
        <ResizableHandle className="relative w-1 bg-stone-300 hover:bg-stone-400 transition-colors">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 z-10 bg-stone-100 border border-stone-300 shadow-sm rounded-full p-0 hover:bg-stone-200"
            onClick={() =>
              leftCollapsed
                ? leftPanelRef.current?.expand()
                : leftPanelRef.current?.collapse()
            }
          >
            {leftCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </ResizableHandle>

        {/* Center: Phaser canvas */}
        <ResizablePanel defaultSize={64} minSize={30}>
          <main className="h-full bg-stone-200 flex items-center justify-center overflow-hidden">
            <div
              ref={containerRef}
              className="shadow-xl rounded overflow-hidden"
            />
          </main>
        </ResizablePanel>

        {/* Right handle with toggle button */}
        <ResizableHandle className="relative w-1 bg-stone-300 hover:bg-stone-400 transition-colors">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 z-10 bg-stone-100 border border-stone-300 shadow-sm rounded-full p-0 hover:bg-stone-200"
            onClick={() =>
              rightCollapsed
                ? rightPanelRef.current?.expand()
                : rightPanelRef.current?.collapse()
            }
          >
            {rightCollapsed ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </ResizableHandle>

        {/* Right panel */}
        <ResizablePanel
          panelRef={rightPanelRef}
          defaultSize={18}
          minSize={0}
          collapsible
          collapsedSize={0}
          onResize={(size) => setRightCollapsed(size.asPercentage === 0)}
        >
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>

      <Footer />
    </div>
  );
}

export default App;
