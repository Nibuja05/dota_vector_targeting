# Dota Vector Targeting

A Helper Library to use vector targeting for dota lua abilities.

## How to use

-   Set up Panorama:

    -   Copy the `vector_targeting.js` file in your panorama folder (or copy the folder if it doesn't exist)
    -   Include the script in your `custom_ui_manifest.xml` (or copy the folder if it doesn't exist)

-   Set up Library:

    -   Copy `vector_targeting.lua` to your 'libs' folder under vscripts (or copy the folder if it doesn't exist)
    -   Require the script in your `addon_game_mode.lua`
    -   Copy `custom_net_tables.txt` or combine it with your existing one

-   Overwrite particles:

    -   Copy the content of the particle directory to yours. This will overwrite the default particles and replace them with these custom ones (default ones don't seem to work properly)

-   For TypeScript users:

    -   Also copy `vector_targeting_interface.ts`
    -   Use `BaseVectorAbility` instead of `BaseAbility` for vector targeting abilities

-   Use for your lua abilities:
    -   Look up the example ability
    -   See custom functions below
    -   Use `DOTA_ABILITY_BEHAVIOR_POINT` and `DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING` as ability behavior

## Important Notes:

-   Vector targeting items only get registered whenever they get picked up or when anything is purchased from the shop
-   The values like `start radius`, `end radius` and `range` only get refreshed (for the indicator) whenever the ability is leveled up or when `UpdateVectorValues()` is executed
-   If you are using another `SetExecuteOrderFilter` in your gamemode, you may have to setup an addition for filters:
    -   copy `filters.lua` to your 'libs' folder under vscripts
    -   Require the script in your `addon_game_mode.lua` in the `Activate function` (if it gets required earlier, it will not work)
    -   Now each context may have a filter on its own, and it should work again

## Custom Functions:

-   `OnVectorCastStart(vStartLocation, vDirection)`: gets called when the ability is actually executed. Replaces `OnSpellStart()`, which is not available for vector targeting abilities.

-   `GetVectorPosition()`: returns the current/last start point of the vector cast

-   `GetVectorPosition2()`: returns the current/last second clicked point of the vector cast

-   `GetVectorDirection()`: return the current/last direction of the vector cast

-   `GetVectorTargetRange()`: return a number value to set this abilities vector display length (default value: 800)

-   `GetVectorTargetStartRadius()`: return a number value to set this abilities vector display start width (default value: 125)

-   `GetVectorTargetEndRadius()`: return a number value to set this abilities vector display end width (default value: start_radius)

-   `UpdateVectorValues()`: refreshes `start radius`, `end radius` and `range` manually

-   `IsDualVectorDirection()`: return true to make this abilities particle effect bidirectional (halfes range)

-   `IgnoreVectorArrowWidth()`: return true to ignore `GetVectorTargetEndRadius()` regarding the width of the arrow in the particle effect
