import { write_kit } from "../scripts/module.js";

import { Button } from "../components/ui/button"; // was @/components/ui/button

function Kits() {
  return (
    <>
      <Button onClick={write_kit}>kit button</Button>
    </>
  )
}

export default Kits;
