import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { District } from "@/data/gameData";

interface DistrictInfoProps {
  district: District | null;
}

export function DistrictInfo({ district }: DistrictInfoProps) {
  if (!district) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2 py-8">
        <span className="text-4xl">🗺️</span>
        <p className="font-medium text-stone-500 text-sm">
          Kein Stadtteil gewählt
        </p>
        <p className="text-xs text-center px-4">
          Klicke auf einen Stadtteil in der Karte, um Details zu sehen.
        </p>
      </div>
    );
  }

  return (
    <Card className="border-stone-200">
      <CardHeader className="pb-0 pt-0 px-0">
        <img
          src={district.image}
          alt={district.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <CardTitle className="text-base text-stone-800 px-4 pt-3">
          {district.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1">
        <p className="text-sm text-stone-600">{district.description}</p>
      </CardContent>
    </Card>
  );
}
