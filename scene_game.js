"use strict";
let DEBUGGING = false;
let DEBUG_STEP = 1;
let DEBUG_BADLUCK;
let DEBUG_MASCOT;
/* constant for GameScene */
const SCALE_OF_PLAYER = {x: 0.2,y: 0.2},
	  SCALE_OF_MASCOT = {x: 0.08,y: 0.08},
	  SCALE_OF_MASCOT_ON_CHARACTER = 1,
	  SCALE_OF_BADLUCK = {x: 0.1,y: 0.1},
	  SCALE_OF_BADLUCK_ON_CHARACTER = 1,
	  SCALE_OF_DICE = {x: 0.35,y: 0.35},
	  SCALE_OF_QUESTION = 1,
	  SCALE_OF_STATUS_BG_1 = {x: 0.43,y: 0.43},
	  SCALE_OF_STATUS_BG_2 = {x: 0.43,y: 0.43},
	  SCALE_OF_FONTSIZE = 1;
const INT_LINE_SPACING_OF_STATUS = 10,
	  POSITION_OF_DICE = {x: 800, y: 466.5},
	  POSITION_OF_STATUS_BG_1 = {x: 18, y: 912},
	  POSITION_OF_STATUS_BG_2 = {x: 1577, y: 22};
/* object for GameScene */
/* objects in layer bckground */
let obj_status1_name,
	obj_status2_name,
	obj_status1_info,
	obj_status2_info,
	obj_status1_BG,
	obj_status2_BG;
/* objects in layer object */
let obj_player1,
	obj_player2,
	obj_mascot,
	obj_badLuck,
	obj_mascotOnCharacter,
	obj_badluckOnCharacter;
/* objects in layer episode */
let obj_dice,
	obj_question,
	obj_ques_text,
	obj_checkSign,
	obj_correctWord,
	obj_wrongWord,
	obj_eventBG,
	obj_eventOccurrenceBG;
/* objects in layer end */
let obj_endGameBG;

let obj_currentSubject, // who own the current turn
	obj_sampleOption; // 
/* objects array for GameScene */
let objs_option = [],
	objs_option_text = [];
let classifiedQuestionBank; // store classified question bank
let NPCCorrectProbabilityArray = [true,true,false]; // 66% probability that NPC's answer are correct 
let intervalBetweenQuesAndOptions = 20,
	intervalAmongOptions = 10;
let AskedQuestionObject = function(){
	this.mainClass = null;
	this.subclass = null;
	this.questionText = "";
	this.optionText = [];
	this.correctIndex = 0;
	this.selectedIndex = 0;
};
let tempAskedQuestionObject = null; // created when run into question. obsoleted when selected option.

let customControl = false; // for more question encountered

let allHasAsked = false; // for checking whether all class get involved

let mainClassAskedControl = []; // make all class get involved

