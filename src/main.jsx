import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App';
import Home from './pages/Home';
import Test from './pages/Test';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="test" element={<Test />} />
          <Route path="inventory" element={<Test />} />
          <Route path="stash" element={<Test />} />
          <Route path="kits" element={<Test />} />
          <Route path="settings" element={<Test />} />
        </Route>
        {/* hide menu bar on these pages */}
        <Route path="kits" >
          <Route path="edit" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
