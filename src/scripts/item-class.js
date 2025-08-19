import { add_item, remove_item, equip_item, edit_item } from "./module.js";
import { itemData } from "./module.js";

import { toastsettings } from "../components/ui/sonner";
import { toast } from "sonner";

const toastErrorSettings = { ...toastsettings, duration: 15 * 1000 };

// NOTE: this should not return anything, but rather handle everything and notify the user with toasts.
class Item {
  uploaded = false;
  slot = "";

  // item data
  itemId = "UUIDV4";
  baseItemId = "";
  amount = 1;
  durability = -1;
  rolledPerks = [];
  modData = { m: [] };
  // these ones we will probably never use
  primaryVanityId = 0;
  secondaryVanityId = 0;
  insurance = "";
  insuranceOwnerPlayfabId = "";
  insuredAttachmentId = "";
  origin = { t: "", p: "", g: "" };

  constructor(json) {
    let item = { ...this.item, ...json };
    for (const key of Object.keys(item)) {
      this[key] = item[key];
    }

    if (this.itemId !== "UUIDV4") this.uploaded = true;
    if (typeof item.uploaded !== "undefined") this.uploaded = item.uploaded;
  }

  get uuid() {
    return this.itemId;
  }
  set uuid(uuid) {
    this.itemId = uuid;
  }
  get id() {
    return this.baseItemId;
  }
  get attachments() {
    return this.modData;
  }
  get perks() {
    return this.rolledPerks;
  }

  get string() {
    return JSON.stringify(this.item);
  }
  get item() {
    // this is to leave out unwanted fields
    let dataKeys = [
      "itemId",
      "baseItemId",
      "amount",
      "durability",
      "rolledPerks",
      "modData",
      "primaryVanityId",
      "secondaryVanityId",
      "insurance",
      "insuranceOwnerPlayfabId",
      "insuredAttachmentId",
      "origin",
    ];
    let item = {};
    dataKeys.forEach((key) => {
      item[key] = this[key];
    });
    return item;
  }
  get itemData() {
    // presumably this is not needed
    let item = this.item;
    let obj = Object.keys(itemData).map((key) => {
      return item[itemData[key]];
    });
    return obj;
  }

  upload() {
    if (this.uploaded) return Promise.reject("item is already uploaded");
    let res = add_item(this)
      .then((uuid) => {
        this.uploaded = true;
        this.uuid = uuid;
        console.log("uplaoded", this.uploaded);
        toast("Successfully added item", toastsettings);
      })
      .catch((msg) =>
        toast.error("Failed to add item; reason: " + msg, toastErrorSettings),
      );
    return res;
  }
  remove() {
    if (!this.uploaded) return Promise.reject("this is not an existing item");
    let res = remove_item(this.uuid)
      .then(() => toast("Successfully removed item", toastsettings))
      .catch((msg) =>
        toast.error(
          "Failed to remove item; reason: " + msg,
          toastErrorSettings,
        ),
      );
    return res;
  }
  async equip(slot) {
    console.log(slot, this);
    if (!this.uploaded) await this.upload();
    console.log("after uploaded", this.uploaded);
    if (typeof slot === "undefined" || slot === "stash" || slot === "") {
      toast.error("couldn't equip item; slot issue", toastErrorSettings);
      return Promise.reject("cant equip the item into the slot: " + slot);
    }
    this.slot = slot;
    let res = equip_item(slot, this.uuid)
      .then(() => toast("Successfully equipped item", toastsettings))
      .catch((msg) =>
        toast.error("Failed to equip item; reason: " + msg, toastErrorSettings),
      );
    return res;
  }
  deequip() {
    // if (typeof del !== "undefined") del = false;
    let res = equip_item(this.slot, this.uuid, true)
      .then(() => toast("Successfully deequipped item", toastsettings))
      .catch((msg) =>
        toast.error(
          "Failed to deequip item; reason: " + msg,
          toastErrorSettings,
        ),
      );
    // if (del) this.remove();
    return res;
  }
  edit() {
    // you should envoke it on the new item
    if (this.uploaded) {
      toast.error("couldn't edit item; upload issue", toastErrorSettings);
      return Promise.reject("invoke edit on the new item");
    }
    let res = edit_item(this.uuid, this)
      .then(() => toast("Successfully edited item", toastsettings))
      .catch((msg) =>
        toast.error("Failed to edit item; reason: " + msg, toastErrorSettings),
      );
    return res;
  }
}

export default Item;
