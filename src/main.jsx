import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Stash from './pages/Stash';
import Loadout from './pages/Loadout';
import Kits from './pages/Kits';
import Settings from './pages/Settings';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="stash" element={<Stash />} />
          <Route path="loadout" element={<Loadout />} />
          <Route path="kits" element={<Kits />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
