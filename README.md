# Dota Vector Targeting
A Helper Library to use vector targeting for dota lua abilities.

## How to use

- Set up Panorama: 
	- Copy the vector\_targeting.js file in your panorama folder (or copy folder if it doesnt exist)
	- Include the script in you custom\_ui\_manifest.xml (or copy folder if it doesnt exist)

- Set up Library:
	- Copy vector\_targeting.lua to you 'libs' folder under vscripts (or copy folder if it doesnt exist)
	- require the script in you addon\_game\_mode.lua

- Overwrite particles:
	- copy the content of the particle directory to yours. This will overwrite the default particles and replace them with these custom ones (default ones don't seem to work properly)

- For TypeScript users:
	- also copy `vector_targeting_interface.ts`
	- use `BaseVectorAbility` instead of `BaseAbility` for vector targeting abilities

- Use for your lua abilities:
	- look up the example ability
	- see custom functions below
	- use `DOTA_ABILITY_BEHAVIOR_POINT` and `DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING` as ability behavior
	
## Important Notes:

- Vector targeting items only get registered whenever they get picked up or when anything is purchased from the shop
- The values like `start radius`, `end radius` and `range` only get refreshed (for the indicator) whenever the ability is leveled up or when `UpdateVectorValues()` is executed
	
## Custom Functions:

- `OnVectorCastStart(vStartLocation, vDirection)`: gets called when ability is actually executed. Replaces `OnSpellStart()`, which is not available for vector targeting abilities.

- `GetVectorPosition()`: returns the current/last start point of the vector cast

- `GetVectorPosition2()`: returns the current/last second clicked point of the vector cast

- `GetVectorDirection()`: return the current/last direction of the vector cast

- `GetVectorTargetRange()`: return a number value to set this abilities vector display length (default value: 800)

- `GetVectorTargetStartRadius()`: return a number value to set this abilities vector display start width (default value: 125)

- `GetVectorTargetEndRadius()`: return a number value to set this abilities vector display end width (default value: start_radius)

- `UpdateVectorValues()`: refreshes `start radius`, `end radius` and `range` manually

