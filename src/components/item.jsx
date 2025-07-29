import { items, itemData } from "../scripts/module";
import { Button } from "../components/ui/button";
import { equip_item, remove_item } from "../scripts/module.js";

function Item({
  item,
  slot,
  reload,
  ...props
}) {
  let uuid = item[itemData.uuid];
  let elem = items.find(elem => elem.id == item[itemData.id]);
  if (typeof elem === "undefined") console.log("not a real item", item);
  let fn = () => {
    console.log("equip", slot);
    if (slot !== "stash") equip_item(slot, uuid, true);
    remove_item(uuid);
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
      <Button variant="destructive" onClick={fn}>Remove</Button>
    </div>
  );
}

export default Item;
