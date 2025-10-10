import { Proportions } from "lucide-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

export default function AdPanel() {
  return (
    <div className="absolute flex items-center top-10 right-10 bg-white border border-gray-200 rounded-md shadow-md w-auto p-1.5 gap-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              Templates
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink className="cursor-pointer">
                Basic
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
      <Button variant="default" aria-label="export" className="cursor-pointer">
        Export
      </Button>
    </div>
  );
}
