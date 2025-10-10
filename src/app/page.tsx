"use client";

import AdComponents from "@/components/AdComponents";
import AdPanel from "@/components/AdPanel";
import LayersContainer from "@/components/LayersContainer";
import SettingsContainer from "@/components/SettingsContainer";
import ReplicateAd from "@/components/ReplicateAd";
import Canvas from "@/components/Canvas";
import { useState } from "react";

export default function Home() {
  const [elements, setElements] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <div className="relative w-full flex justify-center items-center h-screen bg-gray-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <AdComponents
        onToolSelect={setSelectedTool}
        selectedTool={selectedTool}
      />

      <AdPanel />
      <LayersContainer
        elements={elements}
        setElements={setElements}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
      <SettingsContainer
        elements={elements}
        setElements={setElements}
        selectedElement={selectedElement}
      />

      <Canvas
        elements={elements}
        setElements={setElements}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />

      <ReplicateAd />
    </div>
  );
}
