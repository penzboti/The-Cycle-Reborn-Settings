# info
Editing The Cycle Reborn server data without you having to manually do it trough MongoDB Compass.

# what should you expect
- be able to edit
    - [x] stash (this means adding and removing items)
    - [x] currency
    - [x] (equipped) loadout (it adds the item to the "stash" automatically, bc thats how it works in the bg)
- be able to max out
    - [x] faction (points) progress
    - [x] fortuna pass progress
- be able to
    - [ ] unlock maps
    - [ ] skip tutorial (if possible)
- [ ] custom kits (that you make) you can apply with a click

# will look into
- forge perks (in tcf-information: forgePerks.json, these could also be useful: forgeSettings, forgeRecipies) (100% in scope)
- attachments (100% in scope)
- not intended json structures, and other database values (might break the game)
- cut out ammo images (they are bad screenshots currently) (datamine the game?)
- save slots - in one you can play the game normally and in the others you can have the funnest fun
    - might not happen, would be cool
    - skip tutorial (preset save file to after tutorial) (another way to handle it)

# documentation links
[stack](docs/stack.md):
background information about the program.

[features](docs/features.md):
extra information found while experimenting & extra feature ideas.

[saving](docs/saving.md):
how to make a save file and load another one, in mongodb;
for me to not forget.

[missions](docs/missons.md):
the two locked maps need to be unlocked with missions (= contracts = quests).
todo skip tutorial.

# manual installation
first, clone the repo.
```bash
npm install
```
you can use bun instead of node.
you require NodeJs and Rust to be installed.
## run
```bash
npm run tauri dev
```
## build release
```bash
npm run tauri build
```
