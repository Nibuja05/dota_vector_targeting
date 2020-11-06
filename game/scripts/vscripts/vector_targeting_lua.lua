
test_vector_targeting_lua = class({})

function test_vector_targeting_lua:GetVectorTargetRange()
	return 800
end

function test_vector_targeting_lua:GetBehavior()
	return DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING
end

function test_vector_targeting_lua:OnVectorCastStart(vStartLocation, vDirection)
	local caster = self:GetCaster()
	local speed = 1200
	local info = 
	{
		Ability = self,
		EffectName = "particles/units/heroes/hero_mirana/mirana_spell_arrow.vpcf",
		vSpawnOrigin = self:GetVectorPosition(),
		fDistance = self:GetVectorTargetRange(),
		fStartRadius = 64,
		fEndRadius = 64,
		Source = caster,
		bHasFrontalCone = false,
		bReplaceExisting = false,
		iUnitTargetTeam = DOTA_UNIT_TARGET_TEAM_ENEMY,
		iUnitTargetFlags = DOTA_UNIT_TARGET_FLAG_NONE,
		iUnitTargetType = DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_BASIC,
		fExpireTime = GameRules:GetGameTime() + 10.0,
		bDeleteOnHit = true,
		vVelocity = self:GetVectorDirection() * speed,
		bProvidesVision = true,
		iVisionRadius = 200,
		iVisionTeamNumber = caster:GetTeamNumber()
	}
	projectile = ProjectileManager:CreateLinearProjectile(info)

end
