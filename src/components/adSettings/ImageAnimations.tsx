"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap, { Power1, Power2, Power3, Power4 } from "gsap";

type EaseKey =
  | "power1.inOut"
  | "power2.inOut"
  | "power3.inOut"
  | "power4.inOut";

interface ImageAnimationsProps {
  selectedElementId: string;
}

const EASES: Record<EaseKey, gsap.EaseFunction> = {
  "power1.inOut": Power1.easeInOut,
  "power2.inOut": Power2.easeInOut,
  "power3.inOut": Power3.easeInOut,
  "power4.inOut": Power4.easeInOut,
};

export default function ImageAnimations({
  selectedElementId,
}: ImageAnimationsProps) {
  // UI state
  const [activePreset, setActivePreset] = useState<"pulse" | "float" | null>(
    null
  );
  const [loop, setLoop] = useState(true);

  // Pulse controls
  const [pulseScale, setPulseScale] = useState(1.12); // target scale
  const [pulseDuration, setPulseDuration] = useState(1.4);
  const [pulseEase, setPulseEase] = useState<EaseKey>("power2.inOut");

  // Float controls
  const [floatDistance, setFloatDistance] = useState(12); // px up/down
  const [floatDuration, setFloatDuration] = useState(1.8);
  const [floatEase, setFloatEase] = useState<EaseKey>("power1.inOut");

  // Internal
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const targetSelector = useMemo(() => {
    // Animate the inner <img> to avoid Moveable transform conflicts
    return `#${CSS.escape(selectedElementId)} img`;
  }, [selectedElementId]);

  // Kill any running tween when target changes or on unmount
  useEffect(() => {
    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, []);

  const killCurrent = () => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    // Reset only transform-affecting properties we touched
    gsap.set(targetSelector, { clearProps: "transform" });
  };

  const playPulse = () => {
    killCurrent();
    setActivePreset("pulse");
    tweenRef.current = gsap.to(targetSelector, {
      scale: pulseScale,
      duration: pulseDuration,
      ease: EASES[pulseEase],
      yoyo: true,
      repeat: loop ? -1 : 0,
      // transformOrigin to keep pulse centered
      transformOrigin: "50% 50%",
    });

    // After starting GSAP tween
    window.dispatchEvent(
      new CustomEvent("tibrio:update-animation", {
        detail: {
          id: selectedElementId,
          animation: {
            type: "pulse",
            scale: pulseScale,
            duration: pulseDuration,
          },
        },
      })
    );
  };

  const playFloat = () => {
    killCurrent();
    setActivePreset("float");
    // Float up/down around original position
    tweenRef.current = gsap.to(targetSelector, {
      y: -Math.abs(floatDistance),
      duration: floatDuration,
      ease: EASES[floatEase],
      yoyo: true,
      repeat: loop ? -1 : 0,
      // Keep width/height unaffected
      transformOrigin: "50% 50%",
    });

    window.dispatchEvent(
      new CustomEvent("tibrio:update-animation", {
        detail: {
          id: selectedElementId,
          animation: {
            type: "float",
            distance: floatDistance,
            duration: floatDuration,
          },
        },
      })
    );

  };

  const stop = () => {
    setActivePreset(null);
    killCurrent();
  };

  // Live update: if user tweaks controls while a preset is active, restart it
  useEffect(() => {
    if (activePreset === "pulse") playPulse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulseScale, pulseDuration, pulseEase, loop, targetSelector]);

  useEffect(() => {
    if (activePreset === "float") playFloat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floatDistance, floatDuration, floatEase, loop, targetSelector]);

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Image Animations</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
          />
          <span>Loop</span>
        </label>
      </div>

      {/* Pulse preset */}
      <div className="border rounded-md p-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">Pulse</div>
          <div className="flex gap-2">
            <button className="px-2 py-1 border rounded" onClick={playPulse}>
              Play
            </button>
            <button
              className="px-2 py-1 border rounded"
              onClick={stop}
              disabled={activePreset !== "pulse"}
            >
              Stop
            </button>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span>Scale</span>
            <input
              type="range"
              min={1.01}
              max={1.6}
              step={0.01}
              value={pulseScale}
              onChange={(e) => setPulseScale(parseFloat(e.target.value))}
            />
            <span className="text-gray-500">{pulseScale.toFixed(2)}x</span>
          </label>

          <label className="flex flex-col gap-1">
            <span>Duration (s)</span>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={pulseDuration}
              onChange={(e) =>
                setPulseDuration(parseFloat(e.target.value) || 0.1)
              }
            />
          </label>

          <label className="flex flex-col gap-1 col-span-2">
            <span>Ease</span>
            <select
              value={pulseEase}
              onChange={(e) => setPulseEase(e.target.value as EaseKey)}
              className="border rounded px-2 py-1"
            >
              <option value="power1.inOut">power1.inOut</option>
              <option value="power2.inOut">power2.inOut</option>
              <option value="power3.inOut">power3.inOut</option>
              <option value="power4.inOut">power4.inOut</option>
            </select>
          </label>
        </div>
      </div>

      {/* Float preset */}
      <div className="border rounded-md p-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">Float</div>
          <div className="flex gap-2">
            <button className="px-2 py-1 border rounded" onClick={playFloat}>
              Play
            </button>
            <button
              className="px-2 py-1 border rounded"
              onClick={stop}
              disabled={activePreset !== "float"}
            >
              Stop
            </button>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span>Distance (px)</span>
            <input
              type="range"
              min={2}
              max={50}
              step={1}
              value={floatDistance}
              onChange={(e) => setFloatDistance(parseInt(e.target.value, 10))}
            />
            <span className="text-gray-500">{floatDistance}px</span>
          </label>

          <label className="flex flex-col gap-1">
            <span>Duration (s)</span>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={floatDuration}
              onChange={(e) =>
                setFloatDuration(parseFloat(e.target.value) || 0.1)
              }
            />
          </label>

          <label className="flex flex-col gap-1 col-span-2">
            <span>Ease</span>
            <select
              value={floatEase}
              onChange={(e) => setFloatEase(e.target.value as EaseKey)}
              className="border rounded px-2 py-1"
            >
              <option value="power1.inOut">power1.inOut</option>
              <option value="power2.inOut">power2.inOut</option>
              <option value="power3.inOut">power3.inOut</option>
              <option value="power4.inOut">power4.inOut</option>
            </select>
          </label>
        </div>
      </div>

      <button className="mt-1 px-2 py-1 border rounded" onClick={stop}>
        Reset
      </button>
    </div>
  );
}
