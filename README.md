# how to run(Japanese)
>npm install -g grunt-cli
>npm install

access index_develop.html

>grunt

access index.html

# d62 home eco diagnosis Ver6.rev.2

温暖化対策計算ソフトのロジック部分です。diagnosis_view のデザインと併せて設定します。テスト用に index.htmlとview/を用意しています。

エネルギー消費に関する簡単なアンケート入力をもとに、CO2排出量の分析を行い、約60項目のCO2排出削減対策の中から効果的なものを計算して提案するソフトです。

基本は家庭向けですが、小規模事業者の診断にも対応しています。

言語設定と地域用ロジックを変更することで、多言語・他地域の診断ソフトとして作ることができます。言語管理には、EXCELシートを利用しており、ソースコードが出力されます。

以前の eco_diagnosis から情報を整理しての再公開です。(2020/10/15)

This program can advice how to reduce CO2 emission by some question about energy consumption. In this software over 60 measures is set, calculate each measures by input value, show adive fitted to home. It can be used for not only home but also small office.

You can make your area/language software by support of Excel file

access ./index.php or ./index.html

## 太陽光発電の扱い
　家庭で消費された電力量に伴うCO2排出を換算しています。

### modesolaronlyself  = false　（環境省うちエコ診断/うちエコキッズ）
　売電した分は、家庭のCO2削減とみなします。すなわち、太陽光発電量に応じてCO2削減ができる計算になります。
　太陽光発電設置によるCO2削減は大きくなりますが、蓄電池設置でもCO2削減にはなりません。

- 電気代固定で、太陽光発電サイズを増やすと、現状のCO2がやや減少。各分野のCO2は増加、その他（太陽光相当）がマイナスになる。
- このため本来であれば、自家消費を考慮した電力係数を設定し、売電のCO2は購入係数の割り切りをすることが望ましい。

### modesolaronlyself  = true　default（ガス診断）
　太陽光を設置している場合には、購入電力に対するCO2を考慮し、自家消費分はゼロとみなします。売電についてはCO2クレジットが売却されることから、CO2量にはカウントされません。純粋に購入した電気代に基づいて現状の電気のCO2が算出されます。
　対策による電気消費量削減でのCO2量の変化は、購入している電気のCO2係数で計算します。
　対策としての太陽光発電の導入は、自家消費量を推計し、自家消費分について削減します。

- 電気代固定で、太陽光発電サイズを増やすと、現状のCO2が増加するのは、自家消費に相当する電気消費が多くなると想定される一方で、電力の平均CO2係数（自家消費＋購入）を一定としているためです。＞これを修正して、係数を動的に変更するようにしたため、個別の分野は適切に評価されるようになった。しかし全体のCO2は電気消費量では大幅マイナスとなっているが、CO2評価は小さい。


## Demo (git page)

release(minified) code
https://hinodeyasuzuki.github.io/d62/index.html

Develop code
https://hinodeyasuzuki.github.io/d62/index_develop.html

diagnosis for office
https://hinodeyasuzuki.github.io/d62/index_biz.html


## Other Demo

https://www.hinodeya-ecolife.com/diagnosis/?lang=ja	Japanese Default

You can design visual and diagnosis flow. such as...

https://www.hinodeya-ecolife.com/diagnosis/?v=0&lang=en　detail diagnosis(english)

https://www.hinodeya-ecolife.com/diagnosis/?v=1&lang=en　button desgin

https://www.hinodeya-ecolife.com/diagnosis/?v=2&lang=en　one page diagnosis

https://www.hinodeya-ecolife.com/diagnosis/?v=3&lang=en　easy desgin

https://www.hinodeya-ecolife.com/diagnosis/?v=4&lang=en　information about diagnosis


## Install develop environment
In order to pack js files, you need commandline PHP

php files are used as parameters set, if you want to execute listricted pattern of diagnosis, you can save as .html file.

## folder and files
index.php   access file in oder to manage develop/release, language, etc.

init_home.php, init_office.php  parameters set for home/office

parameters.php  default parameters set

/logic/      main logic files, commonly used for each language / views

/logic_JP/  localized files set in this folder to config diagnosis system

now prepareing EN, FR, KO, CN, VI language and area.


## making your area/language system 

### step1)EXCEL setting
The base advice algolism is set for Japan. 

You can fill efficent equipment, price, adive message, subsidy information, question text, select options, in order to fit your area and language. And also set messages in your language.

### step2)copy excel sheet to /logic_**/home/senario_fix.js

 ** is your country code and language code. Please copy code from excel to program files.

### step3)configure parameter.php

 add new language code if you need. 

### step4) access and check



## logig priority

### measure

1. modified in logic_JP/home/senariofix.js, which is defined in Excel file
		- set measure name as #, which means do not show
2. modified in logic_JP/home/cons**.js calcMeasure() function
		- override or add calculation functions
		- set another prohibit status
3. see calculation funciton in common function d6/home/calc**.js

## Third party tools
* jQuery JavaScript Library: Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
* leanModal v1.1 by Ray Stone - http://finelysliced.com.au
* jQuery Cookie Plugin v1.4.1: Copyright 2006, 2014 Klaus Hartl
* Chart.js http://chartjs.org/ Version: 2.0.2: Copyright 2016 Nick Downie
* d3/d3.js Copyright 2010-2017 Mike Bostock
* PMSI-AlignAlytics/dimple: Copyright 2015 AlignAlytics http://www.align-alytics.com
* php-packer: originally created by Dean Edwards, ported to PHP by Nicolas Martin. Packed for composer and slightly extended by Thomas Lutz.
* intro.js : introjs.com
 

## copyright
Copyright 2011－2020（C） Yasufumi Suzuki, Hinodeya Insititute for Ecolife co.Ltd.

Released under the MIT license



# 年度単価更新
logic_JP/area.js 216 電力会社ごとの単価係数
	electCompanyPrice: [1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1.2],


logic_JP/area.js 461 最新の単価（家計調査）
	toukeiUnitNow : [ 31.72, 764.61, 111, 168.1, 148.2 ],

unit　43行～ 基本電気単価、燃料単価（家計調査）
	defaultPriceElectricity 

	price : {
		electricity:31.72,				// override in D6.area.setPersonArea by supplier
		nightelectricity:16.848,
		sellelectricity:16,
		・
		・