function prepareForGameScene(){
	// play background music
	soundManager.play("audio_bg_music"); // note DEBUG: soundManager.play
	addNonImageObject();
	redrawStatusBar();
	canvas_episode_fabric.bringToFront(obj_dice);

	// mouse down event
	canvas_episode_fabric.on('mouse:down', clickEventHandler_inGameScene );

	// click event handler
	function clickEventHandler_inGameScene(e){
		// this console cause auto trigger to occur error
		// console.log("----- mouse down at ",canvas_episode_fabric.getPointer(e.e));

		// avoid handling click event on empty part of canvas
		if(!e.target) {
			return;
		}
		/**** roll dice behavior
		 * Disable when dice is rolling
		 * Disable when character is moving
		 * Disable when player is in the event mode
		 * Disable when player run into mascot
		 * Disable when player run into bad luck
		 * Disable when parasite is animating
		 */
		if(e.target === obj_dice 
		   && !boolean_diceRolling 
		   && !boolean_playerMoving 
		   && !boolean_eventPopout 
		   && !boolean_runintoMascot 
		   && !boolean_runintoBadLuck
		   && !boolean_animating ){
			obj_currentSubject.int_rollTimes--;
			redrawStatusBar();
			canvas_object_fabric.bringToFront(obj_currentSubject); // set player to top layer
			boolean_diceRolling = true; // lock dice flag
			let ranNum; // store random dice number (1~6)
			let times = 10;
			// roll dice ten times
			let intervalId_rolling = setInterval(function(){
				ranNum = Math.floor(4*Math.random()+1);
				switchDiceTo(ranNum);
				times--;
				if(times<0){
					// player start moving, accroding to ranNum
					boolean_playerMoving = true; // lock moving flag
					boolean_diceRolling = false; // unlock dice flag
// 當走到非題目的格子，下一步一定是題目
if( customControl && NPC_LIST.indexOf(obj_currentSubject.int_order)<0 ){
	(function(){
		let current = obj_currentSubject.int_playerPosition;
		let target = [];
		
		for( let stepCount=1, maxCount=4; stepCount<=maxCount; stepCount++ ){
			let testBlockIndex = (current+stepCount) % BLOCKS.length;
			if( BLOCKS[testBlockIndex].event == EVENT_QUESTION ){
				target.push( stepCount );
				break;
			}
		}
		if( target.length > 0 ){
			ranNum = target[ Math.floor( Math.random()*target.length ) ];
			switchDiceTo(ranNum);
			customControl = false;
		}
	})();
}
					// debug 
//					ranNum = 11;
					if( DEBUGGING ) ranNum = DEBUG_STEP;
					playerMoveOneStep( ranNum, function(){
						boolean_playerMoving = false; // unlock moving flag
						executeParasiteEffect( canvas_episode_fabric );
						canvas_episode_fabric.renderAll();
					} );
					clearInterval(intervalId_rolling);
				}
			}, 100);
		}
		// when options are clicked
		if( boolean_eventPopout && e.target && ("isOption" in e.target) && typeof(e.target.isOption)!=='undefined' ){ 
			let tempScore;
			boolean_eventPopout = false;
			boolean_animating = true;

			// record selected option index
			let selectedIndex = objs_option.indexOf( e.target );
			tempAskedQuestionObject.selectedIndex = selectedIndex;
			conceptSet[ tempAskedQuestionObject.mainClass ].subClass[ tempAskedQuestionObject.subClass ].askedArray.push( tempAskedQuestionObject );

			obj_checkSign.set({
				visible: true,
				left: e.target.left,
				top: e.target.top,
				width: e.target.width,
				height: e.target.height
			});
			canvas_episode_fabric.bringToFront(obj_checkSign);
			
			let point = calculatePointOnCanvasBasedOnObject( obj_question, {x:2220,y:600} );
			let quesScale = getScaleValue( obj_question );
			
			if(e.target.isCorrect){ // when choose the correct answer
				soundManager.play("audio_correct");
				tempScore = SCORE_CORRECT_ANSWER;
				
				obj_correctWord.set({
					left: point.x,
					top: point.y,
					width: quesScale * 761,
					height: quesScale * 447
				})
				obj_correctWord.setVisible(true);
				canvas_episode_fabric.bringToFront(obj_correctWord);

				// record correct times
				conceptSet.totalCorrectAmount ++;
				conceptSet[ tempAskedQuestionObject.mainClass ].totalCorrectAmount ++;
				conceptSet[ tempAskedQuestionObject.mainClass ].subClass[ tempAskedQuestionObject.subClass ].totalCorrectAmount ++;
			}
			else{ // when choose the wrong answer
				soundManager.play("audio_wrong");
				tempScore = SCORE_WRONG_ANSWER;
				
				obj_wrongWord.set({
					left: point.x,
					top: point.y,
					width: quesScale * 869,
					height: quesScale * 566
				});
				obj_wrongWord.setVisible(true);
				canvas_episode_fabric.bringToFront(obj_wrongWord);
			}
			tempScore = (obj_currentSubject.isFollowedByMascot) ? tempScore*MASCOT_PRICE_MULTIPLE : tempScore;
			tempScore = (obj_currentSubject.isFollowedByBadLuck) ? tempScore*BADLUCK_PRICE_MULTIPLE : tempScore;
			obj_currentSubject.int_score += tempScore; // plus score
			redrawStatusBar();
			
			let clickToESC = function(){
				canvas_episode_fabric.off('mouse:down', clickToESC );

				clearQuestionEvent();
				canvas_episode_fabric.renderAll();
				boolean_animating = false;
				switchTurn();
			}
			canvas_episode_fabric.on('mouse:down', clickToESC );
		}
		// click anywhere when running into mascot
		if( boolean_runintoMascot && !boolean_animating ){
			// hide event image
			obj_mascot.set({ visible: false });
			// turn off event flag
			boolean_runintoMascot = false;
			// show dice
			obj_dice.set({"visible":true});
			canvas_object_fabric.renderAll();
			// execute event of current block
			executeBlockEvent();
		}
		// click anywhere when running into bad luck
		if( boolean_runintoBadLuck && !boolean_animating ){
			// hide bad luck image
			obj_badLuck.set({ visible: false });
			// turn off event flag
			boolean_runintoBadLuck = false;
			// show dice
			obj_dice.set({"visible":true});
			canvas_object_fabric.renderAll();
			// execute event of current block
			executeBlockEvent();
		}
	}
}
// preload those images that rely on BLOCKS' coordinate
function preloadBlocksRelatedImage(){
	// set default character look (if player did not choose)
	for(let count=0,len=4;count<len;count++){ 
		if(ints_selectedCharacterIndex[0] == null && ints_selectedCharacterIndex.indexOf(count)==-1)
			ints_selectedCharacterIndex[0] = count;
		if(ints_selectedCharacterIndex[1] == null && ints_selectedCharacterIndex.indexOf(count)==-1)
			ints_selectedCharacterIndex[1] = count;
	}
	
	CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[0]] = "你("+CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[0]]+")";
	
	// customize character size
	let charData = [
{ 
	width: convertSizeToCurrentBackground(555,0).x * 0.9 * 0.2,
	height: convertSizeToCurrentBackground(0,1220).y * 0.9 * 0.2
},{ 
	width: convertSizeToCurrentBackground(555,0).x * 0.9 * 0.2,
	height: convertSizeToCurrentBackground(0,1220).y * 0.9 * 0.2
},{ 
	width: convertSizeToCurrentBackground(555,0).x * 0.9 * 0.2,
	height: convertSizeToCurrentBackground(0,1220).y * 0.9 * 0.2
},{ 
	width: convertSizeToCurrentBackground(665,0).x * 0.9 * 0.2,
	height: convertSizeToCurrentBackground(0,1205).y * 0.9 * 0.2
}
	];
	
    // draw obj_status1_BG object
	fabric.Image.fromURL(
		'./images/charecter/info_bg_left_'+(ints_selectedCharacterIndex[0]+1)+'.png',
		function( img ) {
			canvas_fabric.add( img );
			img.isLink = false;
			img.set({
				width: convertSizeToCurrentBackground(img._element.width,0).x * SCALE_OF_STATUS_BG_1.x,
				height: convertSizeToCurrentBackground(0,img._element.height).y * SCALE_OF_STATUS_BG_1.y
			});
			
			obj_status1_BG = img; // save dice into global variable
			// console.log("[preload] loaded obj_status1_BG image");
			window.progressCount++; // increase progress counter of loading image
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'left',
			originY: 'bottom',
			left: calculatePoint( POSITION_OF_STATUS_BG_1.x, 0 ).x,
			top: calculatePoint( 0, POSITION_OF_STATUS_BG_1.y ).y
		}
	);
	// draw obj_status2_BG object
	fabric.Image.fromURL(
		'./images/charecter/info_bg_right_'+(ints_selectedCharacterIndex[1]+1)+'.png',
		function( img ) {
			canvas_fabric.add( img );
			img.isLink = false;
			img.set({
				width: convertSizeToCurrentBackground(img._element.width,0).x * SCALE_OF_STATUS_BG_2.x,
				height: convertSizeToCurrentBackground(0,img._element.height).y * SCALE_OF_STATUS_BG_2.y
			});
			
			obj_status2_BG = img; // save dice into global variable
			// console.log("[preload] loaded obj_status2_BG image");
			window.progressCount++; // increase progress counter of loading image
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'right',
			originY: 'top',
			left: calculatePoint( POSITION_OF_STATUS_BG_2.x, 0 ).x,
			top: calculatePoint( 0, POSITION_OF_STATUS_BG_2.y ).y
		}
	);
	// create player1 image object
	fabric.Image.fromURL(
		'./images/charecter/char'+(ints_selectedCharacterIndex[0]+1)+'.png',
		function( img ) {
			canvas_object_fabric.add( img );
			obj_player1 = img; // save player1 into global variable
			obj_player1.int_score = SCORE_INIT;
			obj_player1.int_rollTimes = AVAILABLE_ROLL_TIMES;
			obj_player1.int_playerPosition = 0;
			obj_player1.isFollowedByMascot = false;
			obj_player1.isFollowedByBadLuck = false;
			obj_player1.int_parasiteRemainingRound = 0;
			obj_player1.int_order = 0;
			obj_currentSubject = obj_player1; // let player1 move first
			// console.log("[preload] loaded obj_player1 image");
			window.progressCount++; // increase progress counter of loading image
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			left: BLOCKS[0].x + OFFSET_C1.x + BLOCKS[0].offset.x[0],
			top: BLOCKS[0].y + OFFSET_C1.y + BLOCKS[0].offset.y[0],
			width: charData[ints_selectedCharacterIndex[0]].width,
			height: charData[ints_selectedCharacterIndex[0]].height
		}
	);
	// create player2(or computer) image object
	fabric.Image.fromURL(
		'./images/charecter/char'+(ints_selectedCharacterIndex[1]+1)+'.png',
		function( img ) {
			canvas_object_fabric.add( img );
			obj_player2 = img; // save player2 into global variable
			obj_player2.int_score = SCORE_INIT;
			obj_player2.int_rollTimes = AVAILABLE_ROLL_TIMES;
			obj_player2.int_playerPosition = 0;
			obj_player2.isFollowedByMascot = false;
			obj_player2.isFollowedByBadLuck = false;
			obj_player2.int_parasiteRemainingRound = 0;
			obj_player2.int_order = 1;
			// console.log("[preload] loaded obj_player2 image");
			window.progressCount++; // increase progress counter of loading image
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			left: BLOCKS[0].x + OFFSET_C2.x + BLOCKS[0].offset.x[1],
			top: BLOCKS[0].y + OFFSET_C2.y + BLOCKS[0].offset.y[1],
			width: charData[ints_selectedCharacterIndex[1]].width,
			height: charData[ints_selectedCharacterIndex[1]].height
		}
	);

	// create mascot image object
	fabric.Image.fromURL(
		'./images/badluck.png',
		function( img ) {
			canvas_object_fabric.add( img );
			obj_mascot = img;
			// randomly set mascot on the map ( except the START point )
			generateMascot(canvas_object_fabric);
			// console.log("[preload] loaded obj_mascot image");
			window.progressCount++; // increase progress counter of loading image
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			visible: false
		}
	);
	// create mascot image object
	fabric.Image.fromURL(
		'./images/mascot.png',
		function( img ) {
			canvas_object_fabric.add( img );
			obj_badLuck = img;
			// randomly set bad luck on the map ( except the START point )
			generateBadLuck(canvas_object_fabric);
			// console.log("[preload] loaded obj_badLuck image");
			window.progressCount++; // increase progress counter of loading image
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			visible: false
		}
	);
	// draw dice object
	fabric.Image.fromURL(
		'./images/1.png',
		function( img ) {
			canvas_episode_fabric.add( img );
			img.isLink = true;
			img.set({
				width: convertSizeToCurrentBackground(img._element.width,0).x * SCALE_OF_DICE.x,
				height: convertSizeToCurrentBackground(0,img._element.height).y * SCALE_OF_DICE.y
			});
			img.setCoords();
			obj_dice = img; // save dice into global variable
			// console.log("[preload] loaded obj_dice image");
			window.progressCount++; // increase progress counter of loading image
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'center',
			left: calculatePoint( POSITION_OF_DICE.x, 0 ).x,
			top: calculatePoint( 0, POSITION_OF_DICE.y ).y
		}
	);
	// draw mascotOnCharacter object
	fabric.Image.fromURL(
		'./images/sun.png',
		function( img ) {
			img.isLink = false;
			obj_mascotOnCharacter = img;
			obj_mascotOnCharacter.setOpacity(0.9);
			canvas_object_fabric.add(obj_mascotOnCharacter);
			// console.log("[preload] loaded obj_mascotOnCharacter image");
			window.progressCount++; // increase progress counter of loading image
		},{
			visible: false,
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			width: convertSizeToCurrentBackground(256,256).x * SCALE_OF_MASCOT_ON_CHARACTER,
			height: convertSizeToCurrentBackground(256,256).y * SCALE_OF_MASCOT_ON_CHARACTER
		}
	);
	// draw badLuckOnCharacter object
	fabric.Image.fromURL(
		'./images/cloud.png',
		function( img ) {
			img.isLink = false;
			obj_badluckOnCharacter = img;
			obj_badluckOnCharacter.setOpacity(0.9);
			canvas_object_fabric.add(obj_badluckOnCharacter);
			// console.log("[preload] loaded obj_badluckOnCharacter image");
			window.progressCount++; // increase progress counter of loading image
		},{
			visible: false,
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			width: convertSizeToCurrentBackground(408,255).x * SCALE_OF_BADLUCK_ON_CHARACTER,
			height: convertSizeToCurrentBackground(408,255).y * SCALE_OF_BADLUCK_ON_CHARACTER
		}
	);
	// draw correct word object
	fabric.Image.fromURL(
		'./images/yes.png',
		function( img ) {
			img.isLink = false;
			obj_correctWord = img;
			canvas_episode_fabric.add(obj_correctWord);
			// console.log("[preload] loaded obj_correctWord image");
			window.progressCount++; // increase progress counter of loading image
		},{
			visible: false,
			originX: 'center',
			originY: 'center',
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false
		}
	);
	// draw wrong word object
	fabric.Image.fromURL(
		'./images/no.png',
		function( img ) {
			img.isLink = false;
			let tempX = calculatePoint(2600, 800).x;
			let tempY = calculatePoint(2600, 800).y;
			img.set({left:tempX,top:tempY});
			obj_wrongWord = img;
			canvas_episode_fabric.add(obj_wrongWord);
			// console.log("[preload] loaded obj_wrongWord image");
			window.progressCount++; // increase progress counter of loading image
		},{
			visible: false,
			originX: 'center',
			originY: 'center',
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false
		}
	);
	// draw obj_eventBG object
	fabric.Image.fromURL(
		'./images/event_background.png',
		function( img ) {
			img.isLink = false;
			obj_eventBG = img;
			let targetSize = convertSizeToCustomRange(3123, 1975, BG_WIDTH_IN_CANVAS * 9/10, BG_HEIGHT_IN_CANVAS * 9/10);
			obj_eventBG.set({
				width: targetSize.width,
				height: targetSize.height,
			});
			canvas_episode_fabric.add(obj_eventBG);
			// console.log("[preload] loaded obj_eventBG image");
			window.progressCount++; // increase progress counter of loading image
		},{
			visible: false,
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'center',
			left: canvas_fabric.width/2,
			top: canvas_fabric.height/2
		}
	);
	// draw obj_eventOccurrenceBG object
	fabric.Image.fromURL(
		'./images/occurrence_event/occurrence_background.png',
		function( img ) {
			img.isLink = false;
			obj_eventOccurrenceBG = img;
			let targetSize = convertSizeToCustomRange(3423, 2276, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS);
			obj_eventOccurrenceBG.set({
				width: targetSize.width,
				height: targetSize.height,
			});
			canvas_episode_fabric.add(obj_eventOccurrenceBG);
			// console.log("[preload] loaded obj_eventOccurrenceBG image");
			window.progressCount++; // increase progress counter of loading image
		},{
			visible: false,
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'center',
			left: canvas_fabric.width/2,
			top: canvas_fabric.height/2
		}
	);
	// draw obj_endGameBG object
	fabric.Image.fromURL(
		'./images/end_scene/diagnosis_background.png',
		function( img ) {
			img.isLink = false;
			obj_endGameBG = img;
			let targetSize = convertSizeToCustomRange(3385, 2112, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS);
			obj_endGameBG.set({
				width: targetSize.width,
				height: targetSize.height,
			});
			canvas_end_fabric.add(obj_endGameBG);
			// console.log("[preload] loaded obj_endGameBG image");
			window.progressCount++; // increase progress counter of loading image
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'center',
			left: canvas_fabric.width/2,
			top: canvas_fabric.height/2
		}
	);
}
// preload some individual images 
function preloadGameImage(){
	
	// draw question object
	fabric.Image.fromURL(
		'./images/question_background.png',
		function( img ) {
			img.isLink = false;
			obj_question = img;
			canvas_episode_fabric.add(obj_question);
			// console.log("[preload] loaded obj_question image");
			window.progressCount++; // increase progress counter of loading image
		},{
			visible: false,
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			left: canvas_fabric.width/2,
			top: canvas_fabric.height/2 + 50
		}
	);
	// draw options object
	fabric.Image.fromURL(
		'./images/option_block.png',
		function( img ) {
			img.isLink = true;
			img.isOption = true;
			obj_sampleOption = img;
			// console.log("[preload] loaded sampleOption image");
			window.progressCount++; // increase progress counter of loading image
		},{	
			visible: false,
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'center'
		}
	);
	// draw check sign object
	fabric.Image.fromURL(
		'./images/check_sign.png',
		function( img ) {
			canvas_episode_fabric.add( img );
			img.isLink = false;
			obj_checkSign = img;
			// console.log("[preload] loaded obj_checkSign image");
			window.progressCount++; // increase progress counter of loading image
		},{
			visible: false,
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'center'
		}
	);
}

