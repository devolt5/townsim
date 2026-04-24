import { PanelRightIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { PendingDecision } from "@/components/PendingDecision";
import { PromiseTracker } from "@/components/PromiseTracker";

function CollapseButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto h-6 w-6 shrink-0 text-stone-400 hover:text-stone-700"
      onClick={toggleSidebar}
      title="Panel einklappen"
    >
      <PanelRightIcon className="h-3.5 w-3.5" />
    </Button>
  );
}

export function RightPanel() {
  return (
    <Sidebar side="right" collapsible="offcanvas">
      <Tabs
        defaultValue="antrag"
        className="flex flex-col h-full"
      >
        <SidebarHeader className="p-0 shrink-0">
          <TabsList className="w-full rounded-none border-b border-stone-200 bg-stone-100 justify-start px-1 h-10">
            <TabsTrigger value="antrag" className="text-xs">
              Antrag
            </TabsTrigger>
            <TabsTrigger value="verhandlung" className="text-xs">
              Verhandlung
            </TabsTrigger>
            <TabsTrigger value="versprechen" className="text-xs">
              Versprechen
            </TabsTrigger>
            <CollapseButton />
          </TabsList>
        </SidebarHeader>

        <SidebarContent className="p-0">
          <TabsContent
            value="antrag"
            className="flex-1 overflow-y-auto p-3 mt-0"
          >
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
        </SidebarContent>
      </Tabs>
    </Sidebar>
  );
}
