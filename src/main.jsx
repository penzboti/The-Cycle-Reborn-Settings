import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App';
import Test from './pages/Test';
import Home from './pages/Home';
import Stash from './pages/Stash';
import Loadout from './pages/Loadout';
import Settings from './pages/Settings';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="test" element={<Test />} />
          <Route index element={<Home />} />
          <Route path="stash" element={<Stash />} />
          <Route path="loadout" element={<Loadout />} />
          <Route path="kits" element={<Test />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* hide menu bar on these pages */}
        <Route path="kits" >
          <Route path="edit" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
