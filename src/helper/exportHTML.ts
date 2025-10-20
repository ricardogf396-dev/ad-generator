export function generateAdHTML(
  elements: any[],
  canvasWidth: number,
  canvasHeight: number,
  bgColor = "#ffffff",
  bgImage?: string
) {
  if (!Array.isArray(elements)) {
    console.warn("generateAdHTML: elements is not an array ->", elements);
    elements = [];
  }

  const bgStyle = bgImage
    ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
    : `background:${bgColor};`;

  const bodyStyle = `margin:0;padding:0;width:${canvasWidth}px;height:${canvasHeight}px;`;
  const anchorStyle = `display:block;width:${canvasWidth}px;height:${canvasHeight}px;text-decoration:none;`;
  const containerStyle = `
    width:${canvasWidth}px;
    height:${canvasHeight}px;
    position:relative;
    overflow:hidden;
    ${bgStyle}
  `;

  // Small helper to escape text content
  const escapeHtml = (s: string) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // Build HTML for each element
  const elementHTML = elements
    .map((el) => {
      const baseStyle = [
        "position:absolute",
        `left:${Math.round(el.x)}px`,
        `top:${Math.round(el.y)}px`,
        `width:${Math.max(1, Math.round(el.width))}px`,
        `height:${Math.max(1, Math.round(el.height))}px`,
        `transform:rotate(${el.rotation || 0}deg)`,
      ].join(";");

      if (el.type === "text") {
        const style = [
          baseStyle,
          `color:${el.textColor || "#000000"}`,
          `font-family:${el.fontFamily || "Arial"}, sans-serif`,
          `font-size:${el.fontSize || 16}px`,
          `font-weight:${el.fontWeight || 400}`,
          `text-align:${el.textAlign || "left"}`,
          `opacity:${(el.textOpacity ?? 100) / 100}`,
          `line-height:${el.lineHeight ?? 1.2}`,
          `letter-spacing:${el.letterSpacing ?? 0}px`,
          "white-space:pre-wrap",
          "word-break:break-word",
        ].join(";");
        return `<div style="${style}">${escapeHtml(el.text || "")}</div>`;
      }

      if (el.type === "image" && el.src) {
        const style = [
          baseStyle,
          "display:block",
          "object-fit:contain",
          "pointer-events:none",
        ].join(";");
        // Important: keep the element id so GSAP can target it
        return `<img src="${el.src}" id="${el.id}" alt="" style="${style}" />`;
      }

      // Simple rect/circle can be done with styled divs
      if (el.type === "square" || el.type === "circle") {
        const color = el.fillColor || "#000000";
        const opacity = (el.fillOpacity ?? 100) / 100;
        const style = [
          baseStyle,
          `background:${color}`,
          el.type === "circle" ? "border-radius:50%" : "border-radius:0",
          `opacity:${opacity}`,
        ].join(";");
        return `<div style="${style}"></div>`;
      }

      // Triangle and star need SVG to render properly
      if (el.type === "triangle" || el.type === "star") {
        const fill = el.fillColor || "#000000";
        const fillOpacity = (el.fillOpacity ?? 100) / 100;
        const stroke = el.strokeColor && el.strokeColor !== "none" ? el.strokeColor : "none";
        const strokeWidth = el.strokeWidth ?? 0;
        const strokeDasharray = el.strokeDasharray && el.strokeDasharray !== "none" ? el.strokeDasharray : "none";

        const svgStyle = [
          baseStyle,
          "display:block",
          "overflow:visible",
        ].join(";");

        if (el.type === "triangle") {
          // Points for an upright triangle in a 100x100 viewBox
          return `
            <div id="${el.id}" style="${svgStyle}">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
                <polygon points="50,0 100,100 0,100"
                  fill="${fill}" fill-opacity="${fillOpacity}"
                  stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="${strokeDasharray}" />
              </svg>
            </div>
          `;
        }

        if (el.type === "star") {
          // Star points similar to canvas version
          return `
            <div id="${el.id}" style="${svgStyle}">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
                <polygon points="50,0 61,38 100,38 68,58 79,95 50,71 21,95 32,58 0,38 39,38"
                  fill="${fill}" fill-opacity="${fillOpacity}"
                  stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="${strokeDasharray}" />
              </svg>
            </div>
          `;
        }
      }

      return "";
    })
    .join("\n");

  // Inline GSAP animations based on element.animation
  const animatedImages = elements.filter((e) => e.type === "image" && e.animation);
  const animationScript = animatedImages
    .map((img) => {
      const a = img.animation || {};
      const safeId = img.id.replace(/[^a-zA-Z0-9_-]/g, "\\\\$&");

      if (a.type === "pulse") {
        return `gsap.to("#${safeId}", {
  scale: ${a.scale || 1.1},
  duration: ${a.duration || 1.4},
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
  transformOrigin: "50% 50%"
});`;
      }

      if (a.type === "float") {
        return `gsap.to("#${safeId}", {
  y: -${a.distance || 10},
  duration: ${a.duration || 1.8},
  ease: "power1.inOut",
  repeat: -1,
  yoyo: true
});`;
      }
      return "";
    })
    .join("\n");

  // Full HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    /* Reset and base styles to ensure consistent rendering */
    html, body { margin:0; padding:0; }
    img, div, span, svg { box-sizing: border-box; }
    #ad-container { font-family: Arial, sans-serif; overflow:hidden; }
  </style>
</head>
<body style="${bodyStyle}">
  <a href="{clickurl_html}" target="{target}" style="${anchorStyle}">
    <div id="ad-container" style="${containerStyle}">
      ${elementHTML}
    </div>
  </a>
</body>
<!-- GSAP CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
  // CSS.escape polyfill for older engines used by some ad platforms
  function cssEscape(id){
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(id);
    return String(id).replace(/[^a-zA-Z0-9_-]/g, '\\\\$&');
  }

  // Start animations once DOM is ready
  window.addEventListener('load', function(){
${animationScript}
  });
</script>
</html>`;
}
