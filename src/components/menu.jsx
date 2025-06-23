import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuViewport,
} from "./ui/navigation-menu" // was @/components/ui/navigation-menu

function MenuItem(props) {
  let text = typeof props.children === "undefined" ? props.text : props.children;
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <NavLink to={props.to}>{text}</NavLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Test</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <NavLink to="/kits">Kits</NavLink>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <NavLink to="/kits/edit">Edit</NavLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <NavLink to="/kits">Kits 2</NavLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="/stash">Stash</MenuItem>
        <MenuItem to="/loadout">Loadout</MenuItem>
        <MenuItem to="/settings">Settings</MenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Menu;
