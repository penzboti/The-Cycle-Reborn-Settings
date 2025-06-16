import { Outlet } from "react-router-dom";

import "./index.css";

import Menu from "./components/menu";

function App() {
  return (
    <>
      <Menu />

      <Outlet />
    </>
  );
}

export default App;
