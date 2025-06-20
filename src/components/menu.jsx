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
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="/stash">Stash</MenuItem>
        <MenuItem to="/inventory">Inventory</MenuItem>
        <MenuItem to="/settings">Settings</MenuItem>
        <MenuItem to="/kits">Kits</MenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Menu;
