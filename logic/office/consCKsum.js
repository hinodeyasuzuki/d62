/**
* Home-Eco Diagnosis for JavaScript
* 
* D6.consCKsum
* 調理全体消費量
* 
* @author Yasufumi SUZUKI 	2011/11/04 diagnosis5
*/


class ConsCKsum extends ConsBase {
	//初期設定値
	constructor() {
		super();
		//構造設定
		this.consName = "consCKsum";		//分野コード
		this.consCode = "CK";				//うちわけ表示のときのアクセス変数
		this.title = "調理";				//分野名として表示される名前
		this.orgCopyNum = 0;				//初期複製数（consCodeがない場合にはこの分のコピーが作成）
		this.sumConsName = "consTotal";		//集約先の分野コード
		this.sumCons2Name = "";				//関連の分野コード
		this.groupID = "4";					//うちわけ番号
		this.color = "#ffe4b5";				//表示の色
		this.residueCalc = "no";			//残余の計算
		this.inputGuide = "調理について";		//入力欄でのガイド

		this.measureName = [];

	}


	//調理消費量計算
	calc() {
		this.clear();			//結果の消去

		this.business = D6.consShow["TO"].business;			//業種
		this.floor = D6.consShow["TO"].floor;				//床面積 m2

		this.seat = this.input("i009",
			(this.business == 5 ? Math.round(this.floor / 5) + 1 : 0));
		//座席数
		if (D6.consShow["TO"].gas > 0) {
			this.gas = this.seat * 0.5 * 30;
		} else {
			this.electricity = this.seat * 5 * 30;
		}
	}


	//対策計算
	calcMeasure() {
	}
}


