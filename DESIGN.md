# D62 家庭エコ診断システム 設計書

> バージョン: 6.rev.2  
> 最終更新: 2026-06-20  
> 著者: Yasufumi Suzuki, Hinodeya Institute for Ecolife co.Ltd.

---

## 目次

1. [システム概要](#1-システム概要)
2. [全体アーキテクチャ](#2-全体アーキテクチャ)
3. [ディレクトリ構成](#3-ディレクトリ構成)
4. [コアエンジン (D6)](#4-コアエンジンd6)
5. [エネルギー消費計算](#5-エネルギー消費計算)
6. [対策（措置）計算](#6-対策措置計算)
7. [地域・単位設定](#7-地域単位設定)
8. [多言語・多地域対応](#8-多言語多地域対応)
9. [家庭診断と事業所診断の違い](#9-家庭診断と事業所診断の違い)
10. [ビューレイヤー](#10-ビューレイヤー)
11. [データフロー](#11-データフロー)
12. [ビルドシステム](#12-ビルドシステム)
13. [主要クラス・オブジェクト関連図](#13-主要クラスオブジェクト関連図)
14. [計算例](#14-計算例)
15. [サードパーティライブラリ](#15-サードパーティライブラリ)

---

## 1. システム概要

### 1.1 目的

エネルギー消費に関する簡単なアンケート入力をもとに、CO2排出量の分析を行い、約60項目のCO2排出削減対策の中から効果的なものを計算して提案するソフトウェアです。

### 1.2 対象

- **家庭向け（Home）**: 住宅のエネルギー消費診断（基本モード）
- **事業所向け（Office）**: 小規模事業者のエネルギー消費診断

### 1.3 主な機能

| 機能 | 説明 |
|------|------|
| エネルギー消費分析 | 電気・ガス・灯油・ガソリン等のエネルギー消費量とCO2排出量を算出 |
| 対策提案 | 約60項目の省エネ対策から、入力に基づき効果的な対策を提案 |
| コスト計算 | 対策導入による年間コスト削減額・投資回収年数を算出 |
| ベンチマーク | 地域平均との比較、100段階ランキング表示 |
| 月別分析 | 季節変動を考慮した月別エネルギー消費パターン |
| 多言語対応 | 日本語・英語・中国語・フランス語・韓国語・ベトナム語 |
| 太陽光発電対応 | 自家消費・売電を考慮したCO2計算 |

### 1.4 技術スタック

- **フロントエンド**: HTML / CSS / JavaScript（Vanilla JS）
- **計算エンジン**: Web Worker による非同期計算
- **サーバーサイド**: PHP（パラメータ設定・言語切替のみ）
- **ビルドツール**: Grunt（concat + terser による minify）
- **グラフ描画**: Chart.js / D3.js / Dimple.js
- **UI補助**: jQuery / leanModal / Intro.js

---

## 2. 全体アーキテクチャ

### 2.1 レイヤー構成

```
┌─────────────────────────────────────────────────┐
│  エントリーポイント (index.html / index.php)     │
├─────────────────────────────────────────────────┤
│  ビューレイヤー (view/)                          │
│  ┌──────────┬────────────┬──────────────────┐   │
│  │ main.js  │createpage.js│  graph.js       │   │
│  │(イベント) │(HTML生成)   │(グラフ描画)     │   │
│  └──────────┴────────────┴──────────────────┘   │
├──────────── postMessage ────────────────────────┤
│  ファサードレイヤー (d6facade.js)                │
│  [Web Worker メッセージブローカー]               │
├─────────────────────────────────────────────────┤
│  計算エンジン (logic/base/)                      │
│  ┌──────────────────────────────────────────┐   │
│  │ D6 コントローラ (d6.js + d6_*.js × 9)   │   │
│  ├──────────────────────────────────────────┤   │
│  │ ConsBase (消費計算基底クラス)             │   │
│  │   └─ 具体消費クラス × 30〜55             │   │
│  ├──────────────────────────────────────────┤   │
│  │ MeasureBase (対策基底クラス)              │   │
│  │   └─ 具体対策インスタンス × 約60         │   │
│  ├──────────────────────────────────────────┤   │
│  │ Energy (エネルギー単位計算)               │   │
│  └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│  設定レイヤー                                    │
│  ┌──────────┬────────────┬──────────────────┐   │
│  │ area.js  │  unit.js   │ scenarioset.js  │   │
│  │(地域設定) │(単位設定)  │(シナリオ定義)   │   │
│  └──────────┴────────────┴──────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 2.2 設計パターン

| パターン | 適用箇所 | 目的 |
|----------|----------|------|
| Facade | d6facade.js | View と計算エンジン間のメッセージング抽象化 |
| Factory | d6_construct.js | 消費クラス・対策インスタンスの動的生成 |
| Composite | ConsBase 親子関係 | 消費量の階層的集約 |
| Observer | Web Worker postMessage | UI と計算の非同期通信 |
| Strategy | scenariofix.js | 地域別計算ロジックの差し替え |
| Template Method | ConsBase.precalc/calc/calc2nd | 消費計算の共通フロー |

---

## 3. ディレクトリ構成

```
d62/
├── index.html              # 本番用エントリーポイント（minified版読込）
├── index.php               # PHP版エントリーポイント（言語・モード管理）
├── index_develop.html      # 開発用エントリーポイント（非圧縮版読込）
├── index_develop_zh.html   # 開発用（中国語版）
├── index_biz.html          # 事業所用エントリーポイント
├── index_notmin.html       # 非minified版
│
├── logic/                  # メインロジック（共通・英語デフォルト）
│   ├── d6facade.js         #   Facade / Web Worker メッセージブローカー
│   ├── api.js              #   外部API連携
│   │
│   ├── base/               #   コアエンジン
│   │   ├── d6.js           #     D6 名前空間・コレクション定義
│   │   ├── d6_construct.js #     シナリオ構築・初期化
│   │   ├── d6_calccons.js  #     消費量計算・調整
│   │   ├── d6_calcmeasures.js #  対策効果計算
│   │   ├── d6_calcaverage.js #   平均比較・ランキング
│   │   ├── d6_calcmonthly.js #   月別計算
│   │   ├── d6_get.js       #     結果取得（表示用データ整形）
│   │   ├── d6_getinput.js  #     入力情報取得
│   │   ├── d6_getmeasure.js #    対策情報取得
│   │   ├── d6_getdemand.js #     需要推計取得
│   │   ├── d6_getevaluateaxis.js # 評価軸算出
│   │   ├── d6_setvalue.js  #     入力値設定
│   │   ├── d6_tools.js     #     ユーティリティ
│   │   ├── consbase.js     #     消費計算基底クラス
│   │   ├── measurebase.js  #     対策基底クラス
│   │   ├── energy.js       #     エネルギー単位変換
│   │   ├── objectcreate.js #     オブジェクト生成ヘルパー
│   │   └── doc.js          #     データ永続化（シリアライズ）
│   │
│   ├── areaset/            #   地域・単位設定（デフォルト）
│   │   ├── area.js         #     地域パラメータ（気候・電力会社）
│   │   ├── unit.js         #     単位定義（CO2係数・単価・換算）
│   │   ├── accons.js       #     空調消費設定
│   │   ├── acload.js       #     空調負荷設定
│   │   └── acadd.js        #     空調追加設定
│   │
│   ├── home/               #   家庭用消費クラス群
│   │   ├── scenarioset.js  #     シナリオ定義（対策・入力項目・logicList）
│   │   ├── scenariofix.js  #     パラメータ上書き（※ベースは空、各logic_XX/で上書き）
│   │   ├── consTOTAL.js    #     全体合計
│   │   ├── consEnergy.js   #     エネルギー全般
│   │   ├── consSeason.js   #     季節パターン
│   │   ├── consAC.js       #     空調（統合ノード）
│   │   ├── consACcool.js   #     冷房
│   │   ├── consACheat.js   #     暖房（エアコン）
│   │   ├── consHTcold.js   #     暖房（寒冷地）
│   │   ├── consHTsum.js    #     暖房合計
│   │   ├── consHWsum.js    #     給湯合計
│   │   ├── consHWshower.js #     シャワー
│   │   ├── consHWtub.js    #     浴槽
│   │   ├── consHWdishwash.js #   食洗機
│   │   ├── consHWdresser.js #    洗面
│   │   ├── consHWtoilet.js #     温水洗浄便座
│   │   ├── consRF.js       #     冷蔵庫
│   │   ├── consRFsum.js    #     冷蔵庫合計
│   │   ├── consLI.js       #     照明
│   │   ├── consLIsum.js    #     照明合計
│   │   ├── consTV.js       #     テレビ
│   │   ├── consTVsum.js    #     テレビ合計
│   │   ├── consCR.js       #     自動車
│   │   ├── consCRsum.js    #     自動車合計
│   │   ├── consCRtrip.js   #     通勤
│   │   ├── consCKcook.js   #     調理（コンロ）
│   │   ├── consCKpot.js    #     調理（電気ポット）
│   │   ├── consCKrice.js   #     調理（炊飯器）
│   │   ├── consCKsum.js    #     調理合計
│   │   ├── consCOsum.js    #     冷房合計
│   │   ├── consDRsum.js    #     洗濯合計
│   │   └── consOTother.js  #     その他
│   │
│   └── office/             #   事業所用消費クラス群
│       ├── scenarioset.js  #     シナリオ定義（事業所用・logicList）
│       ├── scenariofix.js  #     パラメータ上書き（※ベースは空、各logic_XX/で上書き）
│       ├── consTOTAL.js    #     全体合計
│       ├── consEnergy.js   #     エネルギー全般
│       ├── consMonth.js    #     月別消費
│       ├── consSeason.js   #     季節パターン
│       ├── consRM.js       #     室設定
│       ├── consAC.js       #     空調
│       ├── consACsum.js    #     空調合計
│       ├── consHT.js       #     暖房
│       ├── consHTsum.js    #     暖房合計
│       ├── consHWsum.js    #     給湯合計
│       ├── consCO.js       #     冷房
│       ├── consCOsum.js    #     冷房合計
│       ├── consRF.js       #     冷蔵庫
│       ├── consRFsum.js    #     冷蔵庫合計
│       ├── consLI.js       #     照明
│       ├── consLIsum.js    #     照明合計
│       ├── consOT.js       #     OA機器
│       ├── consOTsum.js    #     OA機器合計
│       ├── consOAsum.js    #     事務機器合計
│       ├── consCR.js       #     車両
│       ├── consCRsum.js    #     車両合計
│       ├── consCRtrip.js   #     通勤
│       ├── consCKsum.js    #     調理合計
│       ├── consDRsum.js    #     清掃合計（※ファイルは存在するがlogicListには未登録）
│       └── consElecTime.js #     時間帯別電力（※ファイルは存在するがlogicListには未登録）
│
├── logic_JP/               # 日本語・日本地域用ロジック
│   ├── areaset/            #   日本の地域パラメータ
│   │   ├── area.js         #     都道府県・電力会社・気候帯
│   │   ├── accons.js       #     日本のエアコン性能データ
│   │   ├── acload.js       #     日本の空調負荷データ
│   │   └── acadd.js        #     追加空調設定
│   ├── home/
│   │   ├── scenariofix.js  #     家庭用パラメータ上書き
│   │   └── consHTsum.js    #     暖房合計（日本固有計算）
│   └── office/
│       └── scenariofix.js  #     事業所用パラメータ上書き
│
├── logic_JP_en/            # 日本地域・英語UI
├── logic_CN/               # 中国語・中国地域用
├── logic_FR/               # フランス語・フランス地域用
├── logic_KR/               # 韓国語・韓国地域用
├── logic_VI/               # ベトナム語・ベトナム地域用
│
├── view/                   # ビューレイヤー
│   ├── main.js             #   メインコントローラ（Worker管理）
│   ├── createpage.js       #   HTML動的生成
│   ├── graph.js            #   グラフ描画
│   ├── common.css          #   共通スタイル
│   ├── js/
│   │   └── jquery.cookie.js #  Cookie管理
│   └── view_base/
│       ├── onclick-base.js  #  イベントハンドラ
│       ├── template-base.html # テンプレート
│       └── layout-base.css  #  レイアウト
│
├── dist_sample/            # minified版サンプル
│   ├── d6home_core.min.js  #   家庭用コアバンドル
│   ├── d6home_JP.min.js    #   家庭用日本語バンドル
│   ├── d6office_core.min.js #  事業所用コアバンドル
│   └── d6office_JP.min.js  #   事業所用日本語バンドル
│
├── Gruntfile.js            # ビルド設定
├── package.json            # npm依存関係
├── .eslintrc.js            # ESLint設定
└── LICENSE                 # MITライセンス
```

---

## 4. コアエンジン（D6）

### 4.1 D6 名前空間の構造

D6 はシステム全体の中核となるグローバル名前空間であり、以下の主要コレクションとプロパティを管理します。

```
D6 (グローバル名前空間)
│
├── consList[]              消費クラスインスタンスの配列（生成順）
├── consListByName{}        消費クラスを名前で参照するハッシュ
├── consShow{}              2文字コードで主要消費を参照するハッシュ
│                           例: "TO"→consTOTAL, "AC"→consAC, "CO"→consCOsum
├── measureList[]           全対策インスタンスの配列
├── resMeasure[]            計算済み対策結果（表示用）
├── monthly[]               12ヶ月×エネルギー種別のデータ
│
├── average                 平均値データ（比較用ベンチマーク）
├── isOriginal              対策未選択フラグ（true=初期状態）
├── sortTarget              対策ソートキー（デフォルト: "co2ChangeOriginal"）
│
├── doc                     データ永続化オブジェクト（D6.doc.data[]に入力値格納）
├── area                    地域設定オブジェクト
├── scenario                シナリオ定義オブジェクト
└── Unit                    単位定義オブジェクト
```

### 4.2 D6 モジュール一覧

D6 の機能は9つのモジュールファイルに分割されています。

| ファイル | 主要メソッド | 役割 |
|----------|-------------|------|
| d6.js | - | 名前空間定義、コレクション初期化 |
| d6_construct.js | `construct()`, `setscenario()`, `addMeasureEachCons()`, `addConsSetting()` | システム初期化、消費/対策インスタンスの構築 |
| d6_calccons.js | `calcCons()`, `calcConsAdjust()`, `getTargetConsList()` | 消費量計算の実行、エネルギーバランス調整 |
| d6_calcmeasures.js | `calcMeasures()`, `calcMeasuresOne()`, `clearSelectedMeasures()`, `calcMaxMeasuresList()` | 対策効果の計算、対策の選択・累積計算 |
| d6_calcaverage.js | `calcAverage()`, `rankIn100()` | 地域平均との比較、パーセンタイルランキング |
| d6_calcmonthly.js | `calcMonthly()` | 月別消費パターンの推計 |
| d6_get.js | `getAllResult()`, `getAverage()`, `getItemize()`, `getItemizeGraph()`, `getMonthly()` | 計算結果のView向けデータ整形 |
| d6_getinput.js | `getInputPage()`, `getInputDemandSumup()` | 入力フォーム・需要推計の情報取得 |
| d6_getmeasure.js | `getMeasureList()`, `getMeasureDetail()` | 対策一覧・詳細の取得 |
| d6_getdemand.js | `getDemandGraph()` | 需要グラフ用データ取得 |
| d6_getevaluateaxis.js | `getEvaluateAxisPoint()` | 多軸評価指標の算出 |
| d6_setvalue.js | `inSet()`, `measureAdd()`, `measureDelete()` | ユーザー入力値・対策選択の設定 |
| d6_tools.js | `ObjArraySort()`, `toHalfWidth()` | 汎用ユーティリティ |

### 4.3 初期化フロー

`construct` は `setscenario` のみ呼び出します。`calculateAll` は d6facade.js の workercalc("start") 内で construct の後に別途呼ばれます。

```
[d6facade.js workercalc("start")]
  │
  ├─ D6.construct(prohibitQuestions, allowedQuestions, defInput)
  │    └─ D6.setscenario()
  │         ├─ scenario.setDefs()            対策・入力項目の定義ロード
  │         ├─ scenario.areafix()            地域別修正
  │         ├─ scenario.getLogicList()       消費クラスの定義リスト取得
  │         │    └─ 各消費クラスのインスタンス生成  new ConsXX()
  │         ├─ 親子関係のリンク構築            sumCons / partCons
  │         ├─ D6.addMeasureEachCons()       各消費クラスに対策を紐付け
  │         └─ 入力項目の初期値設定            D6.inSet(iname, defaultValue)
  │
  ├─ D6.doc.loadDataSet(rdata)              保存データのロード（存在する場合）
  │
  └─ D6.calculateAll()                      初回計算の実行
       ├─ D6.area.setCalcBaseParams()       地域パラメータ設定
       ├─ D6.calcAverage()                  平均比較（内部でcalcCons実行）
       └─ D6.calcMeasures(-1)              全対策効果計算（内部でcalcCons実行）
```

※ `calculateAll` は `calcCons()` を直接呼び出しません。`calcCons()` は `calcAverage()` 内部と `calcMeasures()` 内部の `clearSelectedMeasures()` から間接的に呼ばれます。

---

## 5. エネルギー消費計算

### 5.1 クラス階層

```
Energy (エネルギー基底クラス)
  │
  │  エネルギー種別プロパティ:
  │    electricity       電力消費量 (kWh)
  │    nightelectricity  夜間電力消費量 (kWh)
  │    sellelectricity   売電量 (kWh)
  │    nagas             都市ガス消費量 (m³)
  │    lpgas             LPガス消費量 (m³)
  │    kerosene          灯油消費量 (L)
  │    gasoline          ガソリン消費量 (L)
  │    lightoil          軽油消費量 (L)
  │    heavyoil          重油消費量 (L)
  │    coal              石炭消費量
  │    biomass           バイオマス消費量
  │    hotwater          温水消費量
  │    waste             廃棄物
  │    water             水道使用量 (m³)
  │    gas               ガス消費量 (m³, nagasのエイリアス的に使用)
  │    car               自動車燃料消費量 (L, gasolineのエイリアス的に使用)
  │
  │  計算結果プロパティ:
  │    co2           CO2排出量 (kg-CO2)
  │    cost          コスト (円)
  │    jules         エネルギー量 (MJ)
  │
  │  メソッド:
  │    add(energy)            加算
  │    sub(energy)            減算
  │    multiply(ratio)        乗算
  │    multiplyArray(marray)  エネルギー種別ごとに異なる係数で乗算
  │    copy(source)           別インスタンスの値をコピー
  │    isSame(target)         値の一致判定
  │    calcCO2()              CO2排出量計算
  │    calcCost()             コスト計算
  │    calcJules()            エネルギー量計算
  │    calcHeat(apf)          熱量計算
  │
  └── ConsBase (消費計算基底クラス)
       │
       │  追加プロパティ:
       │    title          表示名
       │    consName       内部名（例: "consACcool"）
       │    consCode       2文字コード（例: "AC"）
       │    groupID        グループID
       │    color          表示色
       │    sumCons        親消費クラスへの参照
       │    partCons[]     子消費クラスの配列
       │    measures[]     紐付く対策の配列
       │    orgCopyNum     複製可能数（部屋数等）
       │
       │  計算メソッド（テンプレートメソッドパターン）:
       │    precalc()      前処理（入力値の取得）
       │    calc()         主計算（消費量算出）
       │    calc2nd()      二次計算（クロスリファレンス）
       │    calcAdjust()   調整計算（エネルギーバランス）
       │    calcMeasure()  対策効果計算
       │
       ├── consTOTAL     全体合計
       ├── consEnergy    エネルギー全般設定
       ├── consSeason    季節パターン
       ├── consAC        空調（統合ノード）
       ├── consACcool    冷房（部屋単位・複製可能）
       ├── consACheat    暖房（エアコン、部屋単位・複製可能）
       ├── consHTcold    暖房（寒冷地用）
       ├── consHTsum     暖房合計
       ├── consHWsum     給湯合計
       ├── consHWshower  シャワー
       ├── consHWtub     浴槽
       ├── consRF        冷蔵庫
       ├── consLI        照明
       ├── consTV        テレビ
       ├── consCR        自動車
       └── ... (計30〜55クラス)
```

### 5.2 消費量の階層構造（家庭の例）

```
consTOTAL (全体合計)
 ├── consEnergy (エネルギー全般)
 ├── consSeason (季節パターン)
 │
 ├── consCOsum (冷房合計) [consShow["CO"]]
 │    └── consACcool[0..N] (部屋ごとの冷房)
 │         └── consAC[0..N] (空調統合ノード)
 │
 ├── consHTsum (暖房合計) [consShow["HT"]]
 │    ├── consACheat[0..N] (エアコン暖房、部屋ごと)
 │    └── consHTcold (寒冷地暖房)
 │
 ├── consHWsum (給湯合計) [consShow["HW"]]
 │    ├── consHWshower (シャワー)
 │    ├── consHWtub (浴槽)
 │    ├── consHWdishwash (食洗機)
 │    ├── consHWdresser (洗面)
 │    └── consHWtoilet (温水洗浄便座)
 │
 ├── consRFsum (冷蔵庫合計) [consShow["RF"]]
 │    └── consRF (冷蔵庫)
 │
 ├── consLIsum (照明合計) [consShow["LI"]]
 │    └── consLI (照明)
 │
 ├── consTVsum (テレビ合計) [consShow["TV"]]
 │    └── consTV (テレビ)
 │
 ├── consCRsum (自動車合計) [consShow["CR"]]
 │    ├── consCR (自動車)
 │    └── consCRtrip (通勤)
 │
 ├── consCKsum (調理合計) [consShow["CK"]]
 │    ├── consCKcook (コンロ)
 │    ├── consCKpot (電気ポット)
 │    └── consCKrice (炊飯器)
 │
 ├── consDRsum (洗濯合計) [consShow["DR"]]
 │
 └── consOTother (その他) [consShow["OT"]]
```

### 5.3 計算フロー

消費量計算は5つのフェーズで実行されます。

#### フェーズ1: 前処理 (precalc)

```javascript
// 入力値の取得と初期設定
precalc() {
    roomSize = this.input("i212", 20);    // 部屋面積 (m²)
    acYear = this.input("i215", 2015);    // エアコン設置年
    acPerf = this.input("i216", 2);       // 性能レベル
    // エネルギーアキュムレータのクリア
    this.clear();
}
```

#### フェーズ2: 主計算 (calc)

```javascript
// 消費量の算出（消費クラスごとに計算式が異なる）
calc() {
    // 例: 冷房消費量
    apf = getAPF(acYear, acPerf);         // 年間エネルギー効率
    coolingLoad = roomSize * (Tset - Tout) * heatCapacity;
    coolingHours = getSummerHours(region);
    this.electricity = coolingLoad * coolingHours / apf / 860;
}
```

#### フェーズ3: 二次計算 (calc2nd)

```javascript
// 他の消費クラスとのクロスリファレンス
calc2nd() {
    // 例: 暖房と冷房の比率調整
    // 例: 太陽光発電による電力の調整
}
```

#### フェーズ4: エネルギーバランス調整 (calcConsAdjust)

実際の光熱費入力と計算結果の乖離を調整します。

```
入力: 電気代 = 10,000円/月  →  計算値: 8,000円/月
調整係数 energyAdj = 10,000 / 8,000 = 1.25
各消費クラスの電力消費量に 1.25 を乗じて調整

調整範囲の制限（d6_calccons.js）:
  電力:      1/4 (0.25) 〜 4.0   (adjustFactorEle = 4)
  その他:    1/2.5 (0.4) 〜 2.5  (adjustFactorOther = 2.5)
  水道:      補正なし（合計値をそのまま使用）
  ※ 価格データなしの場合: adjustFactor = 2 で制限
```

#### フェーズ5: CO2・コスト・エネルギー変換

```javascript
// Energy基底クラスの変換メソッドを使用
calcCO2()  →  co2 = electricity × co2係数 + gas × co2係数 + ...
calcCost() →  cost = electricity × 電力単価 + gas × ガス単価 + ...
calcJules() → jules = electricity × 9.6 + gas × 45 + ...
```

### 5.4 calculateAll の実行順序

```
D6.calculateAll()
  │
  ├─ D6.area.setCalcBaseParams()  地域パラメータ設定
  │
  ├─ D6.calcAverage()             地域平均との比較
  │    ├─ averageMode = true（デフォルト入力値で計算）
  │    ├─ D6.calcCons()           ← ここでcalcConsが呼ばれる
  │    │    ├─ 優先度順にprecalc/calc実行（優先度1〜4）
  │    │    ├─ calc2nd()          二次計算
  │    │    ├─ calcConsAdjust()   エネルギーバランス調整
  │    │    └─ calcCost/calcJules + Original値の保存
  │    ├─ 平均値を average.consList に保存
  │    └─ averageMode = false
  │
  └─ D6.calcMeasures(-1)          全対策の効果計算
       └─ clearSelectedMeasures()
            └─ D6.calcCons()     ← ユーザー入力値でcalcConsが呼ばれる
```

※ `calculateAll` は `calcCons()` を直接呼び出しません（コメントアウト済み）。`calcCons()` は `calcAverage()` と `clearSelectedMeasures()` の内部から間接的に呼ばれます。

---

## 6. 対策（措置）計算

### 6.1 MeasureBase クラス

```
MeasureBase extends Energy
  │
  │  識別情報:
  │    mesID           対策ID
  │    mesdefID        定義ID
  │    groupID         グループID
  │    measureName     内部名（例: "mACcoolSetTemp"）
  │
  │  状態:
  │    selected        ユーザーが選択済みか
  │    available       計算可能か（入力データが十分か）
  │
  │  経済性:
  │    priceNew        新規導入費用
  │    priceOrg        現行設備費用
  │    lifeTime        耐用年数
  │    costTotalChange 年間コスト変化（設備費用按分含む）
  │    payBackYear     投資回収年数
  │
  │  効果:
  │    co2Change       CO2変化量 (kg/年, 負=削減)
  │    co2ChangeOriginal  初期状態での効果
  │    co2ChangeSumup     累積効果（他の対策との合算）
  │
  │  メタデータ:
  │    title           対策名
  │    titleShort      短縮名
  │    advice          アドバイス文
  │    lifestyle       ライフスタイル対策フラグ (1=行動変容, 2=設備導入)
  │    easyness        実施容易度
  │    season          季節 ("s"=夏, "w"=冬, ""=通年)
  │    figNum          図番号
  └─  hojoGov          補助金額
```

### 6.2 対策定義構造 (scenarioset.js)

```javascript
defMeasures["consACcool"] = {
    mid: 2,
    name: "mACcoolSetTemp",
    title: "冷房温度を28℃に設定する",
    easyness: 1,              // 1=最も簡単
    refCons: "consACcool",    // 対象消費クラス
    titleShort: "冷房温度",
    joyfull: "エネルギー節約になります...",
    lifestyle: 1,             // 行動変容型 (1=ライフスタイル, 2=設備導入)
    season: "s",              // 夏季の対策
    figNum: 5,
    lifeTime: 1,              // 1年（ライフスタイル）
    price: 0,                 // 費用（priceNew/priceOrgとして使用）
    hojoGov: 0,               // 補助金なし
    advice: "なぜこの対策が有効か..."
};
```

### 6.3 対策計算パイプライン

```
ユーザーが対策を選択
  │
  ├─ D6.measureAdd(mesID)         選択フラグをON
  │
  └─ D6.calcMeasures(-1)         全対策の再計算
       │
       ├─ clearSelectedMeasures()  ベースラインに戻す
       │    ├─ isOriginal = true
       │    └─ calcCons() でデフォルト消費量を再計算
       │
       ├─ calcMeasuresOne()       ベースラインでの各対策効果を計算
       │    ├─ 各消費クラスの calcMeasureInit()
       │    ├─ 各消費クラスの calcMeasure()
       │    └─ co2ChangeOriginal でソート（削減量大→小）
       │
       └─ 選択済み対策の累積計算（貪欲法）
            │
            ├─ for 対策 in ソート済みリスト:
            │    ├─ if 対策.selected AND co2Change < 0:
            │    │    ├─ addReduction()     消費量に削減を適用
            │    │    ├─ calcMeasuresOne()  残りの対策効果を再計算
            │    │    └─ co2ChangeSumup を更新（累積削減量）
            │    └─ else: スキップ
            │
            └─ 結果: 対策ごとの個別効果 + 累積効果
```

### 6.4 対策の相互作用

対策は独立ではなく、先に選択された対策によって後続の対策効果が変化します。

```
例: 冷房関連の対策選択

初期状態:
  冷房電力消費 = 3,000 kWh/年 → 1,650 kg CO2/年

対策1: 設定温度を28℃に上げる
  削減率: 14% → -231 kg CO2
  選択後の消費: 2,580 kWh/年

対策2: エアコン買い替え（高効率機種）
  ※ 対策1適用後の 2,580 kWh がベースライン
  削減率: 40% × 2,580 = -565 kg CO2
  ※ 独立計算なら 40% × 3,000 = -660 kg CO2 だが、実際はより少ない

累積効果: -231 + (-565) = -796 kg CO2（対話的計算による正確な値）
単純合算: (14% + 40%) × 3,000 = -891 kg CO2（過大評価）
```

### 6.5 自動選択機能 (calcMaxMeasuresList)

最大削減を達成する対策の組み合わせを貪欲法で求めます。

```
1. 全対策を未選択状態にリセット
2. 最大CO2削減の対策を選択
3. 残りの対策効果を再計算
4. 次に最大CO2削減の対策を選択
5. 2-4をN回繰り返し
6. 累積削減量の推移を返却
```

---

## 7. 地域・単位設定

### 7.1 地域パラメータ (area.js)

```javascript
D6.area = {
    // 地域名（都道府県等）
    prefName: ["北海道", "青森", "岩手", ...],

    // 暖房負荷レベル (1=寒冷, 6=温暖)
    prefHeatingLevel: [1, 2, 2, 3, 3, 4, 4, 4, 4, ...],

    // 電力会社エリア対応
    prefToEleArea: [0, 1, 1, 1, 1, 1, 2, 2, 2, ...],

    // 電力会社別CO2排出係数 (kg-CO2/kWh)
    co2ElectCompanyUnit: [0.55, 0.52, 0.46, ...],

    // 電力会社別単価係数
    electCompanyPrice: [1.44, 1.31, 1.0, ...],

    // 主要メソッド
    setPersonArea(pref, areaCode),   // 地域の設定
    setCalcBaseParams(),             // 地域別パラメータの適用
    areafix()                        // シナリオの地域別修正
};
```

### 7.2 単位定義 (unit.js)

```javascript
D6.Unit = {
    // CO2排出係数 (kg-CO2/各単位)
    co2: {
        electricity: 0.55,      // kg-CO2/kWh（地域・電力会社により上書き）
        nightelectricity: 0.55, // kg-CO2/kWh
        sellelectricity: 0.55,  // kg-CO2/kWh
        nagas: 2.23,            // kg-CO2/m³（都市ガス）
        lpgas: 5.98,            // kg-CO2/m³（LPガス）
        kerosene: 2.49,         // kg-CO2/L
        gasoline: 2.32,         // kg-CO2/L
        lightoil: 2.62,         // kg-CO2/L（軽油）
        heavyoil: 3,            // kg-CO2/L（重油）
        water: 0.45,            // kg-CO2/m³
        gas: 2.23,              // kg-CO2/m³
        car: 2.32,              // kg-CO2/L
        // coal, biomass, hotwater, waste も定義あり
    },

    // エネルギー単価 (円/各単位, 2025年値)
    price: {
        electricity: 32.65,     // 円/kWh
        nightelectricity: 25.24,// 円/kWh（夜間）
        sellelectricity: 14.58, // 円/kWh（売電）
        nagas: 164.47,          // 円/m³（都市ガス）
        lpgas: 758.01,          // 円/m³（LPガス）
        kerosene: 140.8,        // 円/L
        gasoline: 170.2,        // 円/L
        water: 333.3,           // 円/m³
        gas: 164.47,            // 円/m³
        car: 170.2,             // 円/L
    },

    // 基本料金 (円/月, 消費ゼロ時の固定費)
    priceBase: {
        electricity: 0,         // 円/月
        nightelectricity: 1950, // 円/月
        nagas: 1350,            // 円/月（都市ガス）
        lpgas: 2200,            // 円/月（LPガス）
        gas: 1350,              // 円/月
    },

    // 一次エネルギー変換係数 (MJ/各単位)
    jules: {
        electricity: 9.6,       // MJ/kWh（一次エネルギー換算）
        nagas: 46,              // MJ/m³
        kerosene: 38,           // MJ/L
        gasoline: 38,           // MJ/L
        gas: 45,                // MJ/m³
        car: 38,                // MJ/L
    },

    // 二次エネルギー (kcal/各単位)
    calorie: {
        electricity: 860,       // kcal/kWh
        nagas: 11000,           // kcal/m³
        lpgas: 36000,           // kcal/m³
        kerosene: 8759,         // kcal/L
        gasoline: 8258,         // kcal/L
    }
};
```

### 7.3 空調関連設定

| ファイル | 内容 |
|----------|------|
| accons.js | エアコン年代別・容量別の消費電力データ、APF（年間エネルギー効率）テーブル |
| acload.js | 地域別・月別の冷暖房負荷データ、外気温データ |
| acadd.js | 追加空調設備（ストーブ、床暖房等）のパラメータ |

---

## 8. 多言語・多地域対応

### 8.1 ローカライズ構造

```
logic/              ← 共通ロジック（英語デフォルト）
logic_JP/           ← 日本語・日本地域
logic_JP_en/        ← 日本地域・英語UI
logic_CN/           ← 中国語・中国地域
logic_FR/           ← フランス語・フランス地域
logic_KR/           ← 韓国語・韓国地域
logic_VI/           ← ベトナム語・ベトナム地域
```

### 8.2 ローカライズの2層構造

#### 第1層: シナリオ定義 (scenarioset.js の setDefs)

共通の `scenarioset.js` 内の `setDefs()` メソッドで対策定義・入力項目・選択肢の文言を定義します。各地域の `scenariofix.js` で対策定義やタイトル等が上書きされます。

```javascript
// logic/home/scenarioset.js の setDefs() 内（Excelシートからコピー）
defMeasures["mACcoolSetTemp"] = {
    mid: 2,
    name: "mACcoolSetTemp",
    refCons: "consACcool",
    title: "Set AC to 28°C (cooling)",
    // ...
};

defInput["i001"] = {
    cons: "consTotal",
    title: "How many people in your household?",
    varType: "Number",
    // ...
};

defSelectValue["sel001"] = ["N/A", "1 person", "2 persons", "3 persons", ...];
```

#### 第2層: パラメータ上書き (scenariofix.js)

各地域の `scenariofix.js` で、基底クラスの英語デフォルト値を上書きします。

```javascript
// logic_JP/home/scenariofix.js
D6.scenario.fix_consParams = function() {
    D6.consAC.title = "部屋空調";
    D6.consACcool.title = "部屋冷房";
    D6.consHTsum.title = "暖房";
    D6.consCR.title = "車";

    // 地域固有の計算パラメータ
    D6.consTotal.seasonConsPattern = [1.4, 1.0, 1.2];
};

D6.scenario.areafix = function() {
    D6.area.prefName = ["北海道", "青森", ...];
    D6.area.prefHeatingLevel = [1, 2, 2, ...];
};
```

### 8.3 ローカライズのビルド

Grunt の concat タスクにより、共通ロジック と 地域別ファイルを**別々のバンドル**として生成します。HTMLが両方を個別にロードします。

```
d6home_core.js        = logic/d6facade + logic/areaset/* + logic/base/* + logic/home/*
d6home_JP.js          = logic_JP/areaset/* + logic_JP/home/*
d6home_core.min.js    = minify(d6home_core.js)   ← 別々にminify
d6home_JP.min.js      = minify(d6home_JP.js)     ← 別々にminify
```

※ KR と VI は家庭用(home)のみ。事業所用(office)のビルドタスクは存在しません。

### 8.4 新しい地域・言語の追加手順

1. Excelシートにて、対策名・アドバイス文・質問文・選択肢を翻訳
2. `logic_XX/` フォルダを作成（XXは国/言語コード）
3. `logic_XX/areaset/` に地域パラメータ（気候帯、電力会社、CO2係数等）を設定
4. `logic_XX/home/scenariofix.js` に翻訳テキストとパラメータ上書きを記述
5. `Gruntfile.js` に新しいconcatタスクを追加
6. `index.php` の言語選択に追加

---

## 9. 家庭診断と事業所診断の違い

### 9.1 対象範囲の比較

| 項目 | 家庭 (Home) | 事業所 (Office) |
|------|------------|----------------|
| 建物タイプ | 戸建・集合住宅 | オフィス・店舗 |
| 空調 | 部屋単位（複製可能） | 建物全体のHVAC |
| 給湯 | シャワー・浴槽・食洗機等個別 | 一括 |
| 照明 | 部屋・器具単位 | 床面積単位 (m²) |
| 車両 | 個人車・バイク | 社用車・フリート |
| 調理 | コンロ・ポット・炊飯器 | 簡易（合計のみ） |
| テレビ/OA | テレビ（consTV） | OA機器（consOT）、事務機器（consOA） |
| 消費クラス数 | 約30（logicList登録: 29） | 約25（logicList登録: 23） |
| 対策項目数 | 約60 | 約40 |

### 9.2 シナリオ定義の規模

| | 家庭用 scenarioset.js | 事業所用 scenarioset.js |
|---|---|---|
| 行数 | 約275行 | 約592行 |
| 対策定義数 | 約60 | 約40 |
| 入力項目数 | 約50 | 約40 |

### 9.3 バンドル構成

core と地域別ファイルは別々のバンドルとして生成・minify され、HTMLが両方をロードします。

```
家庭用:
  d6home_core.min.js = polyfill + facade + areaset + base + home/scenarioset + home/scenariofix + home/cons*
  d6home_JP.min.js   = logic_JP/areaset/* + logic_JP/home/*

事業所用:
  d6office_core.min.js = polyfill + facade + areaset + base + office/scenarioset + office/scenariofix + office/cons*
  d6office_JP.min.js   = logic_JP/areaset/* + logic_JP/office/*
```

---

## 10. ビューレイヤー

### 10.1 ファイル構成と役割

| ファイル | 役割 |
|----------|------|
| view/main.js | メインコントローラ。Web Worker の起動・メッセージング・結果受信 |
| view/createpage.js | 入力フォームのHTML動的生成。質問定義からDOM要素を構築 |
| view/graph.js | Chart.js / D3.js によるグラフ描画（棒グラフ・円グラフ・レーダーチャート） |
| view/view_base/onclick-base.js | ボタン・セレクトボックスのイベントハンドラ |
| view/view_base/template-base.html | HTMLテンプレート。ページ構造の雛形 |
| view/view_base/layout-base.css | レイアウト用CSS |
| view/common.css | 共通スタイル |
| view/js/jquery.cookie.js | Cookie管理 |

### 10.2 Web Worker 通信

ビューレイヤーと計算エンジンは Web Worker を介して非同期通信します。

```
┌──────────────┐         postMessage         ┌──────────────────┐
│              │ ───────────────────────────→ │                  │
│  main.js     │    {command, param}          │  d6facade.js     │
│  (UIスレッド) │                              │  (Workerスレッド) │
│              │ ←─────────────────────────── │                  │
│              │    {result data}              │  → D6.workercalc │
└──────────────┘                              └──────────────────┘
```

### 10.3 コマンド一覧 (d6facade.js workercalc)

#### 主要コマンド

| コマンド | パラメータ | 処理内容 |
|---------|-----------|---------|
| `start` | prohibitQuestions, allowedQuestions, defInput, rdata | システム初期化、初回計算 |
| `inchange` | {id, val, consName} | 入力値変更 → 再計算 → 結果返却 |
| `inchange_only` | {id, val} | 入力値変更のみ（再計算なし） |
| `measureadd` | {mid} | 対策選択 → 対策効果再計算 |
| `measureadd_comment` | {mid} | 対策選択（コメント付き） |
| `measuredelete` | {mid} | 対策選択解除 → 対策効果再計算 |
| `tabclick` | {consName, subName} | タブ切替 → 該当カテゴリの結果・入力ページ取得 |
| `subtabclick` | {consName, subName} | サブカテゴリ切替 → 入力ページ取得 |
| `addandstart` | {consName} | 部屋/機器の追加 → シナリオ再構築 |
| `recalc` | {consName, subName} | 再計算 → 結果・入力ページ返却 |

#### ボタン式質問コマンド

| コマンド | パラメータ | 処理内容 |
|---------|-----------|---------|
| `quesone_next` | - | 次の質問へ進む |
| `quesone_prev` | - | 前の質問に戻る |
| `quesone_set` | {id, val} | 回答設定 → 次の質問へ |

#### グラフ・評価コマンド

| コマンド | パラメータ | 処理内容 |
|---------|-----------|---------|
| `graphchange` | {graph} | グラフ表示変更 |
| `evaluateaxis` | {subName} | 多軸評価指標の算出 |
| `demand` | - | 需要推計ページのデータ取得 |
| `add_demand` | {consName} | 需要グラフ用機器追加 → demandに続く |
| `inchange_demand` | {id, val} | 需要ページ入力変更 → グラフ更新 |
| `modal` | {mid} | 対策詳細モーダル表示 |

#### データ入出力コマンド

| コマンド | パラメータ | 処理内容 |
|---------|-----------|---------|
| `save` / `savenew` / `saveandgo` / `save_noalert` | - | 入力データのシリアライズ |
| `load` | - | データロード |
| `getinputpage` | {consName, subName} | 入力ページ取得 |
| `getqueslist` | - | 質問リスト取得 |
| `common` | 複合パラメータ | 汎用コマンド（一括操作） |

### 10.4 結果データ構造 (getAllResult)

```javascript
{
    common: {
        co2Original,          // 対策前CO2合計 (kg)
        co2,                  // 対策後CO2合計 (kg)
        costOriginal,         // 対策前コスト合計 (円)
        cost,                 // 対策後コスト合計 (円)
        consco2Original,      // 選択カテゴリのCO2（対策前）
        consco2,              // 選択カテゴリのCO2（対策後）
    },

    consShow: {
        "TO": {co2Original, co2, cost, ...},  // 全体
        "AC": {co2Original, co2, cost, ...},  // 空調
        "HW": {co2Original, co2, cost, ...},  // 給湯
        // ... 各カテゴリ
    },

    monthly: [
        {month: 1, yen: 15000, energyname: "electricity"},
        {month: 1, yen: 5000, energyname: "gas"},
        // ... 12ヶ月 × エネルギー種別
    ],

    average: {
        you: 5000,            // あなたのCO2 (kg)
        youc: 250000,         // あなたのコスト (円)
        av: 4500,             // 地域平均CO2 (kg)
        avc: 230000,          // 地域平均コスト (円)
        rank100: 55,          // 現在のランキング (1-100)
        afterrank100: 30,     // 対策後ランキング
        samehome: 1200,       // 同等世帯数
    },

    itemize: [
        {title: "冷房", co2: 500, electricity: 900, ...},
        {title: "暖房", co2: 800, gas: 200, ...},
        // ... 各カテゴリの内訳
    ],

    measure: [
        {
            mesID: 5,
            title: "冷房温度を28℃に",
            co2Change: -231,
            costChange: -5000,
            payBackYear: 0,
            lifestyle: 1,
            selected: false,
        },
        // ... 全対策（削減量順）
    ]
}
```

---

## 11. データフロー

### 11.1 全体フロー図

```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐
│ ユーザー入力 │───→│ main.js      │───→│ Web Worker     │
│ (HTML Form)  │    │ (イベント処理)│    │ (d6facade.js)  │
└─────────────┘    └──────────────┘    └───────┬───────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │ D6.workercalc()      │
                                    │                      │
                                    │ ┌──────────────────┐ │
                                    │ │ D6.inSet()       │ │ 入力値保存
                                    │ └────────┬─────────┘ │
                                    │          │           │
                                    │ ┌────────▼─────────┐ │
                                    │ │ D6.calculateAll() │ │
                                    │ │  ├ calcAverage()  │ │ 平均比較(内部でcalcCons)
                                    │ │  └ calcMeasures() │ │ 対策効果(内部でcalcCons)
                                    │ └────────┬─────────┘ │
                                    │          │           │
                                    │ ┌────────▼─────────┐ │
                                    │ │ D6.getAllResult() │ │ 結果整形
                                    │ └────────┬─────────┘ │
                                    └──────────┼──────────┘
                                               │
                    ┌──────────────┐    ┌───────▼───────┐
                    │ グラフ更新    │←───│ main.js       │
                    │ テーブル更新  │    │ getCalcResult │
                    │ 対策リスト更新│    └───────────────┘
                    └──────────────┘
```

### 11.2 ユーザー操作別フロー

#### パターン1: 入力値変更

```
1. ユーザーがHTMLフォームの値を変更
2. onchange イベント → startCalc("inchange", {id:"i212", val:25})
3. main.js が Web Worker へ postMessage
4. d6facade.js で受信 → workercalc("inchange", param)
5. D6.inSet("i212", 25)  // D6.doc.data に保存
6. D6.calculateAll()     // 全消費量・対策を再計算
7. D6.getAllResult()      // 結果をView用に整形
8. postMessage で結果を返却
9. main.js で受信 → グラフ・テーブル・対策リストを更新
```

#### パターン2: 対策選択

```
1. ユーザーが対策のチェックボックスをON
2. onclick → startCalc("measureadd", mesID)
3. D6.measureAdd(mesID)  // selected = true
4. D6.calcMeasures(-1)   // 対策効果の再計算
   a. ベースラインに戻す
   b. 選択済み対策を順に適用
   c. 各対策の累積効果を計算
5. 結果を返却 → 対策リスト・グラフ更新
```

#### パターン3: 部屋/機器の追加

```
1. ユーザーが「部屋を追加」ボタンをクリック
2. onclick → startCalc("addandstart", "consACcool")
3. D6.addConsSetting("consACcool")  // orgCopyNum をインクリメント
4. D6.setscenario("add")           // シナリオ再構築
   a. 新しい部屋用の消費クラスインスタンスを生成
   b. 対応する入力項目を追加 (i215[2], i216[2], ...)
5. 以前の入力値をロード
6. D6.calculateAll()
7. 新しい入力フォームが表示される
```

### 11.3 入力データの永続化

```javascript
// D6.doc.data は配列として宣言され、文字列キーで連想配列的に使用される
D6.doc.data = [];    // 実際の宣言（doc.js）

// 使用例:
D6.doc.data["i001"] = 3;       // 世帯人数
D6.doc.data["i051"] = 1;       // 太陽光パネル有無 (1/0)
D6.doc.data["i052"] = 3.5;     // 太陽光容量 (kW)
D6.doc.data["i212"] = 25;      // 部屋1面積 (m²)
D6.doc.data["i2121"] = 18;     // 部屋2面積 (m²)  ※複製可能消費の場合 iXXX + subID
D6.doc.data["i215"] = 2015;    // エアコン設置年
D6.doc.data["i216"] = 2;       // エアコン性能レベル
D6.doc.data["Area"] = 27;      // 都道府県コード
D6.doc.data["AreaOrg"] = 27;   // 初期地域（リセット用）

// シリアライズ: カンマ区切りの key=value 形式文字列として保存
// "i001=3,i051=1,i052=3.5,...,mesSelId=00x00x..."
D6.doc.serialize()        → カンマ区切り文字列（Base64エンコードして転送）
D6.doc.loadDataSet(data)  ← カンマ区切り文字列から復元
```

---

## 12. ビルドシステム

### 12.1 Grunt タスク構成

```javascript
// Gruntfile.js の主要タスク

grunt.registerTask("default", [
    "concat",    // ファイル結合
    "terser",    // ES6対応minify
    "polyfill"   // ES5/ES6ポリフィル生成
]);

grunt.registerTask("core", [
    "concat:home_core",
    "concat:office_core",
    "terser:home_core",
    "terser:office_core"
]);
```

### 12.2 concat タスク（ファイル結合）

```
concat:home_core
  入力: node_modules/promise-polyfill/dist/polyfill.js
        logic/d6facade.js
        logic/areaset/*.js        (area, unit, accons, acload, acadd)
        logic/base/objectcreate.js
        logic/base/energy.js
        logic/base/consbase.js
        logic/base/measurebase.js
        logic/base/doc.js
        logic/base/d6.js
        logic/base/d6_*.js        (calcmonthly, get, getinput, getmeasure, ...)
        logic/home/scenarioset.js
        logic/home/scenariofix.js  (※ベース版・空ファイルの場合あり)
        logic/home/cons*.js        (29消費クラスファイル)
  出力: develop/d6home_core.js

concat:home_JP
  入力: logic_JP/areaset/*.js     (area, accons, acload, acadd)
        logic_JP/home/*.js        (scenariofix, consHTsum等)
  出力: develop/d6home_JP.js

concat:office_core
  入力: 同上構成（officeディレクトリ版、23消費クラスファイル）
  出力: develop/d6office_core.js

concat:office_JP
  入力: logic_JP/areaset/*.js + logic_JP/office/*.js
  出力: develop/d6office_JP.js

// 他言語: JP_en, CN, FR はhome/office両方あり
//         KR, VI はhomeのみ（officeタスクなし）
```

### 12.3 terser タスク（minify）

core と地域別ファイルは**別々に**minifyされます。HTMLが両方を個別にロードします。

```
terser:home_core   → dist/d6home_core.min.js    (coreのみminify)
terser:home_JP     → dist/d6home_JP.min.js      (JP地域分のみminify)
terser:office_core → dist/d6office_core.min.js
terser:office_JP   → dist/d6office_JP.min.js

// 他言語も同様に個別minify
// 例: terser:home_CN → dist/d6home_CN.min.js
```

### 12.4 開発ワークフロー

```
開発時:
  1. index_develop.html を開く（非圧縮版を個別読込）
  2. ソースコードを直接編集
  3. ブラウザリロードで確認

リリース時:
  1. npm install (初回のみ)
  2. grunt (concat + terser + polyfill)
  3. index.html を開いて minified 版を確認
  4. dist/ 以下のファイルをデプロイ
```

---

## 13. 主要クラス・オブジェクト関連図

### 13.1 依存関係図

```
D6 (メインコントローラ)
 │
 ├──→ D6.consList[]        全消費クラスインスタンス（生成順配列）
 │     └── ConsBase
 │          ├── Energy           エネルギー値（電力, ガス, CO2, コスト）
 │          ├── measures[]       紐付く MeasureBase インスタンス
 │          ├── sumCons          親消費クラスへの参照
 │          └── partCons[]       子消費クラスへの参照
 │
 ├──→ D6.consShow{}        2文字コードによるクイック参照
 │     例: "TO"→consTOTAL, "AC"→consAC, "HW"→consHWsum
 │
 ├──→ D6.consListByName{}  名前による参照
 │     例: "consACcool"→ConsACcool インスタンス
 │
 ├──→ D6.measureList[]     全対策インスタンス
 │     └── MeasureBase
 │          ├── Energy           削減エネルギー値
 │          └── cons             対象消費クラスへの参照
 │
 ├──→ D6.doc               データ永続化
 │     └── data[]            ユーザー入力値の格納（配列を連想配列的に使用）
 │
 ├──→ D6.area              地域設定
 │     ├── prefName[]        地域名
 │     ├── prefHeatingLevel[] 暖房レベル
 │     ├── co2ElectCompanyUnit[] CO2係数
 │     └── electCompanyPrice[] 電力単価係数
 │
 ├──→ D6.Unit              単位定義
 │     ├── co2{}             CO2排出係数
 │     ├── price{}           エネルギー単価
 │     ├── priceBase{}       基本料金
 │     └── jules{}           エネルギー変換係数
 │
 └──→ D6.scenario          シナリオ定義
       ├── defMeasures{}     対策定義
       ├── defInput{}        入力項目定義
       ├── defSelectValue{}  選択肢ラベル
       ├── defSelectData{}   選択肢値
       ├── getLogicList()    消費クラス定義リスト取得
       ├── setDefs()         定義のロード
       └── fix_consParams()  地域別パラメータ上書き
```

### 13.2 ConsBase ↔ MeasureBase 関係

```
ConsBase (消費クラス)
 │
 │  1つの消費クラスに複数の対策が紐付く (1:N)
 │  measures は対策名をキーとする連想配列
 │
 ├── measures["mACcoolSetTemp"]: MeasureBase (温度設定)
 ├── measures["mACcoolClean"]: MeasureBase (フィルター清掃)
 ├── measures["mACcoolReplace"]: MeasureBase (買い替え)
 └── measures["mACcoolInsulate"]: MeasureBase (断熱改修)

MeasureBase (対策)
 │
 │  各対策は1つの消費クラスに属する (N:1)
 │
 └── cons → ConsBase (対象消費クラスへの参照)
```

---

## 14. 計算例

### 14.1 冷房消費量の計算

```
入力:
  部屋面積: 20 m²
  エアコン設置年: 2010年
  性能レベル: 標準 (2)
  地域: 大阪（暖房レベル4）

計算:
  1. APF（年間エネルギー効率）取得
     acYear=2010, capacity=2.8kW → APF=4.5 (経年劣化 ×0.7 込み)

  2. 冷房負荷推計
     Q = roomSize × (T設定 - T外気) × 熱容量係数
     Q = 20 × (26 - 33) × 0.15 = -21 kcal/h (冷房負荷)

  3. 夏季冷房時間
     hours = 3000時間/年 × 暖房レベル4の係数

  4. 電力消費量
     electricity = |Q| × hours / APF / 860
                 = 21 × 3000 / 4.5 / 860
                 ≈ 16.3 kWh/年（1部屋分）

  5. CO2排出量
     co2 = 16.3 × 0.55 = 8.9 kg-CO2/年

  6. コスト
     cost = 16.3 × 32.65 = 532 円/年
```

### 14.2 太陽光発電の扱い

#### modesolaronlyself = true（デフォルト・ガス診断モード）

```
入力:
  太陽光容量: 4 kW
  年間発電量: 4,000 kWh (= 4kW × 1,000kWh/kW)
  自家消費率: 40% → 自家消費 1,600 kWh / 売電 2,400 kWh

計算:
  購入電力のみCO2計算対象
  売電分はCO2クレジット売却済みとみなしカウントしない
  自家消費分はCO2ゼロとみなす

  購入電力CO2 = (総消費 - 自家消費) × CO2係数
  対策としての太陽光導入: 自家消費分について削減
```

#### modesolaronlyself = false（環境省うちエコ診断モード）

```
  売電分も家庭のCO2削減とみなす
  太陽光発電量全体に応じてCO2削減が計算される
  ただし蓄電池設置によるCO2削減にはならない
```

### 14.3 ランキング計算 (rankIn100)

```
ratio = あなたのCO2 / 地域平均CO2

補間テーブル（d6_calcaverage.js より）:
  th     = [0.0,  0.3,  0.5,  0.6,  0.8,  1.0,  1.3,  1.5,  1.8,  2.1,  2.4,  3.0,  4.0]
  thrank = [0.50, 0.99, 4.68, 9.63, 27.32, 50, 71.86, 81.96, 91.01, 95.47, 97.56, 99.34, 100.19]

  ratio = 0.0 → ランク 1  (最も省エネ)
  ratio = 0.5 → ランク 5  (上位5%)
  ratio = 1.0 → ランク 50 (平均)
  ratio = 1.5 → ランク 82
  ratio = 2.1 → ランク 95
  ratio = 4.0 → ランク 100 (最も多消費)

例: あなたの CO2 = 3,500 kg, 平均 = 4,500 kg
  ratio = 3,500 / 4,500 = 0.78
  → th[4]=0.8 と th[3]=0.6 の間で線形補間
  ランク ≈ 25 (上位25%に位置)
```

---

## 15. サードパーティライブラリ

| ライブラリ | バージョン | 用途 | ライセンス |
|-----------|-----------|------|-----------|
| jQuery | 1.x/2.x | DOM操作、イベント処理 | MIT |
| Chart.js | 2.0.2 | グラフ描画（棒・円・レーダー） | MIT |
| D3.js | 3.x/4.x | データ駆動ドキュメント操作 | BSD |
| Dimple.js | - | D3.jsラッパー（簡易グラフ） | MIT |
| leanModal | 1.1 | モーダルダイアログ | MIT |
| jQuery Cookie | 1.4.1 | Cookie管理 | MIT |
| Intro.js | - | チュートリアル・ウォークスルー | AGPL/Commercial |
| Grunt | 1.6.x | ビルドツール（concat/minify） | MIT |
| Terser | 5.x | ES6対応JavaScript圧縮 | BSD |

---

## 付録A: 入力項目ID体系

| ID範囲 | カテゴリ | 例 |
|--------|----------|-----|
| i001-i050 | 世帯情報 | i001=世帯人数, i010=住居タイプ |
| i051-i099 | エネルギー基本 | i051=太陽光有無, i052=太陽光容量 |
| i100-i199 | 光熱費 | i101=電気代, i102=ガス代 |
| i200-i299 | 空調 | i212=部屋面積, i215=エアコン年式, i216=性能 |
| i300-i399 | 給湯 | i301=給湯器タイプ, i310=入浴頻度 |
| i400-i499 | 冷蔵庫・照明 | i401=冷蔵庫年式, i410=照明タイプ |
| i500-i599 | 調理・洗濯 | i501=コンロタイプ, i510=洗濯機タイプ |
| i600-i699 | 自動車 | i601=車種, i610=年間走行距離 |

## 付録B: 消費コード体系

| コード | 消費カテゴリ | 対応クラス | 対象 |
|--------|-------------|-----------|------|
| TO | 全体合計 | consTOTAL | 共通 |
| EN | エネルギー全般 | consEnergy | 共通 |
| SE | 季節パターン | consSeason | 共通 |
| AC | 空調（統合） | consAC / consACsum | 共通 |
| CO | 冷房 | consCOsum | 共通 |
| HT | 暖房 | consHTsum | 共通 |
| HW | 給湯 | consHWsum | 共通 |
| RF | 冷蔵庫 | consRFsum | 共通 |
| LI | 照明 | consLIsum | 共通 |
| TV | テレビ | consTVsum | 家庭のみ |
| CR | 自動車 | consCRsum | 共通 |
| CK | 調理 | consCKsum | 共通 |
| DR | 洗濯/清掃 | consDRsum | 共通 |
| OT | その他/OA機器 | consOTother(家庭) / consOTsum(事業所) | 共通 |
| OA | 事務機器 | consOAsum | 事業所のみ |
| RM | 室設定 | consRM | 事業所のみ |
| MO | 月別消費 | consMonth | 事業所のみ |
