import {
  get_data,
  write_data,
  add_item,
  items,
  queries,
} from "./scripts/module.js";
const { convertFileSrc } = window.__TAURI__.core;
const { resolveResource } = window.__TAURI__.path;
// debug
const { invoke } = window.__TAURI__.core;

// will remove this later
function spawnNode(id, text, imgsrc) {
  let node = document.createElement("div");
  node.innerText = text;
  if (typeof imgsrc !== "undefined") {
    node.innerHTML = `<img src="${imgsrc}"><p>${text}</p>`;
  }
  node.classList.add("item");
  document.getElementById(id).appendChild(node);
}

function get_stash() {
  document.getElementById("stash").innerHTML = "";
  let data = get_data(queries.stash);
  data.then((res) => {
    res.forEach((e) => {
      spawnNode("stash", JSON.stringify(e));
    });
  });
}

function get_loadout() {
  document.getElementById("inventory").innerHTML = "";
  let data = get_data(queries.loadout);
  data.then((res) => {
    let nodes = {
      shield: res["shield"],
      helmet: res["helmet"],
      bag: res["bag"],
      weaponOne: res["weaponOne"],
      weaponTwo: res["weaponTwo"],

      bagItems: JSON.stringify(JSON.parse(res["bagItemsAsJsonStr"])),
      safeItems: JSON.stringify(JSON.parse(res["safeItemsAsJsonStr"])),
    };
    let text = {
      shield: "Shield: ",
      helmet: "Helmet: ",
      bag: "Bag: ",
      weaponOne: "Weapon 1: ",
      weaponTwo: "Weapon 2: ",
      bagItems: "Bag Items: ",
      safeItems: "Safe Pockets: ",
    };
    Object.keys(nodes).forEach((key) => {
      spawnNode("inventory", text[key] + nodes[key]);
    });
  });
}

function change_bp() {
  let value = "false";
  write_data(queries.battlepass_status, value)
    .then(() => alert("changed battlepass"))
    .catch(() => alert("error when changing battlepass"));
}

async function list_items(id) {
  document.getElementById(id).innerHTML = "";
  for (const e of items) {
    let image = e.image;
    if (image.includes("$RESOURCE")) {
      image = await convertFileSrc(
        await resolveResource(image.replace("$RESOURCE/", "")),
      );
    }

    spawnNode(id, `${e.name}: ${e.id} ${e.type}`, image);
  }
}

async function get_settings() {
  document.getElementById("settings").innerHTML = "";
  const needed_queries = [
    "currency",
    "battlepass_status",
    "battlepass_level",
    "korolev",
    "ica",
    "osiris",
  ];
  let object = {};
  for (const query of needed_queries) {
    let res = await get_data(queries[query]);
    object[query] = res;
    if (query === "currency") {
      const balance = res;

      spawnNode("settings", `Aurum: ${res.AU}`);
      spawnNode("settings", `K-Marks: ${res.SC}`);
      spawnNode("settings", `Insurance tokens: ${res.IN}`);
      continue;
    }
    if (res > 100000) res = "definetly maxed out";
    else res = `${res} xp`;
    spawnNode("settings", `${query}: ${res}`);
  }
  // return object;
}

const get_items = [{ baseItemId: "WP_A_Pistol_Bullet_01", amount: 1, durability: -1 }];

function debug_items() {
  for (const item of get_items) {
    add_item(item);
  }
}

// allow modules to load to global scope
// that means being able to use it in html & the javascript console
const exports = [
  list_items,
  // change_bp,
  get_stash,
  get_loadout,
  // items,
  add_item,
  debug_items,
];
for (const fn of exports) {
  globalThis[fn.name] = fn;
}
// debug
// globalThis.item = item;

export { get_loadout, get_stash, get_settings, add_item };
