"use strict";

function miniGame_catching( CF , currentSubject){
	const SCALE_OF_CATCHING_BG = 1,
		  SCALE_OF_JELLY_X = 2, // FUTURE: new argument - SCALE_OF_JELLY
		  SCALE_OF_JELLY_Y = 2, // FUTURE: new argument - SCALE_OF_JELLY
		  SCALE_OF_BOWL_X = 1, // FUTURE: new argument - SCALE_OF_BOWL
		  SCALE_OF_BOWL_Y = 1, // FUTURE: new argument - SCALE_OF_BOWL
		  SCALE_OF_I_GOT_IT = 1,
		  SCALE_OF_RETURN = 1,
		  SCALE_OF_FONTSIZE = 2,
		  SCALE_OF_COLOURED_PAPER = 1,
		  MAX_JELLY_COUNT = 6;
	let obj_rule,
		obj_catchingBackground,
		obj_bowl,
		obj_iGotIt,
		obj_scoreBar,
		obj_timeBar,
		obj_endingBackground,
		obj_endingWord,
		obj_colouredPaperLeft,
		obj_colouredPaperRight,
		obj_return,
		obj_sampleJelly;
	let objs_jellies = [];
	let ints_border_of_bg = {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	};
	let ints_padding_of_bg;

	let mini_score = 0,
		mini_catch_count = 0;
	let jelly_width = 128,
		jelly_height = 132,
		bowl_width = 526,
		bowl_height = 394;

	// show minigame canvas
	setMiniGameCanvasVisible(true);
	// preload images of mini game
	preloadCatchingGameImage();

	// after user click "i got it" button, start the game
	function startCatching(){
		let remainingTime = 15; // 小遊戲秒數
		let totalTime = remainingTime;

		// show game scene
		obj_catchingBackground.set({visible:true});
		obj_bowl.set({
			visible: true,
			left: (ints_border_of_bg.left + ints_border_of_bg.right)/2,
			top: ints_border_of_bg.bottom
		});
		CF.bringToFront(obj_catchingBackground);
		CF.bringToFront(obj_bowl);

		// score bar text
		obj_scoreBar = new fabric.Text('0', {
			fontFamily: "globalFont",
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			fontWeight: 'bold',
			originX: 'left',
			originY: 'top',
			left: ints_border_of_bg.left,
			top: ints_border_of_bg.top,
			fontSize: (obj_catchingBackground.height/18) * SCALE_OF_FONTSIZE
		});
		CF.add(obj_scoreBar);
		CF.bringToFront(obj_scoreBar);

		// time bar text
		obj_timeBar = new fabric.Text('剩餘'+remainingTime+'秒', {
			fontFamily: "globalFont",
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			fontWeight: 'bold',
			originX: 'right',
			originY: 'top',
			left: ints_border_of_bg.right,
			top: ints_border_of_bg.top,
			fontSize: (obj_catchingBackground.height/18) * SCALE_OF_FONTSIZE
		});
		CF.add(obj_timeBar);
		CF.bringToFront(obj_timeBar);

		// hide cursor
		setCursorOnCanvas( CF, 'none');
		// add listener for mouse move event
		CF.on('mouse:move', catchingGameEvent );
		function catchingGameEvent(e) {
			let mouseX = CF.getPointer(e.e).x;
			let bowlLeft = mouseX - obj_bowl.width/2;
			let bowlRight = mouseX + obj_bowl.width/2;

			if( bowlLeft >= ints_border_of_bg.left && bowlRight <= ints_border_of_bg.right ){
				obj_bowl.left = mouseX;
			}
			CF.renderAll();
		}

		// countdown timer
		let countTimeTimer = setInterval(function(){
			remainingTime--;
			obj_timeBar.setText("剩餘"+((remainingTime<0)?0:remainingTime)+"秒");
			// game over
			if( remainingTime < 0 ){
				// clear timer and stop animation
				clearInterval(countTimeTimer);
				clearInterval(generateJelliesTimer);
				cancelRequestAnimFrame(animateCallback);
				// show cursor
				setCursorOnCanvas( CF, 'default');
				// remove listener for mouse move event
				CF.off('mouse:move', catchingGameEvent );
				// show cover background
				obj_endingBackground.set({visible:true});
				CF.bringToFront(obj_endingBackground);
				// show coloured paper
				obj_colouredPaperLeft.set({visible:true});
				obj_colouredPaperRight.set({visible:true});
				CF.bringToFront(obj_colouredPaperLeft);
				CF.bringToFront(obj_colouredPaperRight);
				// ending word text
				if( currentSubject.isFollowedByMascot ){
					mini_score *= MASCOT_PRICE_MULTIPLE;
				}else if( currentSubject.isFollowedByBadLuck ){
					mini_score *= BADLUCK_PRICE_MULTIPLE;
				}
				// add player's score in main game
				currentSubject.int_score += mini_score;
				obj_endingWord = new fabric.Text('恭喜您獲得'+mini_score+'元', {
					fontFamily: "globalFont",
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					originX: 'center',
					originY: 'center',
					left: CF.width/2,
					top: calculatePointOnCanvasBasedOnObject(obj_endingBackground, {x:0, y:1700}).y,
					fontSize: (obj_endingBackground.height/18) * SCALE_OF_FONTSIZE
				});
				CF.add(obj_endingWord);
				CF.bringToFront(obj_endingWord);
				// show obj_return button
				obj_return.set({
					visible: true,
					left: CF.width/2,
					top: ints_border_of_bg.bottom - obj_return.height/2
				});
				obj_return.setCoords();
				CF.bringToFront(obj_return);
				CF.renderAll();
				let animateColouredPaperTimer = setInterval(function(){
					if( obj_colouredPaperLeft.getScaleX() === 1 ){
						obj_colouredPaperLeft.setScaleX(1.1);
						obj_colouredPaperLeft.setScaleY(1.1);
						obj_colouredPaperRight.setScaleX(1.1);
						obj_colouredPaperRight.setScaleY(1.1);
					}else{
						obj_colouredPaperLeft.setScaleX(1);
						obj_colouredPaperLeft.setScaleY(1);
						obj_colouredPaperRight.setScaleX(1);
						obj_colouredPaperRight.setScaleY(1);
					}
					CF.renderAll();
				}, 300);
				// add listener for click event of 'return' button
				CF.on('mouse:down', returnEvent );
				function returnEvent(e) {
					if(e.target === obj_return){
						// stop animation
						clearInterval( animateColouredPaperTimer );
						// clear every object of mini game
						CF.clear();
						// remove listener for click event of 'return' button
						CF.off('mouse:down', returnEvent );
						redrawStatusBar();
						CF.renderAll();
						// hide minigame canvas
						setMiniGameCanvasVisible(false);
						switchTurn();
					}
				}
			}
		},1000);

		// generate jellies
		let generateJelliesTimer = setInterval(function(){
			// limit maximum amount of jellies
			if( objs_jellies.length <= MAX_JELLY_COUNT ){
				let newJelly = fabric.util.object.clone( obj_sampleJelly );
				newJelly.set({
					visible: true,
					left: fabric.util.getRandomInt(ints_border_of_bg.left+jelly_width/2, ints_border_of_bg.right-jelly_width/2),
					top: ints_border_of_bg.top + jelly_height/2,
				});
				// set the jelly to rotate clockwise or counterclockwise
				newJelly.clockwise = Math.floor( Math.random()*2 );
				objs_jellies.push(newJelly);
				CF.add(newJelly);
			}
		}, 400);

		// animation of jelly falling 
		let animateCallback;
		function animateLoop(){
			for(let count=0, arrayLength=objs_jellies.length; count<arrayLength; count++){
				let element = objs_jellies[count];
				if(element){
					let increasePixel = (ints_border_of_bg.bottom - ints_border_of_bg.top)/150 
						+ (totalTime-remainingTime)*(ints_border_of_bg.bottom - ints_border_of_bg.top)/500;
					element.top += increasePixel;
					let newAngle = (element.clockwise)?(element.getAngle() + 5):(element.getAngle() - 5);
					element.setAngle(newAngle);
					// when jelly touch the bowl
					obj_bowl.setCoords();
					element.setCoords();
					if( !element.isCaught && element.intersectsWithObject(obj_bowl) ){ // when jelly touch the bowl
						let removeEl = objs_jellies.splice(count, 1)[0];
						removeEl.isCaught = true;
						CF.remove( removeEl );
						mini_score += SCORE_PER_JELLY;
						mini_catch_count += 1;
						obj_scoreBar.setText(""+mini_score);
					}
					else if( (element.top + element.height) > ints_border_of_bg.bottom ){ // when jelly goes out of border
						let removeEl = objs_jellies.splice(count, 1)[0];
						removeEl.isCaught = true;
						CF.remove( removeEl );
					}
				}
			};
			CF.renderAll();
			animateCallback = fabric.util.requestAnimFrame(animateLoop);
		}
		animateLoop();
	}

	// preload images of mini game
	async function preloadCatchingGameImage(){

		// wait for loading background and rule image
		await Promise.all([
			loadRule(),
			loadBG()
		]);

		// wait for loading other images
		await loadOthers();

		CF.bringToFront(obj_iGotIt);
		obj_iGotIt.setCoords();
		CF.renderAll();

		// add listener for click event of 'i got it' button
		CF.on('mouse:down', iGotItEvent );
		function iGotItEvent(e) {
			if(e.target === obj_iGotIt){

				// remove event of 'i got it' button
				CF.off('mouse:down', iGotItEvent );
				// remove rule scene
				CF.remove(obj_iGotIt);
				obj_iGotIt = null;
				CF.remove(obj_rule);
				obj_rule = null;

				startCatching();
			}
		}

		async function loadOthers(){
			let bgScale = getScaleValue(obj_catchingBackground);
			await Promise.all([
				load_obj_bowl(),
				load_obj_iGotIt(),
				load_obj_sampleJelly(),
				load_obj_endingBackground()
			]);

			// draw obj_bowl object
			async function load_obj_bowl(){
				return new Promise(function (resolve, reject) {
					fabric.Image.fromURL(
						'./images/mini_catching/bowl.png',
						function( img ) {
							img.isLink = false;
							obj_bowl = img;
							CF.add(obj_bowl);
							console.log("[preload minigame] loaded obj_bowl image");
							resolve();
						},{
							visible: false,
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							originX: 'center',
							originY: 'bottom',
							width: bgScale * bowl_width * SCALE_OF_BOWL_X,
							height: bgScale * bowl_height * SCALE_OF_BOWL_Y
						}
					);
				});
			}

			// draw obj_iGotIt object
			async function load_obj_iGotIt(){
				return new Promise(function (resolve, reject) {
					fabric.Image.fromURL(
						'./images/mini_catching/start_game_btn.png',
						function( img ) {
							img.isLink = true;
							obj_iGotIt = img;
							obj_iGotIt.set({
								left: CF.width/2,
								top: ints_border_of_bg.bottom - obj_iGotIt.height/2
							});
							CF.add(obj_iGotIt);
							console.log("[preload minigame] loaded obj_iGotIt image");
							resolve();
						},{
							visible: true,
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							originX: 'center',
							originY: 'center',
							width: bgScale * 608 * SCALE_OF_I_GOT_IT,
							height: bgScale * 238 * SCALE_OF_I_GOT_IT
						}
					);
				});
			}

			// draw obj_sampleJelly object
			async function load_obj_sampleJelly(){
				return new Promise(function (resolve, reject) {
					fabric.Image.fromURL(
						'./images/mini_catching/jelly.png',
						function( img ) {
							img.isLink = false;
							obj_sampleJelly = img;
							obj_sampleJelly.isCaught = false;
							console.log("[preload minigame] loaded obj_sampleJelly image");
							resolve();
						},{
							visible: false,
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							originX: 'center',
							originY: 'center',
							width: bgScale * jelly_width * SCALE_OF_JELLY_X,
							height: bgScale * jelly_height * SCALE_OF_JELLY_Y
						}
					);
				});
			}

			// draw obj_endingBackground object
			async function load_obj_endingBackground(){
				return new Promise(function (resolve, reject) {
					fabric.Image.fromURL(
						'./images/mini_catching/final.png',
						function( img ) {
							img.isLink = false;
							obj_endingBackground = img;
							CF.add(obj_endingBackground);
							console.log("[preload minigame] loaded obj_endingBackground image");

							let endBGScale = getScaleValue(obj_endingBackground);

							// draw obj_colouredPaperSample object
							fabric.Image.fromURL(
								'./images/mini_catching/coloured_paper.png',
								function( img ) {
									img.isLink = false;
									let obj_colouredPaperSample = img;
									obj_colouredPaperLeft = fabric.util.object.clone( obj_colouredPaperSample );
									obj_colouredPaperLeft.set({
										left: calculatePointOnCanvasBasedOnObject(obj_endingBackground, {x:1010,y:890}).x,
										top: calculatePointOnCanvasBasedOnObject(obj_endingBackground, {x:1010,y:890}).y,
									});
									obj_colouredPaperRight = fabric.util.object.clone( obj_colouredPaperSample );
									obj_colouredPaperRight.set({
										left: calculatePointOnCanvasBasedOnObject(obj_endingBackground, {x:2750,y:890}).x,
										top: calculatePointOnCanvasBasedOnObject(obj_endingBackground, {x:2750,y:890}).y,
									});
									CF.add(obj_colouredPaperLeft);
									CF.add(obj_colouredPaperRight);
									console.log("[preload minigame] loaded obj_colouredPaperSample image");
									resolve();
								},{
									visible: false,
									selectable: false,
									hasControls: false,
									hasBorders: false,
									hasRotatingPoint: false,
									originX: 'center',
									originY: 'center',
									width: endBGScale * 830 * SCALE_OF_COLOURED_PAPER,
									height: endBGScale * 449 * SCALE_OF_COLOURED_PAPER
								}
							);

							// draw obj_return object
							fabric.Image.fromURL(
								'./images/mini_catching/back_to_mono.png',
								function( img ) {
									img.isLink = true;
									obj_return = img;
									CF.add(obj_return);
									console.log("[preload minigame] loaded obj_return image");
								},{
									visible: false,
									selectable: false,
									hasControls: false,
									hasBorders: false,
									hasRotatingPoint: false,
									originX: 'center',
									originY: 'center',
									width: endBGScale * 633 * SCALE_OF_RETURN,
									height: endBGScale * 246 * SCALE_OF_RETURN
								}
							);
						},{
							visible: false,
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							originX: 'center',
							originY: 'center',
							left: CF.width/2,
							top: CF.height/2,
							width: convertSizeToCustomRange(3714, 2450, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
							height: convertSizeToCustomRange(3714, 2450, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
						}
					);
				});
			}
		} // end of loadOthers


		// load background image
		async function loadBG(){
			return new Promise(function (resolve, reject) {
				// draw obj_catchingBackground object
				fabric.Image.fromURL(
					'./images/mini_catching/game_background.png',
					function( img ) {
						img.isLink = false;
						obj_catchingBackground = img;
						obj_catchingBackground.setOpacity(0.9);
						CF.add(obj_catchingBackground);
						console.log("[preload minigame] loaded obj_catchingBackground image");
						let bgScale = getScaleValue(obj_catchingBackground);
						ints_padding_of_bg = {
							up: bgScale * 390,
							down: bgScale * 310,
							left: bgScale * 440,
							right: bgScale * 480
						}
						ints_border_of_bg.left = obj_catchingBackground.left - obj_catchingBackground.width/2 + ints_padding_of_bg.left;
						ints_border_of_bg.top = obj_catchingBackground.top - obj_catchingBackground.height/2 + ints_padding_of_bg.up;
						ints_border_of_bg.right = obj_catchingBackground.left + obj_catchingBackground.width/2 - ints_padding_of_bg.right;
						ints_border_of_bg.bottom = obj_catchingBackground.top + obj_catchingBackground.height/2 - ints_padding_of_bg.down;
						resolve();
					},{
						visible: false,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'center',
						originY: 'center',
						left: CF.width/2,
						top: CF.height/2,
						width: convertSizeToCustomRange(3714, 2450, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width * SCALE_OF_CATCHING_BG,
						height: convertSizeToCustomRange(3714, 2450, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height * SCALE_OF_CATCHING_BG
					}
				);
			});
		}; // end of loadBG

		async function loadRule(){
			return new Promise(function (resolve, reject) {
				// draw obj_rule object
				fabric.Image.fromURL(
					'./images/mini_catching/guidance.png',
					function( img ) {
						img.isLink = false;
						obj_rule = img;
						obj_rule.setOpacity(0.9);
						CF.add(obj_rule);
						CF.bringToFront(obj_rule);
						console.log("[preload minigame] loaded obj_rule image");
						resolve();
					},{
						visible: true,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'center',
						originY: 'center',
						left: CF.width/2,
						top: CF.height/2,
						width: convertSizeToCustomRange(3225, 2133, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
						height: convertSizeToCustomRange(3225, 2133, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
					}
				);
			});
		} // end of loadRule
	} // end of preload
}