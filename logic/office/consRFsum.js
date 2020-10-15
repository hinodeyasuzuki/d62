/**
* Home-Eco Diagnosis for JavaScript
* 
* ConsRFsum
* 冷蔵庫全体消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/10/21 冷蔵庫簡易計算を実装
*								2012/08/27 switchに変更
*/


D6.consRFsum = Object.create( ConsBase );
DC = D6.consRFsum;


//初期設定値
DC.init = function() {
	this.home = 600;				//標準年間消費電力量 kWh
	this.homeAdvanced = 240;		//最新型年間消費電力量 kWh
	this.com = 1000;				//標準年間消費電力量 kWh
	this.comAdvanced = 700;			//最新型年間消費電力量 kWh
	this.comFreezer = 2000;				//標準年間消費電力量 kWh
	this.comFreezerAdvanced = 1500;		//最新型年間消費電力量 kWh
	this.show = 2000;					//標準年間消費電力量 kWh
	this.showAdvanced = 1500;			//最新型年間消費電力量 kWh

	this.consRefFreezer = 3;			//冷蔵庫に対する冷凍庫の消費比
	this.consRefOpen = 2;			//扉なしの場合の消費比率
	this.consRefStock = 0.7;		//平台の場合の消費比率

	this.reduceRateNightCover = 0.05;	//ナイトカバーによる削減率
	this.reduceRateWall = 0.1;			//壁から離すことによる削減率
	this.reduceRateTemplature = 0.12;	//温度を控えめにすることによる削減率
	this.reduceRateChange = 0.5;		//新型機種にすることによる削減率

	//構造設定
	this.consName = "consRFsum";		//分野コード
	this.consCode = "RF";				//うちわけ表示のときのアクセス変数
	this.title = "冷蔵庫";				//分野名として表示される名前
	this.orgCopyNum = 0;				//初期複製数（consCodeがない場合にはこの分のコピーが作成）
	this.sumConsName = "consTotal";		//集約先の分野コード
	this.sumCons2Name = "";				//関連の分野コード
	this.groupID = "3";					//うちわけ番号
	this.color = "#a0ffa0";				//表示の色
	//this.residueCalc = "no";			//残余の計算：最初は台数で計算する
	this.inputGuide = "全体の冷蔵庫の使い方について";		//入力欄でのガイド

	this.measureName = [ 
		"mRFnight",
		"mRFslit",
		"mRFcontroler",
		"mRFdoor",
		"mRFflow",
		"mRFicecover",
		"mRFiceflat"
	];
};
DC.init();

//冷蔵庫消費量計算
DC.calc = function( ) {
	this.clear();			//結果の消去
	//入力値の読み込み
	this.business = D6.consShow["TO"].business;			//業種
	this.floor = D6.consShow["TO"].floor;				//床面積 m2

	this.cHome =this.input( "i701", 1 );		//家庭用冷蔵庫台数
	this.cCom =this.input( "i711", 
			(this.business == 5 ? Math.round(this.floor / 100 ) + 1 : 0 ) );
			//業務用冷蔵庫台数
	this.cComFreezer =this.input( "i712",
			(this.business == 5 ? Math.round(this.floor / 300 ) + 1 : 0 ) );
			//業務用冷凍庫台数
	this.cShow =this.input( "i713",
			(this.business == 3 ? 10 : 
			(this.business == 2 ? Math.round(this.floor / 50 ) + 1 : 0 ) ) );
			//扉ありショーケース台数
	this.cShowOpen =this.input( "i714",	
			(this.business == 3 ? 5 : 
			(this.business == 2 ? Math.round(this.floor / 20 ) + 1 : 0 ) ) );
			//扉なしショーケース台数
	this.cShowFreezer =this.input( "i715",
			(this.business == 3 ? 4 : 
			(this.business == 2 ? Math.round(this.floor / 100 ) + 1 : 0 ) ) );
			//扉あり冷凍ショーケース台数
	this.cShowFreezerOpen =this.input( "i716", 0 );	//扉なし冷凍ショーケース台数
	this.cStockFreezer =this.input( "i717",	
			(this.business == 3 ? 2 : 
			(this.business == 2 ? Math.round(this.floor / 100 ) + 1 : 0 ) ) );
			//扉なし冷凍平台台数
	
	this.nightCover =this.input( "i721", -1 );	//ナイトカバー
	this.curtain = this.input('i722',-1);	//'スリットカーテンの設置',
	this.controler = this.input('i723',-1);	//'防露ヒーターコントローラー導入',
	this.cleaning = this.input('i724',-1);	//'冷気の吹き出し口、吸い込み口の清掃と吸い込み口の確保',

	this.electricity = this.cHome * this.home / 12;
	this.electricity += this.cCom * this.com / 12;
	this.electricity += this.cComFreezer * this.comFreezer / 12;
	this.electricity += this.cShow * this.show / 12;
	this.eleOpen = this.cShowOpen * this.show * this.consRefOpen / 12;
	this.electricity += this.eleOpen;
	this.electricity += this.cShowFreezer * this.show * this.consRefFreezer / 12;
	this.eleOpenFreezer = this.cShowFreezerOpen * this.show * this.consRefFreezer * this.consRefOpen / 12;
	this.electricity += this.eleOpenFreezer;
	this.eleStockFreezer = this.cStockFreezer * this.show * this.consRefFreezer * this.consRefStock / 12;
	this.electricity += this.eleStockFreezer;
};


//対策計算
DC.calcMeasure = function( ) {
	if (this.nightCover != 1 ) {
		this.measures["mRFnight"].calcReduceRate(this.reduceRateNightCover * this.eleOpen / this.electricity );		//冷蔵庫へのナイトカバーの設置
		this.measures["mRFicecover"].calcReduceRate(this.reduceRateNightCover * this.eleOpenFreezer / this.electricity);	//	冷凍ナイトカバーの設置
	}
	if ( this.curtain != 1 ){
		this.measures["mRFslit"].calcReduceRate(0.2 * this.eleOpen / this.electricity);		//スリットカーテン設置
	}
	if ( this.controler != 1 ){
		this.measures["mRFcontroler"].calcReduceRate(0.1);	//防露ヒーターコントローラー導入
	}
	this.measures["mRFdoor"].calcReduceRate(0.1* this.eleOpen / this.electricity);		//	スライド扉設置
	this.measures["mRFflow"].calcReduceRate(0.1* ( this.eleOpen + this.eleOpenFreezer + this.eleStockFreezer )/ this.electricity);		//	冷気の吹き出し口、吸い込み口の清掃と吸い込み口の確保
	this.measures["mRFiceflat"].calcReduceRate(0.6 * this.eleOpenFreezer / this.electricity );	//	冷凍ケースを平台型に変更

};



