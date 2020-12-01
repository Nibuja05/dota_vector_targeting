import { BaseAbility } from "./dota_ts_adapter";

export interface BaseVectorAbility extends BaseAbility {
	GetVectorTargetRange():number;
	GetVectorTargetStartRadius():number;
	GetVectorTargetEndRadius():number;
	GetVectorPosition():Vector;
	GetVector2Position():Vector;
	GetVectorDirection():Vector;
	UpdateVectorValues():void;
	OnVectorCastStart(vStartLocation: Vector, vDirection: Vector):void;
	IsDualVectorDirection():boolean;
	IgnoreVectorArrowWidth():boolean;
}