function addNonImageObject(){
	// status bar text
	obj_status1_name = new fabric.Text(CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[0]], {
		fontFamily: "globalFont",
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false,
		originY: 'top',
		originX: 'left',
		left: calculatePointOnCanvasBasedOnObject(obj_status1_BG, {x:575,y:105},SCALE_OF_STATUS_BG_1.x).x,
		top: calculatePointOnCanvasBasedOnObject(obj_status1_BG, {x:575,y:105},SCALE_OF_STATUS_BG_1.y).y,
		fontSize: obj_status1_BG.height/4 - 10
	});
	canvas_fabric.add( obj_status1_name );
	// status bar text
	obj_status1_info = new fabric.Text("", {
		fontFamily: "globalFont",
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false,
		originY: 'top',
		originX: 'left',
		left: obj_status1_name.left,
		top: obj_status1_name.top + obj_status1_name.height + convertSizeToCurrentBackground(INT_LINE_SPACING_OF_STATUS,0).x,
		fontSize: obj_status1_BG.height/5 - 10
	});
	canvas_fabric.add( obj_status1_info );
	// status bar text
	obj_status2_name = new fabric.Text(CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[1]], {
		fontFamily: "globalFont",
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false,
		originY: 'top',
		originX: 'left',
		left: calculatePointOnCanvasBasedOnObject(obj_status2_BG, {x:148,y:105},SCALE_OF_STATUS_BG_2.x).x,
		top: calculatePointOnCanvasBasedOnObject(obj_status2_BG, {x:148,y:105},SCALE_OF_STATUS_BG_2.y).y,
		fontSize: obj_status1_BG.height/4 - 10
	});
	canvas_fabric.add( obj_status2_name );
	// status bar text
	obj_status2_info = new fabric.Text("", {
		fontFamily: "globalFont",
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false,
	//	fontWeight: 'bold',
		originY: 'top',
		originX: 'left',
		left: obj_status2_name.left,
		top: obj_status2_name.top + obj_status2_name.height + convertSizeToCurrentBackground(INT_LINE_SPACING_OF_STATUS,0).x,
		fontSize: obj_status1_BG.height/5 - 10
	});
	canvas_fabric.add( obj_status2_info );
}
function preloadGameAudio(){
	soundManager.setup({
		debugMode: false,
		onready: function () {
			soundManager.createSound({
				id: 'audio_bg_music',
				url: './audio/Rainy_Day_Games.mp3',
				autoLoad: true,
				autoPlay: false,
				onfinish: function() {
					// create and play the second.
					soundManager.play("audio_bg_music");
				}
			});
			soundManager.createSound({
				id: 'audio_correct',
				url: './audio/correct.mp3',
				autoLoad: true,
				autoPlay: false
			});
			soundManager.createSound({
				id: 'audio_wrong',
				url: './audio/wrong.wav',
				autoLoad: true,
				autoPlay: false
			});
			soundManager.createSound({
				id: 'audio_chink',
				url: './audio/chink.mp3',
				autoLoad: true,
				autoPlay: false
			});
		},
		ontimeout: function () {
			// Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
			console.error("Load audio time out.");
		}
	});
}
function clearQuestionEvent(){
	if(obj_question.visible) obj_question.set({ visible: false });
	if(obj_ques_text.visible) obj_ques_text.set({ visible: false });
	if(obj_checkSign.visible) obj_checkSign.set({ visible: false });
	if(obj_correctWord.visible) obj_correctWord.set({ visible: false });
	if(obj_wrongWord.visible) obj_wrongWord.set({ visible: false });
	for(let c=0,len=objs_option.length; c<len; c++){
		objs_option[c].set({ visible: false });
		canvas_episode_fabric.remove(objs_option[c]);
		objs_option_text[c].set({ visible: false });
		canvas_episode_fabric.remove(objs_option_text[c]);
	}
	objs_option = [];
	objs_option_text = [];
}
// redraw status bar
function redrawStatusBar(){
    obj_status1_info.setText("總資產："+obj_player1.int_score+"\n剩餘"+obj_player1.int_rollTimes+"回合");
	obj_status2_info.setText("總資產："+obj_player2.int_score+"\n剩餘"+obj_player2.int_rollTimes+"回合");
	canvas_fabric.renderAll();
}
// change dice face
function switchDiceTo(number){
	fabric.util.loadImage(
		"./images/"+number+".png",
		function (img) {
			obj_dice.setElement(img);
			obj_dice.set({
				width: BG_WIDTH_IN_CANVAS*383/ORI_BG_WIDTH * SCALE_OF_DICE.x,
				height: BG_WIDTH_IN_CANVAS*383/ORI_BG_WIDTH * SCALE_OF_DICE.y
			});
			canvas_episode_fabric.renderAll();
		}
	);
}
// change image src
function switchImage( cf, obj, url, width, height ){
	fabric.util.loadImage(
		url,
		function (img) {
			obj.setElement(img);
			obj.set({
				width: BG_WIDTH_IN_CANVAS*width/ORI_BG_WIDTH,
				height: BG_WIDTH_IN_CANVAS*height/ORI_BG_WIDTH
			});
			cf.renderAll();
		}
	);
}
// calculate x&y distance from 'position' to 'position+1'
function calcMovement( position ){
	if( position !== BLOCKS.length-1 ){
		return {
			dx: BLOCKS[position+1].x - BLOCKS[position].x + BLOCKS[position+1].offset.x[obj_currentSubject.int_order] - BLOCKS[position].offset.x[obj_currentSubject.int_order],
			dy: BLOCKS[position+1].y - BLOCKS[position].y + BLOCKS[position+1].offset.y[obj_currentSubject.int_order] - BLOCKS[position].offset.y[obj_currentSubject.int_order],
		}
	}else{
		return {
			dx: BLOCKS[0].x - BLOCKS[position].x + BLOCKS[0].offset.x[obj_currentSubject.int_order] - BLOCKS[position].offset.x[obj_currentSubject.int_order],
			dy: BLOCKS[0].y - BLOCKS[position].y + BLOCKS[0].offset.y[obj_currentSubject.int_order] - BLOCKS[position].offset.y[obj_currentSubject.int_order],
		}
	}
}
// animate player according to variable 'int_playerPosition'
function playerMoveOneStep( remainingTimes, callbackFunction ){
	let distance = calcMovement( obj_currentSubject.int_playerPosition );
	// stuff to do after moving
	let afterMoving = function(){
		// wait 0.2 sec
		let timer = setTimeout(function(){
			if(remainingTimes === 1){
				if( callbackFunction && typeof(callbackFunction)==='function' ){
					callbackFunction();
				}
			}else{
				playerMoveOneStep( remainingTimes-1, callbackFunction );
			}
		}, 200);
	};

	obj_currentSubject.animate(
		{
			left: obj_currentSubject.left+distance.dx,
			top: obj_currentSubject.top+distance.dy
		}, 
		{
			onChange: canvas_object_fabric.renderAll.bind(canvas_object_fabric),
			duration: 300,
			onComplete: function(){
				afterMoving();
			}
		}
	);
	if(obj_currentSubject.isFollowedByMascot){
		obj_mascotOnCharacter.animate(
			{
				left: obj_mascotOnCharacter.left+distance.dx,
				top: obj_mascotOnCharacter.top+distance.dy
			}, 
			{
				onChange: canvas_object_fabric.renderAll.bind(canvas_object_fabric),
				duration: 300
			}
		);
	}
	if(obj_currentSubject.isFollowedByBadLuck){
		obj_badluckOnCharacter.animate(
			{
				left: obj_badluckOnCharacter.left+distance.dx,
				top: obj_badluckOnCharacter.top+distance.dy
			}, 
			{
				onChange: canvas_object_fabric.renderAll.bind(canvas_object_fabric),
				duration: 300
			}
		);
	}
	obj_currentSubject.int_playerPosition = (obj_currentSubject.int_playerPosition===BLOCKS.length-1)?0:obj_currentSubject.int_playerPosition+1;
}
/*****************************************
 * event case functions ******************
 *****************************************/
