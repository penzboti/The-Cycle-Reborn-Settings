import { Button } from "../components/ui/button"; // was @/components/ui/button
import { Toaster } from "../components/ui/sonner"; // was @/components/ui/sonner
import { toast } from "sonner";

function RefreshButton({
  fn,
  ...props
}) {

  // it just occured to me that if it fails it will still show up refreshed.
  // that not good
  // TODO: refresh button

  return (<>
    <Toaster />
    <Button
      variant="secondary"
      onClick={() => {
        fn();
        toast("Refreshed", {
          duration: 2000,
          position: "bottom-left",
          cancel: {
            label: 'Close',
          },
        });
      }}
      {...props}
    >Refresh</Button>
  </>
  );
}

export default RefreshButton;

