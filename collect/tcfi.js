import fs from "fs";
import * as cheerio from "cheerio";

const neededFiles = [
  "attachments.json",
  "backpacks.json",
  "consumables.json",
  "helmets.json",
  "keyCards.json",
  "materials.json",
  "shields.json",
  "weapons.json",
  // "items.json", // all items are present in the other categories;
  // in fact, there is one left out of it: PlayerDefault, which we dont need,
  // but now all the items are nicely categorized
];
const inPath = "./TCF-Information/";
const outPath = "./result/items.json";
const extraAdditionsPath = "./manual_add.json";
const extreRemovalsPath = "./manual_remove.json";

// TODO: heavy mining tool & scanner
// images to be loaded with asset server w/ tauri
let manualAdditions = JSON.parse(
  fs.readFileSync(extraAdditionsPath, {
    encoding: "utf8",
    flag: "r",
  }),
);

// removing season 3, and not-item (they were in the list) items.
// TODO: idk if tactical & resto gear are also s3 additions
let manualRemovals = JSON.parse(
  fs.readFileSync(extreRemovalsPath, {
    encoding: "utf8",
    flag: "r",
  }),
);

let itemList = [...manualAdditions];

function getImage(underscore, _id) {
  return new Promise((res, rej) => {
    console.log("getting", underscore, "=", _id);
    let url = `https://thecyclefrontier.wiki/wiki/File:${underscore}.png`;
    cheerio.fromURL(url).then(($) => {
      let links = $(".fullMedia > p > a");
      // $(links).each(function (i, link) {
      //   console.log($(link).text() + " -> " + $(link).attr("href"));
      // });
      let array = [];
      $(links).each(function (i, link) {
        let thing = $(link);
        array.push(thing);
      });
      for (const thing of array) {
        let text = thing.text();
        let href = "https:" + thing.attr("href");

        // redirects break this
        // if (!href.includes("cdn.wikimg.net") || !text.includes(underscore))
        //   continue;
        res(href);
      }
      rej("");
    });
  });
}

let folder = fs.readdirSync(inPath);
for (const fileName of neededFiles) {
  if (!folder.includes(fileName)) continue;
  console.log(fileName);
  let string = fs.readFileSync(inPath + fileName, {
    encoding: "utf8",
    flag: "r",
  });
  let object = JSON.parse(string);

  let type = fileName.replace("s.json", "").toLowerCase();

  // for (const key of [""]) {
  for (const key of Object.keys(object)) {
    let item = object[key];
    let name = item.inGameName;

    if (manualRemovals.includes(key) || manualRemovals.includes(name)) continue;

    let itemInfo = {};
    switch (type) {
      case "attachment":
        itemInfo = {
          type: item["type"],
        };
        break;
      // because there are no good images for ammo, i added them manually
      case "material":
        if (name.includes("ammo") || name.includes("Ammo")) continue;
        break;
      case "weapon":
        if (name.includes("Prototype") || name.includes("Mk.II")) continue;
        break;
    }

    let underscore = name.replaceAll(" ", "_");
    // console.log(key);
    let image = await getImage(underscore, key);

    itemList.push({
      id: key,
      name,
      type,
      rarity: item["rarity"],
      // currently, images are http links, but i could maybe download them, so that this works offline? does tc:r work offline?
      image,
      itemInfo,
    });
  }
}

fs.writeFileSync(outPath, JSON.stringify(itemList));
console.log(itemList.length);
