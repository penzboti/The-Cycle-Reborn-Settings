import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const settings = {
  duration: 2000,
  position: "bottom-left",
  cancel: {
    label: 'Close',
  },
}

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)"
        }
      }
      {...props} />
  );
}

export { Toaster, settings as toastsettings }
