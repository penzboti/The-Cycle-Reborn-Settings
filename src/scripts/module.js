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
  // TODO: expeirment with removing some of these, and see if they work
  let json = {
    itemId: "UUIDV4",
    baseItemId: "",
    amount: 1,
    durability: -1,
    rolledPerks: [],
    modData: { m: [] },
    // these ones we will probably never use
    primaryVanityId: 0,
    secondaryVanityId: 0,
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
  if (res[0] === false) {
    return Promise.reject(res[1]);
  } else {
    return Promise.resolve(res[1]);
  }
}

async function remove_item(id) {
  let res = await invoke("remove_item", { id });
  if (res === false) {
    return Promise.reject();
  } else {
    return Promise.resolve();
  }
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

// TODO: durability map (excluding keys, i cant be bothered)

export { get_data, write_data, add_item, remove_item, items, queries };
