import { useEffect } from "react";

type Options = {
  weights?: string[];
  italic?: boolean;
};

export function useWebFont(
  fontFamily?: string,
  opts: { weights?: string[]; italic?: boolean } = {}
) {
  const { weights = ["400"], italic = false } = opts;

  useEffect(() => {
    if (!fontFamily) return;
    let canceled = false;

    (async () => {
      try {
        const WebFont = (await import("webfontloader")).default;
        if (canceled) return;

        WebFont.load({
          google: { families: [`${fontFamily}:${weights.join(",")}`] },
        });

        const id = `gf2-${fontFamily.replace(/\s+/g, "-")}`;
        if (!document.getElementById(id)) {
          const link = document.createElement("link");
          link.id = id;
          link.rel = "stylesheet";
          const w = weights.join(";");
          const italAxis = italic ? `1,${w}` : `0,${w}`;
          // Cargamos normal e italic en una sola url (dos sets separados por &)
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
            fontFamily
          )}:ital,wght@0,${w}${italic ? `;${italAxis}` : ""}&display=swap`;
          document.head.appendChild(link);
        }
      } catch {
        const id = `gf2-${fontFamily.replace(/\s+/g, "-")}`;
        if (!document.getElementById(id)) {
          const link = document.createElement("link");
          link.id = id;
          link.rel = "stylesheet";
          const w = weights.join(";");
          const italAxis = italic ? `1,${w}` : `0,${w}`;
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
            fontFamily
          )}:ital,wght@0,${w}${italic ? `;${italAxis}` : ""}&display=swap`;
          document.head.appendChild(link);
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [fontFamily, italic, weights.join(",")]);
}