// execute effect of current block's parasite
function executeParasiteEffect( CF ){
	// in NPC mode & NPC's turn
	if( getGameMode() === MODE_PLAYER_VS_COMPUTER && NPC_LIST.indexOf(obj_currentSubject.int_order)>=0 ){
		switch( BLOCKS[obj_currentSubject.int_playerPosition].parasite ){
			case 0: executeBlockEvent(); break;
			case 1: eventCase_NPC_mascot( canvas_object_fabric ); break;
			case 2: eventCase_NPC_badLuck( canvas_object_fabric ); break;
			default: break;
		}
	}else{
		switch( BLOCKS[obj_currentSubject.int_playerPosition].parasite ){
			case 0: executeBlockEvent(); break;
			case 1: eventCase_mascot( canvas_object_fabric ); break;
			case 2: eventCase_badLuck( canvas_object_fabric ); break;
			default: break;
		}
	}
}
// execute event of current block
function executeBlockEvent(){
	let event = BLOCKS[obj_currentSubject.int_playerPosition].event;
	// in NPC mode & NPC's turn
	if( getGameMode() === MODE_PLAYER_VS_COMPUTER && NPC_LIST.indexOf(obj_currentSubject.int_order)>=0 ){
		switch( event ){
			case EVENT_QUESTION: 
				eventCase_NPC_question( canvas_episode_fabric ); break;
			case EVENT_MINIGAME_PAIR: 
				eventCase_NPC_fakeMiniGame( "配對小遊戲" , SCORE_PER_PAIR*1, SCORE_PER_PAIR*8, SCORE_PER_PAIR ); break;
			case EVENT_MINIGAME_CATCH: 
				eventCase_NPC_fakeMiniGame( "接涼粉小遊戲" , SCORE_PER_JELLY*1, SCORE_PER_JELLY*44, SCORE_PER_JELLY ); break;
			case EVENT_MINIGAME_WHACK: 
				eventCase_NPC_fakeMiniGame( "打地鼠小遊戲" , SCORE_PER_MOLE*1, SCORE_PER_MOLE*15, SCORE_PER_MOLE ); break;
			case EVENT_MINIGAME_JIGSAW:
				eventCase_NPC_fakeMiniGame( "拼圖小遊戲" , SCORE_PER_SECOND_JIGSAW*1, SCORE_PER_SECOND_JIGSAW*15, SCORE_PER_SECOND_JIGSAW ); break;
			case EVENT_DELIVER:
				eventCase_deliver( BLOCKS[obj_currentSubject.int_playerPosition].deliverDestination ); break;
			case EVENT_OCCURRENCE:
				eventCase_occurrence(); break;
			default: 
				switchTurn(); break;
		}
	}else{
		switch( event ){
			case EVENT_QUESTION: 
				if( conceptSet.totalQuestionAmount > 0 ){
					let questionClass;
					do{
						questionClass = Math.floor( Math.random()*conceptSet.length );
						console.log("ques骰", questionClass);
					}while( conceptSet[ questionClass ].totalQuestionAmount <= 0 );

// 強制從沒問過的類別出題
//if( !allHasAsked ){ 
//	(function(){
//		let type_sum = 0; // 如果 mainClassAskedControl 的所有內容累計起來是 0 ，那就全都問過了。
//		for( let in_c=0, in_len=mainClassAskedControl.length; in_c<in_len; in_c++ ){
//			if( mainClassAskedControl[ in_c ] !== 0 ){
//				questionClass = mainClassAskedControl[ in_c ] - 1;
//				mainClassAskedControl[ in_c ] = 0; // also DEFAULT_EVENT
//				break;
//			}
//		}
//		for( let in_c=0, in_len=mainClassAskedControl.length; in_c<in_len; in_c++ ){
//			type_sum += mainClassAskedControl[ in_c ];
//		}
//		if( type_sum === 0 ){
//			allHasAsked = true;
//		}
//	})();
//}
					eventCase_question( canvas_episode_fabric, questionClass );
				}
				break;
			case EVENT_MINIGAME_PAIR: 
				customControl = true;
				miniGame_pair( canvas_minigame_fabric , obj_currentSubject); break;
			case EVENT_MINIGAME_CATCH: 
				customControl = true;
				miniGame_catching( canvas_minigame_fabric , obj_currentSubject); break;
			case EVENT_MINIGAME_WHACK:
				customControl = true;
				miniGame_whack( canvas_minigame_fabric , obj_currentSubject); break;
			case EVENT_MINIGAME_JIGSAW:
				customControl = true;
				miniGame_jigsaw( canvas_minigame_fabric , obj_currentSubject); break;
			case EVENT_DELIVER:
				customControl = true;
				eventCase_deliver(); break;
			case EVENT_OCCURRENCE:
				customControl = true;
				eventCase_occurrence(); break;
			default: 
				switchTurn(); break;
		}
	}
}
function eventCase_question( CF, quesType ){
	// console.log("[event case] question");
	boolean_eventPopout = true;
	obj_question.set({
		visible: true,
		width: 100,
		height: 100,
		left: canvas_fabric.width/2,
		top: canvas_fabric.height/2 + 50
	});
	CF.bringToFront(obj_question);
	extendEventImage( canvas_episode_fabric, obj_question, 3123, 1975, function(){
		let optionCount,
			options;
		// calculate boundary
		let q_scale = obj_question.width/3123;
		obj_question.setCoords();
		let pointLT = {
			x:obj_question.getBoundingRect().left+687 * q_scale,
			y:obj_question.getBoundingRect().top+600 * q_scale
		};
		let pointRB = {
			x:obj_question.getBoundingRect().left+2505 * q_scale,
			y:obj_question.getBoundingRect().top+1570 * q_scale
		};
		let quesRange = getRangeByTwoPoint( pointLT, pointRB );

		// get question data
		let randomSubType;
		// avoid accessing empty subclass
		do{
			randomSubType = Math.floor( conceptSet[ quesType ].subClass.length * Math.random() );
		}while( conceptSet[ quesType ].subClass[ randomSubType ].totalQuestionAmount <= 0 );

		let subTypeArray = conceptSet[ quesType ].subClass[ randomSubType ].questions;
		let randomIndexInSubType = Math.floor( subTypeArray.length * Math.random() );
		let question = conceptSet[ quesType ].subClass[ randomSubType ].questions[ randomIndexInSubType ];
		options = question.other_options.split( OPTION_SEPARATOR );
		options.push(question.answer);

		// randomize options
		for(let c = 0; c<options.length; c++){
			let ranNum = Math.floor(Math.random()*options.length)
			let temp = options[c];
			options[c] = options[ ranNum ];
			options[ ranNum ] = temp;
		}

		// record question data into tempAskedQuestionObject
		tempAskedQuestionObject = new AskedQuestionObject();
		tempAskedQuestionObject.mainClass = quesType;
		tempAskedQuestionObject.subClass = randomSubType;
		tempAskedQuestionObject.questionText = question.question;
		for( let c=0, len=options.length; c<len; c++ ){
			tempAskedQuestionObject.optionText[c] = options[c];
			if( options[c] === question.answer )
				tempAskedQuestionObject.correctIndex = c;
		}
		
		// increase asked question amount
		conceptSet.totalAskedAmount ++;
		conceptSet[ quesType ].totalAskedAmount ++;
		conceptSet[ quesType ].subClass[ randomSubType ].totalAskedAmount ++;

		// create options' object and their text
		let unformatted_option_text = [];
		for(let c = 0; c<options.length; c++){
			objs_option[c] = fabric.util.object.clone( obj_sampleOption );
			objs_option[c].isCorrect = ( options[c] === question.answer ) ? true : false;
			unformatted_option_text[c] = new fabric.Text( options[c], {
				fontFamily: "globalFont",
			});
		}

		// create unformatted question text
		let unformatted_ques_text = new fabric.Text( question.question, {
			left: quesRange.left,
			top: quesRange.top,
			fontFamily: "globalFont",
		});

		// decrease font size for fitting the quesRange
		let maxFontSize = Math.floor( quesRange.height/10 );
		let decrease = 0;
		let totalOptionHeight;
		do{
			// reset sum of option height
			totalOptionHeight = 0;
			// adjust question text's font size
			unformatted_ques_text.fontSize = maxFontSize - decrease;
			obj_ques_text = wrapCanvasText( unformatted_ques_text, CF, quesRange.width, 0, 'left' );
			// adjust option's size and option text's font size
			for(let c = 0; c<options.length; c++){
				objs_option[c].set({
					width: maxFontSize - decrease,
					height: maxFontSize - decrease
				});
				unformatted_option_text[c].fontSize = maxFontSize - decrease;
				objs_option_text[c] = wrapCanvasText( unformatted_option_text[c], CF, quesRange.width, 0, 'left' );
				totalOptionHeight += objs_option_text[c].height + intervalAmongOptions;
			}
			decrease += 2; 
		}while( obj_ques_text.height + totalOptionHeight + intervalBetweenQuesAndOptions > quesRange.height );
		obj_ques_text.set({
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
		});
		for(let c = 0; c<options.length; c++){
			if(c==0){
				objs_option[c].set({
					visible: true,
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					left: quesRange.left+objs_option[c].width/2,
					top: obj_ques_text.top + obj_ques_text.height + intervalBetweenQuesAndOptions + objs_option[c].height/2,
				});
				objs_option_text[c].set({
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					left: quesRange.left+objs_option[c].width,
					top: obj_ques_text.top + obj_ques_text.height + intervalBetweenQuesAndOptions
				});
			}else{
				objs_option[c].set({
					visible: true,
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					left: quesRange.left+objs_option[c].width/2,
					top: objs_option_text[c-1].top + objs_option_text[c-1].height + intervalAmongOptions + objs_option[c].height/2,
				});
				objs_option_text[c].set({
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					left: quesRange.left+objs_option[c].width,
					top: objs_option_text[c-1].top + objs_option_text[c-1].height + intervalAmongOptions
				});
			}
			CF.add(objs_option[c]);
			CF.add(objs_option_text[c]);
		}
		CF.add(obj_ques_text);
		CF.renderAll();
	});
}

