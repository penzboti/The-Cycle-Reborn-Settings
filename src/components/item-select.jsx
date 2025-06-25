import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "./ui/lib/utils" // was @/lib/utils
import { Button } from "./ui/button"; // was @/components/ui/button
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

import { items } from "../scripts/module";

function ItemSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function selectedItem() {
    if (!value) return "Select item...";
    const json = items.find((item) => item.id === value);
    if (typeof json === "undefined") return "Item not found.";
    return (<>
      <img className="w-10 overflow-hidden mr-[10px]" src={json.image} alt={json.name} />
      {json.name}
    </>);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {selectedItem()}
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command filter={(value, search, keywords) => {
          const extendValue = value + ' ' + keywords.join(' ')
          if (extendValue.includes(search)) return 1
          return 0
        }}>
          <CommandInput placeholder="Search item..." className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  keywords={[item.name, item.name.toLowerCase(), item.id.toLowerCase()]}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <img src={item.image} alt={item.name} className="w-10" />
                  {item.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ItemSelect;
