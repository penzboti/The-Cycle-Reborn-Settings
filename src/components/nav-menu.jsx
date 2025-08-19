import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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

function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="/stash">Stash</MenuItem>
        <MenuItem to="/loadout">Loadout</MenuItem>
        <MenuItem to="/kits">Kits</MenuItem>
        <MenuItem to="/settings">Settings</MenuItem>
        <MenuItem to="/test">Test</MenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavMenu;
