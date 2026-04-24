import { PanelLeftIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { DistrictInfo } from "@/components/DistrictInfo";
import type { District } from "@/game/CityScene";

interface LeftPanelProps {
  selectedDistrict: District | null;
}

function SidebarToggle() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="self-start mt-1 h-7 w-6 shrink-0 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200"
      onClick={toggleSidebar}
      title="Panel umschalten"
    >
      <PanelLeftIcon className="h-4 w-4" />
    </Button>
  );
}

export function LeftPanel({ selectedDistrict }: LeftPanelProps) {
  return (
    <>
      <Sidebar side="left" collapsible="offcanvas">
        <Tabs defaultValue="stadtbild" className="flex flex-col h-full">
          <SidebarHeader className="p-0 shrink-0">
            <TabsList className="w-full rounded-none border-b border-stone-200 bg-stone-100 justify-start px-1 h-10">
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
          </SidebarHeader>

          <SidebarContent className="p-0">
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

            <TabsContent
              value="bilanz"
              className="flex-1 overflow-y-auto p-3 mt-0"
            >
              <div className="text-xs text-stone-400 italic text-center pt-8">
                Jahresbilanz erscheint am Jahresende.
              </div>
            </TabsContent>
          </SidebarContent>
        </Tabs>
      </Sidebar>
      <SidebarToggle />
    </>
  );
}
