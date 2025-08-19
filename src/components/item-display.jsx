import { items, itemData } from "../scripts/module";
import { Button } from "./ui/button";

import AddPopup from "./add-popup";

function ItemDisplay({
  item,
  slot,
  reload,
  ...props
}) {
  let uuid = item[itemData.uuid];
  let elem = items.find(elem => elem.id == item[itemData.id]);
  if (typeof elem === "undefined") console.log("not a real item", item, slot);
  async function remove_fn() {
    if (slot !== "stash") await item.deequip(true);
    else await item.remove();
    if (typeof reload !== "undefined") reload();
  }
  return (
    <div
      key={uuid}
      {...props}
    >
      <img src={elem.image} />
      <p>{item[itemData.id]}</p>
      <p>{elem.name}</p>
      <p>amount: {item[itemData.amount]}</p>
      <p>durability: {item[itemData.durability]}</p>
      <Button variant="destructive" onClick={remove_fn}>Remove</Button>
      <AddPopup slot={slot} edit={item} reload={reload} />
    </div>
  );
}

export default ItemDisplay;