function eventCase_NPC_question( CF ){
	obj_eventBG.set({visible:true});
	CF.bringToFront(obj_eventBG);
	// randomly get score
	let correctOrNot = NPCCorrectProbabilityArray[ Math.floor(Math.random()*NPCCorrectProbabilityArray.length) ];
	let tempScore= (correctOrNot) ? SCORE_CORRECT_ANSWER : SCORE_WRONG_ANSWER;
	let word = CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[obj_currentSubject.int_order]]+"答"+(correctOrNot?"對":"錯")+"了問題，財產"+(correctOrNot?"+":"")+tempScore+"元";
	if(obj_currentSubject.isFollowedByMascot){
		tempScore = (tempScore>0) ? tempScore*MASCOT_PRICE_MULTIPLE : tempScore*MASCOT_PUNISHMENT_MULTIPLE;
		word += '。因為財神附身，實際獲得'+tempScore+'元。';
	}
	if(obj_currentSubject.isFollowedByBadLuck){
		tempScore = (tempScore>0) ? tempScore*BADLUCK_PRICE_MULTIPLE : tempScore*BADLUCK_PUNISHMENT_MULTIPLE;
		word += '。因為衰神附身，實際獲得'+tempScore+'元。';
	}
	obj_currentSubject.int_score += tempScore; // plus score

	// show string
	showTextOnEventBG( word );

	let clickToESC = function(){
		canvas_episode_fabric.off('mouse:down', clickToESC );
		// next turn
		switchTurn();
	}
	canvas_episode_fabric.on('mouse:down', clickToESC );
}

