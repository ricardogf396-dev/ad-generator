"use client";

import { EyeIcon, EyeOff, GripVertical, Trash } from "lucide-react";
import { useState } from "react";

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
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: string;
  textColor?: string;
  textOpacity?: number;
  extraId?: string;
}

interface LayersContainerProps {
  elements: Element[];
  setElements: (elements: Element[]) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
}

export default function LayersContainer({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
}: LayersContainerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Get element name
  const getElementName = (element: Element, index: number) => {
    if (element.name) return element.name;
    const typeNames: { [key: string]: string } = {
      square: "Square",
      circle: "Circle",
      star: "Star",
      triangle: "Triangle",
    };
    return `${typeNames[element.type] || element.type} ${index + 1}`;
  };

  // Change name
  const handleNameChange = (id: string, newName: string) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, name: newName } : el))
    );
  };

  //  Visibility Toggle
  const toggleVisibility = (id: string) => {
    setElements(
      elements.map((el) =>
        el.id === id
          ? { ...el, visible: el.visible === false ? true : false }
          : el
      )
    );
  };

  // Delete element
  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  // Drag & Drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newElements = [...elements];
    const draggedElement = newElements[draggedIndex];
    newElements.splice(draggedIndex, 1);
    newElements.splice(index, 0, draggedElement);

    setElements(newElements);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const reversedElements = [...elements].reverse();

  return (
    <div className="absolute left-10 bg-white border border-gray-200 rounded-md shadow-md min-h-[300px] max-h-[600px] overflow-y-auto w-64 flex flex-col gap-1">
      <p className="font-medium text-sm px-3 py-2 border-b border-gray-200">
        Layers
      </p>
      <div className="flex flex-col overflow-y-auto p-1">
        {reversedElements.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-8">
            No elements
          </div>
        ) : (
          reversedElements.map((element, displayIndex) => {
            const actualIndex = elements.length - 1 - displayIndex;
            const isSelected = selectedElement === element.id;
            const isVisible = element.visible !== false;

            return (
              <div
                key={element.id}
                draggable
                onDragStart={() => handleDragStart(actualIndex)}
                onDragOver={(e) => handleDragOver(e, actualIndex)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedElement(element.id)}
                className={`group flex items-center justify-between p-2 text-sm rounded-md cursor-pointer transition ${
                  isSelected
                    ? "bg-blue-100 border border-blue-300"
                    : "hover:bg-gray-100"
                } ${draggedIndex === actualIndex ? "opacity-50" : ""}`}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <GripVertical className="inline-block mr-2 size-3 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0" />
                  {editingId === element.id ? (
                    <input
                      type="text"
                      defaultValue={getElementName(element, actualIndex)}
                      autoFocus
                      className="bg-white border border-blue-300 rounded px-1 text-sm w-full"
                      onBlur={(e) => {
                        handleNameChange(element.id, e.target.value);
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleNameChange(element.id, e.currentTarget.value);
                          setEditingId(null);
                        }
                        if (e.key === "Escape") {
                          setEditingId(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      className="truncate"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingId(element.id);
                      }}
                    >
                      {getElementName(element, actualIndex)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(element.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    {isVisible ? (
                      <EyeIcon className="size-4 text-gray-400 hover:text-gray-800 transition" />
                    ) : (
                      <EyeOff className="size-4 text-gray-400 hover:text-gray-800 transition" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteElement(element.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash className="size-4 text-gray-400 hover:text-red-500 transition" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
