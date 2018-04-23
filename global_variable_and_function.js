"use strict";
/****************************
 **** Constant Variable *****
 ****************************/
/* 
 * event-------
 *    DEFAULT_EVENT: 指定一個預設事件(這裡是2)
 *    0: 無
 *    1: occurrence，隨機事件
 *    2: question，問題
 *    3: mini game, 小遊戲:配對
 *    4: question，問題。分類二 (已拋棄)
 *    5: mini game, 小遊戲:接涼粉
 *    6: question，問題。分類三 (已拋棄)
 *    7: question，問題。分類四 (已拋棄)
 *    8: deliver to a particular position, 送到指定位置
 *    9: shop 商店 (未完成)
 *   10: mini game, 小遊戲:打地鼠
 *   11: mini game, 小遊戲:拼圖
 */
const DEFAULT_EVENT 		= 0, // set default event to 0
	  EVENT_OCCURRENCE 		= 1,
	  EVENT_QUESTION 		= 2, // 題目
	  EVENT_MINIGAME_PAIR 	= 3,
//	  EVENT_QUESTION_TYPE_2 = 4, // 歷史(no use)
	  EVENT_MINIGAME_CATCH	= 5,
//	  EVENT_QUESTION_TYPE_3 = 6, // 生活(no use)
//	  EVENT_QUESTION_TYPE_4 = 7, // 建築(no use)
	  EVENT_DELIVER			= 8,
	  EVENT_SHOP			= 9,
	  EVENT_MINIGAME_WHACK	= 10,
	  EVENT_MINIGAME_JIGSAW = 11;

let BLOCKS = [
{
	x: 785.72927597062, 
	y: 792.44491080797, 
	event:1, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 728.6463798531, 
	y: 698.42602308499, 
	event:2, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 658.13221406086, 
	y: 661.49003147954, 
	event:3, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 589.29695697796, 
	y: 612.80167890871, 
	event:5, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 522.14060860441, 
	y: 572.50786988458, 
	event:10, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 458.34207764953, 
	y: 528.85624344176, 
	event:11, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 384.47009443861, 
	y: 493.59916054565, 
	event:1, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 224.97376705142, 
	y: 453.30535152151, 
	event:2, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 376.07555089192, 
	y: 406.29590766002, 
	event:3, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 449.94753410283, 
	y: 364.32318992655, 
	event:10, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 527.17733473242, 
	y: 329.06610703043, 
	event:5, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 589.29695697796, 
	y: 283.73557187828, 
	event:11, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 678.27911857293, 
	y: 240.08394543547, 
	event:1, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 742.07764952781, 
	y: 211.54249737671, 
	event:2, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 810.9129066107, 
	y: 130.95487932844, 
	event:3, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 873.03252885624, 
	y: 204.82686253935, 
	event:5, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 928.43651626443, 
	y: 250.1573976915, 
	event:10, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 992.23504721931, 
	y: 292.13011542497, 
	event:11, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 1074.5015739769, 
	y: 337.46065057712, 
	event:1, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 1143.3368310598, 
	y: 376.07555089192, 
	event:2, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 1200.4197271773, 
	y: 416.36935991605, 
	event:3, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 1375.0262329486, 
	y: 470.0944386149, 
	event:5, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 1200.4197271773, 
	y: 488.56243441763, 
	event:10, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 1136.6211962225, 
	y: 535.57187827912, 
	event:11, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 1057.7124868835, 
	y: 570.82896117524, 
	event:1, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 983.84050367261, 
	y: 612.80167890871, 
	event:2, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 920.04197271773, 
	y: 656.45330535152, 
	event:3, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
},{
	x: 846.16998950682, 
	y: 683.31584470094, 
	event:11, 
	offset:{x:[0,0], y:[0,0]}, 
	parasite:0, 
	deliverDestination:'undefined'
}
];
// score of mini game
const SCORE_INIT = 1000,
	  SCORE_CORRECT_ANSWER = 200,
	  SCORE_WRONG_ANSWER = -100,
	  SCORE_PER_JELLY = 10, // mini game (catch)
	  SCORE_PER_PAIR = 60, // mini game (pair)
	  SCORE_PER_MOLE = 10, // mini game (whack)
	  SCORE_PER_PIECE_JIGSAW = 10, // mini game (jigsaw)
	  SCORE_PER_SECOND_JIGSAW = 10; // mini game (jigsaw)

// game mode's const
const MODE_DUALPLAYER = 1,
	  MODE_PLAYER_VS_COMPUTER = 2;
const NPC_LIST = [1]; // set player2 as a NPC
// offset of two character
const OFFSET_C1 = {x:0, y:0},
	  OFFSET_C2 = {x:0, y:0}; /* FUTURE: 增加變數。角色位移 */
