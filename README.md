# info
Editing The Cycle Reborn server data without you having to manually do it trough MongoDB Compass.

# what should i expect
- be able to edit
    - stash (this means adding and removing items)
    - currency
    - (equipped) loadout (it adds the item to the "stash" automatically, bc thats how it works in the bg)
- be able to max out this way
    - faction (points) progress
    - fortuna pass progress
- save slots - (most probably) in one you can play the game normally and in the others you can have the funnest fun
- custom kits (that you make) you can apply with a click

# will look into
- skip tutorial (for new saves in save slot feature)
- negative & really high durability for armor
- positive durability to items
- make unstackable items stacked
- item id not a real item
- overstack items
- forge perks
- attachments

# findings
## items
- itemid is just a string. if two items hold the same id only one of them apears.
## stash & inventory
- anything in your inventory is also in your stash, but just left out of rendering & calculating
- it writes your stash to the db if you get/buy something
- your inventory writes to db if you change it, and then exit the inventory page
- you can refresh your stash & inventory by entering and exiting the tutorial.
- the exact time of your death / evac, it updates the stash & inventory. (removes the items you lost, but also makes newly added ones show)
- you can freely edit your stash & invetory, it will not show in the lobby, but it will be correct in game
- you can freely overflow both.
## xp
- not writing battle pass xp after match completeion
- both battle passe xp and faction xp can be maxed out at a high value like 500k (they probably need less, but idc, this doesnt cause bugs)
## quarters
- you cant edit stash space and safe pocket size with CharacterTechTreeBonuses. you have to edit the upgrade levels.

# possible features (not guaranteed)
- custom notifications?
- custom crates? - probably could do it with twitch drops / insurance returns; dont really need bc of kits
- editing quarters? - you dont really need it i think
- editing contracts progress? - would be cool to finish the fortunas favoured one (if i cant get into it any other way) (wait is it even in the game?)
