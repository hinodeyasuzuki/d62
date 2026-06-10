/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 4 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * unit.js 
 * 
 * any kind of unit related to energy type is defined here, change here
 * 
 * License: http://creativecommons.org/licenses/LGPL/2.1/
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 */

D6.Unit.price = {
		electricity:0.27,				// override in D6.area.setPersonArea by supplyer
		nightelectricity:0.10,
		sellelectricity:0.30,
		nagas:1.5,
		lpgas:5,
		kerosene:0.80,
		gasoline:1.30,
		lightoil:1.00,
		heavyoil:0.80,
		coal:0,
		biomass:0,
		hotwater:0,
		waste:0,
		water:0,
		gas:1.20,
		car:1.30
	};

D6.Unit.defaultPriceElectricity = D6.Unit.price.electricity;

	// intercept price when consumption is zero 	yen(in Japan)
D6.Unit.priceBase = {
		electricity:0,
		nightelectricity:21,
		sellelectricity:0,
		nagas:10,
		lpgas:10,
		kerosene:0,
		gasoline:0,
		lightoil:0,
		heavyoil:0,
		coal:0,
		biomass:0,
		hotwater:0,
		waste:0,
		water:0,
		gas:800,
		car:0
	};
	
	// names ( dataset is now witten in Japanse )
D6.Unit.name = {
		electricity:"electricity",
		nightelectricity:"nightelectricity",
		sellelectricity:"sellelectricity",
		nagas:"nagas",
		lpgas:"lpgas",
		kerosene:"kerosene",
		gasoline:"gasoline",
		lightoil:"lightoil",
		heavyoil:"heavyoil",
		coal:0,
		biomass:0,
		hotwater:0,
		waste:0,
		water:0,
		gas:"nagas",
		car:"car"
	};
	