const AVAILABLE_ROLL_TIMES = 7;
const EVENT_EFFECT_ROUND = 2;
const MASCOT_PRICE_MULTIPLE = 2;
const MASCOT_PUNISHMENT_MULTIPLE = 0.5;
const BADLUCK_PRICE_MULTIPLE = 0.5;
const BADLUCK_PUNISHMENT_MULTIPLE = 2;
let CHARACTER_DEFAULT_NAME = [
	'亞當',
	'瑪莎',
	'安娜',
	'海倫'
];
const TOTAL_IMAGE_COUNT = 19; // number of images need to be preload

/****************************
********* Variable *********
****************************/
let ORI_BG_WIDTH, ORI_BG_HEIGHT, // width & height of background in file
	BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS, // width & height of background on canvas
	canvas_js,
	canvas_fabric,
	canvas_object_js,
	canvas_object_fabric,
	canvas_episode_js,
	canvas_episode_fabric,
	canvas_minigame_js,
	canvas_minigame_fabric,
	canvas_end_js,
	canvas_end_fabric;
let int_gameMode = MODE_PLAYER_VS_COMPUTER, // default = MODE_PLAYER_VS_COMPUTER
	int_playerPosition = 0, // player's current position
	int_correctAnswerIndex, // the index of the current questiob
	int_mascotPosition = 0, // the position of mascot
	int_badLuckPosition = 0; // the position of bad luck
let boolean_diceRolling = false, // a flag for checking whether the dice is rolling or not
	boolean_playerMoving = false, // a flag for checking whether player is moving or not
	boolean_eventPopout = false, // a flag for checking whether run into a question or not
	boolean_runintoMascot = false, // a flag for checking whether run into mascot or not
	boolean_runintoBadLuck = false, // a flag for checking whether run into badluck or not
	boolean_animating = false; // a flag for checking whether animation is playing or not
let obj_background;

/*************************
 ******* Function ********
 *************************/
function correctPositionOfBlocks(){
	for(let c=0,len=BLOCKS.length; c<len; c++){
		BLOCKS[c].x = calculatePoint(BLOCKS[c].x,BLOCKS[c].y).x;
		BLOCKS[c].y = calculatePoint(BLOCKS[c].x,BLOCKS[c].y).y;
		for(let cc=0, length=2; cc<length; cc++){
			let temp = convertSizeToCurrentBackground( BLOCKS[c].offset.x[cc], BLOCKS[c].offset.y[cc] );
			BLOCKS[c].offset.x[cc] = temp.x;
			BLOCKS[c].offset.y[cc] = temp.y;
		}
	}
}

function setBackground( url, width, height, callbackFunction ){
	// get the original background width & height
	ORI_BG_WIDTH = width;
	ORI_BG_HEIGHT = height;
	if( canvas_fabric.height/canvas_fabric.width > ORI_BG_HEIGHT/ORI_BG_WIDTH ){
		BG_WIDTH_IN_CANVAS = canvas_fabric.width;
		BG_HEIGHT_IN_CANVAS = canvas_fabric.width*ORI_BG_HEIGHT/ORI_BG_WIDTH;
	}else{
		BG_HEIGHT_IN_CANVAS = canvas_fabric.height;
		BG_WIDTH_IN_CANVAS = canvas_fabric.height*ORI_BG_WIDTH/ORI_BG_HEIGHT;
	}
	fabric.Image.fromURL(
		url,
		function( img ) {
			canvas_fabric.add( img );
			img.isLink = false;
			obj_background = img;
			canvas_fabric.sendToBack(obj_background);
			canvas_fabric.renderAll();
			if(typeof(callbackFunction)==='function'){
				callbackFunction();
			}
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'center',
			left: canvas_fabric.width/2,
			top: canvas_fabric.height/2,
			width: BG_WIDTH_IN_CANVAS,
			height: BG_HEIGHT_IN_CANVAS
		}
	);
}

function calculatePoint(ori_X,ori_Y){
	let newPoint = convertSizeToCurrentBackground( ori_X, ori_Y );
	// add the gap between background size and canvas size
	newPoint.x += (canvas_fabric.width-BG_WIDTH_IN_CANVAS)/2;
	newPoint.y += (canvas_fabric.height-BG_HEIGHT_IN_CANVAS)/2;
	return newPoint;
}

function convertSizeToCurrentBackground( ori_X, ori_Y ){
	let newX = ori_X * BG_WIDTH_IN_CANVAS / ORI_BG_WIDTH;
	let newY = ori_Y * BG_HEIGHT_IN_CANVAS / ORI_BG_HEIGHT;
	return {
		x: newX,
		y: newY
	};
}
// make a input size fit with the target range
function convertSizeToCustomRange( ori_width, ori_height, limited_width, limited_height ){
	let newWidth,
		newHeight;
	if( limited_height/limited_width > ori_height/ori_width ){
		newWidth = limited_width;
		newHeight = limited_width*ori_height/ori_width;
	}else{
		newHeight = limited_height;
		newWidth = limited_height*ori_width/ori_height;
	}
	return {
		width: newWidth,
		height: newHeight
	};
}
// Argument:
// ** baseObject : the base object.
// ** pointOnOriImage : an object with x and y which is the coordinate value on the original image of the base object.
// ** scale (optional) : the scale value that scaled the image.
// Return: coordinate on the canvas
function calculatePointOnCanvasBasedOnObject( baseObject, pointOnOriImage, scale ){
	let objRect = baseObject.getBoundingRect();
	let newP = pointOnOriImage;
	newP.x *= baseObject.width / baseObject._element.width;
	newP.y *= baseObject.height / baseObject._element.height;
	return {
		// The reason why use "objRect.left" rather than "baseObject.left" is that the position point of baseObject might be not on the top left corner
		x: objRect.left + newP.x,
		y: objRect.top + newP.y
	};
}

