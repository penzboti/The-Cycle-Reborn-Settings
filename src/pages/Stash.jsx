import { useState, useEffect } from "react";
import { queries, get_data, itemData } from "../scripts/module";
import Item from "../scripts/item-class";

import ItemDisplay from "../components/item-display";
import RefreshButton from "../components/refresh-button";
import AddPopup from "../components/add-popup";

const separateMap = ["bagItems", "safeItems"];

function getLoadoutIds(nodes) {
  if (typeof nodes === "undefined") {
    return [];
  }
  let loadout = {
    shield: nodes["shield"],
    helmet: nodes["helmet"],
    bag: nodes["bag"],
    weaponOne: nodes["weaponOne"],
    weaponTwo: nodes["weaponTwo"],

    bagItems: JSON.parse(nodes["bagItemsAsJsonStr"])["m_bagItemsIds"],
    safeItems: JSON.parse(nodes["safeItemsAsJsonStr"])["m_bagItemsIds"],
  };

  let ids = [];
  Object.keys(loadout)
    .filter(key => !separateMap.includes(key))
    .forEach(key => {
      let uuid = loadout[key];
      ids.push(uuid);
    });

  separateMap.forEach(key => {
    let container = loadout[key];
    if (typeof container === "undefined") container = [];
    ids = [...ids, ...container];
  });
  return ids;
}

function Stash() {
  const [stash, updateStash] = useState([]);

  async function loadStash() {
    let newstash = await get_data(queries.stash);
    let loadout = await get_data(queries.loadout);
    if (typeof newstash === "undefined") {
      console.log("error getting stash");
      return;
    }
    // loadout items are also present in the stash in the background; i still don't want to display them here; i purge them
    let loadoutIds = getLoadoutIds(loadout);
    newstash = newstash.filter(i => !loadoutIds.includes(i[itemData.uuid]));
    newstash = newstash.map(item => new Item(item));
    console.log("stash", newstash);
    updateStash(newstash);
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
      <AddPopup slot="stash" reload={loadStash} />

      {stash.map((item) => {
        return (
          <ItemDisplay item={item} slot="stash" reload={loadStash} key={item.uuid} />
        );
      })}
    </>
  );
}

export default Stash;
