"use client";

import { useEffect, useRef } from "react";
import { useWebFont } from "@/lib/useWebFont";

export interface TextElement {
  id: string;
  type: "text";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string; // "100".."900"
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  textOpacity?: number; // 0..100
  lineHeight?: number;
  letterSpacing?: number;
  extraId?: string;
  visible?: boolean;
}

type Props = {
  el: TextElement;
  isEditing: boolean;
  onClick: (e: React.MouseEvent, id: string) => void;
  onDoubleClick: (e: React.MouseEvent, id: string) => void;
  onChangeText: (id: string, text: string) => void;
  onAutoResize: (id: string, size: { width: number; height: number }) => void;
  onEndEditing?: (id: string, finalText: string) => void; // para borrar si quedó vacío
};

export default function TextNode({
  el,
  isEditing,
  onClick,
  onDoubleClick,
  onChangeText,
  onAutoResize,
  onEndEditing,
}: Props) {
  // Carga fuentes (wght + italic)
  useWebFont(el.fontFamily || "Inter", {
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    italic: true,
  });

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const editableRef = useRef<HTMLDivElement | null>(null);

  // Al entrar a edición: enfocar y llevar caret al final.
  // NO sobrescribimos contenido si el nodo ya tiene texto (evita "borrarlo" en doble clic).
  useEffect(() => {
    if (!isEditing || !editableRef.current) return;
    const node = editableRef.current;

    // Si el div está vacío y tenemos texto en estado, inicialízalo.
    if ((node.textContent ?? "") === "" && typeof el.text === "string") {
      node.textContent = el.text;
    }

    // Focus + caret al final
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(node);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
    node.focus();
  }, [isEditing]); // <- sin dependencia de el.text

  // Auto-fit: observamos el contenido (editableRef) mientras editas.
  useEffect(() => {
    if (!isEditing || !editableRef.current) return;
    const node = editableRef.current;

    const ro = new ResizeObserver(() => {
      const rect = node.getBoundingClientRect();
      onAutoResize(el.id, {
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
      });
    });

    ro.observe(node);
    // Medida inicial
    const rect0 = node.getBoundingClientRect();
    onAutoResize(el.id, {
      width: Math.ceil(rect0.width),
      height: Math.ceil(rect0.height),
    });

    return () => ro.disconnect();
  }, [isEditing, el.id, onAutoResize]);

  if (el.visible === false) return null;

  const rotation = el.rotation || 0;

  // Mientras editas dejamos height en "auto" para medir el contenido real;
  // fuera de edición usamos el alto numérico del elemento (para Moveable).
  const styleBox: React.CSSProperties = {
    position: "absolute",
    left: el.x,
    top: el.y,
    width: el.width,
    height: isEditing ? ("auto" as const) : el.height,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: "center center",
    cursor: isEditing ? "text" : "move",
  };

  const styleText: React.CSSProperties = {
    width: "100%",
    // Deja que el alto crezca con el contenido cuando editas
    minHeight: "1em",
    outline: "none",
    border: "none",
    background: "transparent",
    fontFamily: `${el.fontFamily || "Inter"}, sans-serif`,
    fontSize: (el.fontSize || 24) + "px",
    fontWeight: el.fontWeight || "400",
    fontStyle: el.fontStyle || "normal",
    color: el.textColor || "#000",
    opacity: (el.textOpacity ?? 100) / 100,
    textAlign: el.textAlign || "left",
    lineHeight: el.lineHeight ? `${el.lineHeight}` : "1.2",
    letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
    whiteSpace: "pre-wrap",
    userSelect: "text",
    overflow: "visible",
  };

  return (
    <div
      ref={wrapperRef}
      id={el.id}
      data-element-id={el.id}
      data-extra-id={el.extraId || undefined}
      style={styleBox}
      onClick={(e) => onClick(e, el.id)}
      onDoubleClick={(e) => onDoubleClick(e, el.id)}
    >
      <div
        ref={editableRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        style={styleText}
        onMouseDown={(e) => {
          if (isEditing) e.stopPropagation();
        }}
        {...(!isEditing ? { children: el.text || "" } : {})}
        onInput={(e) => onChangeText(el.id, e.currentTarget.textContent ?? "")}
        onBlur={() => {
          const finalText = (editableRef.current?.textContent ?? "").trim();
          onEndEditing?.(el.id, finalText);
        }}
      />
    </div>
  );
}
