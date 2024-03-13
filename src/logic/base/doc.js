/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * doc.js 
 * 
 * document main Class, store, stock
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 *								2011/06/15 designed as document class
 *								2011/08/23 save as dynamic value
 * 								2016/04/12 ported to JavaScript
 * 
 * clear()
 * loadDataSet()
 */

const doc =
{
  //define letiables
  data: [],								//input values
  equip: [],								//equiment price


  // clear values
  //		dialog:false not to show dialog
  clear: function (dialog) {
    let answer;
    let AreaOrgBackup;

    //show dialog
    if (dialog) {
      if (answer == "CANCEL") {
        return;
      }
    }

    //backup no need to clear
    AreaOrgBackup = this.data["AreaOrg"];

    //clear
    this.data = new Array();

    //restore area setting
    this.data["AreaOrg"] = AreaOrgBackup;
    this.data["Area"] = AreaOrgBackup;
  },


  // serialize prepare for saving
  //
  serialize: function () {
    let saveData = "";
    let temp = "";
    let tempg = "";
    let tempi = "";
    let prop = 0;
    let i = 0;
    let Input = this.data;

    this.measureList = window.D6.measureList;
    this.logicList = window.D6.logicList;
    this.scenario = window.D6.scenario;

    for (prop in Input) {
      if (this.scenario.defInput[prop.substr(0, 4)].defaultValue == Input[prop]) continue;
      temp = "" + Input[prop];

      //in case of string
      if (typeof (Input[prop]) == "string") {
        // double width to single width charactor
        while (temp.indexOf(" ") != -1) {
          i = temp.indexOf(" ");
          temp = temp.substring(0, i - 1) + "_" + temp.substring(i + 1, 2000);
        }
        // change ',' to '~'
        while (temp.indexOf(",") != -1) {
          i = temp.indexOf(",");
          temp = temp.substring(0, i - 1) + "~" + temp.substring(i + 1, 2000);
        }
      }
      saveData = saveData + prop + "=" + temp + ",";
    }

    //save room/equipment number
    for (prop in this.logicList) {
      if (this.logicList[prop].orgCopyNum >= 1) {
        saveData += prop + "=" + this.logicList[prop].orgCopyNum + ",";
      }
    }

    //serialize(mesSelId=00x00x0xx0xx...)
    let sel = "";
    for (i = 0; i < this.measureList.length; i++) {
      if (this.measureList[i].selected) {
        //code 5number 3 mesid + 2 groupid
        temp = "000" + this.measureList[i].mesdefID;
        tempg = "00" + this.measureList[i].subID;
        sel += temp.substr(-3) + tempg.substr(-2);
        //initialcost 8num
        tempi = "00000000" + this.measureList[i].priceNew;
        sel += tempi.substr(-8);
        //annual cost [ 8 up/ 9 down ] + 7num
        if (this.measureList[i].costChangeOriginal > 0) {
          sel += "9";
        } else {
          sel += "8";
        }
        temp = "0000000" + Math.abs(Math.round(this.measureList[i].costChangeOriginal));
        sel += temp.substr(-7);
        //annual co2 [ 8 up/ 9 down ] + 5num
        if (this.measureList[i].co2ChangeOriginal > 0) {
          sel += "9";
        } else {
          sel += "8";
        }
        temp = "00000" + Math.abs(Math.round(this.measureList[i].co2ChangeOriginal));
        sel += temp.substr(-5);
      }
    }

    saveData += "mesSelId=" + sel;

    return saveData;
  },


  //loadDataSet()  set data from file
  //
  // parameters
  // 		loadData: stored data to set
  // 		addflag: not used  flag
  // result
  //		mesSel: selected list of measure id  
  //
  loadDataSet: function (loadData, addflag) {
    let param;
    let paramOne;
    let val;
    let vname;
    let vnameDef;
    let i;
    let j;
    let prop;	//temporary value
    let mesSel;	//selected measures temporary stock
    let Input = this.data;
    let indef = this.scenario.defInput;
    let mesid = 0;
    let subid = 0;

    //expanded to values 
    param = loadData.split(",");
    for (i = 0; i < param.length; i++) {
      if (param[i]) {
        paramOne = param[i].split("=");
        vname = paramOne[0];				//ID
        vnameDef = vname.substr(0, 4);
        val = paramOne[1];					//value
      } else {
        vname = "dummy";
      }

      if (this.logicList[vname]) {
        if (parseInt(val) && parseInt(val) < 100) {
          if (!addflag) {
            this.logicList[vname].orgCopyNum = parseInt(val);
          }
        }
      } else if (indef[vnameDef]) {
        //in case of defined in valuable list
        switch (indef[vnameDef].letType) {
          case "Number":
            Input[vname] = parseFloat(val);
            break;

          case "String":
            // convert '_' to ' '
            j = val.indexOf("_");
            while (j != -1) {
              val = val.substring(0, j) + " " + val.substring(j + 1, 200);
              j = val.indexOf("_");
            }
            // convert '~' to ','
            j = val.indexOf("~");
            while (j != -1) {
              val = val.substring(0, j) + "," + val.substring(j + 1, 200);
              j = val.indexOf("~");
            }
            // remove """
            j = val.indexOf("\"");
            while (j != -1) {
              val = val.substring(0, j) + val.substring(j + 1, 200);
              j = val.indexOf("\"");
            }
            //save to valuable
            Input[vname] = val;
            break;

          default:
            //boolian, nodata
            if (vname == "mesSelId") {
              mesSel = val;
              for (j = 0; j < mesSel.length; j += 27) {
                mesid = parseInt(mesSel.substr(j, 3));
                subid = parseInt(mesSel.substr(j + 3, 2));
                for (let k = 0; k < this.measureList.length; k++) {
                  if (this.measureList[k].mesID == mesid && this.measureList[k].subID == subid) {
                    this.measureList[k].seleted = true;
                    break;
                  }
                }
              }
            } else {
              if (val == "true") {
                Input[vname] = true;
              } else if (val == "false") {
                Input[vname] = false;
              }
            }
        }
      }
    }
    return mesSel;
  }
};

export { doc };
