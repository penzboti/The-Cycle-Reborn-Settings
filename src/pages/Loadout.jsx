import { useState, useEffect } from "react";
import { get_data, queries, itemData } from "../scripts/module";

import Item from "../components/item";
import RefreshButton from "../components/refresh";

const text = {
  shield: "Shield: ",
  helmet: "Helmet: ",
  bag: "Bag: ",
  weaponOne: "Weapon 1: ",
  weaponTwo: "Weapon 2: ",
  bagItems: "Bag Items: ",
  safeItems: "Safe Pockets: ",
};
const separateMap = ["bagItems", "safeItems"];

function Loadout() {
  const [loadout, updateLoadout] = useState({ bagItems: [], safeItems: [] });

  async function loadLoadout() {
    // could these two be loaded at the same time?
    let stash = await get_data(queries.stash);
    let nodes = await get_data(queries.loadout);
    if (typeof stash === "undefined" || typeof nodes === "undefined") {
      console.log("error getting loadout");
      return;
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

    Object.keys(loadout)
      .filter(key => !separateMap.includes(key))
      .forEach(key => {
        let uuid = loadout[key];
        let item = stash.find(item => item[itemData.uuid] == uuid);
        loadout[key] = item;
      });

    separateMap.forEach(key => {
      let container = loadout[key];
      if (typeof container === "undefined") container = [];
      container = container.map(id => {
        let item = stash.find(item => item[itemData.uuid] == id);
        return item;
      });
      container = container.filter(item => typeof item !== "undefined");
      loadout[key] = container;
    });

    console.log("loadout", loadout);
    updateLoadout(loadout);
  }

  useEffect(() => {
    loadLoadout();
  }, []);

  return (
    <>
      <h1>Loadout</h1>

      <RefreshButton fn={loadLoadout} />

      {Object.keys(loadout)
        .filter(key => !separateMap.includes(key))
        .map(key => {
          let item = loadout[key];
          let foundItem = typeof item === "undefined";
          let content = foundItem
            ? <>
              <p>not found</p>
            </>
            : <>
              <Item item={item} />
            </>;

          return (
            <div
              key={key}
            >
              <h2>{text[key]}</h2>
              {content}
            </div>
          );
        })}
      {separateMap.map(key => {
        let container = loadout[key];
        return (
          <div
            key={key}
          >
            <h2>{text[key]}</h2>
            {container.length === 0 ? "empty" :
              container.map(item => <Item key={item[itemData.uuid]} item={item} />)
            }
          </div>
        );
      })}
    </>
  );
}

export default Loadout;
