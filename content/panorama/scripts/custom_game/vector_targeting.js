var CONSUME_EVENT = true;
var CONTINUE_PROCESSING_EVENT = false;
var PATTACH_ABSORIGIN_FOLLOW = 1

var active = 1;
var select = {};
select[0] = false;
select[1] = false;
select[2] = false;
var lastSelect = -1;
var base = $.GetContextPanel().GetParent().GetParent().GetParent();
var x = base.FindChildTraverse('HUDElements');
x = x.FindChildTraverse('lower_hud');
x = x.FindChildTraverse('center_with_stats');
x = x.FindChildTraverse('center_block');
x = x.FindChildTraverse('AbilitiesAndStatBranch');
var abilities = x.FindChildTraverse('abilities');

//main variables
var active_ability = undefined;
var vector_target_particle = undefined;
var vector_start_position = undefined;
var vector_range = undefined;

function OnVectorTargetingStart()
{
	var iPlayerID = Players.GetLocalPlayer();
	var selectedEntities = Players.GetSelectedEntities( iPlayerID );
	var mainSelected = Players.GetLocalPlayerPortraitUnit();
	var mainSelectedName = Entities.GetUnitName(mainSelected);
	var cursor = GameUI.GetCursorPosition();
	var worldPosition = GameUI.GetScreenWorldPosition(cursor);

	$.Msg("[VT] Show Particle:");
	$.Msg(worldPosition);
	vector_target_particle = Particles.CreateParticle("particles/ui_mouseactions/range_finder_cone.vpcf", PATTACH_ABSORIGIN_FOLLOW, mainSelected);
	Particles.SetParticleControl(vector_target_particle, 1, worldPosition);
	Particles.SetParticleControl(vector_target_particle, 3, [125, 125, 0]);
	Particles.SetParticleControl(vector_target_particle, 4, [0, 255, 0]);

	vector_start_position = worldPosition;
	var unitPosition = Entities.GetAbsOrigin(mainSelected);
	var direction = Vector_normalize(Vector_sub(vector_start_position, unitPosition));
	var newPosition = Vector_add(vector_start_position, Vector_mult(direction, vector_range));
	Particles.SetParticleControl(vector_target_particle, 2, newPosition);

	ShowVectorTargetingParticle();

	return CONTINUE_PROCESSING_EVENT;
}

function OnVectorTargetingEnd()
{
	$.Msg("[VT] Stop")

	Particles.DestroyParticleEffect(vector_target_particle, true)
	vector_target_particle = undefined;

	SendPosition();
}

function SendPosition() {
	var abilityName = Abilities.GetAbilityName(active_ability);
	var cursor = GameUI.GetCursorPosition();
	var ePos = GameUI.GetScreenWorldPosition(cursor);
	var cPos = vector_start_position;
	var pID = Players.GetLocalPlayer();
	GameEvents.SendCustomGameEventToServer("send_vector_position", {"playerID" : pID, "abilityName": abilityName, "PosX" : cPos[0], "PosY" : cPos[1], "PosZ" : cPos[2], "Pos2X" : ePos[0], "Pos2Y" : ePos[1], "Pos2Z" : ePos[2]});
}

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

		if (val[0] !== 0 && val[1] !== 0 && val[2] !== 0)
		{
			var direction = Vector_normalize(Vector_sub(vector_start_position, worldPosition));
			direction = Vector_negate(direction);
			var newPosition = Vector_add(vector_start_position, Vector_mult(direction, vector_range));

			Particles.SetParticleControl(vector_target_particle, 2, newPosition);
		}
		var mouseHold = GameUI.IsMouseDown(0);
		if (mouseHold)
		{
			$.Schedule(1 / 144, ShowVectorTargetingParticle);
		} else {
			OnVectorTargetingEnd();
		}
	}
}

GameUI.SetMouseCallback(function(eventName, arg)
{
	active_ability = Abilities.GetLocalPlayerActiveAbility();
	var abilityName = Abilities.GetAbilityName(active_ability);
	var vectorAbilities = CustomNetTables.GetTableValue("ability_api", "vector_target");

	for (var key in vectorAbilities) {
	 	var value = vectorAbilities[key];
	 	var name = value["name"];

	 	if (name !== abilityName) {
	 		return CONTINUE_PROCESSING_EVENT;
	 	}

		vector_range = value["range"];
	}

	if (GameUI.GetClickBehaviors() == CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_CAST ) {
		return OnVectorTargetingStart(); 
	}

	return CONTINUE_PROCESSING_EVENT;
});

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

//StartTrack();
