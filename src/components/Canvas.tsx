"use client";

import { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  const generateId = () => `el-${Date.now()}-${Math.random()}`;

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!selectedTool || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawStart({ x, y });
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    let width = currentX - drawStart.x;
    let height = currentY - drawStart.y;

    // Shift para mantener proporcional
    if (e.shiftKey) {
      const size = Math.max(Math.abs(width), Math.abs(height));
      width = width < 0 ? -size : size;
      height = height < 0 ? -size : size;
    }

    const finalX = width < 0 ? drawStart.x + width : drawStart.x;
    const finalY = height < 0 ? drawStart.y + height : drawStart.y;

    setTempElement({
      type: selectedTool,
      x: finalX,
      y: finalY,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;

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
        fillColor: "none",
        fillOpacity: 100,
        strokeColor: "#3b82f6",
        strokeWidth: 2,
        locked: false,
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    } else if (drawStart) {
      // Click simple - tamaño default
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
        fillColor: "none",
        fillOpacity: 100,
        strokeColor: "#3b82f6",
        strokeWidth: 2,
        locked: false,
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    }

    setIsDrawing(false);
    setDrawStart(null);
    setTempElement(null);
    setSelectedTool(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
    }
  };

  // Manejar tecla Delete/Backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElement) {
        e.preventDefault();
        setElements(elements.filter((el) => el.id !== selectedElement));
        setSelectedElement(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, elements, setElements, setSelectedElement]);

  // Actualizar Moveable cuando cambie el elemento seleccionado o sus propiedades
  useEffect(() => {
    if (moveableRef.current) {
      moveableRef.current.updateRect();
    }
  }, [selectedElement, elements]);

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElement(id);
  };

  const renderShape = (element: Partial<Element>, isTemp = false) => {
    // No renderizar si está oculto
    if (!isTemp && element.visible === false) return null;

    const style: React.CSSProperties = {
      position: "absolute",
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      cursor: isTemp ? "crosshair" : "move",
      opacity: isTemp ? 0.5 : 1,
    };

    // Normalizar fillColor: si es "none" o vacío, usar "none"
    const finalFillColor =
      element.fillColor === "none" || !element.fillColor
        ? "none"
        : element.fillColor;
    const finalFillOpacity =
      element.fillOpacity !== undefined ? element.fillOpacity / 100 : 1;
    const finalStrokeColor = element.strokeColor || "#3b82f6";
    const finalStrokeWidth =
      element.strokeWidth !== undefined ? element.strokeWidth : 2;

    const shapeProps = {
      fill: finalFillColor,
      fillOpacity: finalFillOpacity,
      stroke: finalStrokeColor,
      strokeWidth: finalStrokeWidth,
    };

    let svgContent;
    switch (element.type) {
      case "square":
        svgContent = (
          <rect x="5%" y="5%" width="90%" height="90%" {...shapeProps} />
        );
        break;
      case "circle":
        svgContent = <circle cx="50%" cy="50%" r="45%" {...shapeProps} />;
        break;
      case "star":
        svgContent = (
          <polygon
            points="50,10 61,40 92,40 68,58 78,88 50,70 22,88 32,58 8,40 39,40"
            {...shapeProps}
          />
        );
        break;
      case "triangle":
        svgContent = <polygon points="50,10 90,90 10,90" {...shapeProps} />;
        break;
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
          viewBox="0 0 100 100"
          style={{ width: "100%", height: "100%" }}
          key={`svg-${element.id}-${element.fillColor}-${element.strokeColor}-${element.strokeWidth}-${element.fillOpacity}`}
        >
          {svgContent}
        </svg>
      </div>
    );
  };

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
        style={{ cursor: selectedTool ? "crosshair" : "default" }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onClick={handleCanvasClick}
      >
        {elements.map((element) => renderShape(element))}
        {tempElement && renderShape(tempElement, true)}

        {selectedElement && (
          <Moveable
            ref={moveableRef}
            target={document.getElementById(selectedElement)}
            draggable={true}
            resizable={true}
            keepRatio={false}
            throttleResize={0}
            renderDirections={["nw", "ne", "sw", "se", "n", "s", "e", "w"]}
            edge={false}
            zoom={1}
            origin={false}
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
                // Forzar actualización de Moveable
                setTimeout(() => {
                  if (moveableRef.current) {
                    moveableRef.current.updateRect();
                  }
                }, 0);
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
                // Forzar actualización de Moveable
                setTimeout(() => {
                  if (moveableRef.current) {
                    moveableRef.current.updateRect();
                  }
                }, 0);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
