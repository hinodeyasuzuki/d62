/**
* Home-Eco Diagnosis for JavaScript
* 
* ConsHTsum
* 暖房全体消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/09/05 暖房クラスに変換
*								2011/10/21 暖房簡易計算を実装
*/


D6.consHTsum = new ConsBase();
DC = D6.consHTsum;


//初期設定値
DC.init = function() {
	//構造設定
	this.consName = "consHTsum";				//分野コード
	this.consCode = "HT";						//うちわけ表示のときのアクセス変数
	this.title = "暖房";						//分野名として表示される名前
	this.orgCopyNum = 0;						//初期複製数（consCodeがない場合にコピー作成）
	this.sumConsName = "consTotal";				//集約先の分野コード
	this.sumCons2Name = "consACsum";			//関連の分野コード
	this.groupID = "2";							//うちわけ番号
	this.color = "#ff0000";					//表示の色
	this.inputGuide = "全体の暖房の使い方について";		//入力欄でのガイド
	
	this.measureName = [ 
	];

	this.heatLoadUnit_Wood = 220/3 * 1.25 * 0.82;		//標準暖房負荷（W/m2）
	this.heatLoadUnit_Steel = 145/3 * 1.25 * 0.82;		//標準暖房負荷鉄筋住宅の場合（W/m2）
	this.apf = 3;									//エアコンAPF
	this.apfMax = 4.5;							//エアコン最高機種APF

	this.reduceRateInsulation = 0.082;			//断熱シートでの削減率
	this.reduceRateDouble = 0.124;				//ペアガラスでの削減率
	this.reduceRateUchimado = 0.14;				//内窓での削減率
	this.reduceRateFilterCool= 0.05;			//フィルター掃除での冷房削減率

	this.reduceRateFilter= 0.12;				//フィルター掃除での削減率
	this.reduceRateDanran= 0.303;				//家族だんらんでの削減率

	//他でも使う変数
	this.heatMcal;
	this.heatACCalcMcal;

};
DC.init();

//暖房消費量計算
//
DC.calc = function() {
	this.clear();			//結果の消去

	//入力値の読み込み
	this.business = D6.consShow["TO"].business;			//業種
	this.floor = D6.consShow["TO"].floor;				//床面積 m2
	this.workDay = D6.consShow["TO"].workDay;			//週日数
	this.heatTime = D6.consShow["TO"].workTime;			//暖房時間

	this.heatArea  = 0.3;							//冷暖房エリア
	this.heatEquip =this.input( "i203", -1 );		//暖房機器
	this.heatTemp  =this.input( "i205", 22 );		//暖房設定温度
	this.heatMonth  = this.input( "i007", 4 );		//冷房期間

	//熱量計算
	var heatKcal = this.calcHeatLoad() * this.workDay / 7;

	if ( this.heatEquip == 4 ){
		this.kerosene = heatKcal / D6.Unit.calorie.kerosene * D6.area.seasonMonth.winter  *30 / 12;
	} else if ( this.heatEquip == 3 ){
		this.gas = heatKcal / D6.Unit.calorie.gas * D6.area.seasonMonth.winter  *30 / 12;
	} else {
		this.electricity = heatKcal / this.apf / D6.Unit.calorie.electricity * D6.area.seasonMonth.winter  *30 / 12;		
	}

	/*
	//季節別の光熱費より、負荷計算のほうが適切
	var season = D6.consShow["TO"].seasonPrice;
	//電気
	this.electricity = (season[0][0] - season[0][1] )*	D6.area.seasonMonth.winter / 12 / D6.Unit.price.electricity;
	if ( this.electricity < 0 ) this.electricity = 0;
	//gas
	this.gas = ( season[1][0] - season[1][1] ) * D6.area.seasonMonth.winter / 12 / D6.Unit.price.gas;
	//灯油
	this.kerosene = (season[2][0] - season[2][1] )*	D6.area.seasonMonth.winter / 12 / D6.Unit.price.kerosene;
	*/
	
	this.endEnergy = heatKcal;

};

//対策計算
DC.calcMeasure = function() {
};


//暖房消費量計算（他の分野計算後の消費量再計算）
// consP がデータ保持の配列,cons.consShowは他の消費量配列
//
DC.calc2nd = function( ) {
};

//暖房負荷計算 kcal/月
//
//		cons.houseType : 建物の形態
//		cons.floor : 延べ床面積(m2)
//		cons.heatArea : 冷暖房範囲比率(-) 
DC.calcHeatLoad = function(){
	var energyLoad = 0;
	
	var heatLoadUnit;				//暖房負荷原単位　kcal/m2/hr
	if ( this.houseType == 1 ) 
	{
		heatLoadUnit = this.heatLoadUnit_Wood;
	} else {
		heatLoadUnit = this.heatLoadUnit_Steel;
	}

	var heatArea_m2;				//暖房面積 m2
	heatArea_m2 = this.floor * this.heatArea;
	if ( this.heatArea > 0.05 ) {
		heatArea_m2 = Math.max( heatArea_m2, 13 );		//最低13m2（約8畳）
	}

	var heatTime;					//暖房時間（時間）
	heatTime = this.heatTime;

	//暖房係数
	var heatMonth = this.heatMonth;
	var heatFactor =D6.area.getHeatFactor( heatMonth, heatTime );

	var coefTemp;					//設定温度による負荷係数
	coefTemp = ( this.heatTemp - 20 ) / 10 + 1;

	energyLoad = heatLoadUnit * heatFactor[1] * heatArea_m2 * heatTime * 30 * coefTemp;

	return energyLoad;
};


//暖房負荷についても割戻しをする必要がある
DC.calcAdjustStrategy = function( energyAdj ){
	this.calcACkwh *= energyAdj[this.mainSource];
	this.endEnergy *= energyAdj[this.mainSource];
};