// get the scale value of the target fabric object
function getScaleValue( object ){
	return object.width / object._element.width;
}

function removeAllClickEventOfFabricCanvas(){
	canvas_episode_fabric.__eventListeners["mouse:down"] = [];
}

function setGameMode( modeNum ){
	int_gameMode = modeNum;
}

function getGameMode(){
	return int_gameMode;
}

function setMiniGameCanvasVisible( bool ){
	$("#minigameLayerCanvas").parent().css("display",(bool?"block":"none"));
	canvas_fabric.calcOffset();
	canvas_minigame_fabric.calcOffset();
}
// set cursor type on specific canvas
function setCursorOnCanvas( F_canvas, cursor_type ){
	F_canvas.hoverCursor = cursor_type;
	F_canvas.setCursor(F_canvas.hoverCursor);
}

// use for stop requestAnimFrame() circle
window.cancelRequestAnimFrame = (function(){
	return  window.cancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
})();
// create a wrap text object limited in maxW*maxH
function wrapCanvasText(t, canvas, maxW, maxH, justify) {
	if (typeof maxH === "undefined") {
		maxH = 0;
	}
	var words = t.text.split("");
	var formatted = '';

	// This works only with monospace fonts
	justify = justify || 'left';

	// clear newlines
	var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
	// calc line height
	var lineHeight = new fabric.Text(sansBreaks, {
		fontFamily: t.fontFamily,
		fontSize: t.fontSize
	}).height;

	// adjust for vertical offset
	var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
	var context = canvas.getContext("2d");


	context.font = t.fontSize + "px " + t.fontFamily;
	var currentLine = '';
	var breakLineCount = 0;

	let n = 0;
	while (n < words.length) {
		var isNewLine = currentLine === "";
		var testOverlap = currentLine + ' ' + words[n];

		// are we over width?
		var w = context.measureText(testOverlap).width;

		if (w < maxW) { // if not, keep adding words
			if (currentLine !== '') {currentLine += '';}
			currentLine += words[n];
			// formatted += words[n] + ' ';
		} else {

			// if this hits, we got a word that need to be hypenated
			if (isNewLine) {
				var wordOverlap = "";

				// test word length until its over maxW
				for (var i = 0; i < words[n].length; ++i) {

					wordOverlap += words[n].charAt(i);
					var withHypeh = wordOverlap + "-";

					if (context.measureText(withHypeh).width >= maxW) {
						// add hyphen when splitting a word
						withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
						// update current word with remainder
						words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
						formatted += withHypeh; // add hypenated word
						break;
					}
				}
			}
			while (justify === 'right' && context.measureText(' ' + currentLine).width < maxW){
				currentLine = ' ' + currentLine;
			}

			while (justify === 'center' && context.measureText(' ' + currentLine + ' ').width < maxW){
				currentLine = ' ' + currentLine + ' ';
			}

			formatted += currentLine + '\n';
			breakLineCount++;
			currentLine = "";

			continue; // restart cycle
		}
		if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
			// add ... at the end indicating text was cutoff
			formatted = formatted.substr(0, formatted.length - 3) + "...\n";
			currentLine = "";
			break;
		}
		n++;
	}

	if (currentLine !== '') {
		while (justify === 'right' && context.measureText(' ' + currentLine).width < maxW){
			currentLine = ' ' + currentLine;
		}

		while (justify === 'center' && context.measureText(' ' + currentLine + ' ').width < maxW){
			currentLine = ' ' + currentLine + ' ';
		}

		formatted += currentLine + '\n';
		breakLineCount++;
		currentLine = "";
	}

	// get rid of empy newline at the end
	formatted = formatted.substr(0, formatted.length - 1);

	var ret = new fabric.Text(formatted, { // return new text-wrapped text obj
		left: t.left,
		top: t.top,
		fill: t.fill,
		fontFamily: t.fontFamily,
		fontSize: t.fontSize,
		originX: t.originX,
		originY: t.originY,
		angle: t.angle,
		selectable: t.selectable,
		hasControls: t.hasControls,
		hasBorders: t.hasBorders,
		hasRotatingPoint: t.hasRotatingPoint,
	});
	return ret;
}

function is_numeric(str){
	return /^\d+$/.test(str);
}