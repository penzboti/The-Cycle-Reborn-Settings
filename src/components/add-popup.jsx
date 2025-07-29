import { Button } from "./ui/button";
import ItemSelect from "./item-select";
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
import { useEffect, useState } from "react";
import { toastsettings } from "./ui/sonner";
import { toast } from "sonner";

import { add_item, equip_item, items, itemData, edit_item } from "../scripts/module";

function initiate_item_add({ value, amount, durability, slot, reload, item }) {
  if (!items.some(item => item.id === value)) {
    toast.error("Not a valid item", toastsettings);
    return;
  }
  if (amount < 1) {
    toast.error("Not a valid amount", toastsettings);
    return;
  }

  console.log(arguments[0]);
  let json = {
    baseItemId: value,
    amount,
    durability,
  };

  if (typeof item !== "undefined") {
    let newitem = { ...item, ...json };
    edit_item(item[itemData.uuid], newitem).then(() => {
      toast("Successfully edited item", toastsettings);
      console.log("rerender here");
      if (typeof reload !== "undefined") reload();
    }).catch(() => {
      toast.error("Failed to edit item", toastsettings);
    });
    return;
  }

  if (typeof slot === "undefined") slot = "stash";

  add_item(json).then(data => {
    toast("Successfully added item", toastsettings);
    console.log(data);
    if (slot !== "stash") {
      equip_item(slot, data, false);
    }
    if (typeof reload !== "undefined") reload();
  }).catch(data => {
    toast.error("Failed to add item", toastsettings);
    console.log(data);
  });
}


function AddPopup({
  slot,
  reload,
  edit,
  ...props
}) {
  const [value, setValue] = useState("");
  const [amount, setAmount] = useState(1);
  const [durability, setDurability] = useState(-1);

  useEffect(() => {
    if (typeof edit !== "undefined") {
      setValue(edit[itemData.id]);
      setAmount(edit[itemData.amount]);
      setDurability(edit[itemData.durability]);
    }
  }, []);

  let text = typeof edit === "undefined" ? "Add Item" : "Edit Item";

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{text}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{text}</DialogTitle>
            <DialogDescription>
              in {slot}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <ItemSelect set={setValue} id={value} />
              <p>amount</p>
              <input type="number" value={amount} onChange={e => setAmount(e.target.valueAsNumber)} />
              <p>durability</p>
              <input type="number" value={durability} onChange={e => setDurability(e.target.valueAsNumber)} />
            </div></div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => { initiate_item_add({ value, amount, durability, slot, reload, item: edit }) }}>{text}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddPopup;
