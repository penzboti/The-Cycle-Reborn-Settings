import { Button } from "../components/ui/button"; // was @/components/ui/button
import { Toaster } from "../components/ui/sonner"; // was @/components/ui/sonner
import { toast } from "sonner";

function RefreshButton({
  fn,
  ...props
}) {

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

