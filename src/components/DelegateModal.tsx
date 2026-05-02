import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Delegate } from "@/data/types/delegate";

const FACTION_BADGE_COLORS: Record<string, string> = {
  Terra: "bg-green-600 text-white",
  Syndikat: "bg-red-600 text-white",
  Bürger: "bg-blue-600 text-white",
  "Union der Gilden": "bg-orange-500 text-white",
  "Der Bund": "bg-purple-700 text-white",
};

interface DelegateModalProps {
  open: boolean;
  onClose: () => void;
  delegate: Delegate | null;
}

export function DelegateModal({ open, onClose, delegate }: DelegateModalProps) {
  if (!delegate) return null;

  const badgeClass =
    FACTION_BADGE_COLORS[delegate.faction] ?? "bg-stone-500 text-white";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden flex flex-col gap-0 bg-stone-100 ring-stone-200 border-none [&>button]:hidden">
        {/* Header */}
        <div className="flex flex-row items-center justify-between bg-white px-6 py-6 border-b border-stone-200 shadow-sm shrink-0">
          <div className="flex flex-row items-center gap-4">
            <img
              src={delegate.imageUrl}
              alt={delegate.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
            />
            <div className="flex flex-col gap-1 min-w-0">
              <DialogHeader className="p-0 space-y-0 text-left">
                <DialogTitle className="text-base font-bold text-stone-800 leading-tight">
                  {delegate.name}
                </DialogTitle>
              </DialogHeader>
              <span className="text-xs text-stone-500">{delegate.title}</span>
              <Badge className={`self-start text-xs px-2 py-0.5 ${badgeClass}`}>
                {delegate.faction}
              </Badge>
            </div>
          </div>

          {/* Close button */}
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-4">
          <p className="text-sm text-stone-700 leading-relaxed">
            {delegate.bio}
          </p>

          <div className="flex flex-col gap-1 text-xs text-stone-500">
            <span>
              <span className="font-semibold text-stone-600">Reihe:</span>{" "}
              {delegate.row + 1}
            </span>
            <span>
              <span className="font-semibold text-stone-600">Sitz:</span>{" "}
              {delegate.seatIndex + 1}
            </span>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-white border-t border-stone-200 px-6 py-4 shrink-0">
          <Button
            onClick={onClose}
            className="cursor-pointer rounded-full px-6 py-2 h-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-none text-sm"
          >
            Schließen ✓
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
