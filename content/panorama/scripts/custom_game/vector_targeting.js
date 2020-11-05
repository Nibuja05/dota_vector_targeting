var lowerHud = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("HUDElements").FindChildTraverse("lower_hud");
var abilities = lowerHud.FindChildTraverse("abilities");
var items =  lowerHud.FindChildTraverse("inventory_items");

///// Vector Targeting
var CONSUME_EVENT = true;
var CONTINUE_PROCESSING_EVENT = false;

//main variables
var vector_target_particle = undefined;
var vectorTargetUnit = undefined;
var vector_start_position = undefined;
var vector_range = 800;
var vectorAbilityTable = {};
var clickBehavior = 0;
var currentlyActiveVectorTargetAbility;

GameEvents.Subscribe("dota_player_learned_ability", CheckUnitVectorAbilities);
GameEvents.Subscribe("dota_player_update_query_unit", CheckUnitVectorAbilities);
GameEvents.Subscribe("dota_player_update_selected_unit", CheckUnitVectorAbilities);

CheckUnitVectorAbilities()
function CheckUnitVectorAbilities( ){
	var unit = Players.GetLocalPlayerPortraitUnit();
	vectorAbilityTable = {};
	for (i = 0; i <= Entities.GetAbilityCount( unit ); i++){
		var abilityCont = abilities.FindChildTraverse("Ability"+i);
		
		if(abilityCont != null){
			var abilityButton = abilityCont.FindChildTraverse("ButtonSize")
			var abilityImage = abilityCont.FindChildTraverse("AbilityImage")
			var abilityName = abilityImage.abilityname
			var abilityIndex = 	Entities.GetAbilityByName( unit, abilityName )
			var filteredBehavior = Abilities.GetBehavior( abilityIndex ) & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING;
			if(filteredBehavior == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING){
				vectorAbilityTable[abilityCont] = true;
			}
		}
	}
	for (i = 0; i <= 5; i++){
		var abilityCont = items.FindChildTraverse("inventory_slot_"+i);
		if(abilityCont != null){
			var abilityImage = abilityCont.FindChildTraverse("ItemImage")
			var abilityName = abilityImage.abilityname
			var abilityIndex = 	Entities.GetItemInSlot( unit, i )
			var filteredBehavior = Abilities.GetBehavior( abilityIndex ) & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING;
			if(filteredBehavior == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING){
				vectorAbilityTable[abilityCont] = true;
			}
		}
	}
}

//Mouse Callback to check whever this ability was quick casted or not
GameUI.SetMouseCallback(function(eventName, arg, arg2, arg3)
{
	clickBehavior = GameUI.GetClickBehaviors();
	if(clickBehavior == 3 && currentlyActiveVectorTargetAbility != undefined){
		var netTable = CustomNetTables.GetTableValue( "vector_targeting", currentlyActiveVectorTargetAbility.entindex )
		OnVectorTargetingStart(netTable.startWidth, netTable.endWidth, netTable.castLength);
	}
	return CONTINUE_PROCESSING_EVENT;
});