function eventCase_mascot( CF ){
	// console.log("[event case] mascot");
	boolean_animating = true;
	boolean_runintoMascot = true;
	if( obj_currentSubject.isFollowedByBadLuck ){
		removeParasite( obj_currentSubject );
	}
	obj_currentSubject.isFollowedByMascot = true;
	obj_currentSubject.int_parasiteRemainingRound = EVENT_EFFECT_ROUND; // reset effect round
	BLOCKS[obj_currentSubject.int_playerPosition].parasite = 0; // remove mascot from the map
	int_mascotPosition = -1; // reset mascot flag on the map
	obj_mascotOnCharacter.set({
		left: obj_currentSubject.left,
		top: obj_currentSubject.top - obj_currentSubject.height,
		visible: true
	});
	CF.bringToFront(obj_mascotOnCharacter);
	CF.bringToFront(obj_mascot);
	// hide dice
	obj_dice.set({"visible":false});
	extendEventImage( canvas_object_fabric, obj_mascot, 1491, 1640, function(){
		setTimeout(function(){
			showTextOnEventBG( CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[0]]+"碰到財神，接下來"+EVENT_EFFECT_ROUND+"回合內得分"+MASCOT_PRICE_MULTIPLE+"倍，扣分"+MASCOT_PUNISHMENT_MULTIPLE+"倍" );
			boolean_animating = false;
		}, 1000);
	});
}

function eventCase_NPC_mascot( CF ){
	// console.log("[event case] NPC mascot");
	if( obj_currentSubject.isFollowedByBadLuck ){
		removeParasite( obj_currentSubject );
	}
	obj_currentSubject.isFollowedByMascot = true;
	obj_currentSubject.int_parasiteRemainingRound = EVENT_EFFECT_ROUND; // reset effect round
	BLOCKS[obj_currentSubject.int_playerPosition].parasite = 0; // remove mascot from the map
	int_mascotPosition = -1; // reset mascot flag on the map
	obj_mascotOnCharacter.set({
		left: obj_currentSubject.left,
		top: obj_currentSubject.top - obj_currentSubject.height,
		visible: true
	});
	CF.bringToFront(obj_mascotOnCharacter);
	obj_mascot.set({visible:false});
	
	// show string
	showTextOnEventBG( CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[1]]+"碰到財神，接下來"+EVENT_EFFECT_ROUND+"回合內得分"+MASCOT_PRICE_MULTIPLE+"倍，扣分"+MASCOT_PUNISHMENT_MULTIPLE+"倍" );

	let clickToESC = function(){
		canvas_episode_fabric.off('mouse:down', clickToESC );
		// execute event of current block
		executeBlockEvent();
	}
	canvas_episode_fabric.on('mouse:down', clickToESC );
}

function eventCase_badLuck( CF ){
	// console.log("[event case] badLuck");
	boolean_animating = true;
	boolean_runintoBadLuck = true;
	if( obj_currentSubject.isFollowedByMascot ){
		removeParasite( obj_currentSubject );
	}
	obj_currentSubject.isFollowedByBadLuck = true;
	obj_currentSubject.int_parasiteRemainingRound = EVENT_EFFECT_ROUND; // reset effect round
	BLOCKS[obj_currentSubject.int_playerPosition].parasite = 0; // remove bad luck from the map
	int_badLuckPosition = -1; // reset mascot flag on the map
	obj_badluckOnCharacter.set({
		left: obj_currentSubject.left,
		top: obj_currentSubject.top - obj_currentSubject.height,
		visible: true
	});
	CF.bringToFront(obj_badluckOnCharacter);
	CF.bringToFront(obj_badLuck);
	// hide dice
	obj_dice.set({"visible":false});
	extendEventImage( canvas_object_fabric, obj_badLuck, 1014, 1454, function(){
		setTimeout(function(){
			showTextOnEventBG( CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[0]]+"碰到衰神，接下來"+EVENT_EFFECT_ROUND+"回合內得分"+BADLUCK_PRICE_MULTIPLE+"倍，扣分"+BADLUCK_PUNISHMENT_MULTIPLE+"倍" );
			boolean_animating = false;
		}, 1000);
	});
}

function eventCase_NPC_badLuck( CF ){
	// console.log("[event case] NPC badLuck");
	if( obj_currentSubject.isFollowedByMascot ){
		removeParasite( obj_currentSubject );
	}
	obj_currentSubject.isFollowedByBadLuck = true;
	obj_currentSubject.int_parasiteRemainingRound = EVENT_EFFECT_ROUND; // reset effect round
	BLOCKS[obj_currentSubject.int_playerPosition].parasite = 0; // remove bad luck from the map
	int_badLuckPosition = -1; // reset mascot flag on the map
	obj_badluckOnCharacter.set({
		left: obj_currentSubject.left,
		top: obj_currentSubject.top - obj_currentSubject.height,
		visible: true
	});
	CF.bringToFront(obj_badluckOnCharacter);
	obj_badLuck.set({visible:false});

	// show string
	showTextOnEventBG( CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[1]]+"碰到衰神，接下來"+EVENT_EFFECT_ROUND+"回合內得分"+BADLUCK_PRICE_MULTIPLE+"倍，扣分"+BADLUCK_PUNISHMENT_MULTIPLE+"倍" );

	let clickToESC = function(){
		canvas_episode_fabric.off('mouse:down', clickToESC );
		// execute event of current block
		executeBlockEvent();
	}
	canvas_episode_fabric.on('mouse:down', clickToESC );
}

function eventCase_NPC_fakeMiniGame( gameName, minScore, maxScore, interval ){
	// randomly get score
	let range = (maxScore - minScore)/interval;
	let randomScore = Math.floor(Math.random()*range)*interval + minScore;
	let word = CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[obj_currentSubject.int_order]]+"玩"+gameName+"得到了"+randomScore+"元";
	if(obj_currentSubject.isFollowedByMascot){
		randomScore = Math.floor( randomScore*MASCOT_PRICE_MULTIPLE );
		word += '。因為財神附身，實際獲得'+randomScore+'元。';
	}
	if(obj_currentSubject.isFollowedByBadLuck){
		randomScore = Math.floor( randomScore*BADLUCK_PRICE_MULTIPLE );
		word += '。因為衰神附身，實際獲得'+randomScore+'元。';
	}
	obj_currentSubject.int_score += randomScore; // plus score
	
	// show string
	showTextOnEventBG( word );
	
	let clickToESC = function(){
		canvas_episode_fabric.off('mouse:down', clickToESC );
		// next turn
		switchTurn();
	}
	canvas_episode_fabric.on('mouse:down', clickToESC );
}

function eventCase_deliver( destination ){
	switchTurn();
}

