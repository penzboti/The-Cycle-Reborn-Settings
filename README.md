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
- be able to unlock maps
- custom kits (that you make) you can apply with a click

# currently
able to see stash, loadout, see settings;
not able to edit anything yet.

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

[missions](docs/missons.md):
the two locked maps need to be unlocked with missions (= contracts = quests).

# run
Install dependencies, and then
```bash
npm run tauri dev
```
## install dependencies
you require NodeJs and Rust to be installed.
Then
```bash
npm install
```
## build release
what i will have to look into is sharing the executable somehow
