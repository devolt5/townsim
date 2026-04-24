import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DistrictInfo } from "@/components/DistrictInfo";
import type { District } from "@/game/CityScene";

interface LeftPanelProps {
  selectedDistrict: District | null;
}

export function LeftPanel({ selectedDistrict }: LeftPanelProps) {
  return (
    <aside className="w-72 shrink-0 border-r border-stone-200 bg-stone-50 flex flex-col overflow-hidden">
      <Tabs
        defaultValue="stadtbild"
        className="flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="w-full rounded-none border-b border-stone-200 bg-stone-100 shrink-0 justify-start px-1 h-10">
          <TabsTrigger value="stadtbild" className="text-xs">
            Stadtbild
          </TabsTrigger>
          <TabsTrigger value="ereignisse" className="text-xs">
            Ereignisse
          </TabsTrigger>
          <TabsTrigger value="bilanz" className="text-xs">
            Jahresbilanz
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="stadtbild"
          className="flex-1 overflow-y-auto p-3 mt-0"
        >
          <DistrictInfo district={selectedDistrict} />
        </TabsContent>

        <TabsContent
          value="ereignisse"
          className="flex-1 overflow-y-auto p-3 mt-0"
        >
          <div className="text-xs text-stone-400 italic text-center pt-8">
            Noch keine Ereignisse in dieser Amtszeit.
          </div>
        </TabsContent>

        <TabsContent value="bilanz" className="flex-1 overflow-y-auto p-3 mt-0">
          <div className="text-xs text-stone-400 italic text-center pt-8">
            Jahresbilanz erscheint am Jahresende.
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
