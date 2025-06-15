# info
Editing The Cycle Reborn server data without you having to manually do it trough MongoDB Compass.

# what should you expect
- be able to edit
    - stash (this means adding and removing items)
    - currency
    - (equipped) loadout (it adds the item to the "stash" automatically, bc thats how it works in the bg)
- be able to max out this way
    - faction (points) progress
    - fortuna pass progress
- custom kits (that you make) you can apply with a click

# currently
Well, nothing, this migrating to react really killed all the features.
The features were just the bare minimum tho, so i can get back to that state in no time.

# will look into
- forge perks (in tcf-information: forgePerks.json, these could also be useful: forgeSettings, forgeRecipies) (100% in scope)
- attachments (100% in scope)
- bad json items, and other database values (might break the game)
- cut out ammo images (they are bad screenshots currently)
- save slots - in one you can play the game normally and in the others you can have the funnest fun
    - might not happen, would be cool
    - skip tutorial (preset save file to after tutorial)

# links
[stack](docs/stack.md):
background information about the program

[features](docs/features.md):
extra information found while experimenting & extra feature ideas

[saving](docs/saving.md):
how to make a save file and load another one

# run
```npm run tauri dev```
## install dependencies
```npm install``` should do the trick
## build release
what i will have to look into is sharing the executable somehow
