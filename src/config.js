/**
 * Home-Eco Diagnosis for JavaScript
 *
 * view/main.js:  Main Class to use d6 package
 *
 * in this routine, cannot access D6, can access html DOM
 * 	- on loaded action
 * 	- call D6 routine through web-worker
 * 	- callback action by web-worker
 *
 * @author SUZUKI Yasufumi	2016/05/23
 *
 */
import {lang} from "./lang_ja.js";

var config = {
	targetMode : 1,
    debugMode : true,
    viewMode : 0,
    languageMode : "ja",
    focusMode : 0,
    useWorker : false,
    useCode : 3,
    messhownumber : 7,
    hideAverage : "0",
    hidePrice : "0",

//worker parameters
    worker : "",
    param : "",

//display state initialize
    tabNow : "",

    tabNowName : "easy01", // default page
    tabSubNowName : "easy01", // default sub page
    showPageName : lang.startPageName, // title of default page
    tabSubNow : "",
    showOver15 : false,

    tabNowIndex : 0,
    tabSubNowCode : "",

    graphNow : "co2", // graph unit, "co2", "jules" or "price"
    mainTab : "cons", // main tab mode , "cons" or "demand"
    pageMode : "m1", // "m1":input page ,"m2":measures page

// diagnosis question and measures,  set in localize_*/focussetting
    prohibitQuestions : [],
    allowedQuestions : [],
    prohibitMeasures : [],
    allowedMeasures : [],
};

config.tabSubNow = config.tabNowName + "-" + config.tabSubNowName;

export { config };
