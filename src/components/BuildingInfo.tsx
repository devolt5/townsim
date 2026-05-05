import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUILDING_INFO } from "@/data/gameData";

interface BuildingInfoProps {
  defKey: string | null;
  instanceId?: string | null;
}

export function BuildingInfo({ defKey, instanceId }: BuildingInfoProps) {
  if (!defKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2 py-8">
        <span className="text-4xl">🏛️</span>
        <p className="font-medium text-stone-500 text-sm">
          Kein Gebäude gewählt
        </p>
        <p className="text-xs text-center px-4">
          Klicke auf ein Gebäude in der Karte, um Details zu sehen.
        </p>
      </div>
    );
  }

  const info = BUILDING_INFO[defKey];
  const label = info?.label ?? defKey;
  const description =
    info?.description ?? "Keine weiteren Informationen verfügbar.";

  return (
    <Card className="border-stone-200">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-base text-stone-800">{label}</CardTitle>
        {instanceId && (
          <p className="text-[10px] text-stone-400 font-mono">{instanceId}</p>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <p className="text-sm text-stone-600">{description}</p>
      </CardContent>
    </Card>
  );
}
