import { Link } from "react-router-dom";

import { Button } from "../components/ui/button"; // was @/components/ui/button

function NotFound() {
  let loc = location.href;

  return (
    <>
      <p>this page is not found</p>
      <p>you are at: {loc}</p>
      <Button asChild variant="secondary">
        <Link to="/" style={{
          color: 'pink'
        }}>Link Back home</Link>
      </Button>
    </>
  );
}

export default NotFound;
