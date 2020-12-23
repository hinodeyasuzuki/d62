module.exports = function(grunt){
	var pkg = grunt.file.readJSON("package.json");
	grunt.initConfig({
		concat: {
		// for forcemode2/3
		home_core: {
			files:{
				"develop/d6home_core.js" :
					[	
						"logic/d6facade.js",
						"logic/areaset/*.js",
						"logic/base/objectcreate.js",
						"logic/base/energy.js",
						"logic/base/consbase.js",
						"logic/base/measurebase.js",
						"logic/base/doc.js",
						"logic/base/d6.js",
						"logic/base/d6_calcmonthly.js",
						"logic/base/d6_get.js",
						"logic/base/d6_getinput.js",
						"logic/base/d6_getmeasure.js",
						"logic/base/d6_getdemand.js",
						"logic/base/d6_getevaluateaxis.js",
						"logic/base/d6_construct.js",
						"logic/base/d6_calccons.js",
						"logic/base/d6_calcaverage.js",
						"logic/base/d6_calcmeasures.js",
						"logic/base/d6_setvalue.js",
						"logic/base/d6_tools.js",
						"logic/home/scenarioset.js",
						"logic/home/scenariofix.js",
						"logic/home/consEnergy.js",
						"logic/home/consSeason.js",
						"logic/home/consTOTAL.js",
						"logic/home/consHWsum.js",
						"logic/home/consHWshower.js",
						"logic/home/consHWtub.js",
						"logic/home/consHWdresser.js",
						"logic/home/consHWdishwash.js",
						"logic/home/consHWtoilet.js",
						"logic/home/consCOsum.js",
						"logic/home/consACcool.js",
						"logic/home/consHTsum.js",
						"logic/home/consHTcold.js",
						"logic/home/consACheat.js",
						"logic/home/consAC.js",
						"logic/home/consRFsum.js",
						"logic/home/consRF.js",
						"logic/home/consLIsum.js",
						"logic/home/consLI.js",
						"logic/home/consTVsum.js",
						"logic/home/consTV.js",
						"logic/home/consDRsum.js",
						"logic/home/consCRsum.js",
						"logic/home/consCR.js",
						"logic/home/consCRtrip.js",
						"logic/home/consCKsum.js",
						"logic/home/consCKpot.js",
						"logic/home/consCKrice.js",
						"logic/home/consCKcook.js",
						"logic/home/consOTother.js",
					]
				}
			},
			office_core: {
				files:{
					"develop/d6office_core.js" :
					[	
						//"logic/d6facade.js",
						"logic/areaset/*.js",
						"logic/base/objectcreate.js",
						"logic/base/energy.js",
						"logic/base/consbase.js",
						"logic/base/measurebase.js",
						"logic/base/doc.js",
						"logic/base/d6.js",
						"logic/base/d6_calcmonthly.js",
						"logic/base/d6_get.js",
						"logic/base/d6_getinput.js",
						"logic/base/d6_getmeasure.js",
						"logic/base/d6_getdemand.js",
						"logic/base/d6_getevaluateaxis.js",
						"logic/base/d6_construct.js",
						"logic/base/d6_calccons.js",
						"logic/base/d6_calcaverage.js",
						"logic/base/d6_calcmeasures.js",
						"logic/base/d6_setvalue.js",
						"logic/base/d6_tools.js",
						"logic/office/scenarioset.js",
						"logic/office/scenariofix.js",
						"logic/office/consEnergy.js",
						"logic/office/consMonth.js",
						"logic/office/consSeason.js",
						"logic/office/consTOTAL.js",
						"logic/office/consRM.js",
						"logic/office/consHWsum.js",
						"logic/office/consCOsum.js",
						"logic/office/consCO.js",
						"logic/office/consHTsum.js",
						"logic/office/consHT.js",
						"logic/office/consACsum.js",
						"logic/office/consAC.js",
						"logic/office/consRFsum.js",
						"logic/office/consRF.js",
						"logic/office/consLIsum.js",
						"logic/office/consLI.js",
						"logic/office/consTVsum.js",
						"logic/office/consTV.js",
						"logic/office/consOAsum.js",
						"logic/office/consOTsum.js",
						"logic/office/consOT.js",
						"logic/office/consCRsum.js",
						"logic/office/consCR.js",
						"logic/office/consCRtrip.js",
						"logic/office/consCKsum.js",
					]
				}
			},
			home_JP: {
				files:{
					"develop/d6home_JP.js" :
					[	"logic_JP/areaset/*.js",
						"logic_JP/home/*.js"
					]
				}
			},
			office_JP: {
				files:{
					"develop/d6office_JP.js" :
					[	"logic_JP/areaset/*.js",
						"logic_JP/office/*.js"
					]
				}
			},
			home_JP_en: {
				files:{
					"develop/d6home_JP_en.js" :
					[	"logic_JP_en/areaset/*.js",
						"logic_JP_en/home/*.js"
					]
				}
			},
			office_JP_en: {
				files:{
					"develop/d6office_JP_en.js" :
					[	"logic_JP_en/areaset/*.js",
						"logic_JP_en/office/*.js"
					]
				}
			},
			home_CN: {
				files:{
					"develop/d6home_CN.js" :
					[	"logic_CN/areaset/*.js",
						"logic_CN/home/*.js"
					]
				}
			},
			office_CN: {
				files:{
					"develop/d6office_CN.js" :
					[	"logic_CN/areaset/*.js",
						"logic_CN/office/*.js"
					]
				}
			},
			home_FR: {
				files:{
					"develop/d6home_FR.js" :
					[	"logic_FR/areaset/*.js",
						"logic_FR/home/*.js"
					]
				}
			},
			office_FR: {
				files:{
					"develop/d6office_FR.js" :
					[	"logic_FR/areaset/*.js",
						"logic_FR/office/*.js"
					]
				}
			},
			home_KR: {
				files:{
					"develop/d6home_KR.js" :
					[	"logic_KR/areaset/*.js",
						"logic_KR/home/*.js"
					]
				}
			},
			office_KR: {
				files:{
					"develop/d6office_KR.js" :
					[	"logic_KR/areaset/*.js",
						"logic_KR/office/*.js"
					]
				}
			},
			home_VI: {
				files:{
					"develop/d6home_VI.js" :
					[	"logic_VI/areaset/*.js",
						"logic_VI/home/*.js"
					]
				}
			},
		},

		terser: {
			home_core : {
				files:{
									// output file : source file
									"dist/d6home_core.min.js": "develop/d6home_core.js"
				}
			},
			office_core : {
				files:{
									"dist/d6office_core.min.js": "develop/d6office_core.js"
				}
			},
			home_JP : {
				files:{
									// output file : source file
									"dist/d6home_JP.min.js": "develop/d6home_JP.js"
				}
			},
			office_JP : {
				files:{
									// output file : source file
									"dist/d6office_JP.min.js": "develop/d6office_JP.js"
				}
			},
			home_JP_en : {
				files:{
									// output file : source file
									"dist/d6home_JP_en.min.js": "develop/d6home_JP_en.js"
				}
			},
			office_JP_en : {
				files:{
									// output file : source file
									"dist/d6office_JP_en.min.js": "develop/d6office_JP_en.js"
				}
			},
			home_CN : {
				files:{
									// output file : source file
									"dist/d6home_CN.min.js": "develop/d6home_CN.js"
				}
			},
			office_CN : {
				files:{
									// output file : source file
									"dist/d6office_CN.min.js": "develop/d6office_CN.js"
				}
			},
			home_FR : {
				files:{
									// output file : source file
									"dist/d6home_FR.min.js": "develop/d6home_FR.js"
				}
			},
			office_FR : {
				files:{
									// output file : source file
									"dist/d6office_FR.min.js": "develop/d6office_FR.js"
				}
			},
			home_KR : {
				files:{
									// output file : source file
									"dist/d6home_KR.min.js": "develop/d6home_KR.js"
				}
			},
			office_KR : {
				files:{
									// output file : source file
									"dist/d6office_KR.min.js": "develop/d6office_KR.js"
				}
			},
			home_VI : {
				files:{
									// output file : source file
									"dist/d6home_VI.min.js": "develop/d6home_VI.js"
				}
			},
			},
	});
	grunt.loadNpmTasks('grunt-terser');
	grunt.loadNpmTasks("grunt-contrib-concat");
//	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask("core", ["concat:home_core",
								"concat:office_core",
								"terser:home_core",
								"terser:office_core"
								]);
	grunt.registerTask("default", ["concat","terser"]);

};
