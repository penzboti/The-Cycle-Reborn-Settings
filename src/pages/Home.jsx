import { Button } from "../components/ui/button";
import ItemSelect from "../components/item-select";
import { useState } from "react";
import { add_item, items } from "../scripts/module";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

const toastsettings = {
  duration: 2000,
  position: "bottom-left",
  cancel: {
    label: 'Close',
  },
}

function initiate_item_add(value, amount, durability) {
  if (!items.some(item => item.id === value)) {
    toast.error("Not a valid item", toastsettings);
    return;
  }
  if (amount < 1) {
    toast.error("Not a valid amount", toastsettings);
    return;
  }

  console.log(value, amount, durability);
  let json = {
    baseItemId: value,
    amount,
    durability,
  };
  add_item(json).then(data => {
    toast("Successfully added item", toastsettings);
    console.log(data);
  }).catch(data => {
    toast.error("Failed to add item", toastsettings);
    console.log(data);
  });
}

function Home() {
  const [value, setValue] = useState("");
  const [amount, setAmount] = useState(1);
  const [durability, setDurability] = useState(-1);

  return (
    <>
      <h1>homepage</h1>
      <Button onClick={() => { initiate_item_add(value, amount, durability) }}>Add</Button>
      <Toaster />
      <ItemSelect set={setValue} />
      <p>amount</p>
      <input type="number" value={amount} onChange={e => setAmount(e.target.valueAsNumber)} />
      <p>durability</p>
      <input type="number" value={durability} onChange={e => setDurability(e.target.valueAsNumber)} />
    </>
  );
}

export default Home;