function eventCase_occurrence(){
	let eventImage; // the image which belongs to the event, if there is any.
	let formatted_word; // the text object

	// show occurrence background
	obj_eventOccurrenceBG.set({visible:true});
	canvas_episode_fabric.bringToFront(obj_eventOccurrenceBG);

	// generate a random index for occurrence event list
	let randomEventIndex = Math.floor(Math.random()*occurrenceEvent.length);

	// the description of evnet (string)
	let word = occurrenceEvent[ randomEventIndex ].description;

	// the stuff to do after occurence event finish
	let afterOccurenceFunction = function(){
		let clickToESC = function(){
			canvas_episode_fabric.off('mouse:down', clickToESC );

			obj_eventOccurrenceBG.set({visible:false});
			if( eventImage ){
				canvas_episode_fabric.remove( eventImage );
				canvas_episode_fabric.remove( formatted_word );
			}else{
				canvas_episode_fabric.remove( formatted_word );
			}
			canvas_episode_fabric.renderAll();
			redrawStatusBar();
			// next turn
			switchTurn();
		}
		canvas_episode_fabric.on('mouse:down', clickToESC );
	};

	// the range of displaying event
	let eventDisplayRangeOnOriImage = {
		LTpoint: {x:720, y:870},
		RBpoint: {x:2700, y:1750},
		getWidth: function(){
			return Math.abs( this.LTpoint.x - this.RBpoint.x );
		},
		getHeight: function(){
			return Math.abs( this.LTpoint.y - this.RBpoint.y );
		}
	};


	// if there is no image, all range is used for displaying text
	if( occurrenceEvent[ randomEventIndex ].imageLink === "" ){
		let textAvailableRange = eventDisplayRangeOnOriImage;

		textAvailableRange.LTpoint = calculatePointOnCanvasBasedOnObject( obj_eventOccurrenceBG, textAvailableRange.LTpoint);
		textAvailableRange.RBpoint = calculatePointOnCanvasBasedOnObject( obj_eventOccurrenceBG, textAvailableRange.RBpoint);

		// the unformatted text object, whose properties will be inherited to the formatted text object
		let unformatted_word = new fabric.Text( word, {
			fontFamily: "globalFont",
			left: textAvailableRange.LTpoint.x + textAvailableRange.getWidth()/2,
			top: textAvailableRange.LTpoint.y + textAvailableRange.getHeight()/2,
			originY: 'center',
			originX: 'center'
		});

		// decrease font size for fitting the quesRange
		let maxFontSize = Math.floor( textAvailableRange.getHeight()/8 );console.log("max fontsize",maxFontSize);
		let decrease = 0;
		do{
			// adjust text's font size
			unformatted_word.fontSize = maxFontSize - decrease;console.log("fontsize",unformatted_word.fontSize );
			formatted_word = wrapCanvasText( unformatted_word, canvas_episode_fabric, textAvailableRange.getWidth(), 0, 'center' );

			decrease += 2; 
		}while( formatted_word.height > textAvailableRange.getHeight() );

		canvas_episode_fabric.add( formatted_word );
		triggerEventEffect( randomEventIndex, obj_currentSubject, afterOccurenceFunction );
		canvas_episode_fabric.renderAll();
	}
	// adjust position of text and set image if this event has image to show
	else{
		// image get the lower half range
		let imageAvailableRange = {
			LTpoint: {
				x: eventDisplayRangeOnOriImage.LTpoint.x,
				y: ( eventDisplayRangeOnOriImage.LTpoint.y + eventDisplayRangeOnOriImage.RBpoint.y ) / 2
			},
			RBpoint: {
				x: eventDisplayRangeOnOriImage.RBpoint.x,
				y: eventDisplayRangeOnOriImage.RBpoint.y
			},
			getWidth: function(){
				return Math.abs( this.LTpoint.x - this.RBpoint.x );
			},
			getHeight: function(){
				return Math.abs( this.LTpoint.y - this.RBpoint.y );
			}
		};
		// text get the upper half range
		let textAvailableRange = {
			LTpoint: {
				x: eventDisplayRangeOnOriImage.LTpoint.x,
				y: eventDisplayRangeOnOriImage.LTpoint.y
			},
			RBpoint: {
				x: eventDisplayRangeOnOriImage.RBpoint.x,
				y: ( eventDisplayRangeOnOriImage.LTpoint.y + eventDisplayRangeOnOriImage.RBpoint.y ) / 2
			},
			getWidth: function(){
				return Math.abs( this.LTpoint.x - this.RBpoint.x );
			},
			getHeight: function(){
				return Math.abs( this.LTpoint.y - this.RBpoint.y );
			}
		};

		imageAvailableRange.LTpoint = calculatePointOnCanvasBasedOnObject( obj_eventOccurrenceBG, imageAvailableRange.LTpoint);
		imageAvailableRange.RBpoint = calculatePointOnCanvasBasedOnObject( obj_eventOccurrenceBG, imageAvailableRange.RBpoint);
		textAvailableRange.LTpoint = calculatePointOnCanvasBasedOnObject( obj_eventOccurrenceBG, textAvailableRange.LTpoint);
		textAvailableRange.RBpoint = calculatePointOnCanvasBasedOnObject( obj_eventOccurrenceBG, textAvailableRange.RBpoint);

		// draw eventImage object
		fabric.Image.fromURL(
			occurrenceEvent[ randomEventIndex ].imageLink,
			function( img ) {
				img.isLink = false;
				img.set({
					height: (img._element.height>imageAvailableRange.getHeight())?imageAvailableRange.getHeight():img._element.height,
					width: (img._element.height>imageAvailableRange.getHeight())?img._element.width*(imageAvailableRange.getHeight()/img._element.height):img._element.width
				});

				eventImage = img;
				canvas_episode_fabric.add(eventImage);
				triggerEventEffect( randomEventIndex, obj_currentSubject, afterOccurenceFunction );
				canvas_episode_fabric.renderAll();
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'top',
				left: imageAvailableRange.LTpoint.x + imageAvailableRange.getWidth()/2,
				top: imageAvailableRange.LTpoint.y,
				isLink: false
			}
		);

		// the unformatted text object, whose properties will be inherited to the formatted text object
		let unformatted_word = new fabric.Text( word, {
			fontFamily: "globalFont",
			left: textAvailableRange.LTpoint.x + textAvailableRange.getWidth()/2,
			top: textAvailableRange.LTpoint.y + textAvailableRange.getHeight()/2,
			originY: 'center',
			originX: 'center'
		});

		// decrease font size for fitting the quesRange
		let maxFontSize = Math.floor( textAvailableRange.getHeight()/3 );
		let decrease = 0;
		do{
			// adjust text's font size
			unformatted_word.fontSize = maxFontSize - decrease;
			formatted_word = wrapCanvasText( unformatted_word, canvas_episode_fabric, textAvailableRange.getWidth(), 0, 'center' );

			decrease += 2; 
		}while( formatted_word.height > textAvailableRange.getHeight() );
		canvas_episode_fabric.add(formatted_word);
		canvas_episode_fabric.renderAll();
	}
}

// show pure info text with obj_eventBG
function showTextOnEventBG( stringToPrint ){// NOTE: flag showTextOnEventBG
	// show background
	obj_eventBG.set({visible:true});
	canvas_episode_fabric.bringToFront(obj_eventBG);
	
	// the stuff to do after event finish
	let afterFunction = function(){
		let clickToESC = function(){
			canvas_episode_fabric.off('mouse:down', clickToESC );
			
			obj_eventBG.set({visible:false});
			canvas_episode_fabric.remove( formatted_word );
			redrawStatusBar();
		}
		canvas_episode_fabric.on('mouse:down', clickToESC );
	};
	
	// the range of displaying event
	let textAvailableRange = {
		LTpoint: {x:560, y:400},
		RBpoint: {x:2570, y:1600},
		getWidth: function(){
			return Math.abs( this.LTpoint.x - this.RBpoint.x );
		},
		getHeight: function(){
			return Math.abs( this.LTpoint.y - this.RBpoint.y );
		}
	};

	textAvailableRange.LTpoint = calculatePointOnCanvasBasedOnObject( obj_eventBG, textAvailableRange.LTpoint);
	textAvailableRange.RBpoint = calculatePointOnCanvasBasedOnObject( obj_eventBG, textAvailableRange.RBpoint);

	// the unformatted text object, whose properties will be inherited to the formatted text object
	let unformatted_word = new fabric.Text( stringToPrint, {
		fontFamily: "globalFont",
		left: textAvailableRange.LTpoint.x + textAvailableRange.getWidth()/2,
		top: textAvailableRange.LTpoint.y + textAvailableRange.getHeight()/2,
		originY: 'center',
		originX: 'center',
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false
	});
	
	let formatted_word;
	// decrease font size for fitting the quesRange
	let maxFontSize = Math.floor( textAvailableRange.getHeight()/8 );
	let decrease = 0;
	do{
		// adjust text's font size
		unformatted_word.fontSize = maxFontSize - decrease;
		formatted_word = wrapCanvasText( unformatted_word, canvas_episode_fabric, textAvailableRange.getWidth(), 0, 'center' );

		decrease += 2; 
	}while( formatted_word.height > textAvailableRange.getHeight() );

	canvas_episode_fabric.add( formatted_word );
	canvas_episode_fabric.renderAll();
	afterFunction();
}

// execute occurrence event effect
function triggerEventEffect( e_index, subject, callback ){
	switch( occurrenceEvent[ e_index ].effectType ){
		case OCCURRENCE_TYPE_SCORE:
			let tempScore = occurrenceEvent[ e_index ].effectAmount;
			if(obj_currentSubject.isFollowedByMascot){
				tempScore = (tempScore>0) ? tempScore*MASCOT_PRICE_MULTIPLE : tempScore*MASCOT_PUNISHMENT_MULTIPLE;
			}
			if(obj_currentSubject.isFollowedByBadLuck){
				tempScore = (tempScore>0) ? tempScore*BADLUCK_PRICE_MULTIPLE : tempScore*BADLUCK_PUNISHMENT_MULTIPLE;
			}
			subject.int_score += tempScore;
			break;
		default:
			break;
	}
	callback && callback();
}

function generateMascot( CF ){
	// clear mascot flag on the map
	for( let c=0,len=BLOCKS.length; c<len; c++ ){
		if( BLOCKS[ c ].parasite===1 )
			BLOCKS[ c ].parasite = 0;
	}
	// randomly set bad luck on the map ( except the START point )
	do{
		int_mascotPosition = Math.floor((BLOCKS.length-1)*Math.random())+1;
		if( DEBUGGING ) int_mascotPosition = DEBUG_MASCOT;
	}while( int_badLuckPosition == int_mascotPosition );
	BLOCKS[ int_mascotPosition ].parasite = 1;
	obj_mascot.set({
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false,
		originX: 'center',
		originY: 'bottom',
		left: BLOCKS[int_mascotPosition].x,
		top: BLOCKS[int_mascotPosition].y,
		width: convertSizeToCurrentBackground( 1491, 0 ).x * SCALE_OF_MASCOT.x,
		height: convertSizeToCurrentBackground( 0, 1640 ).y * SCALE_OF_MASCOT.y,
		visible: true
	});
	CF.bringToFront(obj_mascot);
}

