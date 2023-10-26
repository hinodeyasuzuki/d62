// シナリオによってarea内の修正をする場合
//
//
//
D6.scenario.areafix = function() {

	//calcConsの標準値設定に関わる標準呼び出し
	D6.area.setCalcBaseParams = function(){
		//地域の設定
		D6.area.setArea( D6.doc.data.i021 );
	};

	//季節パラメータの標準呼び出し
	D6.area.getSeasonParamCommon = function(){
		//地域の設定
		return D6.area.getSeasonParam(  D6.consShow["TO"].business  );
	};


	//事業所別標準値
	// i001(業種)に対応
	//'事務所', 'スーパー', 'コンビニエンスストア', 'ほか小売・卸業', '飲食店', '旅館・ホテル', '学校', '病院', '工場', 'その他'
	// MJ/m2・年, 季節排出比,　営業時間外消費比率
	//　DECC　　非住宅建築物の環境関連データベース（H22年3月）　より作成
	// floor 		業種平均床面積
	// workTime		業種平均営業時間
	D6.area.businessParams = {
	1: { energy:1724, winter:0.93, spring:0.97, summer:1.14, notservice:0.2, floor:200, workTime:8, workDay:5 },
	2: { energy:4640, winter:0.91, spring:0.99, summer:1.14, notservice:0.2, floor:200, workTime:12, workDay:7},
	3: { energy:14783, winter:0.97, spring:0.99, summer:1.06, notservice:1, floor:60, workTime:24, workDay:7},
	4: { energy:2942, winter:0.89, spring:0.98, summer:1.19, notservice:0.1, floor:200, workTime:8, workDay:6},
	5: { energy:17543, winter:0.86, spring:0.99, summer:1.2, notservice:0.4, floor:60, workTime:8, workDay:6},
	6: { energy:2668, winter:0.9, spring:0.97, summer:1.18, notservice:0.4, floor:1000, workTime:8, workDay:7},
	7: { energy:366, winter:1.08, spring:0.96, summer:0.95, notservice:0.1, floor:1000, workTime:8, workDay:6},
	8: { energy:2422, winter:0.97, spring:0.96, summer:1.11, notservice:0.4, floor:1000, workTime:8, workDay:7},
	9: { energy:17543, winter:0.86, spring:0.99, summer:1.2, notservice:0.4, floor:1000, workTime:8, workDay:5},
	10: { energy:2942, winter:0.89, spring:0.98, summer:1.19, notservice:0.1, floor:200, workTime:8, workDay:5}
		
	};

	//業種から季節別の係数を得る
	D6.area.getSeasonParam = function( business ) {
		ret = {};
		var p = D6.area.businessParams[business];
		ret["electricity"] = [ p["winter"], p["spring"], p["summer"] ];
		ret["gas"] = [ 1, 1, 1 ];
		ret["kerosene"] = [ 1, 1, 1 ];
		ret["car"] = [ 1, 1, 1 ];
		ret["heavyoil"] = [ 1, 1, 1 ];

		return ret;
	};
	
	//地域ごとの標準値の設定 :(地域設定後に設定する)
	//　areaId：都道府県ID
	D6.area.setArea = function( areaId  )
	{
		if ( areaId < 0 ) {
			areaId = 13;
		}

		D6.area.area = Math.round(areaId ? areaId : 0);	

		//電力会社の設定
		D6.area.electCompany = D6.area.getElectCompany(D6.area.area);

		//電力のCO2排出係数の設定
		D6.Unit.co2.electricity = D6.area.getCo2Unit( D6.area.electCompany );
		D6.Unit.co2.nightelectricity = D6.Unit.co2.electricity;
		D6.Unit.co2.sellelectricity = D6.Unit.co2.electricity;
		
		//エアコンパラメータ設定
		D6.area.airconFactor_mon = D6.accons.getArray( D6.area.area );
		D6.area.heatFactor_mon = D6.acload.getArray( D6.area.area );
		D6.area.plusHeatFactor_mon = D6.acadd.getArray( D6.area.area );

		
		//平均気温設定
		D6.area.averageTemplature = D6.area.getTemplature( D6.area.area );
		
		//太陽光発電量の設定　100622
		D6.area.unitPVElectricity = 1000 * D6.area.getPVElectricity( D6.area.area ) / 3.6;

		//暖房地域の設定
		D6.area.heatingLevel = D6.area.getHeatingLevel( D6.area.area );

		//冷暖房月数の設定
		switch( D6.area.heatingLevel ) {
			case 1:
				D6.area.seasonMonth = { winter:7, spring:2, summer:3 };
				break;
			case 2:
				D6.area.seasonMonth = { winter:6, spring:2, summer:4 };
				break;
			case 3:
				D6.area.seasonMonth = { winter:5, spring:2, summer:5 };
				break;
			case 5:
				D6.area.seasonMonth = { winter:4, spring:2, summer:6 };
				break;
			case 6:
				D6.area.seasonMonth = { winter:3, spring:2, summer:7 };
				break;
			case 4:
			default:
				D6.area.seasonMonth = { winter:4, spring:2, summer:6 };
				break;
		}
		
		//calculate average cost for business
		this.averageCostEnergy = this.getAverageCostEnergy( 
						D6.consShow["TO"].business ,
						D6.consShow["TO"].floor );
		
		//calculate average CO2
		this.averageCO2Energy = {};
		for( var i in this.averageCostEnergy ) {
			this.averageCO2Energy[i] = 
						D6.Unit.costToCons( this.averageCostEnergy[i] , i )
						* D6.Unit.co2[i];
		}
	};
	
	// get average fee depend on business type,floor
	// 	ret[energy_name]
	//
	//	energy_name: electricity,gas,kerosene,car
	//
	D6.area.getAverageCostEnergy= function( business, floor ) {
		var ret;
		ret = new Array();

		var id;
		for ( i in this.energyCode2id) {
			id = this.energyCode2id[i];
			if ( i=="electricity" ){
				ret[i] = D6.Unit.consToCost(business * floor 
							/ D6.Unit.jules.electricity / 12 
						,"electricity", 1, 0 );			//月電気代
			} else {
				ret[i] = 0;
			}
		}

		return ret;
	};

};




