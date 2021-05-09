/**
* Home-Eco Diagnosis for JavaScript
* 
* consAC
* 部屋の冷暖房消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/09/05 暖房クラスに変換
*								2011/10/21 暖房簡易計算を実装
*/


class ConsAC extends ConsBase {

	//初期設定値
	constructor() {
		super();
		//構造設定
		this.consName = "consAC";				//分野コード
		this.consCode = "";						//うちわけ表示のときのアクセス変数
		this.title = "部屋空調";					//分野名として表示される名前
		this.orgCopyNum = 1;					//初期複製数（consCodeがない場合にコピー作成）
		this.sumConsName = "";					//集約先の分野コード
		this.sumCons2Name = "";					//関連の分野コード
		this.inputDisp = "consCO";				//入力欄を表示する分野コード
		this.groupID = "2";						//うちわけ番号
		this.color = "#ff0000";				//表示の色
		this.countCall = "部屋目";				//呼び方
		this.inputGuide = "";					//入力欄でのガイド

		//対策の関連定義
		this.measureName = [
			//		"mACreplaceHeat",
			"mACreplace"
		];

		//これが定義されている場合には、分割を明確に定義する
		this.consAddSet = [
			"consCO",
			"consHT"
		];

	}


	//冷暖房消費量計算
	//
	calc() {
		this.clear();			//結果の消去

		this.acYear = this.input("i215" + this.subID, 6);	//エアコン使用年数
		this.acPerf = this.input("i216" + this.subID, 2);	//エアコン省エネ型1　でない2
		this.acFilter = this.input("i217" + this.subID, -1);	//フィルター掃除

		if (this.subID != 0) {
			this.mesTitlePrefix = this.subID + "部屋目";
		}

	}

	calc2nd() {
		//冷房と暖房の加算
		this.acHeat = D6.consListByName["consHT"][this.subID];
		this.acCool = D6.consListByName["consCO"][this.subID];
		this.copy(this.acHeat);
		this.add(this.acCool);

	}

	//対策計算
	calcMeasure() {
		var mes;	//よく使う場合

		mes = this.measures["mACreplace"];
		mes.copy(this);
		if (this.acHeat.heatEquip == 1) {
			//暖房をエアコンでしている場合
			mes.electricity = this.electricity * this.acHeat.apf / this.acHeat.apfMax;
			//分割評価
			mes["consHT"] = new Energy();
			mes["consHT"].copy(this.acHeat);
			mes["consHT"].electricity = this.acHeat.electricity * this.acHeat.apf / this.acHeat.apfMax;
		} else {
			mes.electricity -= this.acCool.electricity * (1 - this.acHeat.apf / this.acHeat.apfMax);
		}
		//分割評価
		mes["consCO"] = new Energy();
		mes["consCO"].copy(this.acCool);
		mes["consCO"].electricity = this.acCool.electricity * this.acHeat.apf / this.acHeat.apfMax;

		if (this.acHeat.heatArea > 0.3
			&& this.acHeat.houseSize > 60
		) {
			var num = Math.round(Math.max(this.acHeat.houseSize * this.acHeat.heatArea, 25) / 25);
			mes.priceNew = num * mes.def["price"];
		}
	}
}




