// SettingsContainer.tsx
import FigureStyles from "./adSettings/FigureStyles";
import TextStyles from "./adSettings/TextStyles";
import ImageAnimations from "./adSettings/ImageAnimations";
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
  strokeDasharray?: string;
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
  const el = elements.find((x) => x.id === selectedElement);
  const isImage = !!el && el.type === "image";

  return (
    <div
      className="absolute right-10 bg-white border border-gray-200 rounded-md shadow-md
                h-[680px] w-64 flex flex-col gap-1 p-2 min-w-0"
    >
      <Tabs
        defaultValue="styles"
        className="w-full flex flex-col h-full min-h-0"
        // Force remount when selection changes to avoid stale tab state
        key={selectedElement || "no-selection"}
      >
        <TabsList className="w-full overflow-x-auto shrink-0">
          <TabsTrigger value="styles" className="flex-1 min-w-0">
            Styles
          </TabsTrigger>

          {isImage && (
            <TabsTrigger value="animations" className="flex-1 min-w-0">
              Animations
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="styles" className="flex-1 min-h-0 overflow-y-auto">
          {(() => {
            if (!el) {
              return (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  Select an element to edit
                </div>
              );
            }
            if (el.type === "text") {
              return (
                <TextStyles
                  elements={elements}
                  setElements={setElements}
                  selectedElement={selectedElement}
                />
              );
            }
            return (
              <FigureStyles
                elements={elements}
                setElements={setElements}
                selectedElement={selectedElement}
              />
            );
          })()}
        </TabsContent>

        {isImage && (
          <TabsContent
            value="animations"
            className="flex-1 min-h-0 overflow-y-auto"
          >
            <ImageAnimations selectedElementId={selectedElement!} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
