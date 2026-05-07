import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGameStore } from "@/store/gameStore";
import { quartersRemaining } from "@/lib/turnUtils";

export function PromiseTracker() {
  const promises = useGameStore((s) => s.openPromises);
  const turn = useGameStore((s) => s.turn);

  return (
    <Card className="border-stone-200">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-stone-700 flex items-center gap-2">
            📌 Versprechen
          </CardTitle>
          {promises.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {promises.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {promises.length === 0 ? (
          <p className="text-xs text-stone-400 italic">
            Keine offenen Versprechen.
          </p>
        ) : (
          <ul className="space-y-2">
            {promises.map((p) => {
              const remaining =
                p.deadline && !p.fulfilled && !p.broken
                  ? quartersRemaining(p.deadline, turn)
                  : null;
              return (
                <li key={p.id} className="text-xs flex items-start gap-2">
                  <span
                    className={
                      p.broken
                        ? "text-red-500"
                        : p.fulfilled
                          ? "text-emerald-500"
                          : "text-amber-500"
                    }
                  >
                    {p.broken ? "✗" : p.fulfilled ? "✓" : "○"}
                  </span>
                  <div>
                    <span
                      className={
                        p.broken
                          ? "line-through text-stone-400"
                          : "text-stone-700"
                      }
                    >
                      {p.text}
                    </span>
                    <span className="ml-1 text-stone-400">({p.faction})</span>
                    {remaining !== null && (
                      <span
                        className={`ml-1 font-medium ${remaining <= 1 ? "text-red-500" : "text-stone-400"}`}
                      >
                        · noch {remaining}Q
                      </span>
                    )}
                    {p.broken && (
                      <span className="ml-1 text-red-500 font-semibold">
                        gebrochen
                      </span>
                    )}
                  </div>
                </li>
              );
            })}

          </ul>
        )}
      </CardContent>
    </Card>
  );
}
