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
import guideImage from "@/images/guide.jpg";

interface GameDialogProps {
  open: boolean;
  onClose: () => void;
  /** The dialog the player just clicked – determines sender and marks the newest visible entry. */
  data: DialogData;
}

export function GameDialog({ open, onClose, data }: GameDialogProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // All dialogs for this sender up to and including the current one (chronological).
  const history = (dialogsBySender[data.sender] ?? [data]).filter(
    (d) => d.id <= data.id,
  );

  // Scroll to the bottom (newest message) whenever the dialog opens or the data changes.
  useEffect(() => {
    if (open) {
      // Use a small timeout so the DOM has been painted before scrolling.
      const id = setTimeout(
        () => scrollEndRef.current?.scrollIntoView({ behavior: "instant" }),
        50,
      );
      return () => clearTimeout(id);
    }
  }, [open, data.id]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl h-[66vh] p-0 overflow-hidden flex flex-col gap-0 bg-stone-100 ring-stone-200">
        {/* Chat header */}
        <DialogHeader className="flex flex-row items-center gap-3 bg-white px-5 py-4 border-b border-stone-200 shadow-sm shrink-0">
          <img
            src={guideImage}
            alt={data.sender}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <DialogTitle className="text-sm font-semibold text-stone-800 leading-tight">
              {data.sender}
            </DialogTitle>
            <span className="text-xs text-emerald-500 font-medium">
              ● Online
            </span>
          </div>
        </DialogHeader>

        {/* Scrollable message history */}
        <div className="px-5 py-6 flex-1 overflow-y-auto flex flex-col gap-4">
          {history.map((entry, index) => {
            const isNewest = index === history.length - 1;
            return (
              <div key={entry.id} className="flex flex-col gap-2">
                {/* Topic separator chip */}
                <span className="self-center text-xs text-stone-400 font-medium tracking-wide uppercase select-none">
                  {entry.title}
                </span>

                {/* Message bubble */}
                <div className="flex items-end gap-2 max-w-[85%]">
                  <img
                    src={guideImage}
                    alt={data.sender}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mb-0.5"
                  />
                  <div
                    className={`rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm ring-1 ring-stone-200 transition-colors ${
                      isNewest ? "bg-amber-50 ring-amber-200" : "bg-white"
                    }`}
                  >
                    <div className="text-stone-700 text-sm leading-relaxed prose prose-sm prose-stone max-w-none prose-p:my-1 prose-strong:font-semibold prose-em:italic">
                      <ReactMarkdown>{entry.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Anchor element that we scroll into view */}
          <div ref={scrollEndRef} />
        </div>

        {/* Footer / reply bar */}
        <DialogFooter className="bg-white border-t border-stone-200 px-5 pt-4 pb-8 flex flex-row items-center justify-end gap-2 shrink-0">
          <Button
            onClick={onClose}
            className="cursor-pointer rounded-full px-8 py-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-none"
          >
            Verstanden ✓
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
