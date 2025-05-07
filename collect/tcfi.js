import fs from "fs";

const neededFiles = [
  "attachments.json",
  "backpacks.json",
  "consumables.json",
  "helmets.json",
  // "items.json", // all items are present in the other categories;
  // in fact, they even have one more: PlayerDefault
  "keyCards.json",
  "materials.json",
  "shields.json",
  "weapons.json",
];
const inPath = "./TCF-Information/";
const outPath = "./result/items.json";

let itemList = [];

let folder = fs.readdirSync(inPath);
neededFiles.forEach((fileName) => {
  if (!folder.includes(fileName)) return;
  console.log(fileName);
  let string = fs.readFileSync(inPath + fileName, {
    encoding: "utf8",
    flag: "r",
  });
  let object = JSON.parse(string);

  let type = fileName.replace(".json", "");

  Object.keys(object).forEach((key) => {
    let item = object[key];

    let itemInfo = {};
    switch (type) {
      case "attachments":
        itemInfo["type"] = item["type"];
        break;
    }

    itemList.push({
      id: key,
      name: item.inGameName,
      type,
      itemInfo,
    });
  });
});

fs.writeFileSync(outPath, JSON.stringify(itemList));
console.log(itemList.length);
