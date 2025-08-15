import { invoke, convertFileSrc } from "@tauri-apps/api/core";
import { readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { resolveResource } from "@tauri-apps/api/path";

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

async function equip_item(slot, id, remove) {
  if (typeof remove === "undefined") remove = false;
  let res = await invoke("equip_item", { slot, id, remove });
  console.log(res);
  if (res === false) {
    return Promise.reject();
  } else {
    return Promise.resolve();
  }
}

function edit_item(id, item) {
  return new Promise((resolve, reject) => {
    remove_item(id)
      .then(() => {
        if (item[itemData.uuid] !== id) item[itemData.uuid] = id;
        add_item(item)
          .then(() => {
            return resolve();
          })
          .catch(() => {
            // Q: readd the item?
            return reject();
          });
      })
      .catch(() => {
        return reject();
      });
  });
}

const items = await readTextFile("items.json", {
  baseDir: BaseDirectory.Resource,
})
  .then((data) => {
    return JSON.parse(data);
  })
  .then((data) => {
    data.map(async (item) => {
      let image = item.image;
      image = await resolveResource(image.replace("$RESOURCE/", "")); // Q: remove the resource prefix?
      image = convertFileSrc(image);
      item.image = image;
      return item;
    });
    return data;
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
  contracts: "ContractsOneTimeCompleted",
};

const itemData = {
  uuid: "itemId",
  id: "baseItemId",
  amount: "amount",
  durability: "durability",
  attachments: "modData", // TODO: i have not used this yet
  perks: "rolledPerks",
};

async function read_kit() {
  return new Promise((resolve, reject) => {
    readTextFile("kits.json", {
      baseDir: BaseDirectory.AppData,
    }).then(data => {
        resolve(JSON.parse(data));
      }).catch( () => {
        write_kit().then(() => {
          read_kit().then(data => {
            resolve(data);
          }).catch(() => reject());
        }).catch(() => reject());
      });
  });
}

function write_kit(kits) {
  return new Promise((resolve, reject) => {
    if (typeof kits === "undefined") kits = {"kitlist":[]};
    let string = JSON.stringify(kits);
    invoke("write_kit_data", { write: string }).then( data => {
      return data ? resolve() : reject();
    });
  });
}

// TODO: durability map (excluding keys, i cant be bothered)

export {
  get_data,
  write_data,
  add_item,
  remove_item,
  equip_item,
  edit_item,
  read_kit,
  write_kit,
  items,
  queries,
  itemData,
};
