// TextStyles.tsx
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import {
  Type as TypeIcon,
  CaseUpper,
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoveHorizontal,
  MoveVertical,
  RotateCw,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
} from "lucide-react";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";

export default function TextStyles() {
  return (
    <div className="w-full mt-2 p-2">
      <div className="space-y-4">
        {/* Font Family */}
        <div className="space-y-2 w-full">
          <Label className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4" /> Font Family
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="poppins">Poppins</SelectItem>
              <SelectItem value="montserrat">Montserrat</SelectItem>
              <SelectItem value="system-ui">System UI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Size / Weight */}
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CaseUpper className="h-4 w-4" /> Font Size
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                defaultValue={[36]}
                max={120}
                step={1}
                className="w-full"
              />
              <Input className="w-16" placeholder="36" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Bold className="h-4 w-4" /> Font Weight
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select the font weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semibold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
                <SelectItem value="800">ExtraBold (800)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alignment */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4" /> Alignment
          </Label>
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <TextAlignStart />
            </Button>
            <Button variant="outline" size="icon">
              <TextAlignCenter />
            </Button>
            <Button variant="outline" size="icon">
              <TextAlignEnd />
            </Button>
          </ButtonGroup>
        </div>

        <Separator />

        {/* Position X / Y */}
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MoveHorizontal className="h-4 w-4" /> Position X
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                defaultValue={[40]}
                max={2000}
                step={1}
                className="w-full"
              />
              <Input className="w-20" placeholder="40" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MoveVertical className="h-4 w-4" /> Position Y
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                defaultValue={[40]}
                max={2000}
                step={1}
                className="w-full"
              />
              <Input className="w-20" placeholder="40" />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" /> Rotation (°)
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              defaultValue={[0]}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
            <Input className="w-20" placeholder="0" />
          </div>
        </div>
      </div>
    </div>
  );
}
