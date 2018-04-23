"use strict";

function miniGame_whack( CF , currentSubject){
	const SCALE_OF_WHACK_BG = 1,
		  SCALE_OF_I_GOT_IT = 1,
		  SCALE_OF_RETURN = 1,
		  SCALE_OF_FONTSIZE = 1,
		  SCALE_OF_O_MOLE_X = 1, //FUTURE: scale o
		  SCALE_OF_O_MOLE_Y = 1, //FUTURE: scale o
		  SCALE_OF_X_MOLE_X = 1, //FUTURE: scale x
		  SCALE_OF_X_MOLE_Y = 1, //FUTURE: scale x
		  UP_CURSOR_URL = 'url("./images/mini_whack/whack_malletUp.png") 20 20, default',
		  DOWN_CURSOR_URL = 'url("./images/mini_whack/whack_malletDown.png") 20 20, pointer';
	let obj_rule,
		obj_whackBackground,
		obj_iGotIt,
		obj_scoreBar,
		obj_timeBar,
		obj_endingBackground,
		obj_endingWord,
		obj_return;
	let ints_border_of_bg = {
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		getWidth: function(){return Math.abs(this.right-this.left);},
		getHeight: function(){return Math.abs(this.bottom-this.top);},
		set: function(t,b,r,l){
			this.top = t;
			this.bottom = b;
			this.right = r;
			this.left = l;
		}
	};
	let ints_padding_of_bg;
	let mini_score = 0, // the score earned from mini game
		mini_correct_mole_count = 0,
		mini_wrong_mole_count = 0;
	let class_mole = function(){
		// image objects
		this.obj_correct_mole = null; // correct mole image object
		this.obj_wrong_mole = null; // wrong mole image object
		this.clipRect4correct = null; // rectangle for clipping correct mole
		this.clipRect4wrong = null; // rectangle for clipping wrong mole
		this.obj_exploding = null; // exploding image object
		// flags
		this.isPopping = false; // the mole is running the animation of popping
		this.isCorrectOnePopped = false; // determine which image is popping
		this.isBusted = false; // the mole is hit or not
		// variables for animation
		this.animatePopCallback = null;
		this.animatePushCallback = null;
	};
	// pop animate function
	class_mole.prototype.popMoleAnimate = function(){
		let self = this; // used for accessing variables
		let animateSteps = 10;
		let stillTime = 1000; // ms
		let targetObj = (self.isCorrectOnePopped) ? self.obj_correct_mole : self.obj_wrong_mole;
		let originalTop = targetObj.top;
		let targetTop = targetObj.top - targetObj.height;
		let obj_referTo_explodeRange = null;
		if( !self.isPopping ){
			obj_referTo_explodeRange = (self.isCorrectOnePopped) ? self.clipRect4correct : self.clipRect4wrong;
			CF.bringToFront(obj_referTo_explodeRange);
			self.isPopping = true;
			self.animatePopCallback = fabric.util.requestAnimFrame(animateMolePop);
		}else{
			console.log("repop?!");
		}

		// animation of a card shrink
		function animateMolePop(){
			if( !(self.animatePopCallback) ){ return; }

			targetObj.top -= targetObj.height/animateSteps;
			if( self.isBusted ){
				self.obj_exploding.set({
					visible: true,
					left: obj_referTo_explodeRange.left,
					top: obj_referTo_explodeRange.top,
					width: obj_referTo_explodeRange.width,
					height: obj_referTo_explodeRange.height
				});
				CF.bringToFront(self.obj_exploding);
			}
			if( targetObj.top <= targetTop ){
				cancelRequestAnimFrame( self.animatePopCallback );
				self.animatePopCallback = null;
				targetObj.top = targetTop;
				CF.renderAll();
				// start to expand card
				self.animatePushCallback = setTimeout(function(){
					self.animatePushCallback = fabric.util.requestAnimFrame(animateMolePush);
				}, stillTime);
			}else{
				CF.renderAll();
				self.animatePopCallback = fabric.util.requestAnimFrame(animateMolePop);
			}
		}
		// animation of a card shrink
		function animateMolePush(){
			if( !(self.animatePushCallback) ){return;}
			targetObj.top += targetObj.height/animateSteps;
			if( self.isBusted ){
				self.obj_exploding.set({
					visible: true,
					left: obj_referTo_explodeRange.left,
					top: obj_referTo_explodeRange.top,
					width: obj_referTo_explodeRange.width,
					height: obj_referTo_explodeRange.height
				});
				CF.bringToFront(self.obj_exploding);
			}
			if( targetObj.top >= originalTop ){
				cancelRequestAnimFrame( self.animatePushCallback );
				self.animatePushCallback = null;
				targetObj.top = originalTop;
				if( self.isBusted ){
					self.obj_exploding.set({visible: false});
				}
				CF.renderAll();
				self.isPopping = false;
				self.isBusted = false;
			}else{
				CF.renderAll();
				self.animatePushCallback = fabric.util.requestAnimFrame(animateMolePush);
			}
		}
	};
	let objs_mole = [];
	let getNonPoppingMole = function(){
		let emptyMoles = [];
		for( let c=0,len=objs_mole.length; c<len; c++ ){
			if( !(objs_mole[c].isPopping) ){
				emptyMoles.push(objs_mole[c]);
			}
		}
		return emptyMoles;
	};
	let mole_coordinate = [
		{x:520, y:955},
		{x:670, y:1617},
		{x:1140, y:1218},
		{x:1626, y:830},
		{x:1640, y:1633},
		{x:2131, y:1225},
		{x:2730, y:934},
		{x:2694, y:1635}
	];

	// show minigame canvas
	setMiniGameCanvasVisible(true);
	// preload images of mini game
	preloadWhackGameImage();

	function startWhack(){
		let remainingTime = 20; // 小遊戲時間(秒)//FUTURE: remainingTime
		let countTimeTimer;
		let generateMoleTimer;

		setCursorOnCanvas( CF, UP_CURSOR_URL);
//		CF.defaultCursor = UP_CURSOR_URL;
//		CF.setCursor(CF.defaultCursor);
		// show game scene
		obj_whackBackground.set({visible:true});
		// score bar text
		obj_scoreBar = new fabric.Text('0', {
			visible: true,
			fontFamily: "globalFont",
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'left',
			originY: 'bottom',
			left: ints_border_of_bg.left,
			top: ints_border_of_bg.top,
			fontSize: ( ints_border_of_bg.getHeight()/10 ) * SCALE_OF_FONTSIZE
		});
		CF.add(obj_scoreBar);
		CF.bringToFront(obj_scoreBar);

		// time bar text
		obj_timeBar = new fabric.Text('剩餘'+remainingTime+'秒', {
			visible: true,
			fontFamily: "globalFont",
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'right',
			originY: 'bottom',
			left: ints_border_of_bg.right,
			top: ints_border_of_bg.top,
			fontSize: ( ints_border_of_bg.getHeight()/10 ) * SCALE_OF_FONTSIZE
		});
		CF.add(obj_timeBar);
		CF.bringToFront(obj_timeBar);

		// whack event( mouse down )
		let whack_mouseDownEvent = function(){
			setCursorOnCanvas( CF, DOWN_CURSOR_URL);
//			CF.defaultCursor = DOWN_CURSOR_URL;
//			CF.setCursor(CF.defaultCursor);
		};

		// whack event( mouse up )
		let whack_mouseUpEvent = function(e){
			setCursorOnCanvas( CF, UP_CURSOR_URL);
//			CF.defaultCursor = UP_CURSOR_URL;
//			CF.setCursor(CF.defaultCursor);
			let clickObj = e.target;
			for(let count=0,len=mole_coordinate.length; count<len; count++){
				if( objs_mole[count].isPopping && !(objs_mole[count].isBusted) ){
					if( objs_mole[count].isCorrectOnePopped && (clickObj === objs_mole[count].clipRect4correct) ){
//						console.log("correct on "+ count);
						objs_mole[count].isBusted = true;
						objs_mole[count].obj_exploding.set({
							visible: true,
							left: objs_mole[count].clipRect4correct.left,
							top: objs_mole[count].clipRect4correct.top,
							width: objs_mole[count].clipRect4correct.width,
							height: objs_mole[count].clipRect4correct.height
						});
						CF.bringToFront(objs_mole[count].obj_exploding);
						mini_correct_mole_count++;
						mini_score += SCORE_PER_MOLE;
						obj_scoreBar.setText(""+mini_score);
					}else if( !(objs_mole[count].isCorrectOnePopped) && (clickObj === objs_mole[count].clipRect4wrong) ){
//						console.log("wrong on "+ count);
						objs_mole[count].isBusted = true;
						objs_mole[count].obj_exploding.set({
							visible: true,
							left: objs_mole[count].clipRect4wrong.left,
							top: objs_mole[count].clipRect4wrong.top,
							width: objs_mole[count].clipRect4wrong.width,
							height: objs_mole[count].clipRect4wrong.height
						});
						CF.bringToFront(objs_mole[count].obj_exploding);
						mini_wrong_mole_count++;
						mini_score -= SCORE_PER_MOLE;
						if( mini_score<0 )
							mini_score = 0;
						obj_scoreBar.setText(""+mini_score);
					}
				}
			}
		};
		CF.on('mouse:down', whack_mouseDownEvent );
		CF.on('mouse:up', whack_mouseUpEvent );
		let countDownTimefunction = function(){
			remainingTime--;
			obj_timeBar.setText("剩餘"+((remainingTime<0)?0:remainingTime)+"秒");
			CF.renderAll();
			// game over
			if( remainingTime < 0 ){
				// clear timer and stop animation
				clearInterval(countTimeTimer);
				clearInterval(generateMoleTimer);
				for(let c=0,len=objs_mole.length; c<len; c++){
					if( objs_mole[c].animatePopCallback ){
						cancelRequestAnimFrame( objs_mole[c].animatePopCallback );
						objs_mole[c].animatePopCallback = null;
					}
					if( objs_mole[c].animatePushCallback ){
						cancelRequestAnimFrame( objs_mole[c].animatePushCallback );
						objs_mole[c].animatePushCallback = null;
					}
				}

				// remove listener for whacking
				CF.off('mouse:down', whack_mouseDownEvent );
				CF.off('mouse:up', whack_mouseUpEvent );
				setCursorOnCanvas( CF, 'default');
//				CF.defaultCursor = 'default';

				// show cover background
				obj_endingBackground.set({visible:true});
				CF.bringToFront(obj_endingBackground);

				// ending word text
				let text = '獲得'+mini_score+'元';
				if( currentSubject.isFollowedByMascot ){
					mini_score *= MASCOT_PRICE_MULTIPLE;
					mini_score = mini_score.toFixed();
					text += "，財神加持所以共獲得"+mini_score+'元';
				}else if( currentSubject.isFollowedByBadLuck ){
					mini_score *= BADLUCK_PRICE_MULTIPLE;
					mini_score = mini_score.toFixed();
					text += "，衰神加持所以只獲得"+mini_score+'元';
				}
				obj_endingWord = new fabric.Text( text, {
					fontFamily: "globalFont",
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					originX: 'center',
					originY: 'center',
					left: CF.width/2,
					top: calculatePointOnCanvasBasedOnObject(obj_endingBackground, {x:0, y:1600}).y,
					fontSize: ( ints_border_of_bg.getHeight()/10 ) * SCALE_OF_FONTSIZE
				});
				CF.add(obj_endingWord);
				CF.bringToFront(obj_endingWord);

				// add player's score in main game
				currentSubject.int_score += mini_score;

				// show obj_return button
				obj_return.set({
					visible: true,
					left: CF.width/2,
					top: ints_border_of_bg.bottom
				});
				obj_return.setCoords();
				CF.bringToFront(obj_return);
				CF.renderAll();
				// add listener for click event of 'return' button
				CF.on('mouse:down', returnEvent );
				function returnEvent(e) {
					if(e.target === obj_return){
						// clear every object of mini game
						CF.clear();
						objs_mole = [];
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
		};
		countTimeTimer = setInterval( countDownTimefunction, 1000 );

		let spamMoleFunction = function(){
			let randomCorrectPosition;
			let randomWrongPosition;
			let remainingRoom = getNonPoppingMole();
			if( remainingRoom.length===1 ){
				remainingRoom[0].isCorrectOnePopped = true;
				remainingRoom[0].popMoleAnimate();
			}else if( remainingRoom.length>=2 ){
				// randomly pop correct mole
				randomCorrectPosition = Math.floor( Math.random()*remainingRoom.length );
				remainingRoom[randomCorrectPosition].isCorrectOnePopped = true;
				remainingRoom[randomCorrectPosition].popMoleAnimate();
				// remove selected element
				remainingRoom.splice(randomCorrectPosition, 1);
				// randomly pop wrong mole
				randomWrongPosition = Math.floor( Math.random()*remainingRoom.length );
				remainingRoom[randomWrongPosition].isCorrectOnePopped = false;
				remainingRoom[randomWrongPosition].popMoleAnimate();
			}else{
				// if there is no empty room, do nothing.
				console.log("full");
			}
		};
		generateMoleTimer = setInterval( spamMoleFunction, 600 );
	}

	async function generateMoles(){
		let bgScale = getScaleValue(obj_whackBackground);
		objs_mole = [];
		let promiseList = [];

		for( let count=0,len=mole_coordinate.length; count<len; count++ ){
			let coordinate = calculatePointOnCanvasBasedOnObject( obj_whackBackground, mole_coordinate[count]);
			objs_mole[count] = new class_mole();
			// draw obj_correct_mole object
			promiseList.push( new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_whack/o.png',
					function( img ) {
						img.isLink = false;
						let bound = new fabric.Rect({
							visible: false,
							originX: 'left', /* non-changeable */
							originY: 'top', /* non-changeable */
							left: img.left - img.width/2,
							top: img.top - img.height,
							width: img.width,
							height: img.height,
							fill: 'transparent', /* use transparent for no fill */
							strokeWidth: 0,
							selectable: false,
							clipFor: 'c'+count /* clip flag */
						});
						img.set({
							clipName: 'c'+count,
							clipTo: function(ctx) { 
								return _.bind(clipByName, img)(ctx);
							}
						});

						CF.add(bound);
						CF.add(img);
						objs_mole[count].clipRect4correct = bound;
						objs_mole[count].obj_correct_mole = img;
						resolve();
					},{
						visible: false,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'center',
						originY: 'top',
						left: coordinate.x,
						top: coordinate.y,
						width: bgScale * 450 * SCALE_OF_O_MOLE_X,
						height: bgScale * 530 * SCALE_OF_O_MOLE_Y
					}
				);
			}));
			// draw obj_wrong_mole object
			promiseList.push( new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_whack/x.png',
					function( img ) {
						img.isLink = false;
						let bound = new fabric.Rect({
							visible: false,
							originX: 'left', /* non-changeable */
							originY: 'top', /* non-changeable */
							left: img.left - img.width/2,
							top: img.top - img.height,
							width: img.width,
							height: img.height,
							fill: 'transparent', /* use transparent for no fill */
							strokeWidth: 0,
							selectable: false,
							clipFor: 'w'+count /* clip flag */
						});
						img.set({
							clipName: 'w'+count,
							clipTo: function(ctx) { 
								return _.bind(clipByName, img)(ctx) 
							}
						});

						CF.add(bound);
						CF.add(img);
						objs_mole[count].clipRect4wrong = bound;
						objs_mole[count].obj_wrong_mole = img;
						resolve();
					},{
						visible: false,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'center',
						originY: 'top',
						left: coordinate.x,
						top: coordinate.y,
						width: bgScale * 323 * SCALE_OF_X_MOLE_X,
						height: bgScale * 504 * SCALE_OF_X_MOLE_Y
					}
				);
			}));
			// draw obj_exploding object
			promiseList.push( new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_whack/whack_exploding.png',
					function( img ) {
						img.isLink = false;
						CF.add(img);
						objs_mole[count].obj_exploding = img;
						resolve();
					},{
						visible: false,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'left',
						originY: 'top'
					}
				);
			}));
		}
		return Promise.all(promiseList);
	}

	async function preloadWhackGameImage(){
		await Promise.all([
			load_obj_rule(),
			load_obj_endingBackground(),
			loadBG()
		]);

		await Promise.all([
			load_obj_iGotIt(),
			load_obj_return(),
			generateMoles()
		]);

		// add listener for click event of 'i got it' button
		CF.on('mouse:down', iGotItEvent );
		function iGotItEvent(e) {
			if(e.target === obj_iGotIt){
				// remove rule scene
				CF.remove(obj_iGotIt);
				obj_iGotIt = null;
				CF.remove(obj_rule);
				obj_rule = null;
				// remove event of 'i got it' button
				CF.off('mouse:down', iGotItEvent );

				// arrange image layer
				for( let c=0,len=objs_mole.length; c<len; c++ ){
					objs_mole[c].obj_correct_mole.set({visible:true});
					objs_mole[c].obj_wrong_mole.set({visible:true});
					objs_mole[c].clipRect4correct.set({visible:true});
					objs_mole[c].clipRect4wrong.set({visible:true});
					CF.bringToFront(objs_mole[c].clipRect4correct);
					CF.bringToFront(objs_mole[c].clipRect4wrong);
				}
				startWhack();
			}
		}

		// draw obj_whackBackground object
		async function loadBG(){
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_whack/whack_BG.png',
					function( img ) {
						img.isLink = false;
						obj_whackBackground = img;
						CF.add(obj_whackBackground);
						console.log("[preload minigame] loaded obj_whackBackground image");

						let bgScale = getScaleValue(obj_whackBackground);
						ints_padding_of_bg = {
							up: bgScale * 470,
							down: bgScale * 155,
							left: bgScale * 150,
							right: bgScale * 150
						};

						let l = obj_whackBackground.left - obj_whackBackground.width/2 + ints_padding_of_bg.left;
						let t = obj_whackBackground.top - obj_whackBackground.height/2 + ints_padding_of_bg.up;
						let r = obj_whackBackground.left + obj_whackBackground.width/2 - ints_padding_of_bg.right;
						let b = obj_whackBackground.top + obj_whackBackground.height/2 - ints_padding_of_bg.down;
						ints_border_of_bg.set(t,b,r,l);
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
						width: convertSizeToCustomRange(3225, 2142, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
						height: convertSizeToCustomRange(3225, 2142, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
					}
				);
			});
		}

		// draw obj_iGotIt object
		async function load_obj_iGotIt(){
			let bgScale = getScaleValue(obj_rule);
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_whack/whack_IGotIt.png',
					function( img ) {
						img.isLink = true;
						obj_iGotIt = img;
						obj_iGotIt.setCoords();
						CF.add(obj_iGotIt);
						CF.bringToFront(obj_iGotIt);
						console.log("[preload minigame] loaded obj_iGotIt image");
						resolve();
					},{
						visible: true,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'center',
						originY: 'bottom',
						width: bgScale * 613 * SCALE_OF_I_GOT_IT,
						height: bgScale * 233 * SCALE_OF_I_GOT_IT,
						left: CF.width/2,
						top: ints_border_of_bg.bottom
					}
				);
			});
		}

		// draw obj_rule object
		async function load_obj_rule(){
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_whack/whack_rule.png',
					function( img ) {
						img.isLink = false;
						obj_rule = img;
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
						width: convertSizeToCustomRange(3225, 2142, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
						height: convertSizeToCustomRange(3225, 2142, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
					}
				);
			});
		}

		// draw obj_endingBackground object
		async function load_obj_endingBackground(){
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_whack/whack_endingBG.png',
					function( img ) {
						img.isLink = false;
						obj_endingBackground = img;
						CF.add(obj_endingBackground);
						console.log("[preload minigame] loaded obj_endingBackground image");
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
						width: convertSizeToCustomRange(3225, 2142, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
						height: convertSizeToCustomRange(3225, 2142, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
					}
				);
			});
		}

		// draw obj_return object
		async function load_obj_return(){
			let endBgScale = getScaleValue(obj_endingBackground);
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_whack/whack_backToMono.png',
					function( img ) {
						img.isLink = true;
						obj_return = img;
						CF.add(obj_return);
						console.log("[preload minigame] loaded obj_return image");
						resolve();
					},{
						visible: false,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'center',
						originY: 'center',
						width: endBgScale * 613 * SCALE_OF_RETURN,
						height: endBgScale * 233 * SCALE_OF_RETURN
					}
				);
			});
		}
	}
	/*********************************
	 ***** method for clip image *****
	 *********************************/
	function findByClipName(name) {
		return _(CF.getObjects()).where({
				clipFor: name
			}).first()
	}

	// Since the `angle` property of the Image object is stored 
	// in degrees, we'll use this to convert it to radians.
	function degToRad(degrees) {
		return degrees * (Math.PI / 180);
	}

	let clipByName = function (ctx) {
		this.setCoords();
		var clipRect = findByClipName(this.clipName);
		var scaleXTo1 = (1 / this.scaleX);
		var scaleYTo1 = (1 / this.scaleY);
		ctx.save();

		var ctxLeft = -( this.width / 2 ) + clipRect.strokeWidth;
		var ctxTop = -( this.height / 2 ) + clipRect.strokeWidth;
		var ctxWidth = clipRect.width - clipRect.strokeWidth;
		var ctxHeight = clipRect.height - clipRect.strokeWidth;

		ctx.translate( ctxLeft, ctxTop );

		ctx.rotate(degToRad(this.angle * -1));
		ctx.scale(scaleXTo1, scaleYTo1);
		ctx.beginPath();
		ctx.rect(
			clipRect.left - this.oCoords.tl.x,
			clipRect.top - this.oCoords.tl.y,
			clipRect.width,
			clipRect.height
		);
		ctx.closePath();
		ctx.restore();
	}
}