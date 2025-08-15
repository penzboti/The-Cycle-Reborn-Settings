import { useState, useEffect } from "react";
import { read_kit, write_kit } from "../scripts/module.js";

import { Button } from "../components/ui/button"; // was @/components/ui/button

import RefreshButton from "../components/refresh-button";

function Kits() {
  let [kits, updateKits] = useState({});
  async function loadKits() {
    let kits = await read_kit();
    console.log(kits);
    updateKits(kits);
  }
  async function update() {
    let string = JSON.stringify(kits);
    await write_kit(string);
    updateKits({...kits});
  }

  useEffect(() => {loadKits()}, []);
  return (
    <>
      <RefreshButton fn={loadKits} />
      <Button onClick={update}>save kits</Button>
    </>
  )
}

export default Kits;
