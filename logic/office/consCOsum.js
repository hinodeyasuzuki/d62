/**
* Home-Eco Diagnosis for JavaScript
* 
* D6.ConsCOsum
* 冷房全体消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/09/05 冷房クラスに変換
*								2011/10/21 冷房簡易計算を実装
* 								2016/04/12 js
*/

class ConsCOsum extends ConsBase {
	//初期設定値
	constructor() {
		super();
		this.coolLoadUnit_Wood = 220 / 3;			//標準冷房負荷（W/m2）
		this.coolLoadUnit_Steel = 145 / 3;		//標準冷房負荷鉄筋住宅の場合（W/m2）
		this.apf = 4;							//エアコンAPF

		this.reduceRateSunCut = 0.1;			//日射カットによる消費削減率

		//構造設定
		this.consName = "consCOsum";			//分野コード
		this.consCode = "CO";					//うちわけ表示のときのアクセス変数
		this.title = "冷房";					//分野名として表示される名前
		this.orgCopyNum = 0;					//初期複製数（consCodeがない場合にコピー作成）
		this.sumConsName = "consTotal";			//集約先の分野コード
		this.sumCons2Name = "consACsum";		//関連の分野コード
		this.groupID = "2";						//うちわけ番号
		this.color = "#0000ff";				//表示の色
		this.inputGuide = "全体の冷房の使い方について";		//入力欄でのガイド

	}

	//冷房消費量計算
	calc() {
		this.clear();			//結果の消去

		//入力値の読み込み
		//全体なので、部屋毎の設定は読み込まない
		this.business = D6.consShow["TO"].business;			//業種
		this.floor = D6.consShow["TO"].floor;				//床面積 m2
		this.workDay = D6.consShow["TO"].workDay;			//週日数

		this.buidType = this.input("i004", 1);		//木造・鉄筋
		this.coolTime = D6.consShow["TO"].workTime;	//冷房時間
		this.coolTemp = this.input("i216", 27);		//冷房設定温度
		this.coolMonth = this.input("i008", 6);		//冷房期間
		this.loadBusiness =
			(this.business == 5 ? 3 : 1);
		//事業形態による重み付け
		var coolKcal = this.calcCoolLoad() * this.loadBusiness * this.workDay / 7;

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

	}


	//対策計算 consP
	consCOsum() {
	};


	//冷房負荷計算 kcal/月
	//
	//		cons.buidType : 建物の形態
	//		cons.floot : 延べ床面積(m2)
	//		cons.heatArea : 冷暖房範囲(-)
	calcCoolLoad() {
		var energyLoad = 0;
		this.coolArea = 0.3;

		var coolLoadUnit = 0;				//冷房負荷原単位　kcal/m2/hr
		if (this.buidType == 1) {
			coolLoadUnit = this.coolLoadUnit_Wood;
		} else {
			coolLoadUnit = this.coolLoadUnit_Steel;
		}

		var coolArea_m2;				//冷房面積 m2
		coolArea_m2 = this.floor * this.coolArea;

		var coolTime;					//冷房時間（時間）
		coolTime = this.coolTime;

		//冷房係数
		var coolMonth = D6.area.seasonMonth.summer;
		var coolFactor = D6.area.getCoolFactor(coolMonth, coolTime);

		var coefTemp;					//設定温度による負荷係数
		coefTemp = (27 - this.coolTemp) / 10 + 1;

		energyLoad = coolLoadUnit * coolFactor[0] * coolArea_m2 * coolTime * 30 * coefTemp;

		return energyLoad;

	}
}

