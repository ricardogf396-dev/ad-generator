"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Image as ImageIcon,
  MoveHorizontal,
  MoveVertical,
  RotateCw,
  Square,
  Brush,
  UploadCloud,
} from "lucide-react";

export default function ImageStyles() {
  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Imagen (preview con overlay) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <ImageIcon className="h-4 w-4" />
            Image
          </div>

          {/* Contenedor preview */}
          <div className="group relative w-full rounded-lg border border-slate-200 overflow-hidden">
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
              <Image
                src="/test-img.png"
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>

            <label
              htmlFor="image-upload"
              className="absolute inset-0 hidden cursor-pointer items-center justify-center gap-2 bg-black/50 text-white text-sm font-medium group-hover:flex transition-opacity"
              title="Choose Image"
            >
              <UploadCloud className="h-4 w-4" />
              Choose Image
            </label>

            {/* Input de archivo oculto */}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
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
                defaultValue={[280]}
                max={2000}
                step={1}
                className="w-full"
              />
              <Input className="w-20" placeholder="280" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MoveVertical className="h-4 w-4" /> Position Y
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                defaultValue={[160]}
                max={2000}
                step={1}
                className="w-full"
              />
              <Input className="w-20" placeholder="160" />
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

        <Separator />

        {/* Stroke (border) */}
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Brush className="h-4 w-4" /> Stroke
            </Label>
            <Input type="color" defaultValue="#000000" className="h-9 p-1" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Square className="h-4 w-4" /> Stroke Weight
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                defaultValue={[0]}
                min={0}
                max={20}
                step={1}
                className="w-full"
              />
              <Input className="w-20" placeholder="0" />
            </div>
          </div>
        </div>

        {/* Border Radius */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Square className="h-4 w-4" /> Border Radius
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              defaultValue={[0]}
              min={0}
              max={200}
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
