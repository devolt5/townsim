import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BUILDING_INFO } from "@/data/gameData";

interface BuildingModalProps {
  open: boolean;
  onClose: () => void;
  defKey: string | null;
}

export function BuildingModal({ open, onClose, defKey }: BuildingModalProps) {
  if (!defKey) return null;

  const info = BUILDING_INFO[defKey];
  const label = info?.label ?? defKey;
  const description =
    info?.description ?? "Keine weiteren Informationen verfügbar.";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden flex flex-col gap-0 bg-stone-100 ring-stone-200 border-none [&>button]:hidden">
        {/* Header */}
        <div className="flex flex-row items-center justify-between bg-white px-6 py-6 border-b border-stone-200 shadow-sm shrink-0">
          <DialogHeader className="p-0 space-y-0 text-left">
            <DialogTitle className="text-base font-bold text-stone-800 leading-tight">
              {label}
            </DialogTitle>
          </DialogHeader>

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
        <div className="px-6 py-6">
          <p className="text-sm text-stone-700 leading-relaxed">
            {description}
          </p>
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
