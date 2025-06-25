import { Link } from "react-router-dom";

import { Separator } from "../components/ui/separator"; // was @/components/ui/separator
import { Button } from "../components/ui/button"; // was @/components/ui/button

import ItemSelect from "../components/item-select";

function Test() {
  let loc = location.href;

  return (
    <>
      <Button asChild variant="secondary">
        <Link to="/" style={{
          color: 'pink'
        }}>Link Back home</Link>
      </Button>
      <h1>this is a test site</h1>
      <p>you are at: {loc}</p>

      <Separator />

      <ItemSelect />
      <p>end</p>
    </>
  );
}

export default Test;
