const { invoke } = window.__TAURI__.core;
const body = document.querySelector("body");

let items = [];
invoke("get_item_list").then((data) => (items = JSON.parse(data)));

async function get_data(key) {
  let res = await invoke("get_data", { key });
  let json = await JSON.parse(res);
  return Promise.resolve(json);
}

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

async function change_bp() {
  let res = await invoke("write_data", {
    key: "FortunaPass2_PremiumUnlock",
    value: "false",
  });
  console.log(res);
  if (res === false) {
    console.log("error when writing");
  }
}

function reset_children() {
  const pages = ["inventory", "stash", "items"];
  pages.forEach((key) => {
    document.getElementById(key).innerHTML = "";
  });
}

function list_items() {
  document.getElementById("items").innerHTML = "";
  items.forEach((e) => {
    spawnNode("items", `${e.name}: ${e.id} ${e.type}`, e.image);
  });
}
