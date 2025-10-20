"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Moveable from "react-moveable";
import keycon from "keycon";
import TextNode from "./TextNode";
import { blobToDataURL, fitSize, loadImage } from "@/helper/imageHelper";

if (typeof window !== "undefined") {
  keycon.setGlobal();
}

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
  // Text
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string; // "300" | "400" | ...
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  textOpacity?: number; // 0..100
  lineHeight?: number; // opcional
  letterSpacing?: number; // opcional
  extraId?: string;

  // Image
  src?: string;
  naturalW?: number;
  naturalH?: number;

  animation?: {
    type: "pulse" | "float";
    scale?: number;
    distance?: number;
    duration?: number;
  };
}

interface CanvasProps {
  elements: Element[];
  setElements: (elements: Element[]) => void;
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
}

export default function Canvas({
  elements,
  setElements,
  selectedTool,
  setSelectedTool,
  selectedElement,
  setSelectedElement,
}: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [tempElement, setTempElement] = useState<Partial<Element> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); // 👈 para edición inline de texto

  const canvasRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  const generateId = () => `el-${Date.now()}-${Math.random()}`;

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!selectedTool || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Para TEXT: no “dibujamos” arrastrando; con un click basta
    if (selectedTool === "text") {
      setDrawStart({ x, y });
      setIsDrawing(true);
      return;
    }

    setDrawStart({ x, y });
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;

    // Si la tool es texto, no hay rectángulo temporal
    if (selectedTool === "text") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    let width = currentX - drawStart.x;
    let height = currentY - drawStart.y;

    if (e.shiftKey) {
      const size = Math.max(Math.abs(width), Math.abs(height));
      width = width < 0 ? -size : size;
      height = height < 0 ? -size : size;
    }

    const finalX = width < 0 ? drawStart.x + width : drawStart.x;
    const finalY = height < 0 ? drawStart.y + height : drawStart.y;

    setTempElement({
      type: selectedTool!,
      x: finalX,
      y: finalY,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const commitElement = useCallback(
    (newEl: Element) => {
      setElements([...elements, newEl]);
      setSelectedElement(newEl.id);
    },
    [elements, setElements, setSelectedElement]
  );

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;

    if (selectedTool === "text" && drawStart) {
      const newEl: Element = {
        id: generateId(),
        type: "text",
        x: drawStart.x,
        y: drawStart.y,
        width: 200,
        height: 24, // alto mínimo inicial
        color: "#3b82f6",
        rotation: 0,
        visible: true,
        text: "", // 👈 sin placeholder
        fontFamily: "Inter",
        fontSize: 24,
        fontWeight: "400",
        textAlign: "left",
        textColor: "#000000",
        textOpacity: 100,
      };
      commitElement(newEl);
      setEditingId(newEl.id); // entra a edición
      setSelectedTool(null);
      setIsDrawing(false);
      setDrawStart(null);
      setTempElement(null);
      return;
    }

    // 👉 Figuras (lo que ya tenías)
    let newElementId: string | null = null;
    if (tempElement && tempElement.width! > 5 && tempElement.height! > 5) {
      const newElement: Element = {
        id: generateId(),
        type: tempElement.type!,
        x: tempElement.x!,
        y: tempElement.y!,
        width: tempElement.width!,
        height: tempElement.height!,
        color: "#3b82f6",
        rotation: 0,
        visible: true,
        fillColor: "#3b82f6",
        fillOpacity: 100,
        strokeColor: "none",
        strokeWidth: 0,
        strokeDasharray: "none",
        locked: false,
      };
      newElementId = newElement.id;
      setElements([...elements, newElement]);
    } else if (drawStart && selectedTool) {
      const newElement: Element = {
        id: generateId(),
        type: selectedTool!,
        x: drawStart.x - 50,
        y: drawStart.y - 50,
        width: 100,
        height: 100,
        color: "#3b82f6",
        rotation: 0,
        visible: true,
        fillColor: "#3b82f6",
        fillOpacity: 100,
        strokeColor: "none",
        strokeWidth: 0,
        strokeDasharray: "none",
        locked: false,
      };
      newElementId = newElement.id;
      setElements([...elements, newElement]);
    }

    if (newElementId) setSelectedElement(newElementId);

    setIsDrawing(false);
    setDrawStart(null);
    setTempElement(null);
    setSelectedTool(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
      setEditingId(null);
    }
  };

  // Delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeIsEditable =
        (document.activeElement as HTMLElement | null)?.isContentEditable ||
        false;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (editingId || activeIsEditable) return;

        if (selectedElement) {
          e.preventDefault();
          setElements(elements.filter((el) => el.id !== selectedElement));
          setSelectedElement(null);
          setEditingId(null);
        }
      }

      if (e.key === "Escape" && (editingId || activeIsEditable)) {
        e.preventDefault();
        setEditingId(null);
        (document.activeElement as HTMLElement | null)?.blur?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingId, selectedElement, elements, setElements, setSelectedElement]);

  useEffect(() => {
    if (moveableRef.current) moveableRef.current.updateRect();
  }, [selectedElement, elements]);

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElement(id);
  };

  // ---- RENDER FIGURAS (como ya lo tenías)
  const renderShape = (element: Partial<Element>, isTemp = false) => {
    if (!isTemp && element.visible === false) return null;
    const rotation = element.rotation || 0;
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      cursor: isTemp ? "crosshair" : "move",
      opacity: isTemp ? 0.5 : 1,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: "center center",
      overflow: "hidden",
    };

    const finalFillColor =
      element.fillColor === "none" || !element.fillColor
        ? "none"
        : element.fillColor;
    const finalFillOpacity =
      element.fillOpacity !== undefined ? element.fillOpacity / 100 : 1;
    const finalStrokeColor = element.strokeColor || "none";
    const finalStrokeWidth =
      element.strokeWidth !== undefined ? element.strokeWidth : 0;
    const finalStrokeDasharray = element.strokeDasharray || "none";

    const shapeProps = {
      fill: finalFillColor,
      fillOpacity: finalFillOpacity,
      stroke: finalStrokeColor,
      strokeWidth: finalStrokeWidth,
      strokeDasharray: finalStrokeDasharray,
    };

    let svgContent;
    const viewBox = "0 0 100 100";
    const preserveAspectRatio = "none";

    switch (element.type) {
      case "square":
        svgContent = (
          <rect x="0" y="0" width="100" height="100" {...shapeProps} />
        );
        break;
      case "circle":
        svgContent = (
          <ellipse cx="50" cy="50" rx="50" ry="50" {...shapeProps} />
        );
        break;
      case "star":
        svgContent = (
          <polygon
            points="50,0 61,38 100,38 68,58 79,95 50,71 21,95 32,58 0,38 39,38"
            {...shapeProps}
          />
        );
        break;
      case "triangle":
        svgContent = <polygon points="50,0 100,100 0,100" {...shapeProps} />;
        break;
      case "image":
        return (
          <div
            key={isTemp ? "temp" : element.id}
            id={isTemp ? undefined : element.id}
            style={style}
            onClick={
              isTemp ? undefined : (e) => handleElementClick(e, element.id!)
            }
            data-element-id={element.id}
          >
            {element.src ? (
              <img
                src={element.src}
                alt={element.name || "image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  pointerEvents: "none",
                }}
                draggable={false}
              />
            ) : null}
          </div>
        );
      default:
        return null;
    }

    return (
      <div
        key={isTemp ? "temp" : element.id}
        id={isTemp ? undefined : element.id}
        style={style}
        onClick={isTemp ? undefined : (e) => handleElementClick(e, element.id!)}
        data-element-id={element.id}
      >
        <svg
          viewBox={viewBox}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            overflow: "visible",
          }}
          preserveAspectRatio={preserveAspectRatio}
        >
          {svgContent}
        </svg>
      </div>
    );
  };

  useEffect(() => {
    async function onPaste(e: ClipboardEvent) {
      if (!canvasRef.current) return;

      const items: ClipboardItem[] =
        e.clipboardData?.items || e.clipboardData?.files || [];
      if (!items || items.length === 0) return;

      let blob: Blob | null = null;

      for (const it of items) {
        const type = it.type || it.kind;
        if (type && String(type).includes("image/")) {
          blob = it.getAsFile ? it.getAsFile() : await it.getType?.(type);
          if (blob) break;
        }
      }

      if (!blob && e.clipboardData?.files?.length) {
        const file = e.clipboardData.files[0];
        if (file && file.type.startsWith("image/")) blob = file;
      }

      if (!blob) return;

      e.preventDefault();
      const dataUrl = await blobToDataURL(blob);
      const img = await loadImage(dataUrl);

      const canvas = canvasRef.current.getBoundingClientRect();
      const maxW = canvas.width * 0.8;
      const maxH = canvas.height * 0.8;
      const { w, h } = fitSize(img.naturalWidth, img.naturalHeight, maxW, maxH);

      const newEl: Element = {
        id: generateId(),
        type: "image",
        x: (canvas.width - w) / 2,
        y: (canvas.height - h) / 2,
        width: w,
        height: h,
        color: "#3b82f6",
        rotation: 0,
        visible: true,
        src: dataUrl,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
      };
      commitElement(newEl);
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [commitElement]);

  // Recibe imágenes desde la toolbar mediante CustomEvent
  useEffect(() => {
    async function onAddImage(ev: any) {
      const file: File | null = ev?.detail?.file || null;
      const url: string | null = ev?.detail?.url || null;
      if (!file && !url) return;

      const dataUrl = url || (await blobToDataURL(file!));
      const img = await loadImage(dataUrl);

      const canvas = canvasRef.current!.getBoundingClientRect();
      const { w, h } = fitSize(
        img.naturalWidth,
        img.naturalHeight,
        canvas.width * 0.8,
        canvas.height * 0.8
      );

      const newEl: Element = {
        id: generateId(),
        type: "image",
        x: (canvas.width - w) / 2,
        y: (canvas.height - h) / 2,
        width: w,
        height: h,
        color: "#3b82f6",
        rotation: 0,
        visible: true,
        src: dataUrl,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
      };
      commitElement(newEl);
    }

    window.addEventListener("tibrio:add-image", onAddImage as EventListener);
    return () =>
      window.removeEventListener(
        "tibrio:add-image",
        onAddImage as EventListener
      );
  }, [commitElement]);

  useEffect(() => {
    function onUpdateAnimation(ev: any) {
      const { id, animation } = ev.detail || {};
      if (!id) return;
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, animation } : el))
      );
    }

    window.addEventListener("tibrio:update-animation", onUpdateAnimation);
    return () =>
      window.removeEventListener("tibrio:update-animation", onUpdateAnimation);
  }, [setElements]);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-1 px-2">
        <p className="font-medium text-sm">
          Ad 1 - <span className="text-gray-500">Template 1</span>
        </p>
        <p className="font-medium text-sm text-gray-700">500x500</p>
      </div>

      <div
        ref={canvasRef}
        className="w-[500px] h-[500px] bg-white border border-gray-200 shadow relative overflow-hidden"
        style={{
          cursor: selectedTool
            ? selectedTool === "text"
              ? "text"
              : "crosshair"
            : "default",
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Render elementos */}
        {elements.map((el) =>
          el.type === "text" ? (
            <TextNode
              key={el.id}
              el={el as any}
              isEditing={editingId === el.id}
              onClick={(e, id) => {
                e.stopPropagation();
                setSelectedElement(id);
              }}
              onDoubleClick={(e, id) => {
                e.stopPropagation();
                setSelectedElement(id);
                setEditingId(id);
              }}
              onChangeText={(id, text) => {
                setElements(
                  elements.map((x) => (x.id === id ? { ...x, text } : x))
                );
              }}
              onAutoResize={(id, size) => {
                const el = elements.find((x) => x.id === id);
                if (!el) return;
                const w = Math.max(1, Math.ceil(size.width));
                const h = Math.max(1, Math.ceil(size.height));
                if (el.width !== w || el.height !== h) {
                  setElements(
                    elements.map((x) =>
                      x.id === id ? { ...x, width: w, height: h } : x
                    )
                  );
                }
              }}
              onEndEditing={(id, finalText) => {
                // Leave edition mode
                setEditingId(null);

                if (!finalText) {
                  // If it is empty, delete the element
                  setElements(elements.filter((x) => x.id !== id));
                  if (selectedElement === id) setSelectedElement(null);
                } else {
                  // Otherwise, just update text (in case it changed)
                  setElements(
                    elements.map((x) =>
                      x.id === id ? { ...x, text: finalText } : x
                    )
                  );
                }
              }}
            />
          ) : (
            renderShape(el)
          )
        )}

        {tempElement &&
          tempElement.type !== "text" &&
          renderShape(tempElement, true)}
        {selectedElement && selectedElement !== editingId && (
          <Moveable
            ref={moveableRef}
            target={document.getElementById(selectedElement)}
            draggable={true}
            resizable={true}
            rotatable={true}
            scalable={keycon.global?.shiftKey}
            keepRatio={false}
            throttleResize={1}
            throttleRotate={0}
            renderDirections={["nw", "ne", "sw", "se", "n", "s", "e", "w"]}
            edge={false}
            zoom={1}
            origin={false}
            snappable={true}
            bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
            padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
            onDrag={(e) => {
              e.target.style.transform = e.transform;
            }}
            onDragEnd={(e) => {
              const element = elements.find((el) => el.id === selectedElement);
              if (element) {
                const newX = element.x + e.lastEvent.translate[0];
                const newY = element.y + e.lastEvent.translate[1];
                setElements(
                  elements.map((el) =>
                    el.id === selectedElement ? { ...el, x: newX, y: newY } : el
                  )
                );
                e.target.style.transform = "translate(0px, 0px)";
                setTimeout(() => moveableRef.current?.updateRect(), 0);
              }
            }}
            onResize={(e) => {
              e.target.style.width = `${e.width}px`;
              e.target.style.height = `${e.height}px`;
              e.target.style.transform = e.drag.transform;
            }}
            onResizeEnd={(e) => {
              const element = elements.find((el) => el.id === selectedElement);
              if (element) {
                setElements(
                  elements.map((el) =>
                    el.id === selectedElement
                      ? {
                          ...el,
                          x: element.x + e.drag.translate[0],
                          y: element.y + e.drag.translate[1],
                          width: e.width,
                          height: e.height,
                        }
                      : el
                  )
                );
                e.target.style.transform = "translate(0px, 0px)";
                setTimeout(() => moveableRef.current?.updateRect(), 0);
              }
            }}
            onRotate={(e) => {
              e.target.style.transform = e.drag.transform;
            }}
            onRotateEnd={(e) => {
              const element = elements.find((el) => el.id === selectedElement);
              if (element) {
                setElements(
                  elements.map((el) =>
                    el.id === selectedElement
                      ? {
                          ...el,
                          rotation: e.rotation,
                          x: element.x + e.drag.translate[0],
                          y: element.y + e.drag.translate[1],
                        }
                      : el
                  )
                );
                e.target.style.transform = `translate(0px, 0px) rotate(${e.rotation}deg)`;
                setTimeout(() => moveableRef.current?.updateRect(), 0);
              }
            }}
            onScaleStart={(e) => {
              e.setFixedDirection([0, 0]);
            }}
            onBeforeScale={(e) => {
              if (keycon.global?.shiftKey) e.setFixedDirection([-1, -1]);
              else e.setFixedDirection([0, 0]);
            }}
            onScale={(e) => {
              e.target.style.transform = e.drag.transform;
            }}
            onScaleEnd={(e) => {
              const element = elements.find((el) => el.id === selectedElement);
              if (element) {
                const newWidth = element.width * e.scale[0];
                const newHeight = element.height * e.scale[1];
                setElements(
                  elements.map((el) =>
                    el.id === selectedElement
                      ? {
                          ...el,
                          x: element.x + e.drag.translate[0],
                          y: element.y + e.drag.translate[1],
                          width: newWidth,
                          height: newHeight,
                        }
                      : el
                  )
                );
                e.target.style.transform = "translate(0px, 0px)";
                setTimeout(() => moveableRef.current?.updateRect(), 0);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
