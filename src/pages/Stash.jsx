import { useState, useEffect } from "react";
import { queries, get_data, items } from "../scripts/module";

import { Button } from "../components/ui/button"; // was @/components/ui/button
import { Toaster } from "../components/ui/sonner"; // was @/components/ui/sonner
import { toast } from "sonner";

function Stash() {
  const [stash, updateStash] = useState([]);

  async function loadStash() {
    let res = await get_data(queries.stash);
    updateStash(res);
    console.log(res);
  }

  // only runs on initial load
  // normally it would do every render
  // but when changed with useState, it rerenders => infinite loop
  useEffect(() => {
    loadStash();
  }, []);

  return (
    <>
      <h1>Stash</h1>

      <Toaster />
      <Button variant="secondary" onClick={() => {
        loadStash();
        toast("Refreshed", {
          duration: 2000,
          position: "bottom-left",
          cancel: {
            label: 'Close',
          },
        });
      }}>Refresh</Button>

      {stash.map((item) => {
        let elem = items.find(elem => elem.id == item.baseItemId);
        if (typeof elem === "undefined") console.log("not a real item", item);
        return (
          <div
            key={item.itemId}
          >
            <img src={elem.image} />
            <p>{item["baseItemId"]}</p>
            <p>{elem.name}</p>
            <p>amount: {item["amount"]}</p>
            <p>{item["durability"]}</p>
          </div>
        );
      })}
    </>
  );
}

export default Stash;
