const { invoke } = window.__TAURI__.core;
const body = document.querySelector("body");

async function get_data(data) {
  let res = await invoke("get_data", { data });
  let json = await JSON.parse(res);
  return Promise.resolve(json);
}

function spawnNode(text) {
  let node = document.createElement("p");
  node.innerText = text;
  inventory.appendChild(node);
}

function get_stash() {
    inventory.innerHTML="";
  let data = get_data("Inventory");
  data.then((res) => {
    res.forEach((e) => {
      spawnNode(JSON.stringify(e));
    });
  });
}

function get_loadout() {
    inventory.innerHTML="";
  let data = get_data("LOADOUT");
  data.then((res) => {
    const shield = res["shield"];
    const helmet = res["helmet"];
    const bag = res["bag"];
    const weaponOne = res["weaponOne"];
    const weaponTwo = res["weaponTwo"];

    const bagItems = JSON.parse(res["bagItemsAsJsonStr"]);
    const safeItems = JSON.parse(res["safeItemsAsJsonStr"]);

    spawnNode("shield: " + shield);
    spawnNode("helmet: " + helmet);
    spawnNode("bag: " + bag);
    spawnNode("weaponOne: " + weaponOne);
    spawnNode("weaponTwo: " + weaponTwo);
    spawnNode("Bag Items: " + JSON.stringify(bagItems));
    spawnNode("Safe Pockets: " + JSON.stringify(safeItems));
  });
}
