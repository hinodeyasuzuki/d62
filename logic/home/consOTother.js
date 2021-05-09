/* 2017/12/10  version 1.0
 * coding: utf-8, Tab as 2 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * consOTother.js
 *
 * calculate consumption and measures other electronics in your hourse
 * total use
 *
 * License: MIT
 *
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 * 								2019/04/28 			original
 */

//resolve D6
var D6 = D6 || {};

//Inherited class of ConsBase
class ConsOTother extends ConsBase {

	//initialize
	constructor() {
		super();

		//construction setting
		this.consName = "consOTother"; //code name of this consumption
		this.consCode = "OT"; //short code to access consumption, only set main consumption user for itemize
		this.title = "others"; //consumption title name
		this.orgCopyNum = 1; //original copy number in case of countable consumption, other case set 0
		this.sumConsName = ""; //code name of consumption sum up include this
		this.sumCons2Name = "consTotal"; //code name of consumption related to this
		this.groupID = "9"; //number code in items
		this.color = "#a9a9a9"; //color definition in graph
		this.residueCalc = "no"; //evaluate residue as #0 or not	no/sumup/yes

		//guide message in input page
		this.inputGuide = "usage of other electronics";

		//機器の情報
		//0:名前 1:ワット数 2:使用時間（時間/日） 3:使用日(日/年）→初期値 4:コメント
		this.eq_list = [
			[
				"ノートパソコン",
				20,
				2,
				365,
				"使用時の消費電力は、ラベル表示より小さくなります。"
			],
			[
				"デスクトップパソコン",
				200,
				2,
				365,
				"ノートパソコンのほうが消費電力が少なくなります。"
			],
			[
				"インターネットモデム",
				10,
				24,
				365,
				"モデム、ルータなど複数の機器がある場合があります。"
			],
			["電話・FAX", 5, 24, 365, "消費電力はもっと少ないタイプもあります。"],
			["携帯電話充電", 5, 1, 365, "充電器の待機電力はほとんどありません。"],
			[
				"据置ゲーム機",
				100,
				4,
				365,
				"これ以外にテレビの電気がかかります。携帯型のほうが消費電力が少なくなります。"
			],
			[
				"携帯ゲーム機",
				5,
				4,
				365,
				"ゲームを使用する時間で換算しています。電池駆動のため省エネの工夫がされています。"
			],
			[
				"録画機器",
				30,
				4,
				365,
				"通常は待機電力は小さいですが、「瞬間起動」を設定していると稼働中と同じくらい消費します。"
			],
			[
				"炊飯器",
				500,
				0.5,
				365,
				"2合を2回炊く設定です。まる1日保温を続けると同じ程度の電気を消費してしまいます。"
			],
			[
				"電子レンジ",
				1000,
				0.17,
				365,
				"消費電力は大きいですが、使用時間が短く、活用することで省エネにすることもできます。"
			],
			[
				"トースター",
				1000,
				0.17,
				365,
				"消費電力は大きいですが、使用時間が短くなっています。"
			],
			[
				"掃除機",
				500,
				0.17,
				365,
				"強弱の設定により消費電力が大きく変わる機種もあります。"
			],
			["除湿機", 500, 6, 104, "エアコンの除湿より効率は悪くなっています。"],
			[
				"加湿機",
				100,
				6,
				182,
				"断熱が弱い家では、使い過ぎると窓や壁で結露を起こす危険があります。"
			],
			[
				"空気清浄機",
				20,
				24,
				365,
				"長時間使用することで、多くの電気を消費する傾向があります。"
			],
			[
				"ヘアドライヤー",
				1000,
				0.17,
				365,
				"消費電力が大きい機器です。タオルでよく拭いてから使うと少なくなります。"
			],
			[
				"換気扇",
				30,
				8,
				365,
				"長時間使用することで、多くの電気を消費する傾向があります。"
			],
			[
				"換気システム",
				50,
				24,
				365,
				"長時間使用することで、多くの電気を消費する傾向があります。"
			],
			[
				"浄化槽ポンプ",
				50,
				24,
				365,
				"長時間使用することで、多くの電気を消費する傾向があります。"
			],
			[
				"熱帯魚水槽",
				50,
				24,
				365,
				"長時間使用することで、多くの電気を消費する傾向があります。"
			],
			[
				"パイプ凍結防止",
				100,
				12,
				104,
				"水道管の破裂を防ぐためですが、断熱材を十分に使うなどで消費電力を減らすこともできます。"
			],
			["そのほか", 5, 0.03, 1, "考えられるものを試してみてください。"]
		];
		this.subName = " ";
	}

	precalc() {
		this.clear();
		this.name = this.input("i653" + this.subID, ""); //name
		this.watt = this.input("i654" + this.subID, 0); //watt
		this.hour = this.input("i655" + this.subID, 0); //use hour / day
		this.day = this.input("i656" + this.subID, 0); //use day
		this.reduceRate = this.input("i657" + this.subID, 0) / 10; //reduce rate
	}

	calc() {
		this.electricity = this.watt * this.hour * this.day / 12 / 1000; //kWh/month
	}

	calcMeasure() {
		//mOTother
		/*
		this.measures["mOTother"].calcReduceRate(this.reduceRate);
		if (this.reduceRate == 1) {
			this.measures["mOTother"].title = this.name + "を使用しない";
		} else {
			this.measures["mOTother"].title =
				this.name + "の使用を" + this.reduceRate * 10 + "割減らす";
		}
		*/
	}

}


