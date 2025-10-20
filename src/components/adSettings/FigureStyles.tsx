"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  Brush,
  Palette,
  MoveHorizontal,
  MoveVertical,
  Link,
  Link2Off,
  Shapes,
  RotateCw,
} from "lucide-react";
import { useEffect, useState } from "react";

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

interface FigureStylesProps {
  elements: Element[];
  setElements: (elements: Element[]) => void;
  selectedElement: string | null;
}

export default function FigureStyles({
  elements,
  setElements,
  selectedElement,
}: FigureStylesProps) {
  const [locked, setLocked] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);

  const element = elements.find((el) => el.id === selectedElement);

  // Calcular aspect ratio cuando cambia el elemento
  useEffect(() => {
    if (element) {
      setAspectRatio(element.width / element.height);
      setLocked(element.locked || false);
    }
  }, [element?.id]);

  if (!element) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        Selecciona un elemento para editar
      </div>
    );
  }

  const updateElement = (updates: Partial<Element>) => {
    console.log("Updating element:", selectedElement, updates);
    setElements(
      elements.map((el) =>
        el.id === selectedElement ? { ...el, ...updates } : el
      )
    );
  };

  const handleWidthChange = (newWidth: number) => {
    if (locked) {
      const newHeight = newWidth / aspectRatio;
      updateElement({ width: newWidth, height: newHeight });
    } else {
      updateElement({ width: newWidth });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (locked) {
      const newWidth = newHeight * aspectRatio;
      updateElement({ width: newWidth, height: newHeight });
    } else {
      updateElement({ height: newHeight });
    }
  };

  const toggleLock = () => {
    const newLocked = !locked;
    setLocked(newLocked);
    if (newLocked) {
      setAspectRatio(element.width / element.height);
    }
    updateElement({ locked: newLocked });
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Shapes className="h-4 w-4" />
          {element.name || `${element.type} styles`}
        </div>

        {/* Fill (background) */}
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Fill color
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={
                  element.fillColor === "none"
                    ? "#ffffff"
                    : element.fillColor || "#ffffff"
                }
                onChange={(e) => updateElement({ fillColor: e.target.value })}
                className="h-9 p-1 flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateElement({ fillColor: "none" })}
                className={element.fillColor === "none" ? "bg-gray-100" : ""}
              >
                None
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Fill opacity
            </Label>
            <div className="flex items-center gap-3 min-w-0">
              <Slider
                value={[element.fillOpacity || 100]}
                onValueChange={(value) =>
                  updateElement({ fillOpacity: value[0] })
                }
                min={0}
                max={100}
                step={1}
                className="flex-1 min-w-0"
              />
              <Input
                className="w-20 shrink-0"
                type="number"
                value={element.fillOpacity || 100}
                onChange={(e) =>
                  updateElement({ fillOpacity: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Stroke */}
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Brush className="h-4 w-4" /> Stroke color
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={
                  element.strokeColor === "none"
                    ? "#000000"
                    : element.strokeColor || "#000000"
                }
                onChange={(e) => updateElement({ strokeColor: e.target.value })}
                className="h-9 p-1 flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateElement({ strokeColor: "none", strokeWidth: 0 })
                }
                className={element.strokeColor === "none" ? "bg-gray-100" : ""}
              >
                None
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Brush className="h-4 w-4" /> Stroke width
            </Label>
            <div className="flex items-center gap-3 min-w-0">
              <Slider
                value={[element.strokeWidth || 0]}
                onValueChange={(value) =>
                  updateElement({ strokeWidth: value[0] })
                }
                min={0}
                max={20}
                step={1}
                className="flex-1 min-w-0"
              />
              <Input
                className="w-20 shrink-0"
                type="number"
                value={element.strokeWidth || 0}
                onChange={(e) =>
                  updateElement({ strokeWidth: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Brush className="h-4 w-4" /> Stroke style
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={
                  element.strokeDasharray === "none" ? "default" : "outline"
                }
                size="sm"
                onClick={() => updateElement({ strokeDasharray: "none" })}
              >
                Solid
              </Button>
              <Button
                variant={
                  element.strokeDasharray === "5,5" ? "default" : "outline"
                }
                size="sm"
                onClick={() => updateElement({ strokeDasharray: "5,5" })}
              >
                Dashed
              </Button>
              <Button
                variant={
                  element.strokeDasharray === "2,2" ? "default" : "outline"
                }
                size="sm"
                onClick={() => updateElement({ strokeDasharray: "2,2" })}
              >
                Dotted
              </Button>
              <Button
                variant={
                  element.strokeDasharray === "10,5,2,5" ? "default" : "outline"
                }
                size="sm"
                onClick={() => updateElement({ strokeDasharray: "10,5,2,5" })}
              >
                Custom
              </Button>
            </div>
            {element.strokeDasharray && element.strokeDasharray !== "none" && (
              <Input
                className="w-full"
                type="text"
                placeholder="e.g., 5,5 or 10,5,2,5"
                value={element.strokeDasharray}
                onChange={(e) =>
                  updateElement({ strokeDasharray: e.target.value })
                }
              />
            )}
          </div>
        </div>

        <Separator />

        {/* Proportions */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MoveHorizontal className="h-4 w-4" /> Proportions
          </Label>

          <div className="grid grid-cols-1 items-end gap-3">
            {/* Width */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-xs text-slate-500">
                <MoveHorizontal className="h-3.5 w-3.5" /> Width
              </Label>
              <div className="flex items-center gap-3 min-w-0">
                <Slider
                  value={[element.width]}
                  onValueChange={(value) => handleWidthChange(value[0])}
                  min={10}
                  max={500}
                  step={1}
                  className="flex-1 min-w-0"
                />
                <Input
                  className="w-20 shrink-0"
                  type="number"
                  value={Math.round(element.width)}
                  onChange={(e) =>
                    handleWidthChange(parseInt(e.target.value) || 10)
                  }
                />
              </div>
            </div>

            {/* Lock ratio toggle */}
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="text-xs text-slate-500">Aspect ratio</span>
              <Button
                variant={locked ? "default" : "outline"}
                size="icon"
                onClick={toggleLock}
                className="h-8 w-8"
                title={locked ? "Unlock ratio" : "Lock ratio"}
              >
                {locked ? (
                  <Link className="h-4 w-4" />
                ) : (
                  <Link2Off className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Height */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-xs text-slate-500">
                <MoveVertical className="h-3.5 w-3.5" /> Height
              </Label>
              <div className="flex items-center gap-3 min-w-0">
                <Slider
                  value={[element.height]}
                  onValueChange={(value) => handleHeightChange(value[0])}
                  min={10}
                  max={500}
                  step={1}
                  className="flex-1 min-w-0"
                />
                <Input
                  className="w-20 shrink-0"
                  type="number"
                  value={Math.round(element.height)}
                  onChange={(e) =>
                    handleHeightChange(parseInt(e.target.value) || 10)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
