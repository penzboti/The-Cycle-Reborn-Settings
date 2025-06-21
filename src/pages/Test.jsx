import { Link } from "react-router-dom";
function Test() {
  let loc = location.href;
  return (
    <>
      <Link to="/" style={{
        color: 'pink'
      }}>Back home</Link>
      <h1>test site</h1>
      <p>{loc}</p>
    </>
  );
}

export default Test;
