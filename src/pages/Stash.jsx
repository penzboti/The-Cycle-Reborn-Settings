import { useState, useEffect } from "react";
import { queries, get_data, itemData } from "../scripts/module";

import Item from "../components/item";
import RefreshButton from "../components/refresh";

function Stash() {
  const [stash, updateStash] = useState([]);

  async function loadStash() {
    let stash = await get_data(queries.stash);
    if (typeof stash === "undefined") {
      console.log("error getting stash");
      return;
    }
    console.log("stash", stash);
    updateStash(stash);
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

      <RefreshButton fn={loadStash} />

      {stash.map((item) => {
        return (
          <Item item={item} key={item[itemData.uuid]} />
        );
      })}
    </>
  );
}

export default Stash;
