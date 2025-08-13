import { Outlet } from "react-router-dom";

import "./index.css";

import NavMenu from "./components/nav-menu";

function App() {
  return (
    <>
      <NavMenu />

      <Outlet />
    </>
  );
}

export default App;
