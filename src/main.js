import { get_data, write_data, items } from "./module.js";
const { convertFileSrc } = window.__TAURI__.core;
const { resolveResource } = window.__TAURI__.path;

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
  stash.innerHTML = "";
  let data = get_data("Inventory");
  data.then((res) => {
    res.forEach((e) => {
      spawnNode("stash", JSON.stringify(e));
    });
  });
}

function get_loadout() {
  inventory.innerHTML = "";
  let data = get_data("LOADOUT");
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
  let key = "FortunaPass2_PremiumUnlock";
  let value = "false";
  write_data(key, value)
    .then(() => alert("changed battlepass"))
    .catch(() => alert("error when changing battlepass"));
}

function reset_children() {
  const pages = ["inventory", "stash", "items"];
  pages.forEach((key) => {
    document.getElementById(key).innerHTML = "";
  });
}

async function list_items() {
  document.getElementById("items").innerHTML = "";
  // items.forEach((e) => {
  for (const e of items) {
    let image = e.image;
    if (image.includes("$RESOURCE")) {
      image = await convertFileSrc(
        await resolveResource(image.replace("$RESOURCE/", "")),
      );
    }

    spawnNode("items", `${e.name}: ${e.id} ${e.type}`, image);
  }
}

// allow modules to load to global scope
// that means being able to use it in html & the javascript console
const exports = [
  list_items,
  change_bp,
  get_stash,
  get_loadout,
  reset_children,
  // items,
];
for (const fn of exports) {
  globalThis[fn.name] = fn;
}
