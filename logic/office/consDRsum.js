/**
* Home-Eco Diagnosis for JavaScript
* 
* ConsDRsum
* 洗濯乾燥全体消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/10/21 洗濯乾燥簡易計算を実装
*/



D6.consDRsum = new ConsBase();
DC = D6.consDRsum;


//初期設定値
DC.init = function() {
	this.whWash = 100;	// wh/日・3人
	this.whDry = 1000;	// wh/日・3人

	this.reduceRateHeatPump = 0.65;		//ヒートポンプ式の削減率

	this.res2Freq = [ 0, 1, 0.5, 0.2, 0.07, 0 ];


	//構造設定
	this.consName = "consDRsum";					//分野コード
	this.consCode = "DR";						//うちわけ表示のときのアクセス変数
	this.title = "洗濯乾燥";						//分野名として表示される名前
	this.orgCopyNum = 0;							//初期複製数（consCodeがない場合にコピー作成）
	this.sumConsName = "consTotal";				//集約先の分野コード
	this.sumCons2Name = "";						//関連の分野コード
	this.groupID = "5";							//うちわけ番号
	this.color = "#00ffff";						//表示の色
	this.inputGuide = "洗濯機乾燥機の使い方について";		//入力欄でのガイド
	
	this.measureName = [ 
		"mDRheatPump",
		"mDRsolar"
	];
};
DC.init();

//乾燥消費量計算
DC.calc = function( cons ) {
	this.clear();			//結果の消去

	//入力値の読み込み
	this.dryUse =this.input( "i401", 0 );		//乾燥機の利用
	this.person =this.input( "i001", 3 );		//世帯人数

	//乾燥の割合
	this.rateDry = ( this.whDry * this.res2Freq[this.dryUse] ) / ( this.whWash + this.whDry * this.res2Freq[this.dryUse] );

	//月の消費電力量　kWh/月
	this.electricity = ( this.whWash + this.whDry * this.res2Freq[this.dryUse] ) / 1000
									* this.person / 3 
									* 30;
};

//対策計算
DC.calcMeasure = function() {
	this.measures["mDRheatPump"].calcReduceRate( this.rateDry * this.reduceRateHeatPump );
	this.measures["mDRsolar"].calcReduceRate( this.rateDry );
		
};


