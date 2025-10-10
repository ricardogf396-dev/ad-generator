import FigureStyles from "./adSettings/FigureStyles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Element {
  id: string;
  type: string;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  visible?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  locked?: boolean;
}

interface SettingsContainerProps {
  elements: Element[];
  setElements: (elements: Element[]) => void;
  selectedElement: string | null;
}

export default function SettingsContainer({
  elements,
  setElements,
  selectedElement,
}: SettingsContainerProps) {
  return (
    <div
      className="absolute right-10 bg-white border border-gray-200 rounded-md shadow-md
                h-[680px] w-64 flex flex-col gap-1 p-2 min-w-0"
    >
      <Tabs
        defaultValue="styles"
        className="w-full flex flex-col h-full min-h-0"
      >
        <TabsList className="w-full overflow-x-auto shrink-0">
          <TabsTrigger value="styles" className="flex-1 min-w-0">
            Styles
          </TabsTrigger>
          <TabsTrigger value="animations" className="flex-1 min-w-0">
            Animations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="styles" className="flex-1 min-h-0 overflow-y-auto">
          <FigureStyles
            elements={elements}
            setElements={setElements}
            selectedElement={selectedElement}
          />
        </TabsContent>

        <TabsContent
          value="animations"
          className="flex-1 min-h-0 overflow-y-auto"
        >
          <div className="text-sm text-gray-400 text-center py-8">
            Animations coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
