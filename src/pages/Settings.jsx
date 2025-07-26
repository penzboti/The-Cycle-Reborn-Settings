import { useState, useEffect } from "react";
import { queries, get_data, write_data } from "../scripts/module";
import { Button } from "../components/ui/button";

import RefreshButton from "../components/refresh";
import { toast } from "sonner";

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

const toastsettings = {
  duration: 2000,
  position: "bottom-left",
  cancel: {
    label: 'Close',
  },
}

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

  function updateSetting(setting) {
    const current = settings[setting];
    let newData;
    if (["osiris", "battlepass_level", "korolev", "ica", "osiris"].includes(setting)) newData = current !== 1000000 ? 1000000 : 0;
    if (setting === "battlepass_status") newData = !current;
    if (setting === "currency") newData = current;
    if (setting === "currency") newData = JSON.stringify(newData);
    let string = "" + newData;
    console.log(setting, current, newData, string);
    let query = queries[setting];

    write_data(query, string).then(() => {
      toast("success", toastsettings);
      get_data(query).then(data => {
        let snap = settings;
        snap[setting] = data;
        updateSettings({ ...snap });
        console.log(snap, settings);
      });
    }).catch(() => toast.error("there was an error", toastsettings));
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
      // <p>{number}</p>
      return (
        <div key={text}>
          <h3>{text}</h3>
          <input type="number" value={number}
            onChange={e => {
              let value = e.target.valueAsNumber
              console.log(value);
              let snap = settings;
              snap["currency"][key] = value;
              updateSettings({ ...snap });
            }}
          />
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
            <Button onClick={() => updateSetting("currency")}>update</Button>
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
                <Button onClick={() => updateSetting(key)}>toggle</Button>
              </div>
            );
          })
      }
    </>
  );
}

export default Settings;
