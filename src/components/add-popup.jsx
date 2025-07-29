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
import { useState } from "react";
import { add_item, equip_item, items } from "../scripts/module";
import { toastsettings } from "./ui/sonner";
import { toast } from "sonner";

function initiate_item_add({ value, amount, durability, slot, reload }) {
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
  add_item(json).then(data => {
    toast("Successfully added item", toastsettings);
    console.log(data);
    if (slot !== "stash" && typeof slot !== "undefined") {
      console.log("helo");
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
  ...props
}) {
  const [value, setValue] = useState("");
  const [amount, setAmount] = useState(1);
  const [durability, setDurability] = useState(-1);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Item</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              into {slot}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <ItemSelect set={setValue} />
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
              <Button onClick={() => { initiate_item_add({ value, amount, durability, slot, reload }) }}>Add</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddPopup;
