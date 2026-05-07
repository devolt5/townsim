import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DialogData } from "@/data/dialogs";
import { dialogsBySender } from "@/data/dialogs";
import { useGameStore } from "@/store/gameStore";

/** Maps a sender name to the avatar image shown in the chat dialog. */
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const SENDER_AVATAR: Record<string, string> = {
  Stadtberaterin: `${base}/images/guide.jpg`,
  Stadtredakteur: `${base}/images/delegate_01_female.jpg`,
};

function senderAvatar(sender: string): string {
  return SENDER_AVATAR[sender] ?? `${base}/images/guide.jpg`;
}

interface GameDialogProps {
  open: boolean;
  onClose: () => void;
  /** The dialog the player just clicked – determines sender and marks the newest visible entry. */
  data: DialogData;
}

export function GameDialog({ open, onClose, data }: GameDialogProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const playerName = useGameStore((s) => s.basicData.playerName);

  // All dialogs for this sender up to and including the current one (chronological).
  const history = (dialogsBySender[data.sender] ?? [data]).filter(
    (d) => d.id <= data.id,
  );

  // Scroll to the top (newest message) whenever the dialog opens or the data changes.
  useEffect(() => {
    if (open) {
      // Use a small timeout so the DOM has been painted before scrolling.
      const scrollableDiv = scrollEndRef.current?.parentElement;
      if (scrollableDiv) {
        const id = setTimeout(() => (scrollableDiv.scrollTop = 0), 50);
        return () => clearTimeout(id);
      }
    }
  }, [open, data.id]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl h-[66vh] p-0 overflow-hidden flex flex-col gap-0 bg-stone-100 ring-stone-200 border-none [&>button]:hidden">
        {/* Chat header */}
        <div className="flex flex-row items-center justify-between bg-white px-6 py-8 border-b border-stone-200 shadow-sm shrink-0">
          <div className="flex flex-row items-center gap-4">
            <img
              src={senderAvatar(data.sender)}
              alt={data.sender}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
            />
            <div className="flex flex-col min-w-0 text-left">
              <DialogHeader className="p-0 space-y-0 text-left">
                <DialogTitle className="text-base font-bold text-stone-800 leading-tight">
                  {data.sender}
                </DialogTitle>
              </DialogHeader>
              <span className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>

          {/* Custom Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-10 w-10 text-stone-400 hover:text-stone-600 hover:bg-stone-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>

        {/* Scrollable message history */}
        <div
          className="px-6 py-8 flex-1 overflow-y-auto flex flex-col gap-6"
          ref={scrollEndRef}
        >
          {[...history].reverse().map((entry, index) => {
            const isNewest = index === 0;
            return (
              <div key={entry.id} className="flex flex-col gap-2">
                {/* Topic separator chip */}
                <span className="self-center text-xs text-stone-400 font-medium tracking-wide uppercase select-none">
                  {entry.title}
                </span>

                {/* Message bubble */}
                <div className="flex items-start gap-2 max-w-[85%]">
                  <img
                    src={senderAvatar(data.sender)}
                    alt={data.sender}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div
                    className={`rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm ring-1 ring-stone-200 transition-colors ${
                      isNewest ? "bg-amber-50 ring-amber-200" : "bg-white"
                    }`}
                  >
                    <div className="text-stone-700 text-sm leading-relaxed prose prose-sm prose-stone max-w-none prose-p:my-1 prose-strong:font-semibold prose-em:italic">
                      <ReactMarkdown>
                        {entry.text.replace("{playerName}", playerName)}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / reply bar */}
        <DialogFooter className="bg-white border-t border-stone-200 px-6 py-4 flex flex-row items-center justify-end gap-2 shrink-0">
          <Button
            onClick={onClose}
            className="cursor-pointer rounded-full px-6 py-2 h-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-none text-sm"
          >
            Verstanden ✓
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