function generateBadLuck( CF ){
	// clear badluck flag on the map
	for( let c=0,len=BLOCKS.length; c<len; c++ ){
		if( BLOCKS[ c ].parasite===2 )
			BLOCKS[ c ].parasite = 0;
	}
	// randomly set bad luck on the map ( except the START point )
	do{
		int_badLuckPosition = Math.floor((BLOCKS.length-1)*Math.random())+1;
		if( DEBUGGING ) int_badLuckPosition = DEBUG_BADLUCK;
	}while( int_badLuckPosition == int_mascotPosition );
	BLOCKS[ int_badLuckPosition ].parasite = 2;
	obj_badLuck.set({
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false,
		originX: 'center',
		originY: 'bottom',
		left: BLOCKS[int_badLuckPosition].x,
		top: BLOCKS[int_badLuckPosition].y,
		width: convertSizeToCurrentBackground( 1014, 0 ).x * SCALE_OF_BADLUCK.x,
		height: convertSizeToCurrentBackground( 0, 1454 ).y * SCALE_OF_BADLUCK.y,
		visible: true
	});
	CF.bringToFront(obj_badLuck);
}

function removeParasite( subject ){
	subject.int_parasiteRemainingRound = 0;
	
	if( subject.isFollowedByMascot ){
		subject.isFollowedByMascot = false;
		obj_mascotOnCharacter.setVisible(false);
		generateMascot(canvas_object_fabric);
	}
	if( subject.isFollowedByBadLuck ){
		subject.isFollowedByBadLuck = false;
		obj_badluckOnCharacter.setVisible(false);
		generateBadLuck(canvas_object_fabric);
	}
}
// extend image to whole view size
function extendEventImage( cf, target_object, img_width, img_height, callback ){
	let animateCallback;
	let step = 20;
	let targetSize = convertSizeToCustomRange(img_width, img_height, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS);
	let incrementOfWidth = (targetSize.width - target_object.width)/step;
	let incrementOfHeight = (targetSize.height - target_object.height)/step;
	let targetPoint = {x:0, y:0};
	switch( target_object.originX ){
		case "center": targetPoint.x=cf.width/2; break;
		case "left": targetPoint.x=cf.width/2-targetSize.width/2; break;
		case "right": targetPoint.x=cf.width/2+targetSize.width/2; break;
	}
	switch( target_object.originY ){
		case "center": targetPoint.y=cf.height/2; break;
		case "top": targetPoint.y=cf.height/2-targetSize.height/2; break;
		case "bottom": targetPoint.y=cf.height/2+targetSize.height/2; break;
	}
	let incrementOfX = (targetPoint.x - target_object.left)/step;
	let incrementOfY = (targetPoint.y - target_object.top)/step;
	function extendAnimateLoop(){
		if( target_object.width<targetSize.width 
		   || target_object.height<targetSize.height 
		   || target_object.left<targetPoint.x 
		   || target_object.top<targetPoint.y){
			// change size
			if( target_object.width<targetSize.width )
				target_object.width = ((target_object.width+incrementOfWidth)<targetSize.width) ? target_object.width+incrementOfWidth : targetSize.width;
			if( target_object.height<targetSize.height )
				target_object.height = ((target_object.height+incrementOfHeight)<targetSize.height) ? target_object.height+incrementOfHeight : targetSize.height;
			// change position
			if( target_object.left != targetPoint.x )
				target_object.left = (Math.abs(targetPoint.x-target_object.left)<Math.abs(incrementOfX)) ? targetPoint.x : target_object.left+incrementOfX;
			if( target_object.top != targetPoint.y )
				target_object.top = (Math.abs(targetPoint.y-target_object.top)<Math.abs(incrementOfY)) ? targetPoint.y : target_object.top+incrementOfY;
			cf.renderAll();
			animateCallback = fabric.util.requestAnimFrame(extendAnimateLoop);
		}
		else{
			cancelRequestAnimFrame(animateCallback);
			animateCallback = undefined;
			callback && callback();
		}
	}
	animateCallback = fabric.util.requestAnimFrame(extendAnimateLoop);
}

function classifyQuestionBank(){

	// check if question bank is loaded
	if( typeof(conceptSet)==='undefined' ){
		console.error("[ERROR] fail to load question data.");
		alert("Failed to load question data.");
		return;
	}

	initConceptCounter( conceptSet );

	conceptSet.forEach( function( mainClassObject, index, array ){

		initConceptCounter( mainClassObject );

		if( mainClassObject.subClass && mainClassObject.subClass.length>0 ){

			let subClasses = mainClassObject.subClass;
			subClasses.forEach( function( subClassObject, subIndex, subArray ){

				initConceptCounter( subClassObject );
				subClassObject.askedArray = [];

				conceptSet.totalQuestionAmount += subClassObject.questions.length;
				mainClassObject.totalQuestionAmount += subClassObject.questions.length;
				subClassObject.totalQuestionAmount += subClassObject.questions.length;

			});
		}
	} );

	window.progressCount++; // increase progress counter of preloading

	function initConceptCounter( targetObject ){
		Object.assign( targetObject, {
			totalQuestionAmount: 0,
			totalAskedAmount: 0,
			totalCorrectAmount: 0
		} );
	}
}

function getRangeByTwoPoint(pointLT, pointRB){
	return {
		top : Math.min( pointLT.y, pointRB.y ),
		bottom: Math.max( pointLT.y, pointRB.y ),
		left: Math.min( pointLT.x, pointRB.x ),
		right : Math.min( pointLT.x, pointRB.x ),
		width : Math.abs( pointRB.x-pointLT.x ),
		height : Math.abs( pointRB.y-pointLT.y )
	}
}

function switchTurn(){ // FUTURE: 加上"換你"圖片
	let previousPlayerIsOutOfTurn = false;
	console.log("switchTurn");
	// record that if previous player is out of turn
	previousPlayerIsOutOfTurn = (+obj_currentSubject.int_rollTimes===0);
	// decrease the remaining turns of parasite
	if( obj_currentSubject.isFollowedByMascot || obj_currentSubject.isFollowedByBadLuck ){
		// console.log("int_parasiteRemainingRound",obj_currentSubject.int_parasiteRemainingRound);
		if( --obj_currentSubject.int_parasiteRemainingRound == 0 ){
			removeParasite( obj_currentSubject );
		}
	}
	// switch turn
	obj_currentSubject = (obj_currentSubject === obj_player1) ? obj_player2 : obj_player1 ;
	// if both player is out of turn, end the game
	if( previousPlayerIsOutOfTurn && (+obj_currentSubject.int_rollTimes===0) ){
		endGame();
		return;
	}
	// if this turn belongs to NPC
	if( getGameMode() === MODE_PLAYER_VS_COMPUTER && NPC_LIST.indexOf(obj_currentSubject.int_order)>=0 ){
		canvas_episode_fabric.trigger('mouse:down', {target: obj_dice});
	}
}

/* debug function */
function debug_step(s){ // set step
	DEBUGGING = true;
	DEBUG_STEP = s;
}
function debug_badluck(s){ // set badluck
	if( BLOCKS[s].parasite !== 0 ){
		console.warn("The position has already had a parasite.");
		DEBUGGING = false;
		return;
	}
	DEBUGGING = true;
	DEBUG_BADLUCK = s;
	generateBadLuck(canvas_object_fabric);
	canvas_object_fabric.renderAll();
}
function debug_mascot(s){ // set mascot
	if( BLOCKS[s].parasite !== 0 ){
		console.warn("The position has already had a parasite.");
		DEBUGGING = false;
		return;
	}
	DEBUGGING = true;
	DEBUG_MASCOT = s;
	generateMascot(canvas_object_fabric);
	canvas_object_fabric.renderAll();
}
function debug_mascot_step(s){
	debug_step(s);
	debug_mascot(s);
}
function debug_badluck_step(s){
	debug_step(s);
	debug_badluck(s);
}
function debug_closeDebugMode(){ DEBUGGING = false; }
