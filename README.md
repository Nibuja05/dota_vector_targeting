# Dota Vector Targeting
A Helper Library to use vector targeting for dota lua abilities.

## How to use

- Set up Panorama: 
	- Copy the vector\_targeting.js file in your panorama folder (or copy folder if it doesnt exist)
	- Include the script in you custom\_ui\_manifest.xml (or copy folder if it doesnt exist)

- Set up Library:
	- Copy vector\_targeting.lua to you 'libs' folder under vscripts (or copy folder if it doesnt exist)
	- require the script in you addon\_game\_mode.lua

- Use for your lua abilities:
	- look up the example ability
	- see custom functions below
	- use `DOTA_ABILITY_BEHAVIOR_POINT` as ability behavior
	
	
## Custom Functions:

- `IsVectorTargeting()`: return true to make this ability a vector targeting ability

- `GetVectorTargetRange()`: return a number value to set this abilities vector display length (default value: 800)

- `OnVectorCastStart(vStartLocation, vDirection)`: gets called when ability is actually executed. Replaces `OnSpellStart()`, which is not available for vector targeting abilities.

- `GetVectorPosition()`: returns the current/last start point of the vector cast

- `GetVectorDirection`: return the current/last direction of the vector cast

- `GetVectorTargetStartRadius`: return a number value to set this abilities vector display start width (default value: 125)

- `GetVectorTargetEndRadius`: return a number value to set this abilities vector display end width (default value: start_radius)

