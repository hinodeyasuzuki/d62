/**
* Home-Eco Diagnosis for JavaScript
* 
* ConsHWsum
* 給湯全体消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/09/05 給湯への展開
*								2011/10/21 給湯簡易計算を実装
*/

D6.consHWsum = new ConsBase();
DC = D6.consHWsum;


//初期設定値
DC.init = function() {
	//構造設定
	this.consName = "consHWsum";		//分野コード
	this.consCode = "HW";				//うちわけ表示のときのアクセス変数
	this.title = "給湯";				//分野名として表示される名前
	this.orgCopyNum = 0;				//初期複製数（consCodeがない場合にはこの分のコピーが作成）
	this.sumConsName = "consTotal";		//集約先の分野コード
	this.sumCons2Name = "";				//関連の分野コード
	this.groupID = "1";					//うちわけ番号
	this.color = "#ffb700";			//表示の色
	this.inputGuide = "給湯の使い方について";		//入力欄でのガイド
	
	this.measureName = [ 
	];

	this.waterTemp = 18;				//水の温度(初期)
	this.hotWaterTemp = 42;				//湯沸かしの温度
	this.tabWaterLitter = 160;			//貯湯量(200Lの8割）
	this.showerWaterLitterUnit = 10;	//1分あたりのシャワー量
	this.showerWaterMinutes = 10;		//標準の1人シャワー時間
	this.otherWaterLitter = 50;			//その他のお湯量
//	this.showerWaterLitter;				//シャワーのお湯量
	this.tankLossWatt = 100;			//貯湯タンクからのロス

	this.performanceGas = 0.73;			//通常機種の効率
	this.performanceEcojozu = 0.877;	//潜熱回収型の効率
	this.performanceElec = 0.8;			//電気温水器の効率
	this.performanceEcocute = 3;		//エコキュートの効率
	this.performanceEnefarmEle = 0.289;	//エネファームの発電効率
	this.performanceEnefarmHW = 0.33;	//エネファームの熱効率


	this.reduceRateSaveMode = 0.2;		//節約モードでの削減率
	this.reduceRateSolar = 0.4;			//太陽熱温水器での削減率
	this.reduceRateSolarSystem = 0.5;	//ソーラーシステムでの削減率

	this.reduceRateKeepStop;
	
};
DC.init();



//お湯消費量計算
DC.calc = function() {
	this.clear();			//結果の消去

	//入力値の読み込み
	this.business = D6.consShow["TO"].business;			//業種
	this.floor = D6.consShow["TO"].floor;				//床面積 m2

	this.person =this.input( "i010", 
			( this.business == 6 ? Math.round(this.floor/20) + 1 : 0 ) );
			//客室数

	this.equipType =this.input( "i101", -1 );			//給湯器の種類
	this.eachbath =this.input( "i102", -1 );			//客室への風呂設置
	this.bigbath =this.input( "i103", 2 );				//大浴場
	
	this.showerperson =this.input( "i104",		
			( this.business == 8 ? Math.round(this.floor/20) + 1 : 0 ) );
			//シャワー利用人数
	this.dinnerperson =this.input( "i105",		
			( this.business == 8 ? Math.round(this.floor/10) + 1 :
			( this.business == 5 ? this.floor * 2 : 0 ) ) );
			//食事利用人数（食数）

	this.otherWaterLitter = 
			( this.business == 8 ? ( Math.round(this.floor/10) + 1 ) * 100 : 100 );
			//その他のお湯
			
	//給湯器の推計
	if ( !this.equipType || this.equipType <= 0 ) {
		if ( D6.consShow["TO"].priceGas == 0 ) {
			if ( D6.consShow["TO"].priceKeros > 30000 ) {
				this.equipType = 3;
			} else {
				this.equipType = 5;
			}
		} else {
			this.equipType = 1;
		}
	}

	//水温の設定
	this.waterTemp = D6.area.getWaterTemplature();

	//食器洗いのお湯量(L/日)
	this.dishwashLitter = this.dinnerperson * 20;

	//シャワーの湯量(L/日)
	this.showerWaterLitter = this.showerperson * this.showerWaterMinutes * this.showerWaterLitterUnit;

	//給湯リットル（L/日)
	this.allLitter = ( this.person * this.tabWaterLitter
						+ this.showerWaterLitter
						+ this.otherWaterLitter 
						+ this.dishwashLitter
						);
	//給湯量（加温エネルギー量 kcal/月）
	this.heatEnergy = this.allLitter * ( this.hotWaterTemp - this.waterTemp ) * 365 / 12;
	this.endEnergy = this.heatEnergy;

	//貯湯エネルギー（加温エネルギー量 kcal/月）
	this.tanklossEnergy = this.tankLossWatt / 1000 * D6.Unit.calorie.electricity * 365 / 12;
	//標準値（保温を止めた場合のガス・電気温水器の効率向上）
	//reduceRateKeepStop = reduceRateKeepStopGas;

	switch ( this.equipType ) {
		case 1:
			//ガス給湯器
			this.mainSource = "gas";
			this[this.mainSource] = this.heatEnergy / this.performanceGas 
						/ D6.Unit.calorie[this.mainSource];
			break;
		case 2:
			//エコジョーズ
			this.mainSource = "gas";
			this[this.mainSource] = this.heatEnergy / this.performanceEcojozu 
						/ D6.Unit.calorie[this.mainSource];
			break;
		case 3:
			//灯油給湯器
			this.mainSource = "kerosene";
			this[this.mainSource] = this.heatEnergy / this.performanceGas 
						/ D6.Unit.calorie[this.mainSource];
			break;
		case 4:
			//エコフィール
			this.mainSource = "kerosene";
			this[this.mainSource] = this.heatEnergy / this.performanceEcojozu 
						/ D6.Unit.calorie[this.mainSource];
			break;
		case 5:
			//電気温水器
			this.mainSource = "nightelectricity";
				this[this.mainSource] = ( this.heatEnergy + this.tanklossEnergy )
						/ this.performanceElec / D6.Unit.calorie[this.mainSource] ;
			break;
		case 6:
			//エコキュート
			this.mainSource = "nightelectricity";
			this[this.mainSource] = ( this.heatEnergy + this.tanklossEnergy ) 
						/ this.performanceEcocute / D6.Unit.calorie[this.mainSource];
			//エコキュートだけ効率向上が違う
			//reduceRateKeepStop = reduceRateKeepStopEle;
			break;
		case 7:
		case 8:
		default:
			this.mainSource = "gas";
			this.gas = this.heatEnergy / this.performanceEcojozu 
						/ D6.Unit.calorie.gas;
	}
};


//対策計算
DC.calcMeasure = function() {
};


//給湯負荷についても割戻しをする必要がある（初期状態の割戻し）
DC.calcAdjustStrategy = function( energyAdj ){
	this.heatEnergy *= energyAdj[this.mainSource];
	this.tanklossEnergy *= energyAdj[this.mainSource];
	this.endEnergy *= energyAdj[this.mainSource];
};

