"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Type as TypeIcon,
  Bold,
  Italic as ItalicIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoveHorizontal,
  MoveVertical,
  RotateCw,
  Palette,
  Tag,
} from "lucide-react";

interface ElementNode {
  id: string;
  type: string; // "text" | others
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  // Text fields
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string; // "100"..."900"
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  textOpacity?: number; // 0..100
  lineHeight?: number;
  letterSpacing?: number;
  extraId?: string;
  visible?: boolean;
}

interface TextStylesProps {
  elements: ElementNode[];
  setElements: (next: ElementNode[]) => void;
  selectedElement: string | null;
}

const googleFonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Ubuntu",
  "Merriweather",
  "Playfair Display",
  "Oswald",
  "PT Sans",
  "Nunito",
  "Cabin",
  "Arimo",
];

export default function TextStyles({
  elements,
  setElements,
  selectedElement,
}: TextStylesProps) {
  const element = elements.find((el) => el.id === selectedElement);

  if (!element || element.type !== "text") {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        Select an element to edit
      </div>
    );
  }

  const updateElement = (patch: Partial<ElementNode>) => {
    setElements(
      elements.map((el) =>
        el.id === selectedElement ? { ...el, ...patch } : el
      )
    );
  };

  return (
    <div className="w-full">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <TypeIcon className="h-4 w-4" />
          {element.name || "Texto"}
        </div>

        {/* Extra ID */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" /> Extra ID
          </Label>
          <Input
            value={element.extraId || ""}
            onChange={(e) => updateElement({ extraId: e.target.value })}
            placeholder="Custom ID"
          />
        </div>

        <Separator />

        {/* Font Family */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4" /> Familia tipográfica
          </Label>
          <Select
            value={element.fontFamily || "Inter"}
            onValueChange={(value) => updateElement({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {googleFonts.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Style & Weight */}
        <div className="grid grid-cols-1 gap-3">
          {/* Style */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ItalicIcon className="h-4 w-4" /> Estilo
            </Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={element.fontStyle === "normal" ? "default" : "outline"}
                size="sm"
                onClick={() => updateElement({ fontStyle: "normal" })}
              >
                Normal
              </Button>
              <Button
                variant={element.fontStyle === "italic" ? "default" : "outline"}
                size="sm"
                onClick={() => updateElement({ fontStyle: "italic" })}
              >
                Italic
              </Button>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Bold className="h-4 w-4" /> Grosor
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["Thin", "100"],
                  ["ExtraLight", "200"],
                  ["Light", "300"],
                  ["Regular", "400"],
                  ["Medium", "500"],
                  ["SemiBold", "600"],
                  ["Bold", "700"],
                  ["ExtraBold", "800"],
                  ["Black", "900"],
                ] as const
              ).map(([label, val]) => (
                <Button
                  key={val}
                  variant={element.fontWeight === val ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateElement({ fontWeight: val })}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4" /> Tamaño
          </Label>
          <div className="flex items-center gap-3 min-w-0">
            <Slider
              value={[element.fontSize || 24]}
              onValueChange={(value) => updateElement({ fontSize: value[0] })}
              min={8}
              max={160}
              step={1}
              className="flex-1 min-w-0"
            />
            <Input
              className="w-20 shrink-0"
              type="number"
              value={element.fontSize || 24}
              onChange={(e) =>
                updateElement({ fontSize: parseInt(e.target.value) || 24 })
              }
            />
          </div>
        </div>

        {/* Alignment */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4" /> Alineación
          </Label>
          <div className="flex gap-2">
            <Button
              variant={element.textAlign === "left" ? "default" : "outline"}
              size="icon"
              onClick={() => updateElement({ textAlign: "left" })}
              title="Izquierda"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === "center" ? "default" : "outline"}
              size="icon"
              onClick={() => updateElement({ textAlign: "center" })}
              title="Centro"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === "right" ? "default" : "outline"}
              size="icon"
              onClick={() => updateElement({ textAlign: "right" })}
              title="Derecha"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Color */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Color
          </Label>
          <Input
            type="color"
            value={element.textColor || "#000000"}
            onChange={(e) => updateElement({ textColor: e.target.value })}
            className="h-9 p-1"
          />
        </div>

        {/* Opacidad */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">Opacidad</Label>
          <div className="flex items-center gap-3 min-w-0">
            <Slider
              value={[element.textOpacity ?? 100]}
              onValueChange={(value) =>
                updateElement({ textOpacity: value[0] })
              }
              min={0}
              max={100}
              step={1}
              className="flex-1 min-w-0"
            />
            <Input
              className="w-20 shrink-0"
              type="number"
              value={element.textOpacity ?? 100}
              onChange={(e) =>
                updateElement({
                  textOpacity: Math.max(
                    0,
                    Math.min(100, parseInt(e.target.value) || 0)
                  ),
                })
              }
            />
          </div>
        </div>

        <Separator />

        {/* Advanced: line-height & letter-spacing (opcionales) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Interlineado</Label>
            <Input
              type="number"
              step="0.05"
              value={element.lineHeight ?? 1.2}
              onChange={(e) =>
                updateElement({
                  lineHeight: parseFloat(e.target.value) || 1.2,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Esp. letras (px)</Label>
            <Input
              type="number"
              step="0.5"
              value={element.letterSpacing ?? 0}
              onChange={(e) =>
                updateElement({
                  letterSpacing: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        <Separator />

        {/* Proportions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs">
              <MoveHorizontal className="h-3.5 w-3.5" /> Ancho
            </Label>
            <Input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) =>
                updateElement({ width: parseInt(e.target.value) || 10 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs">
              <MoveVertical className="h-3.5 w-3.5" /> Alto
            </Label>
            <Input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) =>
                updateElement({ height: parseInt(e.target.value) || 10 })
              }
            />
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" /> Rotación
          </Label>
          <div className="flex items-center gap-3 min-w-0">
            <Slider
              value={[element.rotation || 0]}
              onValueChange={(value) => updateElement({ rotation: value[0] })}
              min={0}
              max={360}
              step={1}
              className="flex-1 min-w-0"
            />
            <Input
              className="w-20 shrink-0"
              type="number"
              value={Math.round(element.rotation || 0)}
              onChange={(e) =>
                updateElement({ rotation: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
