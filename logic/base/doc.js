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
var D6 = D6 || {};

D6.doc =
{
	//define variables
	data : [],								//input values
	equip : [],								//equiment price

	// clear values
	//		dialog:false not to show dialog
	clear : function( dialog ) {
		var answer;
		var AreaOrgBackup;

		//show dialog
		if ( dialog ){
			if ( answer == "CANCEL" ) {
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
	serialize :  function() {
		var saveData = "";
		var temp = "";
		var tempg = "";
		var tempi = "";
		var prop = 0;
		var i = 0;
		var Input = this.data;

		for ( prop in Input )
		{
			if (D6.scenario.defInput[prop.substr(0,4)].defaultValue == Input[prop] ) continue;
			temp = "" + Input[prop];

			//in case of string
			if ( typeof( Input[prop] ) == "string" ) {
				// double width to single width charactor
				while ( temp.indexOf( " " ) != -1)
				{
					i = temp.indexOf( " " );
					temp = temp.substring( 0, i - 1 ) + "_" + temp.substring( i + 1, 2000);
				}
				// change ',' to '~'
				while ( temp.indexOf( "," ) != -1 )
				{
					i = temp.indexOf( "," );
					temp = temp.substring( 0, i - 1 ) + "~" + temp.substring( i + 1, 2000);
				}
			}
			saveData = saveData + prop + "=" + temp + ",";
		}

		//save room/equipment number
		for ( prop in D6.logicList )
		{
			if ( D6.logicList[prop].orgCopyNum >= 1 ) {
				saveData += prop + "=" + D6.logicList[prop].orgCopyNum + ",";
			}
		}

		//serialize(mesSelId=00x00x0xx0xx...)
		var sel = "";
		for ( i=0 ; i < D6.measureList.length ; i++ )
		{
			if ( D6.measureList[i].selected ) {
				//code 5number 3 mesid + 2 groupid
				temp = "000" + D6.measureList[i].mesdefID;
				tempg = "00" + D6.measureList[i].subID;
				sel += temp.substr( -3 ) + tempg.substr( -2 );
				//initialcost 8num
				tempi = "00000000" + D6.measureList[i].priceNew;
				sel += tempi.substr( -8 );
				//annual cost [ 8 up/ 9 down ] + 7num
				if (  D6.measureList[i]. costChangeOriginal > 0 ){
					sel += "9";					
				} else {
					sel += "8";
				}
				temp = "0000000" + Math.abs(Math.round(D6.measureList[i].costChangeOriginal));
				sel += temp.substr( -7 );
				//annual co2 [ 8 up/ 9 down ] + 5num
				if (  D6.measureList[i]. co2ChangeOriginal > 0 ){
					sel += "9";					
				} else {
					sel += "8";
				}
				temp = "00000" + Math.abs(Math.round(D6.measureList[i].co2ChangeOriginal));
				sel += temp.substr( -5 );
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
	loadDataSet : function ( loadData, addflag ) {
		var param;
		var paramOne;
		var val;
		var vname;
		var vnameDef;
		var i;
		var j;
		var prop;	//temporary value
		var mesSel;	//selected measures temporary stock
		var Input = this.data;
		var indef = D6.scenario.defInput;
		var mesid = 0;
		var subid = 0;

		//expanded to values 
		param = loadData.split(",");
		for ( i=0 ; i<param.length ; i++ )
		{
			if ( param[i] ) {
				paramOne = param[i].split("=");
				vname = paramOne[0];				//ID
				vnameDef = vname.substr( 0,4 );
				val = paramOne[1];					//value
			} else {
				vname = "dummy";
			}

			if ( D6.logicList[vname] ) {
				if ( parseInt(val) && parseInt(val) < 100 ) {
					if ( !addflag ) {
						D6.logicList[vname].orgCopyNum = parseInt(val);
					}
				}
			} else if ( indef[vnameDef] ) {
				//in case of defined in valuable list
				switch (  indef[vnameDef].varType ) {
				case "Number":
					Input[vname] = parseFloat( val );
					break;

				case "String":
					// convert '_' to ' '
					j = val.indexOf( "_" );
					while ( j != -1 )
					{
						val = val.substring( 0, j ) + " " + val.substring( j + 1, 200);
						j = val.indexOf( "_" );
					}
					// convert '~' to ','
					j = val.indexOf( "~" );
					while ( j != -1 )
					{
						val = val.substring( 0, j ) + "," + val.substring( j + 1, 200);
						j = val.indexOf( "~" );
					}
					// remove """
					j = val.indexOf( "\"" );
					while ( j != -1 )
					{
						val = val.substring( 0, j ) + val.substring( j + 1, 200);
						j = val.indexOf( "\"" );
					}
					//save to valuable
					Input[vname] = val;
					break;

				default:
					//boolian, nodata
					if ( vname == "mesSelId" ) {
						mesSel = val;
						for ( j=0 ; j<mesSel.length ; j+=27 ) {
							mesid = parseInt(mesSel.substr( j, 3 ));
							subid = parseInt(mesSel.substr( j+3, 2 ));
							for ( var k=0 ; k < D6.measureList.length ; k++ ) {
								if (D6.measureList[k].mesID == mesid && D6.measureList[k].subID == subid) {
									D6.measureList[k].seleted = true;
									break;
								}
							}
						}
					} else {
						if ( val == "true" ) {
							Input[vname] = true;
						} else if ( val == "false" ) {
							Input[vname] = false;
						}
					}
				}
			}
		}
		return mesSel;
	}
};
