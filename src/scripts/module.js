const { invoke } = window.__TAURI__.core;
const { readTextFile } = window.__TAURI__.fs;

async function get_data(key) {
  let res = await invoke("get_data", { key });
  let json = await JSON.parse(res);
  return Promise.resolve(json);
}

async function write_data(key, value) {
  let res = await invoke("write_data", {
    key,
    value,
  });
  if (res === false) {
    return Promise.reject();
  } else {
    return Promise.resolve();
  }
}

async function add_item(input_json) {
  let json = {
    itemId: "UUIDV4",
    baseItemId: "",
    primaryVanityId: 0,
    secondaryVanityId: 0,
    amount: 1,
    durability: -1,
    modData: { m: [] },
    rolledPerks: [],
    insurance: "",
    insuranceOwnerPlayfabId: "",
    insuredAttachmentId: "",
    origin: { t: "", p: "", g: "" },
  };
  for (const key of Object.keys(input_json)) {
    json[key] = input_json[key];
  }
  let string = JSON.stringify(json);
  let res = await invoke("add_item", { json: string });
  return res;
}

const items = await readTextFile("items.json", {
  baseDir: 11,
}).then((data) => {
  return JSON.parse(data);
});

const queries = {
  battlepass_status: "FortunaPass2_PremiumUnlock",
  battlepass_level: "FortunaPass2_SeasonXp",
  korolev: "FactionProgressionKorolev",
  ica: "FactionProgressionICA",
  osiris: "FactionProgressionOsiris",
  loadout: "LOADOUT",
  stash: "Inventory",
  currency: "Balance",
};

export { get_data, write_data, add_item, items, queries };
