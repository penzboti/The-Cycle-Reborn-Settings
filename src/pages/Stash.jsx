import { useState, useEffect, useCallback } from "react";
import { queries, get_data, itemData } from "../scripts/module";

import Item from "../components/item";
import RefreshButton from "../components/refresh";
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
    let stash = await get_data(queries.stash);
    let loadout = await get_data(queries.loadout);
    if (typeof stash === "undefined") {
      console.log("error getting stash");
      return;
    }
    let ids = getLoadoutIds(loadout);
    stash = stash.filter(id => !ids.includes(id[itemData.uuid]));
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
      <AddPopup slot="stash" reload={loadStash} />

      {stash.map((item) => {
        return (
          <Item item={item} slot="stash" reload={loadStash} key={item[itemData.uuid]} />
        );
      })}
    </>
  );
}

export default Stash;
