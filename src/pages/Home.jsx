import { Button } from "../components/ui/button";
import ItemSelect from "../components/item-select";
import { useState } from "react";
import { add_item, items } from "../scripts/module";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

function initiate_item_add(value, amount) {
  if (!items.some(item => item.id === value)) {
    toast.error("Not a valid item", {
      duration: 2000,
      position: "bottom-left",
      cancel: {
        label: 'Close',
      },
    });
    return;
  }
  if (amount < 1) {
    toast.error("Not a valid amount", {
      duration: 2000,
      position: "bottom-left",
      cancel: {
        label: 'Close',
      },
    });
    return;
  }
  console.log(value, amount);
  let json = {
    baseItemId: value,
  };
  add_item(json).then(data => {
    toast("Successfully added item", {
      duration: 2000,
      position: "bottom-left",
      cancel: {
        label: 'Close',
      },
    });
    console.log(data);
  }).catch(data => {
    toast.error("Failed to add item", {
      duration: 2000,
      position: "bottom-left",
      cancel: {
        label: 'Close',
      },
    });
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
      <Button onClick={() => { initiate_item_add(value, amount) }}>Add</Button>
      <Toaster />
      <ItemSelect set={setValue} />
      <p>amount</p>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <p>durability</p>
      <input type="number" value={durability} onChange={e => setDurability(e.target.value)} />
    </>
  );
}

export default Home;
