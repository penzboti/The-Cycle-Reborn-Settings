import { items, itemData } from "../scripts/module";

function Item({
  item,
  ...props
}) {
  let elem = items.find(elem => elem.id == item[itemData.id]);
  if (typeof elem === "undefined") console.log("not a real item", item);
  return (
    <div
      key={item[itemData.uuid]}
      {...props}
    >
      <img src={elem.image} />
      <p>{item[itemData.id]}</p>
      <p>{elem.name}</p>
      <p>amount: {item[itemData.amount]}</p>
      <p>{item[itemData.durability]}</p>
    </div>
  );
}

export default Item;
