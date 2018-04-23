"use strict";

function miniGame_pair( CF , currentSubject){
	const SCALE_OF_PAIRING_BG = 1,
		  SCALE_OF_CARD = 1,
		  SCALE_OF_I_GOT_IT = 1,
		  SCALE_OF_RETURN = 1,
		  SCALE_OF_FONTSIZE = 1,
		  MAX_CARD_NUMBER = 12; // this number should have square root of integer, also is a multiple of two
	let obj_rule,
		obj_pairingBackground,
		obj_iGotIt,
		obj_scoreBar,
		obj_timeBar,
		obj_peekPrompt,
		obj_endingBackground,
		obj_endingWord,
		obj_return;
	let class_card = function(){
		let card_type = null, // type of the card
			obj_card = null, // card image object
			obj_back_of_card = null, // back of card image object
			isFlipped = false, // the current status of this card
			isFlipping = false, // the card is running the animation of flipping
			isBusted = false // the card has been matched or not
	};
	let objs_cards = [];
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
	}
	let ints_padding_of_bg;
	let mini_score = 0, // the score earned from mini game
		mini_pair_count = 0;
	let AnUnit; // an unit of card table
	let flippedCardIndex = [undefined, undefined];
	let cardPicName = [
		'card1.png','card2.png','card3.png','card6.png','card7.png','card8.png'
	];

	// show minigame canvas
	setMiniGameCanvasVisible(true);
	// preload images of mini game
	preloadPairGameImage();
	
	function startPairing(){
		let remainingTime = 15; // 小遊戲時間(秒)
		let peekTime = 5; // 開放預覽的時間(秒)
		let countTimeTimer; // play timer
		let peekCardTimer; // timer of peeking before starting

		// show game scene
		obj_pairingBackground.set({visible:true});
		// score bar text
		obj_scoreBar = new fabric.Text('0', {
			visible: false,
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
			visible: false,
			fontFamily: "globalFont",
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
		//	fontWeight: 'bold',
			originX: 'right',
			originY: 'bottom',
			left: ints_border_of_bg.right,
			top: ints_border_of_bg.top,
			fontSize: ( ints_border_of_bg.getHeight()/10 ) * SCALE_OF_FONTSIZE
		});
		CF.add(obj_timeBar);
		CF.bringToFront(obj_timeBar);
		obj_peekPrompt = new fabric.Text('請記住相同圖案的位置，剩下'+peekTime+'秒', {
			fontFamily: "globalFont",
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			left: (ints_border_of_bg.right+ints_border_of_bg.left)/2,
			top: ints_border_of_bg.top,
			fontSize: ( ints_border_of_bg.getHeight()/10 ) * SCALE_OF_FONTSIZE
		});
		CF.add(obj_peekPrompt);
		CF.bringToFront(obj_peekPrompt);
		
		for(let count=0,len=MAX_CARD_NUMBER; count<len; count++){
			objs_cards[count].obj_card.set({visible:true});
		}
		CF.renderAll();
		peekCardTimer = setInterval(function(){
			peekTime--;
			if( peekTime < 0 ){
				clearInterval(peekCardTimer);
				for(let count=0,len=MAX_CARD_NUMBER; count<len; count++){
					objs_cards[count].obj_card.set({visible:false});
					objs_cards[count].obj_back_of_card.set({visible:true});
				}
				obj_peekPrompt.set({visible:false});
				obj_scoreBar.set({visible:true});
				obj_timeBar.set({visible:true});
				countTimeTimer = setInterval( countDownTimefunction, 1000 );
				CF.on('mouse:down', flipCardEvent );
			}
			obj_peekPrompt.setText('請記住相同圖案的位置，剩下'+peekTime+'秒');
			CF.renderAll();
		}, 1000);
		
		// countdown timer
		let countDownTimefunction = function(){
			remainingTime--;
			obj_timeBar.setText("剩餘"+((remainingTime<0)?0:remainingTime)+"秒");
			CF.renderAll();
			// game over
			if( (mini_pair_count===MAX_CARD_NUMBER/2) || remainingTime < 0 ){
				// clear timer and stop animation
				clearInterval(countTimeTimer);
				// remove listener for flip card
				CF.off('mouse:down', flipCardEvent );
				// show cover background
				obj_endingBackground.set({visible:true});
				CF.bringToFront(obj_endingBackground);
				// ending word text
				if( currentSubject.isFollowedByMascot ){
					mini_score *= MASCOT_PRICE_MULTIPLE;
				}else if( currentSubject.isFollowedByBadLuck ){
					mini_score *= BADLUCK_PRICE_MULTIPLE;
				}
				obj_endingWord = new fabric.Text( '恭喜您獲得'+mini_score+'元', {
					fontFamily: "globalFont",
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					originX: 'center',
					originY: 'center',
					left: CF.width/2,
					top: calculatePointOnCanvasBasedOnObject(obj_endingBackground, {x:0, y:1650}).y,
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
					top: ints_border_of_bg.bottom - obj_return.height/2
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
						objs_cards = [];
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
		let flipCardEvent = function(e){
			let index = undefined;
			for(let count=0,len=MAX_CARD_NUMBER; count<len; count++){
				if( objs_cards[count].obj_back_of_card === e.target ){
					index = count;
				}
			}
			// when click on the covered card
			if(index !== undefined){
				if( flippedCardIndex[0] === undefined ){
					flippedCardIndex[0] = index;
					flipCardAnimate( objs_cards[index] );
				}else if( flippedCardIndex[1] === undefined ){
					flippedCardIndex[1] = index;
					flipCardAnimate( objs_cards[index], function(){
						// if match
						if( objs_cards[flippedCardIndex[0]].card_type === objs_cards[flippedCardIndex[1]].card_type ){
							// set status of card into BUSTED
							objs_cards[flippedCardIndex[0]].isBusted = true;
							objs_cards[flippedCardIndex[1]].isBusted = true;
							// add score
							mini_score += SCORE_PER_PAIR;
							mini_pair_count ++;
							obj_scoreBar.setText(""+mini_score);
							CF.renderAll();
							// reset flip flag
							flippedCardIndex = [undefined, undefined];
						}else{ // if not match
							// flip both card after half second
							setTimeout(function(){
								flipCardAnimate( objs_cards[flippedCardIndex[0]] );
								flipCardAnimate( objs_cards[flippedCardIndex[1]] );
								// reset flip flag
								flippedCardIndex = [undefined, undefined];
							}, 400);
						}
					} );
				}
			}
		}
	}
	// "card" should be one class_card object
	function flipCardAnimate( card, afterFunction ){
		let shrinkTarget = (card.isFlipped)?card.obj_card:card.obj_back_of_card;
		let expandTarget = (card.isFlipped)?card.obj_back_of_card:card.obj_card;
		shrinkTarget.width = AnUnit.width*2 - 10;
		expandTarget.width = 0;
		let animateCardShrinkCallback = null;
		let animateCardExpandCallback = null;
		if( !(card.isBusted || card.isFlipping) ){
			// lock the card when animating
			card.isFlipping = true;
			// start to shrink card
			animateCardShrinkCallback = fabric.util.requestAnimFrame(animateCardShrink);
		}
		// animation of a card shrink
		function animateCardShrink(){
			if( !animateCardShrinkCallback )
				return;
			shrinkTarget.width -= AnUnit.width/6;
			if( shrinkTarget.width <= 0 ){
				cancelRequestAnimFrame( animateCardShrinkCallback );
				animateCardShrinkCallback = null;
				shrinkTarget.set({visible:false});
				shrinkTarget.width = 0;
				CF.renderAll();
				// start to expand card
				expandTarget.set({visible:true});
				animateCardExpandCallback = fabric.util.requestAnimFrame(animateCardExpand);
			}else{
				CF.renderAll();
				animateCardShrinkCallback = fabric.util.requestAnimFrame(animateCardShrink);
			}
		}
		// animation of a card expand
		function animateCardExpand(){
			if( !animateCardExpandCallback )
				return;
			expandTarget.width += AnUnit.width/6;
			if( expandTarget.width >= (AnUnit.width*2-10) ){
				cancelRequestAnimFrame( animateCardExpandCallback );
				animateCardExpandCallback = null;
				expandTarget.width = AnUnit.width*2-10;
				CF.renderAll();
				card.isFlipped = !card.isFlipped;
				card.isFlipping = false; // unlock the card animation
				if( afterFunction )
					afterFunction();
			}else{
				CF.renderAll();
				animateCardExpandCallback = fabric.util.requestAnimFrame(animateCardExpand);
			}
		}
	}
	
	async function preloadPairGameImage(){
		await Promise.all([
			load_obj_rule(),
			load_obj_endingBackground(),
			loadBG()
		]);

		await Promise.all([
			load_obj_iGotIt(),
			load_obj_return(),
			generateCards()
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

				startPairing();
			}
		}

		async function generateCards(){
			let sideCount = Math.sqrt(MAX_CARD_NUMBER);

			let rowCount = Math.floor( Math.sqrt(MAX_CARD_NUMBER) );
			let colCount = Math.ceil(MAX_CARD_NUMBER/rowCount);

			let cardType = MAX_CARD_NUMBER/2;
			AnUnit = {
				width: ints_border_of_bg.getWidth()/(colCount*2),
				height: ints_border_of_bg.getHeight()/(rowCount*2)
			};
			// init cards
			for(let count=0,len=MAX_CARD_NUMBER; count<len; count++){
				objs_cards[ count ] = new class_card();
				objs_cards[ count ].card_type = (count%cardType);
			}
			// random cards
			for(let count=0,len=MAX_CARD_NUMBER; count<len; count++){
				let ranNum = Math.floor( Math.random()*MAX_CARD_NUMBER );
				let tempType = objs_cards[count].card_type;
				objs_cards[count].card_type = objs_cards[ranNum].card_type;
				objs_cards[ranNum].card_type = tempType;
			}
			// draw cards
			for(let count=0,len=MAX_CARD_NUMBER; count<len; count++){
				// draw objs_cards object
				fabric.Image.fromURL(
					'./images/mini_pair/'+cardPicName[objs_cards[count].card_type],
					function( img ) {
						img.isLink = false;
						objs_cards[count].obj_card = img;
						CF.add(img);
						CF.bringToFront(img);
						//	console.log("[preload minigame] loaded objs_cards["+count+"].obj_card image");
					},{
						visible: false,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'center',
						originY: 'center',
						left: ints_border_of_bg.left + AnUnit.width*((count%colCount)*2+1),
						top: ints_border_of_bg.top + AnUnit.height*(Math.floor(count/colCount)*2+1),
						width: AnUnit.width*2 - 10,
						height: AnUnit.height*2 - 10
					}
				);
				// draw objs_back_of_cards object
				fabric.Image.fromURL(
					'./images/mini_pair/cardBG.png',
					function( img ) {
						img.isLink = true;
						objs_cards[count].obj_back_of_card = img;
						CF.add(img);
						CF.bringToFront(img);
						//	console.log("[preload minigame] loaded objs_cards["+count+"].obj_back_of_card image");
					},{
						visible: false,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'center',
						originY: 'center',
						left: ints_border_of_bg.left + AnUnit.width*((count%colCount)*2+1),
						top: ints_border_of_bg.top + AnUnit.height*(Math.floor(count/colCount)*2+1),
						width: AnUnit.width*2 - 10,
						height: AnUnit.height*2 - 10
					}
				);
			}
		}

		async function loadBG(){
			return new Promise(function (resolve, reject) {
				// draw obj_pairingBackground object
				fabric.Image.fromURL(
					'./images/mini_pair/pair_BG.png',
					function( img ) {
						img.isLink = false;
						obj_pairingBackground = img;
						CF.add(obj_pairingBackground);
						console.log("[preload minigame] loaded obj_pairingBackground image");

						let bgScale = getScaleValue(obj_pairingBackground);
						ints_padding_of_bg = {
							up: bgScale * 470,
							down: bgScale * 150,
							left: bgScale * 300,
							right: bgScale * 300
						}

						let l = obj_pairingBackground.left - obj_pairingBackground.width/2 + ints_padding_of_bg.left;
						let t = obj_pairingBackground.top - obj_pairingBackground.height/2 + ints_padding_of_bg.up;
						let r = obj_pairingBackground.left + obj_pairingBackground.width/2 - ints_padding_of_bg.right;
						let b = obj_pairingBackground.top + obj_pairingBackground.height/2 - ints_padding_of_bg.down;
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
						width: convertSizeToCustomRange(3225, 2137, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
						height: convertSizeToCustomRange(3225, 2137, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
					}
				);
			});
		}

		// draw obj_iGotIt object
		async function load_obj_iGotIt(){
			let bgScale = getScaleValue(obj_pairingBackground);
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_pair/pair_iGotIt.png',
					function( img ) {
						img.isLink = true;
						obj_iGotIt = img;
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
					'./images/mini_pair/pair_rule.png',
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
						width: convertSizeToCustomRange(3225, 2137, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
						height: convertSizeToCustomRange(3225, 2137, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
					}
				);
			});
		}

		// draw obj_endingBackground object
		async function load_obj_endingBackground(){
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_pair/pair_endingBG.png',
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
						width: convertSizeToCustomRange(3225, 2137, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
						height: convertSizeToCustomRange(3225, 2137, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
					}
				);
			});
		}

		// draw obj_return object
		async function load_obj_return(){
			let endBgScale = getScaleValue(obj_endingBackground);
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_pair/pair_backToMono.png',
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
						height: endBgScale * 233 * SCALE_OF_RETURN,
						left: CF.width/2,
						top: ints_border_of_bg.bottom
					}
				);
			});
		}
	}
}