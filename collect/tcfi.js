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
// images to be loaded with asset server w/ tauri (its done)
// now you just have to download all the images
const manualAdditions = JSON.parse(
  fs.readFileSync(extraAdditionsPath, {
    encoding: "utf8",
    flag: "r",
  }),
);

// removing season 3, and not-item (they were in the list) items.
// TODO: idk if tactical & resto gear are also s3 additions
const manualRemovals = JSON.parse(
  fs.readFileSync(extreRemovalsPath, {
    encoding: "utf8",
    flag: "r",
  }),
);

// all downloaded images
const imageItems = fs
  .readdirSync("../images/")
  .map((e) => e.replace(".png", ""));

const download_argument = "--download-images";
const argument = process.argv[2];

let itemList = [...manualAdditions];

function getImageUrl(underscore, _id) {
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

  // for (const id of [""]) {
  for (const id of Object.keys(object)) {
    const item = object[id];
    const name = item.inGameName;

    if (manualRemovals.includes(id) || manualRemovals.includes(name)) continue;

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
    let image = "";
    // if its downloaded already
    if (imageItems.includes(id)) {
      image = `$RESOURCE/images/${key}.png`;
    } else {
      image = await getImageUrl(underscore, id);
      if (argument === download_argument) {
        // download_image(image);
      }
    }

    itemList.push({
      id,
      name,
      type,
      rarity: item["rarity"],
      // i still don't know if tc:r works offline or not
      image,
      itemInfo,
    });
  }
}

fs.writeFileSync(outPath, JSON.stringify(itemList));
console.log(itemList.length);
