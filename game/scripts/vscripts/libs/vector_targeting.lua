if not VectorTarget then 
	VectorTarget = class({})
end

ListenToGameEvent("game_rules_state_change", function()
	if GameRules:State_Get() == DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP then
		print("[VectorTarget] Initializing...")
		CustomGameEventManager:RegisterListener("send_vector_position", Dynamic_Wrap(VectorTarget, "StartVectorCast"))
		CustomNetTables:SetTableValue( "ability_api", "vector_target", {})
	end
end, nil)

function VectorTarget:StartVectorCast( event )
	local caster = PlayerResource:GetSelectedHeroEntity(event.playerID)
	local position = Vector(event.PosX, event.PosY, event.PosZ)
	local position2 = Vector(event.Pos2X, event.Pos2Y, event.Pos2Z)
	local abilityName = event.abilityName

	local ability = caster:FindAbilityByName(abilityName)
	local direction = -(position - position2):Normalized()

	if position == position2 then
		direction = -(caster:GetAbsOrigin() - position):Normalized()
	end

	direction = Vector(direction.x, direction.y, 0)

	if ability then
		ability:OnVectorCastStart(position, direction)
	end
end

ListenToGameEvent("npc_spawned", function(event)
	local npc = EntIndexToHScript(event.entindex)

	if npc:IsRealHero() then
		self:AddVectorTargetingAbilities(npc)
	end
end, nil)

function VectorTarget:AddVectorTargetingAbilities(hero)
	print("[VT] Search for vector targeting abilities...")
	for i=0, 10 do
		local ability = hero:GetAbilityByIndex(i)
		if ability then
			if ability:IsVectorTargeting() then
				local abilityTable = {
					name = ability:GetAbilityName(),
					range = 800,
				}
				local vectorAbilities = CustomNetTables:GetTableValue("ability_api", "vector_target")
				if not vectorAbilities then
					vectorAbilities = {}
				end
				table.insert(vectorAbilities, abilityTable)
				CustomNetTables:SetTableValue( "ability_api", "vector_target", vectorAbilities)
				print("[VT] Added "..ability:GetName().." to vector targeting abilities")
			end
		end
	end
end

function CDOTABaseAbility:IsVectorTargeting()
	return false
end

function CDOTABaseAbility:GetVectorTargetRange()
	return 800
end 

function CDOTABaseAbility:OnVectorCastStart(vStartLocation, vDirection)
	print("Vector Cast")
end
