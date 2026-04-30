import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DialogData } from "@/data/dialogs";
import guideImage from "@/images/guide.jpg";

interface GameDialogProps {
  open: boolean;
  onClose: () => void;
  data: DialogData;
}

export function GameDialog({ open, onClose, data }: GameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl h-[66vh] p-0 overflow-hidden flex flex-col gap-0 bg-stone-100 ring-stone-200">
        {/* Chat header */}
        <DialogHeader className="flex flex-row items-center gap-3 bg-white px-5 py-4 border-b border-stone-200 shadow-sm shrink-0">
          <img
            src={guideImage}
            alt="Berater"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <DialogTitle className="text-sm font-semibold text-stone-800 leading-tight">
              Stadtberater
            </DialogTitle>
            <span className="text-xs text-emerald-500 font-medium">
              ● Online
            </span>
          </div>
        </DialogHeader>

        {/* Message bubble area */}
        <div className="px-5 py-6 flex-1 overflow-y-auto flex flex-col gap-3">
          {/* Topic chip */}
          <span className="self-center text-xs text-stone-400 font-medium tracking-wide uppercase select-none mb-2">
            {data.title}
          </span>

          {/* Incoming message bubble */}
          <div className="flex items-end gap-2 max-w-[85%]">
            <img
              src={guideImage}
              alt="Berater"
              className="w-8 h-8 rounded-full object-cover shrink-0 mb-0.5"
            />
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm ring-1 ring-stone-200">
              <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
                {data.text}
              </p>
              <span className="block text-right text-[10px] text-stone-400 mt-1 select-none">
                {new Date().toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
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
