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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-black">{data.title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-start gap-4">
          <img src={guideImage} alt="Berater" className="w-30 h-30" />
          <p className="text-stone-700 text-sm leading-relaxed">{data.text}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="cursor-pointer">
            Verstanden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
