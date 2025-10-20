"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Square,
  Minus,
  Type,
  Image as ImageLucide,
  Proportions,
  Circle,
  Star,
  Triangle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AdComponentsProps {
  onToolSelect: (tool: string | null) => void;
  selectedTool: string | null;
}

export default function AdComponents({
  onToolSelect,
  selectedTool,
}: AdComponentsProps) {
  const [showFigures, setShowFigures] = useState(false);
  const figuresRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    // Disparamos evento global (Canvas lo escucha)
    window.dispatchEvent(
      new CustomEvent("tibrio:add-image", { detail: { file } })
    );
    // Limpia para permitir volver a elegir el mismo archivo si se desea
    e.currentTarget.value = "";
  };

  useEffect(() => {
    if (!showFigures) return;
    const onDocDown = (e: MouseEvent | TouchEvent) => {
      if (!figuresRef.current) return;
      const target = e.target as Node;
      if (!figuresRef.current.contains(target)) {
        setShowFigures(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, [showFigures]);

  useEffect(() => {
    if (!showFigures) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFigures(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showFigures]);

  const handleShapeSelect = (shape: string) => {
    onToolSelect(shape);
    setShowFigures(false);
  };

  return (
    <div className="absolute flex items-center top-10 left-10 bg-white border border-gray-200 rounded-md shadow-md w-auto p-2 gap-2">
      <Image
        src="/tibrio.png"
        alt="Tibrio Logo"
        width={80}
        height={20}
        className="object-contain p-2"
      />
      <div className="flex gap-2 items-center">
        <p className="text-sm text-gray-500 pr-3">Ad HTML Generator v0.1</p>
        <div
          ref={figuresRef}
          className="flex gap-1 border-l border-gray-300 pl-3"
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label="Figure"
            className={`cursor-pointer relative ${
              selectedTool &&
              ["square", "circle", "star", "triangle"].includes(selectedTool)
                ? "bg-blue-100"
                : ""
            }`}
            onClick={() => setShowFigures(!showFigures)}
            title="Add figure"
          >
            <Square />
            {showFigures && (
              <div className="p-1.5 rounded flex shadow absolute top-12 gap-1 bg-white left-0 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Square"
                  className={`cursor-pointer ${
                    selectedTool === "square" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleShapeSelect("square")}
                >
                  <Square strokeWidth={1.5} className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Circle"
                  className={`cursor-pointer ${
                    selectedTool === "circle" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleShapeSelect("circle")}
                >
                  <Circle strokeWidth={1.5} className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Star"
                  className={`cursor-pointer ${
                    selectedTool === "star" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleShapeSelect("star")}
                >
                  <Star strokeWidth={1.5} className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Triangle"
                  className={`cursor-pointer ${
                    selectedTool === "triangle" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleShapeSelect("triangle")}
                >
                  <Triangle strokeWidth={1.5} className="size-6" />
                </Button>
              </div>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Line"
            className="cursor-pointer"
            title="Add line"
          >
            <Minus />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Text"
            className={`cursor-pointer ${
              selectedTool === "text" ? "bg-blue-100" : ""
            }`}
            onClick={() => onToolSelect("text")}
            title="Add Text"
          >
            <Type />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Image"
            onClick={triggerFileDialog}
            className="cursor-pointer"
            title="Add Image"
          >
            <ImageLucide />
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickImage}
          />
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Proportions className="size-4.5" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink className="cursor-pointer">
                    300x250
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    336x280
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    300x600
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    500x500
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}