$.RegisterForUnhandledEvent( "StyleClassesChanged", CheckAbilityVectorTargeting );
function CheckAbilityVectorTargeting( table ){
	if( table == null ){return}
	if( vectorAbilityTable[table] == true ){
		$
		if( table.hasBeenMarkedActivated && !table.BHasClass( "is_active" )){
			table.hasBeenMarkedActivated = false
			currentlyActiveVectorTargetAbility = undefined
			OnVectorTargetingEnd( false )
		} else if( !table.hasBeenMarkedActivated && table.BHasClass( "is_active" ) ) {
			table.hasBeenMarkedActivated = true
			currentlyActiveVectorTargetAbility = table
			if( GameUI.GetClickBehaviors() == 9 ){
				var netTable = CustomNetTables.GetTableValue( "vector_targeting", table.entindex )
				OnVectorTargetingStart(netTable.startWidth, netTable.endWidth, netTable.castLength);
			}
		}
	}
}
// Start the vector targeting
function OnVectorTargetingStart(fStartWidth, fEndWidth, fCastLength)
{
	var iPlayerID = Players.GetLocalPlayer();
	var selectedEntities = Players.GetSelectedEntities( iPlayerID );
	var mainSelected = Players.GetLocalPlayerPortraitUnit();
	var mainSelectedName = Entities.GetUnitName(mainSelected);
	vectorTargetUnit = mainSelected;
	var cursor = GameUI.GetCursorPosition();
	var worldPosition = GameUI.GetScreenWorldPosition(cursor);
	// particle variables
	var startWidth = fStartWidth || 125
	var endWidth = fEndWidth || startWidth
	vector_range = fCastLength || 800
	//Initialize the particle
	var casterLoc = Entities.GetAbsOrigin(mainSelected);
	var testPos = [casterLoc[0] + Math.min( 1500, vector_range), casterLoc[1], casterLoc[2]];
	vector_target_particle = Particles.CreateParticle("particles/ui_mouseactions/range_finder_cone.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, mainSelected);
	vectorTargetUnit = mainSelected
	Particles.SetParticleControl(vector_target_particle, 1, Vector_raiseZ(worldPosition, 100));
	Particles.SetParticleControl(vector_target_particle, 2, Vector_raiseZ(testPos, 100));
	Particles.SetParticleControl(vector_target_particle, 3, [endWidth, startWidth, 0]);
	Particles.SetParticleControl(vector_target_particle, 4, [0, 255, 0]);

	//Calculate initial particle CPs
	vector_start_position = worldPosition;
	var unitPosition = Entities.GetAbsOrigin(mainSelected);
	var direction = Vector_normalize(Vector_sub(vector_start_position, unitPosition));
	var newPosition = Vector_add(vector_start_position, Vector_mult(direction, vector_range));
	Particles.SetParticleControl(vector_target_particle, 2, newPosition);

	//Start position updates
	ShowVectorTargetingParticle();
	return CONTINUE_PROCESSING_EVENT;
}

//End the particle effect
function OnVectorTargetingEnd(bSend)
{
	if (vector_target_particle) {
		Particles.DestroyParticleEffect(vector_target_particle, true)
		vector_target_particle = undefined;
		vectorTargetUnit = undefined;
	}
}

//Updates the particle effect and detects when the ability is actually casted
function ShowVectorTargetingParticle()
{
	if (vector_target_particle !== undefined)
	{
		var mainSelected = Players.GetLocalPlayerPortraitUnit();
		var cursor = GameUI.GetCursorPosition();
		var worldPosition = GameUI.GetScreenWorldPosition(cursor);

		if (worldPosition == null)
		{
			$.Schedule(1 / 144, ShowVectorTargetingParticle);
			return;
		}
		var val = Vector_sub(worldPosition, vector_start_position);
		if (!(val[0] == 0 && val[1] == 0 && val[2] == 0))
		{
			var direction = Vector_normalize(Vector_sub(vector_start_position, worldPosition));
			direction = Vector_flatten(Vector_negate(direction));
			var newPosition = Vector_add(vector_start_position, Vector_mult(direction, vector_range));

			Particles.SetParticleControl(vector_target_particle, 2, newPosition);
		}
		if( mainSelected != vectorTargetUnit ){
			GameUI.SelectUnit( vectorTargetUnit, false )
		}
		$.Schedule(1 / 144, ShowVectorTargetingParticle);
	}
}

//Some Vector Functions here:
function Vector_normalize(vec)
{
	var val = 1 / Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2));
	return [vec[0] * val, vec[1] * val, vec[2] * val];
}

function Vector_mult(vec, mult)
{
	return [vec[0] * mult, vec[1] * mult, vec[2] * mult];
}

function Vector_add(vec1, vec2)
{
	return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]];
}

function Vector_sub(vec1, vec2)
{
	return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2]];
}

function Vector_negate(vec)
{
	return [-vec[0], -vec[1], -vec[2]];
}

function Vector_flatten(vec)
{
	return [vec[0], vec[1], 0];
}

function Vector_raiseZ(vec, inc)
{
	return [vec[0], vec[1], vec[2] + inc];
}
