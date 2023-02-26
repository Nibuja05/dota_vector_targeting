
filterList = {
	"AbilityTuningValueFilter",
	"BountyRunePickupFilter",
	"DamageFilter",
	"ExecuteOrderFilter",
	"ItemAddedToInventoryFilter",
	"ModifierGainedFilter",
	"ModifyExperienceFilter",
	"ModifyGoldFilter",
	"RuneSpawnFilter",
	"TrackingProjectileFilter"
}

if not Filters then
	Filters = {}
end

if filterOverwritten == nil then
	filterOverwritten = true

	FILTER_PRIORITY_LOWEST = 0
	FILTER_PRIORITY_LOW = 1
	FILTER_PRIORITY_NORMAL = 2
	FILTER_PRIORITY_HIGH = 3
	FILTER_PRIORITY_HIGHEST = 4

	local mode = GameRules:GetGameModeEntity()

	for _,fType in pairs(filterList) do
		print("Setting filter for: ", fType)
		Filters[fType] = {}

		mode["Set"..fType](mode, function( self, event )
			for _,filter in ipairs( Filters[fType] ) do
				if filter.func( filter.context, event ) ~= true then
					return false
				end
			end

			return true
		end, {} )

		mode["Set"..fType] = function( self, filterFunc, context, priority )
			if type( context ) == 'number' then
				priority = context
				context = self
			end

			if priority == nil then
				priority = FILTER_PRIORITY_NORMAL
			end

			table.insert( Filters[fType], {func = filterFunc, priority = priority, context = context } )
			table.sort( Filters[fType], function( a, b ) return a.priority - b.priority end )
		end
		mode["Clear"..fType] = function(self, context)
			local newFilters = {}
			for _,v in pairs(Filters[fType]) do
				if not CompareContext(v.context, context) then
					table.insert(newFilters, v)
				end
			end
			Filters[fType] = newFilters
		end
	end
end

function CompareContext(t1,t2,ignore_mt)
	local ty1 = type(t1)
	local ty2 = type(t2)
	if ty1 ~= ty2 then return false end
	-- non-table types can be directly compared
	if ty1 ~= 'table' and ty2 ~= 'table' then return t1 == t2 end
	-- as well as tables which have the metamethod __eq
	local mt = getmetatable(t1)
	if not ignore_mt and mt and mt.__eq then return t1 == t2 end
	for k1,v1 in pairs(t1) do
		local v2 = t2[k1]
		if v2 == nil or not CompareContext(v1,v2) then return false end
	end
	for k2,v2 in pairs(t2) do
		local v1 = t1[k2]
		if v1 == nil or not CompareContext(v1,v2) then return false end
	end
	return true
end