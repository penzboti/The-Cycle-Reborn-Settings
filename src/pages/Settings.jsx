import { useState, useEffect } from "react";
import { queries, get_data } from "../scripts/module";

import RefreshButton from "../components/refresh";

const needed_queries = [
  "currency",
  "battlepass_status",
  "battlepass_level",
  "korolev",
  "ica",
  "osiris",
];

const text = [
  "Currencies",
  "Battlepass ownership",
  "Battlepass completeion",
  "Korolev maxed",
  "Ica maxed",
  "Osiris maxed"
];

const currencytext = {
  AU: "aurum",
  IN: "insurance tokens",
  SC: "k-marks"
};

function Settings() {
  const [settings, updateSettings] = useState({});

  async function getSettings() {
    let data = {};
    for (const query of needed_queries) {
      let res = await get_data(queries[query]);
      if (typeof res === "undefined") {
        console.log("error getting stash");
        return;
      }
      data[query] = res;
    }
    console.log("settings", data);
    updateSettings(data);
  }

  useEffect(() => {
    getSettings();
  }, []);

  // if currencies is present
  if (typeof settings[needed_queries[0]] !== "undefined") {
    let obj = settings[needed_queries[0]];
    var currencies = Object.keys(obj).map(key => {
      let text = currencytext[key];
      let number = obj[key];
      return (
        <div key={text}>
          <h3>{text}</h3>
          <p>{number}</p>
        </div>
      )
    });

  }

  return (
    <>
      <h1>Settings</h1>

      <RefreshButton fn={getSettings} />

      {
        typeof currencies !== "undefined" ?
          <div>
            <h2>{text[0]}</h2>
            {currencies}
          </div>
          : <></>
      }
      {
        Object.keys(settings)
          .filter(key => key != "currency")
          .map(key => {
            let obj = settings[key];
            let n = needed_queries.findIndex(s => s === key);
            let header = text[n];
            if (n === -1) header = key;
            return (
              <div key={key}>
                <h2>{header}</h2>
                <p>{JSON.stringify(obj)}</p>
              </div>
            );
          })
      }
    </>
  );
}

export default Settings;
