// AdPanel.tsx
import { generateAdHTML } from "@/helper/exportHTML";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

interface AdPanelProps {
  elements: any[];
}

export default function AdPanel({ elements }: AdPanelProps) {
  function handleExport() {
    if (!Array.isArray(elements)) {
      console.error("❌ elements is not an array", elements);
      return;
    }

    const html = generateAdHTML(elements, 500, 500);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ad-export.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="absolute flex items-center top-10 right-10 bg-white border border-gray-200 rounded-md shadow-md w-auto p-1.5 gap-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Templates</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink className="cursor-pointer">
                Best performance
              </NavigationMenuLink>
              <NavigationMenuLink className="cursor-pointer">
                Colorful
              </NavigationMenuLink>
              <NavigationMenuLink className="cursor-pointer">
                Normal
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Button
        onClick={handleExport}
        variant="default"
        aria-label="export"
        className="cursor-pointer"
      >
        Export
      </Button>
    </div>
  );
}
