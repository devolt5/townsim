import { PanelLeftIcon } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DistrictInfo } from "@/components/DistrictInfo";
import { Messages } from "@/components/Messages";
import { GameDialog } from "@/components/GameDialog";
import { dialogsById } from "@/data/dialogs";
import type { DialogData } from "@/data/dialogs";
import type { District } from "@/game/CityScene";
import phonePng from "@/images/phone.png";

interface LeftPanelProps {
  selectedDistrict: District | null;
  open: boolean;
  onToggle: () => void;
}

/** Active "app" shown on the phone screen */
type PhoneApp = "nachrichten" | "stadtbild" | "bilanz";

export function LeftPanel({
  selectedDistrict,
  open,
  onToggle,
}: LeftPanelProps) {
  const [activeApp, setActiveApp] = useState<PhoneApp>("nachrichten");
  const [openDialog, setOpenDialog] = useState<DialogData | null>(null);

  function handleMessageClick(dialogId: number) {
    const dialog = dialogsById[dialogId];
    if (dialog) setOpenDialog(dialog);
  }

  return (
    <>
      <div className="absolute z-10 left-0 top-0 flex h-full shrink-0 pointer-events-none">
        {/* Slide panel — width animates between 17rem and 0 */}
        <div
          className="h-full overflow-hidden transition-[width] duration-200 ease-linear shrink-0 pointer-events-auto"
          style={{ width: open ? "17rem" : "0" }}
        >
          {/* Phone skin — fills the fixed-width inner container */}
          <div
            className="relative h-full"
            style={{
              width: "17rem",
              backgroundImage: `url(${phonePng})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top left",
            }}
          >
            {/*
             * Anchor div: same width as the background image (100%), same aspect
             * ratio as the phone asset (466 × 830). All screen-overlay percentages
             * are relative to this box, so they stay pixel-perfect regardless of
             * the sidebar's rendered width.
             */}
            <div
              className="relative w-full"
              style={{ aspectRatio: "466 / 830" }}
            >
              {/*
               * Screen overlay — calibrated to phone.png:
               *   top    ≈ 13.5 %  (below dynamic island / notch)
               *   bottom ≈ 18 %   (above home-bar area)
               *   left / right ≈ 7 %  (side bezels)
               */}
              <div
                className="absolute overflow-hidden rounded-xl"
                style={{
                  top: "13.5%",
                  left: "7%",
                  right: "7%",
                  bottom: "18%",
                }}
              >
                <Tabs
                  value={activeApp}
                  onValueChange={(v) => setActiveApp(v as PhoneApp)}
                  className="flex flex-col h-full bg-white/90 backdrop-blur-sm"
                >
                  {/* App navigation bar */}
                  <TabsList className="w-full shrink-0 rounded-none bg-stone-100/80 border-b border-stone-200 justify-start px-1 h-8 gap-0.5">
                    <TabsTrigger
                      value="nachrichten"
                      className="text-[10px] px-2 cursor-pointer"
                    >
                      Nachrichten
                    </TabsTrigger>
                    <TabsTrigger
                      value="stadtbild"
                      className="text-[10px] px-2 cursor-pointer"
                    >
                      Stadt
                    </TabsTrigger>
                    <TabsTrigger
                      value="bilanz"
                      className="text-[10px] px-2 cursor-pointer"
                    >
                      Bilanz
                    </TabsTrigger>
                  </TabsList>

                  {/* Screen content — swappable per active app */}
                  <TabsContent
                    value="nachrichten"
                    className="flex-1 overflow-y-auto p-2 mt-0"
                  >
                    <Messages onMessageClick={handleMessageClick} />
                  </TabsContent>

                  <TabsContent
                    value="stadtbild"
                    className="flex-1 overflow-y-auto p-2 mt-0"
                  >
                    <DistrictInfo district={selectedDistrict} />
                  </TabsContent>

                  <TabsContent
                    value="bilanz"
                    className="flex-1 overflow-y-auto p-2 mt-0"
                  >
                    <div className="text-[11px] text-stone-400 italic text-center pt-8">
                      Jahresbilanz erscheint am Jahresende.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/*
               * Dock icon zones — calibrated to phone.png dock bar:
               *   vertical: 83.5 % – 93.5 % from top
               *   horizontal centers: ~16 %, ~39 %, ~62 %, ~84 %
               * Each zone is ~15 % wide.
               */}
              {(
                [
                  { app: "nachrichten", left: "10.5%", title: "Nachrichten" },
                  { app: "stadtbild", left: "32.5%", title: "Stadtbild" },
                  { app: "bilanz", left: "53.5%", title: "Bilanz" },
                  {
                    app: null,
                    left: "73.5%",
                    title: "Kamera (nicht verfügbar)",
                  },
                ] as const
              ).map(({ app, left, title }) => (
                <button
                  key={left}
                  title={title}
                  onClick={() => app && setActiveApp(app)}
                  className="absolute cursor-pointer rounded-xl bg-transparent hover:bg-white/20 transition-colors"
                  style={{
                    top: "84.5%",
                    left,
                    width: "15%",
                    bottom: "6%",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Toggle button — always visible next to the panel */}
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer pointer-events-auto self-start mt-2 ml-1 h-7 w-6 shrink-0 rounded bg-white/80 shadow-sm text-stone-400 hover:text-stone-700 hover:bg-stone-200 backdrop-blur-sm"
          onClick={onToggle}
          title="Panel umschalten"
        >
          <PanelLeftIcon className="h-4 w-4" />
        </Button>
      </div>

      {openDialog && (
        <GameDialog
          open={true}
          onClose={() => setOpenDialog(null)}
          data={openDialog}
        />
      )}
    </>
  );
}
