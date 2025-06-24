import { useState } from "react";
import { Link } from "react-router-dom";
import { items } from "../scripts/module";

import { Separator } from "../components/ui/separator" // was @/components/ui/separator

function Test() {
  let loc = location.href;
  let [item_element, updateElement] = useState(<></>);

  function displayItems() {
    updateElement(items.map(item => (
      <p
        key={item.id}
      >
        <img src={item.image} className="w-20" />
        {item.name}
      </p>
    )));
  }

  return (
    <>
      <Link to="/" style={{
        color: 'pink'
      }}>Link Back home</Link>
      <h1>this is a test site</h1>
      <p>you are at: {loc}</p>

      <Separator />

      <button onClick={displayItems}>Items</button>
      {item_element}
      <p>end</p>
    </>
  );
}

export default Test;
