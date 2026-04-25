import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

export function GameDialog({ open, onClose }: TutorialModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Willkommen in TownSim</DialogTitle>
        </DialogHeader>
        <p className="text-stone-700 text-sm leading-relaxed">
          Willkommen! Hier beginnt dein Abenteuer als Bürgermeister.
        </p>
        <DialogFooter>
          <Button onClick={onClose}>Verstanden</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
