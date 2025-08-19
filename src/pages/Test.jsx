import { Button } from "../components/ui/button"; // was @/components/ui/button

import Item from "../scripts/item-class";

function func() {
  let item = new Item({ durability: 10, slot: "helmet" });
  console.log(item.slot);
}

function Test() {
  return (
    <>
      <p>this page is a test site</p>
      <Button onClick={() => func()}>Press Me</Button>
    </>
  );
}

export default Test;
