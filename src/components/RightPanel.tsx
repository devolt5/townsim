import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingDecision } from "@/components/PendingDecision";
import { PromiseTracker } from "@/components/PromiseTracker";

export function RightPanel() {
  return (
    <aside className="w-80 shrink-0 border-l border-stone-200 bg-stone-50 flex flex-col overflow-hidden">
      <Tabs
        defaultValue="antrag"
        className="flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="w-full rounded-none border-b border-stone-200 bg-stone-100 shrink-0 justify-start px-1 h-10">
          <TabsTrigger value="antrag" className="text-xs">
            Antrag
          </TabsTrigger>
          <TabsTrigger value="verhandlung" className="text-xs">
            Verhandlung
          </TabsTrigger>
          <TabsTrigger value="versprechen" className="text-xs">
            Versprechen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="antrag" className="flex-1 overflow-y-auto p-3 mt-0">
          <PendingDecision />
        </TabsContent>

        <TabsContent
          value="verhandlung"
          className="flex-1 overflow-y-auto p-3 mt-0"
        >
          <div className="text-xs text-stone-400 italic text-center pt-8">
            Wähle „Verhandeln" bei einem Antrag, um den Verhandlungsmodus zu
            starten.
          </div>
        </TabsContent>

        <TabsContent
          value="versprechen"
          className="flex-1 overflow-y-auto p-3 mt-0"
        >
          <PromiseTracker />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
