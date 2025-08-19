import { add_item, remove_item, equip_item, edit_item } from "./module.js";
import { itemData } from "./module.js";

import { toast } from "sonner";

// NOTE: this should not return anything, but rather handle everything and notify the user with toasts.
class Item {
  uploaded = false;

  constructor(json) {
    let allData = {
      // TODO: expeirment with removing some of these, and see if they work
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
    let item = { ...allData, ...json };
    for (const key of Object.keys(item)) {
      this[key] = item[key];
    }

    if (this.itemId !== "UUIDV4") this.uploaded = true;
    if (typeof item.uploaded !== "undefined") this.uploaded = item.uploaded;
  }

  get string() {
    return JSON.stringify(this.item);
  }
  get item() {
    let dataKeys = [
      itemId,
      baseItemId,
      amount,
      durability,
      rolledPerks,
      modData,
      primaryVanityId,
      secondaryVanityId,
      insurance,
      insuranceOwnerPlayfabId,
      insuredAttachmentId,
      origin
    ];
    let item = {};
    dataKeys.forEach( key => {
      item[key] = this[key];
    });
    return item;
  }
  get itemData() {
    let item = this.item;
    let obj = Object.keys(itemData).map(key => {
      return item[itemData[key]];
    })
    return obj;
  }

  upload() {
    if (this.uploaded) return Promise.reject("item is already uploaded");
    let res = add_item(this); // this might not wait for the promise.*; so new promise((res, rej), {}) then
    console.log("inner",res);
    res.then(() => this.uploaded = true);
    console.log("inner",this.uploaded);
    return res;
  }
  remove() {
    if (!this.uploaded) return Promise.reject("this is not an existing item");
    let res = remove_item(this.id);
    return res;
  }
  equip(slot, remove) {
    if (!this.uploaded && remove) return Promise.reject("Can't equip an item that has not been uploaded (yet)"); // TODO: handle uploading here
    let res = equip_item(slot, this.id, remove);
    return res;
  }
  edit() {
    // you should envoke it on the new item
    if (this.uploaded) return Promise.reject("invoke edit on the new item");
    let res = edit_item(this.id, this.item);
    return res;
  }
}

export default Item;
