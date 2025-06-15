# findings
- bad inventory json will correct itself (like deleting it entirely) (mabye not tho)
## items
- itemid is just a string. it can be anything
- if two items hold the same itemid only one of them apears.
- unstackable items with modified ammounts cannot be split-stacked. so like two helmets in one cannot be split.
- unknown items just don't appear
- overstacking items is allowed
- -1 amount makes items unequipable (with armors, even into their slots)
## keycards
- keycards with negative durability dont work
- keycards with modified durability reset to normal when used (you still get +1 use out of it)
## armour
- -1 durability makes them unbreakable
- you can make them really high rudability
## weapons
- durability doesnt change even when positive
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
