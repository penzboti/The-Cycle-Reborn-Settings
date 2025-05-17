import fs from "fs";
import * as cheerio from "cheerio";
import * as client from "https";

// uses the github repo TCF-Wiki/TCF-Information
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

// all downloaded images
const imageItems = fs
  .readdirSync("../images/")
  .map((e) => e.replace(".png", ""));

// if you dont add the download argument, it uses the links if the file is not present
const download_argument = "--download-images";
const argument = process.argv[2];
if (argument === download_argument) {
  console.log("With downloading images.");
} else {
  console.log("Without downloading images!");
}

const inPath = "./TCF-Information/";
const outPath = "./result/items.json";

const extraAdditionsPath = "./manual_add.json";
const manualAdditions = JSON.parse(
  fs.readFileSync(extraAdditionsPath, {
    encoding: "utf8",
    flag: "r",
  }),
);
const errorImage = "$RESOURCE/images/jeff.png";
for (let item of manualAdditions) {
  const id = item.id;
  if (item.image === "png") {
    item.image = `$RESOURCE/images/${id}.png`;
  }
  if (item.image === "") {
    item.image = errorImage;
  }
}
for (let image of fs.readdirSync("./manual_images/")) {
  if (imageItems.includes(image.replace(".png", ""))) continue;
  fs.cpSync(`./manual_images/${image}`, `../images/${image}`);
}

const extreRemovalsPath = "./manual_remove.json";
// removing season 3, and not-item (they were in the list) entries.
// side note: tactical & resto gear are not s3 additions
const manualRemovals = JSON.parse(
  fs.readFileSync(extreRemovalsPath, {
    encoding: "utf8",
    flag: "r",
  }),
);

let itemList = [...manualAdditions];

// https://scrapingant.com/blog/download-image-javascript
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    client
      .get(url, (res) => {
        res.pipe(fs.createWriteStream(filepath));
      })
      .on("error", (data) => reject(data))
      .once("close", () => resolve(filepath));
  });
}

// https://stackoverflow.com/questions/15343292/extract-all-hyperlinks-from-external-website-using-node-js-and-request
function getImageUrl(underscore) {
  return new Promise((resolve, reject) => {
    console.log("getting image url");
    let url = `https://thecyclefrontier.wiki/wiki/File:${underscore}.png`;
    cheerio
      .fromURL(url)
      .then(($) => {
        let links = $(".fullMedia > p > a");
        // printing all links (DEBUG)
        // $(links).each(function (_, link) {
        //   console.log($(link).text() + " -> " + $(link).attr("href"));
        // });
        let array = [];
        $(links).each(function (_, link) {
          let thing = $(link);
          array.push(thing);
        });
        for (const thing of array) {
          let href = "https:" + thing.attr("href");
          resolve(href);
        }
        if (array.length === 0) reject();
      })
      .catch(() => reject());
  });
}

const folder = fs.readdirSync(inPath);
for (const fileName of neededFiles) {
  if (!folder.includes(fileName)) continue;
  console.log("\n", fileName);
  let string = fs.readFileSync(inPath + fileName, {
    encoding: "utf8",
    flag: "r",
  });
  const object = JSON.parse(string);

  const type = fileName.replace("s.json", "").toLowerCase();

  for (const id of Object.keys(object)) {
    const item = object[id];
    const name = item.inGameName;
    const rarity = item["rarity"];
    let itemInfo = {};

    // removing unnecessary items
    if (manualRemovals.includes(id) || manualRemovals.includes(name)) continue;
    manualRemovals
      .filter((e) => e.includes("*"))
      .forEach((e) => {
        let removeText = e.replace("*", "");
        if (id.includes(removeText) || name.includes(removeText)) {
          // i think its awful i had to do it this way
          itemInfo.skip = "true";
        }
      });
    if (itemInfo.skip) continue;

    // then all items not removed are being worked on
    console.log(`${id} \t\t ${name}`);

    switch (type) {
      // adding itemInfo
      case "attachment":
        itemInfo = {
          type: item["type"],
        };
        break;
    }

    const underscore = name.replaceAll(" ", "_");
    let image = imageItems.includes(id)
      ? `$RESOURCE/images/${id}.png`
      : await getImageUrl(underscore)
          .then((data) => {
            return data;
          })
          .catch(() => {
            return errorImage;
          });
    if (argument === download_argument);
    {
      if (image.includes("$RESOURCE")) {
        // console.log("image is already downloaded");
      } else {
        console.log(image);
        await downloadImage(image, `../images/${id}.png`)
          .then((data) => {
            image = data.replace("..", "$RESOURCE");
            console.log("downloaded image");
          })
          .catch(() => {
            image = errorImage;
            console.log("error downloading image");
          });
      }
    }

    itemList.push({
      id,
      name,
      type,
      rarity,
      // i still don't know if tc:r works offline or not
      image,
      itemInfo,
    });
  }
}

fs.writeFileSync(outPath, JSON.stringify(itemList));
console.log(itemList.length);
