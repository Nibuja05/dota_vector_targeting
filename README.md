# Dota Vector Targeting
A Helper Library to use vector targeting for dota lua abilities.

## How to use

- Set up Panorama: 
	- Copy the vector\_targeting.js file in your panorama folder (or copy folder if it doesnt exist)
	- Include the script in you custom\_ui\_manifest.xml (or copy folder if it doesnt exist)

- Set up Library:
	- Copy vector\_targeting.lua to you 'libs' folder under vscripts (or copy folder if it doesnt exist)
	- require the script in you addon\_game\_mode.lua
	- Call 'VectorTarget:Init()' on InitGameMode()
	- Add precache of targeting particle

- Set up nettables:
	- Copy 'custom\_net\_tables.txt' in your script folder

- Use for your lua abilities:
	- look up the example ability