import { invoke, convertFileSrc } from "@tauri-apps/api/core";
import { readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { resolveResource } from "@tauri-apps/api/path";

async function get_data(key) {
  return new Promise((resolve, reject) => {
    invoke("get_data", { key })
      .then((data) => JSON.parse(data))
      .then((data) => resolve(data))
      .catch((msg) => reject(msg));
  });
}

async function write_data(key, value) {
  return new Promise((resolve, reject) => {
    invoke("write_data", { key, value })
      .then(() => resolve())
      .catch((msg) => reject(msg));
  });
}

async function add_item(item) {
  return new Promise((resolve, reject) => {
    let string = item.string;
    invoke("add_item", { json: string })
      .then((id) => resolve(id))
      .catch((msg) => reject(msg));
  });
}

async function remove_item(id) {
  return new Promise((resolve, reject) => {
    invoke("remove_item", { id })
      .then(() => resolve())
      .catch((msg) => reject(msg));
  });
}

async function equip_item(slot, id, remove) {
  return new Promise((resolve, reject) => {
    console.log(0, arguments);
    if (typeof remove === "undefined") remove = false;
    invoke("equip_item", { slot, id, remove })
      .then(() => resolve())
      .catch((msg) => reject(msg));
  });
}

function edit_item(id, item) {
  return new Promise((resolve, reject) => {
    remove_item(id)
      .then(() => {
        if (item.uuid !== id) item.uuid = id;
        add_item(item)
          .then(() => resolve())
          .catch((msg) => reject(msg));
      })
      .catch((msg) => reject(msg));
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
      image = await resolveResource(image.replace("$RESOURCE/", "")); // Q: remove the resource prefix entirely?
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
  attachments: "modData", // TODO: i have not used these yet
  perks: "rolledPerks",
};

// NOTE: not properly error-handled
async function read_kit() {
  return new Promise((resolve, reject) => {
    readTextFile("kits.json", {
      baseDir: BaseDirectory.AppData,
    })
      .then((data) => resolve(JSON.parse(data)))
      // the file is not created; we create it
      .catch(() => {
        write_kit()
          .then(() => {
            read_kit()
              .then((data) => {
                resolve(data);
              })
              .catch(() => reject());
          })
          .catch(() => reject());
      });
  });
}

function write_kit(kits) {
  return new Promise((resolve, reject) => {
    if (typeof kits === "undefined") kits = { kitlist: [] };
    let string = JSON.stringify(kits);
    invoke("write_kit_data", { write: string }).then((data) => {
      data ? resolve() : reject();
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
