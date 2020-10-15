/**
* Home-Eco Diagnosis for JavaScript
* 
* D6.ConsCO
* 部屋冷房消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/09/05 冷房クラスに変換
*								2011/10/21 冷房簡易計算を実装
* 								2016/04/12 js
*/

D6.consCO = Object.create( D6.consCOsum );
DC = D6.consCO;


//初期設定値
DC.init = function() {

	//構造設定
	this.consName = "consCO";			//分野コード
	this.consCode = "";					//うちわけ表示のときのアクセス変数
	this.title = "冷房";				//分野名として表示される名前
	this.orgCopyNum = 1;				//初期複製数（consCodeがない場合にコピー作成）
	this.addable = "冷暖房するエリア";		//追加可能
	this.sumConsName = "consCOsum";		//集約先の分野コード
	this.sumCons2Name = "consAC";		//関連の分野コード
	this.groupID = "2";					//うちわけ番号
	this.color = "#0000ff";				//表示の色
	this.countCall = "エリア目";			//呼び方
	this.inputGuide = "部屋・エリアごとの冷房の使い方について";		//入力欄でのガイド

	this.measureName = [ 
		"mCOtemplature",
		"mCOroof",
		"mCObrind",
		"mCOoutunitsolar",
		"mCOcurtain",
		"mCOwindow"
	];

};
DC.init();

//冷房消費量計算
DC.calc = function() {
	this.clear();			//結果の消去

	//入力値の読み込み
	//全体なので、部屋毎の設定は読み込まない
	this.business = D6.consShow["TO"].business;			//業種
	this.floor = this.input( "i092" + this.subID, this.sumCons.floor/2 );	//床面積 m2

	this.buidType = this.input( "i004", 1 );		//木造・鉄筋
	this.coolTime  = this.input( "i002", 8 );		//冷房時間
	this.coolTemp  = this.input( "i214" + this.subID, 27 );		//冷房設定温度
	this.sunWest  = this.input( "i217" + this.subID, 2 );		//西日
	this.coolMonth  = this.input( "i008", 6 );		//冷房期間

	var coolKcal = this.calcCoolLoad();

	//年平均値への換算（季節分割をしている場合にはここでするべきではない）
	coolKcal *= this.coolMonth * 30 / 12;

	this.electricity = coolKcal / this.apf / D6.Unit.calorie.electricity;
	//月の消費電力量　kWh/月

	/*
	//季節別の光熱費より、負荷計算のほうが適切
	var season = D6.consShow["TO"].seasonPrice;
	//電気
	this.electricity = (season[0][2] - season[0][1] )*	D6.area.seasonMonth.winter / 12 / D6.Unit.price.electricity;
	if ( this.electricity < 0 ) this.electricity = 0;
	//gas
	this.gas = ( season[1][2] - season[1][1] ) * D6.area.seasonMonth.winter / 12 / D6.Unit.price.gas;
	//灯油
	this.kerosene = (season[2][2] - season[2][1] )*	D6.area.seasonMonth.winter / 12 / D6.Unit.price.kerosene;
	*/

};


//対策計算 consP
DC.calcMeasure = function() {
	if ( this.coolTemp <= 27 ) {
		this.measures["mCOtemplature"].calcReduceRate(0.1* (20 - this.coolTemp ) );	//	冷房の設定温度を控えめにする
	}
	this.measures["mCOroof"].calcReduceRate(0.01);	//	屋根面に表面反射塗料を塗る
	if ( this.sunWest <= 2 && this.sunWest >= 1 ){
		this.measures["mCObrind"].calcReduceRate(0.03 * (3-this.sunWest));	//	冷房時にブラインドを閉める
		this.measures["mCOcurtain"].calcReduceRate(0.02 * (3-this.sunWest));	//	冷房時に日射を遮る
	}
	this.measures["mCOoutunitsolar"].calcReduceRate(0.02);	//	冷房時に室外機が直射日光に当たらないようにする
	this.measures["mCOwindow"].calcReduceRate(0.05);	//	外気を活用して空調を止める

};


