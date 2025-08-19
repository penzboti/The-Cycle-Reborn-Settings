import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import { items, itemData } from "../scripts/module";
import Item from "../scripts/item-class";

import ItemSelect from "./item-select";

async function initiate_item_add({ json, slot, reload, item }) {
  if (!items.some(item => item.id === json.value)) {
    toast.error("Not a valid item", toastsettings);
    return;
  }
  if (json.amount < 1) {
    toast.error("Not a valid amount", toastsettings);
    return;
  }

  json = {
    baseItemId: json.value,
    amount: json.amount,
    durability: json.durability,
  };

  if (typeof item !== "undefined") {
    let newitem = new Item({ ...item.item, ...json });
    newitem.uploaded = false;
    await newitem.edit();
    if (typeof reload !== "undefined") reload();
    return;
  }

  if (typeof item === "undefined") {
    item = new Item(json);
  }
  if (typeof slot === "undefined" || slot === "stash") await item.upload();
  else await item.equip(slot);

  if (typeof reload !== "undefined") reload();
}


function AddPopup({
  slot,
  reload,
  edit,
  ...props
}) {
  const [json, setJson] = useState({
    value: "",
    amount: 1,
    durability: -1,
  });
  let setValue = useCallback((value) => { setJson({ ...json, value }); });

  useEffect(() => {
    if (typeof edit !== "undefined") {
      let value = edit[itemData.id];
      let amount = edit[itemData.amount];
      let durability = edit[itemData.durability];

      setJson({ value, amount, durability });
    }
  }, []);

  let bool = typeof edit === "undefined";
  let text = bool ? "Add Item" : "Edit Item";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{text}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{text}</DialogTitle>
          <DialogDescription>
            in{bool ? "to" : ""} {slot}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <ItemSelect set={setValue} id={json.value} />
            <p>amount</p>
            <input type="number" value={json.amount} onChange={e => setJson({ ...json, amount: e.target.valueAsNumber })} />
            <p>durability</p>
            <input type="number" value={json.durability} onChange={e => setJson({ ...json, durability: e.target.valueAsNumber })} />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => { initiate_item_add({ json, slot, reload, item: edit }) }}>{text}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddPopup;
