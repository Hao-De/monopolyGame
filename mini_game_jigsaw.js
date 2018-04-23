"use strict";

function miniGame_jigsaw( CF , currentSubject){
	const SCALE_OF_CATCHING_BG = 1,
		  SCALE_OF_I_GOT_IT = 0.6,
		  SCALE_OF_RETURN = 0.6,
		  SCALE_OF_FONTSIZE = 1;
	const MIN_ROWS = 3,
		  MAX_ROWS = 3,
		  MIN_COLUMNS = 3,
		  MAX_COLUMNS = 3;
	const FILE_LIST = [
		'jigsaw0.png','jigsaw1.png','jigsaw2.png','jigsaw3.png'
	];
	let obj_rule,
		obj_promptImg,
		obj_jigsawBackground,
		obj_iGotIt,
		obj_timeBar,
		obj_peekPrompt,
		obj_endingWord,
		obj_return,
		objs_rowLine = [],
		objs_columnLine = [],
		objs_jigsaw = [],
		booleans_jigsawRoom = [];
	let ints_border_of_bg = {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		getWidth: function(){return Math.abs(this.right-this.left);},
		getHeight: function(){return Math.abs(this.bottom-this.top);},
		getCenterPoint: function(){ 
			return {
				x: (this.left+this.right)/2,
				y: (this.bottom+this.top)/2,
			};
		}
	};
	let ints_padding_of_bg;
	let jigsaw_box = {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		getWidth: function(){return Math.abs(this.right-this.left);},
		getHeight: function(){return Math.abs(this.bottom-this.top);},
		set: function(t,b,r,l){
			this.top = t;
			this.bottom = b;
			this.right = r;
			this.left = l;
		},
		increaseSize: function( increment ){
			this.top -= increment;
			this.bottom += increment;
			this.right += increment;
			this.left -= increment;
		}
	}
	let pieces_per_row, // amount of jigsaw pieces per row
		pieces_per_column; // amount of jigsaw pieces per column
	let answerString = ""; // store serial number of jigsaws

	// show minigame canvas
	setMiniGameCanvasVisible(true);
	// randomly pick an image
	let randomNum = Math.floor( Math.random()*FILE_LIST.length );
	let srcUrl = './images/mini_jigsaw/jigsaw_pic/'+FILE_LIST[ randomNum ];
	// preload images of mini game
	preloadJigsawGameImage();

	// 
	function startJigsaw(){
		let remainingTime; // 小遊戲秒數
		let peekTime = 4; // 開放預覽的時間(秒)
		let countTimeTimer; // play timer
		let peekImageTimer; // timer of peeking before starting

		// show game scene
		obj_promptImg.set({visible:true});
		CF.bringToFront(obj_jigsawBackground);
		CF.bringToFront(obj_promptImg);

		// draw lines of row and column
		drawRowAndColumn();
		// set remainingTime accroding to the pieces of jigsaw
		remainingTime = (pieces_per_row*pieces_per_column)*2;
		// generate jigsaw
		generateJigsaw();
		// time bar text
		obj_timeBar = new fabric.Text('剩餘'+remainingTime+'秒', {
			fontFamily: "globalFont",
			visible: false,
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			fontWeight: 'bold',
			originX: 'right',
			originY: 'bottom',
			left: ints_border_of_bg.right,
			top: ints_border_of_bg.top,
			fontSize: ( ints_border_of_bg.getHeight()/12 ) * SCALE_OF_FONTSIZE
		});
		CF.add(obj_timeBar);
		obj_peekPrompt = new fabric.Text('請記住圖案，剩下'+peekTime+'秒', {
			fontFamily: "globalFont",
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'bottom',
			left: (ints_border_of_bg.right+ints_border_of_bg.left)/2,
			top: ints_border_of_bg.top,
			fontSize: ( ints_border_of_bg.getHeight()/12 ) * SCALE_OF_FONTSIZE
		});
		CF.add(obj_peekPrompt);
		CF.bringToFront(obj_peekPrompt);
		CF.renderAll();

		peekImageTimer = setInterval(function(){
			peekTime--;
			if( peekTime < 0 ){
				clearInterval(peekImageTimer);
				// hide peek scene
				obj_peekPrompt.set({visible:false});
				obj_promptImg.set({visible:false});

				// show game scene
				obj_timeBar.set({visible:true});
				[].concat( objs_rowLine, objs_columnLine, ...objs_jigsaw ).forEach( (obj)=>{
					obj.set({visible:true});
				});

				CF.renderAll();
				// start game countdown
				countTimeTimer = setInterval( countDownTimefunction, 1000 );
			}
			obj_peekPrompt.setText('請記住圖案，剩下'+peekTime+'秒');
			CF.renderAll();
		}, 1000);

		// countdown timer
		let countDownTimefunction = function(){
			remainingTime--;
			obj_timeBar.setText("剩餘"+((remainingTime<0)?0:remainingTime)+"秒");
			CF.renderAll();
			// game over
			if( checkCorrect() || remainingTime < 0 ){
				let correctJigsawAmount = sumCorrectJigsaw();
				// clear timer
				clearInterval(countTimeTimer);
				
				// remove redundant element
				[].concat( ...objs_jigsaw, objs_rowLine, objs_columnLine, obj_timeBar ).forEach( (obj)=>{
					CF.remove(obj);
				});
				// show prompt image and set opacity
				obj_promptImg.set({
					visible:true,
					opacity: 0.7
				});

				// remove listener for event
				CF.off('object:modified', dropJigsaw );
				CF.off('mouse:down', topTheChosenJigsaw );

				remainingTime = (remainingTime<0)?0:remainingTime;
				let mini_score = correctJigsawAmount * SCORE_PER_PIECE_JIGSAW + remainingTime * SCORE_PER_SECOND_JIGSAW;
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
					top: CF.height/2,
					fontSize: ( ints_border_of_bg.getHeight()/12 ) * SCALE_OF_FONTSIZE
				});
				CF.add(obj_endingWord);
				CF.bringToFront(obj_endingWord);
				// show obj_return button
				obj_return.set({ visible: true });
				obj_return.setCoords();
				CF.bringToFront(obj_return);
				CF.renderAll();
				// add listener for click event of 'return' button
				CF.on('mouse:down', returnEvent );
				function returnEvent(e) {
					if(e.target === obj_return){
						// clear every object of mini game
						CF.clear();
						CF.off('mouse:down', returnEvent );
						redrawStatusBar();
						// hide minigame canvas
						setMiniGameCanvasVisible(false);
						switchTurn();
					}
				}
			}
		};
	}

	// randomly set rows and column of jigsaw
	function setRowAndColumn( rowRange, columnRange ){
		let rowInterval = rowRange.max - rowRange.min;
		let columnInterval = columnRange.max - columnRange.min;
		pieces_per_row = rowRange.min + ( Math.floor( Math.random()*rowInterval ) );
		pieces_per_column = columnRange.min + ( Math.floor( Math.random()*columnInterval ) );
		console.log(pieces_per_row+" x "+pieces_per_column);
	}
	// draw lines of row and column
	function drawRowAndColumn(){
		// draw row lines
		for(let c=0; c<pieces_per_row; c++){
			let y = jigsaw_box.top + c * (jigsaw_box.getHeight()/pieces_per_row);
			let x1 = jigsaw_box.left;
			let x2 = jigsaw_box.right;
			let line = new fabric.Line([x1, y, x2, y],{
				stroke: 'gray',
				strokeWidth: Math.ceil(CF.width/500),
				visible: false,
				selectable:false,
				hasBorders: false,
				hasRotatingPoint: false,
				hasControls: false
			});
			objs_rowLine.push( line );
			CF.add(line);
			// draw the last line
			if( c === pieces_per_row-1 ){
				y = jigsaw_box.bottom;
				let lastLine = new fabric.Line([x1, y, x2, y],{
					stroke: 'gray',
					strokeWidth: Math.ceil(CF.width/500),
					visible: false,
					selectable:false,
					hasBorders: false,
					hasRotatingPoint: false,
					hasControls: false
				});
				objs_rowLine.push( lastLine );
				CF.add(lastLine);
			}
		}
		// draw column lines
		for(let c=0; c<pieces_per_column; c++){
			let y1 = jigsaw_box.top
			let y2 = jigsaw_box.bottom;
			let x = jigsaw_box.left + c * (jigsaw_box.getWidth()/pieces_per_column);
			let line = new fabric.Line([x, y1, x, y2],{
				stroke: 'gray',
				strokeWidth: Math.ceil(CF.width/500),
				visible: false,
				selectable:false,
				hasBorders: false,
				hasRotatingPoint: false,
				hasControls: false
			});
			objs_columnLine.push( line );
			CF.add(line);
			// draw the last line
			if( c === pieces_per_column-1 ){
				x = jigsaw_box.right;
				let lastLine = new fabric.Line([x, y1, x, y2],{
					stroke: 'gray',
					strokeWidth: Math.ceil(CF.width/500),
					visible: false,
					selectable:false,
					hasBorders: false,
					hasRotatingPoint: false,
					hasControls: false
				});
				objs_columnLine.push( lastLine );
				CF.add(lastLine);
			}
		}
	}
	// calculate size and position of jigsawBox, accroding to ints_border_of_bg
	function calcJigsawBox(){
		let increment = Math.floor(CF.width/50);
		let centerPoint = ints_border_of_bg.getCenterPoint();
		jigsaw_box.set( centerPoint.y, centerPoint.y, centerPoint.x, centerPoint.x );
		while( true ){
			if( jigsaw_box.left - increment < ints_border_of_bg.left 
			  || jigsaw_box.right + increment > ints_border_of_bg.right 
			  || jigsaw_box.top - increment < ints_border_of_bg.top 
			  || jigsaw_box.bottom + increment > ints_border_of_bg.bottom ){
				break;
			}
			jigsaw_box.increaseSize(increment);
		}
	}

	// generate jigsaw
	function generateJigsaw(){
		for( let rowCount=0; rowCount<pieces_per_row; rowCount++ ){
			for( let columnCount=0; columnCount<pieces_per_column; columnCount++ ){
				// pile answerString
				answerString += ""+rowCount+""+columnCount;

				// new a canvasin order to create a partition of image
				let tempCanvas = document.createElement("canvas");
				let canvasId = "tempImgCanvas"+rowCount+""+columnCount;
				tempCanvas.id = canvasId;
				tempCanvas.width = jigsaw_box.getWidth()/pieces_per_column;
				tempCanvas.height = jigsaw_box.getHeight()/pieces_per_row;
				document.body.appendChild( tempCanvas );
				let tempCF = new fabric.StaticCanvas(canvasId);

				// draw image on the temp canvas
				let img = new Image();
				img.src = srcUrl;
				img.onload = function(){
					let imgInstance = new fabric.Image(img, {
						left: (-1)*(columnCount * jigsaw_box.getWidth()/pieces_per_column),
						top: (-1)*(rowCount * jigsaw_box.getHeight()/pieces_per_row),
						width: jigsaw_box.getWidth(),
						height: jigsaw_box.getHeight(),
						originX: 'left',
						originY: 'top',
						hasBorders: false,
						hasRotatingPoint: false,
						hasControls: false,
						clipTo: function(ctx){
							ctx.rect(
								columnCount * jigsaw_box.getWidth()/pieces_per_column - jigsaw_box.getWidth()/2,
								rowCount * jigsaw_box.getHeight()/pieces_per_row - jigsaw_box.getHeight()/2,
								jigsaw_box.getWidth()/pieces_per_column,
								jigsaw_box.getHeight()/pieces_per_row
							);              
						}
					});
					tempCF.add( imgInstance );
					tempCF.renderAll();

					// convert image to dataUrl
					let data = tempCF.toDataURL('png');
					// Then create an image object on the main canvas
					let newImg = new Image();
					newImg.src = data;
					newImg.onload = function(){
						let newImgInstance = new fabric.Image( newImg, {
							left: fabric.util.getRandomInt(ints_border_of_bg.left, ints_border_of_bg.right - jigsaw_box.getWidth()/pieces_per_column),
							top: fabric.util.getRandomInt(ints_border_of_bg.top, ints_border_of_bg.bottom - jigsaw_box.getHeight()/pieces_per_row),
							width: jigsaw_box.getWidth()/pieces_per_column,
							height: jigsaw_box.getHeight()/pieces_per_row,
							originX: 'left',
							originY: 'top',
							hasBorders: false,
							hasRotatingPoint: false,
							hasControls: false
						});
						let borderPath = new fabric.Path(
							'M '+newImgInstance.left+' '+newImgInstance.top+' '+
							'L '+(newImgInstance.left+newImgInstance.width)+' '+newImgInstance.top+' '+
							'L '+(newImgInstance.left+newImgInstance.width)+' '+(newImgInstance.top+newImgInstance.height)+' '+
							'L '+newImgInstance.left+' '+(newImgInstance.top+newImgInstance.height)+' z'
						);
						borderPath.set({
							hasBorders: false,
							hasRotatingPoint: false,
							hasControls: false,
							selectable: false,
							stroke: '#6D6875',
							strokeWidth: Math.ceil(CF.width/500),
							fill: 'rgba(0,0,0,0)'
						});
						var group = new fabric.Group([ borderPath, newImgInstance ], {
							left: newImgInstance.left,
							top: newImgInstance.top,
							hasBorders: false,
							hasRotatingPoint: false,
							hasControls: false,
							visible: false,
							jigsawNumber: rowCount+""+columnCount, // differentiate jigsaws
							isInPosition: false, // wheather this jigsaw was dropped into a position
							lastPositionIndex: {row:null, col:null} // store the last position index
						});
						CF.add( group );
						// store jigsaw instance and initialize booleans_jigsawRoom
						if( !objs_jigsaw[rowCount] ){
							objs_jigsaw[rowCount] = [];
							booleans_jigsawRoom[rowCount] = [];
						}
						objs_jigsaw[rowCount][columnCount] = group;
						booleans_jigsawRoom[rowCount][columnCount] = false;
					}

					// remove temp canvas
					imgInstance = null;
					img = null;
					tempCanvas = null;
					tempCF = null;
					$("#"+canvasId).remove();
				}
			}
		}
		// add object:modified event for moving jigsaws
		CF.on('object:modified', dropJigsaw );
		// add click event for bringToFront
		CF.on('mouse:down', topTheChosenJigsaw );
	}
	// object:modified event for moving jigsaws
	function dropJigsaw(e) {
		if( e.target ){
			let check = isObjectInside2DArray( e.target, objs_jigsaw );
			// confirm that jigsaw was moved
			if( check.answer ){
				let mouseCoordinate = CF.getPointer(e.e);
				positionJigsaw( e.target, mouseCoordinate );
			}
		}
	}
	// click event for bringToFront
	function topTheChosenJigsaw(e) {
		if( e.target ){
			let check = isObjectInside2DArray( e.target, objs_jigsaw );
			// confirm that jigsaw was click
			if( check.answer ){
				CF.bringToFront( objs_jigsaw[check.dimension1][check.dimension2] );
				CF.renderAll();
			}
		}
	}
	// check if the object is inside the 2-dimensional array
	function isObjectInside2DArray( obj, array2D ){
		for(let c=0, len=array2D.length; c<len; c++){
			for(let c1=0, len1=array2D[c].length; c1<len1; c1++){
				if( obj === array2D[c][c1] ){
					return { answer:true, dimension1:c, dimension2:c1 };
				}
			}
		}
		return { answer:false };
	}
	// position jigsaw into jigsaw box ( if it was dropped inside jigsaw box )
	function positionJigsaw( obj, mouseCoor ){
		// clear last position flag
		if( obj.isInPosition ){
			obj.isInPosition = false;
			booleans_jigsawRoom[ obj.lastPositionIndex.row ][ obj.lastPositionIndex.col ] = false;
			obj.lastPositionIndex.row = null;
			obj.lastPositionIndex.col = null;
		}
		// check position
		for( let rowCount=0; rowCount<pieces_per_row; rowCount++ ){
			let busted = false; // for break nested loop
			for( let columnCount=0; columnCount<pieces_per_column; columnCount++ ){
				// only check on the empty room
				if( !booleans_jigsawRoom[ rowCount ][ columnCount ] ){
					let x1 = jigsaw_box.left 	+ columnCount		* jigsaw_box.getWidth()/pieces_per_column;
					let x2 = jigsaw_box.left 	+ (+columnCount+1)	* jigsaw_box.getWidth()/pieces_per_column;
					let y1 = jigsaw_box.top		+ rowCount			* jigsaw_box.getHeight()/pieces_per_row;
					let y2 = jigsaw_box.top		+ (+rowCount+1)		* jigsaw_box.getHeight()/pieces_per_row;

					if( mouseCoor.x > x1 && mouseCoor.x < x2 
					  && mouseCoor.y > y1 && mouseCoor.y <y2 ){
						obj.set({
							left: x1,
							top: y1,
							isInPosition: true,
							lastPositionIndex: {row:rowCount, col:columnCount}
						});
						booleans_jigsawRoom[ rowCount ][ columnCount ] = true;
						obj.setCoords();
						CF.renderAll();
						busted = true;
						break;
					}
				}
			}
			if(busted)
				break;
		}
	}
	// check whether all jigsaw is in correct position
	function checkCorrect(){
		for( let rowCount=0; rowCount<pieces_per_row; rowCount++ ){
			for( let columnCount=0; columnCount<pieces_per_column; columnCount++ ){
				let jigsawLastPosition = objs_jigsaw[rowCount][columnCount].lastPositionIndex.row + "" + objs_jigsaw[rowCount][columnCount].lastPositionIndex.col;
				if( objs_jigsaw[rowCount][columnCount].jigsawNumber !== jigsawLastPosition){
					return false;
				}
			}
		}
		return true;
	}
	// total amount of jigsaw that in the right position
	function sumCorrectJigsaw(){
		let sum = 0;
		for( let rowCount=0; rowCount<pieces_per_row; rowCount++ ){
			for( let columnCount=0; columnCount<pieces_per_column; columnCount++ ){
				let jigsawLastPosition = objs_jigsaw[rowCount][columnCount].lastPositionIndex.row + "" + objs_jigsaw[rowCount][columnCount].lastPositionIndex.col;
				if( objs_jigsaw[rowCount][columnCount].jigsawNumber === jigsawLastPosition){
					sum++;
				}
			}
		}
		return sum;
	}
	// preload images of mini game
	async function preloadJigsawGameImage(){
		await Promise.all([
			loadBG()
		]);

		await Promise.all([
			load_obj_promptImg(),
			load_obj_iGotIt(),
			load_obj_return()
		]);

		// randomly set rows and column of jigsaw. argu:(rowRange, columnRange)
		setRowAndColumn(
			{min:MIN_ROWS, max:MAX_ROWS},
			{min:MIN_COLUMNS, max:MAX_COLUMNS}
		);

		load_obj_rule();

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
				
				startJigsaw();
			}
		}

		// draw obj_jigsawBackground object
		async function loadBG(){
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_jigsaw/game_background.png',
					function( img ) {
						img.isLink = false;
						obj_jigsawBackground = img;
						obj_jigsawBackground.setOpacity(0.9);
						CF.add(obj_jigsawBackground);
						console.log("[preload minigame] loaded obj_jigsawBackground image");

						let bgScale = getScaleValue(obj_jigsawBackground);
						ints_padding_of_bg = {
							up: bgScale * 240,
							down: bgScale * 100,
							left: bgScale * 150,
							right: bgScale * 150
						}

						ints_border_of_bg.left = obj_jigsawBackground.left - obj_jigsawBackground.width/2 + ints_padding_of_bg.left;
						ints_border_of_bg.top = obj_jigsawBackground.top - obj_jigsawBackground.height/2 + ints_padding_of_bg.up;
						ints_border_of_bg.right = obj_jigsawBackground.left + obj_jigsawBackground.width/2 - ints_padding_of_bg.right;
						ints_border_of_bg.bottom = obj_jigsawBackground.top + obj_jigsawBackground.height/2 - ints_padding_of_bg.down;

						// calculate size and position of jigsawBox, accroding to ints_border_of_bg
						calcJigsawBox();
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
						width: convertSizeToCustomRange(3714, 2450, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).width,
						height: convertSizeToCustomRange(3714, 2450, BG_WIDTH_IN_CANVAS, BG_HEIGHT_IN_CANVAS).height
					}
				);
			});
		}

		// draw obj_promptImg object
		async function load_obj_promptImg(){
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					srcUrl,
					function( img ) {
						img.isLink = false;
						obj_promptImg = img;
						CF.add(obj_promptImg);
						console.log("[preload minigame] loaded obj_promptImg image");
						resolve();
					},{
						visible: false,
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originX: 'left',
						originY: 'top',
						left: jigsaw_box.left,
						top: jigsaw_box.top,
						width: jigsaw_box.getWidth(),
						height: jigsaw_box.getHeight()
					}
				);
			});
		}


		// draw obj_iGotIt object
		async function load_obj_iGotIt(){
			let bgScale = getScaleValue(obj_jigsawBackground);
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_jigsaw/start_game_btn.png',
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
						width: bgScale * 608 * SCALE_OF_I_GOT_IT,
						height: bgScale * 238 * SCALE_OF_I_GOT_IT,
						left: CF.width/2,
						top: ints_border_of_bg.bottom
					}
				);
			});
		}

		// draw obj_rule object
		function load_obj_rule(){
			let second = pieces_per_row*pieces_per_column*2;
			obj_rule = new fabric.Text( `遊戲規則：\n　請記住圖片原本的樣子\n　用滑鼠將拼圖移至正確的位置\n　越快完成拼圖，分數越高！`, {
				fontFamily: "globalFont",
				left: ints_border_of_bg.left,
				top: ints_border_of_bg.top,
				originX: "left",
				originY: "top",
				fontFamily: "globalFont",
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				opacity: 0.9
			});
			let ruleRect = obj_rule.getBoundingRect();
			let ruleRatio = ruleRect.width / ruleRect.height;
			let borderRatio = ints_border_of_bg.getWidth() / ints_border_of_bg.getHeight();
			if( ruleRatio > borderRatio ){
				obj_rule.scaleToWidth( ints_border_of_bg.getWidth() );
			}else{
				obj_rule.scaleToHeight( ints_border_of_bg.getHeight() );
			}
			CF.add( obj_rule );
			CF.bringToFront(obj_rule);
		}

		// draw obj_return object
		async function load_obj_return(){
			let bgScale = getScaleValue(obj_jigsawBackground);
			return new Promise(function (resolve, reject) {
				fabric.Image.fromURL(
					'./images/mini_jigsaw/back_to_mono.png',
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
						originY: 'bottom',
						width: bgScale * 633 * SCALE_OF_RETURN,
						height: bgScale * 246 * SCALE_OF_RETURN,
						left: CF.width/2,
						top: ints_border_of_bg.bottom
					}
				);
			});
		}
	}
}