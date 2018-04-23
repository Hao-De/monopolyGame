/* object for SelectCharacterScene */
let obj_returnGameMainMenuBtn;
/* objects array for SelectCharacterScene */
let objs_character = new Array();
// selected character index
let ints_selectedCharacterIndex = [null, null];

let obj_charName = [];

let checkSignForCharSample;

// CF : canvas_fabric object
function prepareForSelectCharacterScene( CF ){
	objs_character = [];
	CF.clear();

	let loadCheckSign = async ()=>{
		return new Promise(function (resolve, reject) {
			// create checkSignForCharSample sign
			fabric.Image.fromURL(
				'./images/charecter/checked.png',
				function( img ) {
					checkSignForCharSample = img;
					resolve();
				},{
					visible: false,
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					originX: 'center',
					originY: 'bottom',
					isLink: false
				}
			);
		});
	};

	// draw background object
	setBackground("./images/charecter/pick_char_background.png", 3590 , 2198);// FUTURE 擴充參數 select char bg

	let charData = [
		{ 
			x: calculatePoint(568,1600).x, 
			y: calculatePoint(568,1600).y,
			width: convertSizeToCurrentBackground(555,0).x * 0.9,
			height: convertSizeToCurrentBackground(0,1220).y * 0.9,
			centerOffset_x: convertSizeToCurrentBackground(30,0).x,
			nameOffset_y: convertSizeToCurrentBackground(50,0).x
		},
		{ 
			x: calculatePoint(1386,1600).x,
			y: calculatePoint(1386,1600).y,
			width: convertSizeToCurrentBackground(555,0).x * 0.9,
			height: convertSizeToCurrentBackground(0,1220).y * 0.9,
			centerOffset_x: 0,
			nameOffset_y: convertSizeToCurrentBackground(50,0).x
		},
		{ 
			x: calculatePoint(2204,1600).x,
			y: calculatePoint(2204,1600).y,
			width: convertSizeToCurrentBackground(555,0).x * 0.9,
			height: convertSizeToCurrentBackground(0,1220).y * 0.9,
			centerOffset_x: 0,
			nameOffset_y: convertSizeToCurrentBackground(50,0).x
		},
		{ 
			x: calculatePoint(3000,1600).x,
			y: calculatePoint(3000,1600).y,
			width: convertSizeToCurrentBackground(665,0).x * 0.9,
			height: convertSizeToCurrentBackground(0,1205).y * 0.9,
			centerOffset_x: convertSizeToCurrentBackground(70,0).x,
			nameOffset_y: convertSizeToCurrentBackground(50,0).x
		}
	];

	// load characters after checksign loaded completely
	(async ()=>{
		await loadCheckSign();
		for( let c=0, len=CHARACTER_DEFAULT_NAME.length; c<len; c++ ){
			// draw character object
			fabric.Image.fromURL(
				'./images/charecter/char'+(c+1)+'.png',
				function( img ) {
					objs_character[c] = img;
					img.isLink = true;
					img.myCheckSign = fabric.util.object.clone( checkSignForCharSample );
					img.myCheckSign.set({
						left: img.getLeft() + charData[c].centerOffset_x,
						top: img.getTop() - img.getHeight(),
						width: img.getWidth()/2,
						height: img.getWidth()/2
					});
					if(ints_selectedCharacterIndex.indexOf(c)!=-1){
						img.isSelectedCharacter = true;
						img.myCheckSign.setVisible(true);
					}

					obj_charName[c] = new fabric.Text( CHARACTER_DEFAULT_NAME[c], {
						fontFamily: "globalFont",
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originY: 'top',
						originX: 'center',
						left: charData[c].x + charData[c].centerOffset_x,
						top: charData[c].y + charData[c].nameOffset_y,
						fontSize: convertSizeToCurrentBackground(90,0).x
					});

					CF.add( img );
					CF.add(img.myCheckSign);
					CF.add(obj_charName[c]);
					CF.renderAll();
				},{
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					originX: 'center',
					originY: 'bottom',
					left: charData[c].x,
					top: charData[c].y,
					width: charData[c].width,
					height: charData[c].height
				}
			);
		}
	})();

	// draw returnBtn object
	fabric.Image.fromURL(
		'./images/charecter/start_game_btn.png',
		function( img ) {
			CF.add( img );
			img.isLink = true;
			obj_returnGameMainMenuBtn = img;
			CF.bringToFront(img);
		},{
			selectable: false,
			hasControls: false,
			hasBorders: false,
			hasRotatingPoint: false,
			originX: 'center',
			originY: 'center',
			left: canvas_fabric.getWidth()/2,
			top: calculatePoint(0,1900).y,
			width: BG_WIDTH_IN_CANVAS*613/ORI_BG_WIDTH *1,
			height: BG_WIDTH_IN_CANVAS*233/ORI_BG_WIDTH *1
		}
	);

	CF.on('mouse:down', function(e) {
		if(objs_character.indexOf(e.target) !== -1){ // when click on the characters
			if(ints_selectedCharacterIndex[0] == objs_character.indexOf(e.target)){ // if player clicked the chosen character 1
				ints_selectedCharacterIndex[0] = null; // unset the first player image
				e.target.isSelectedCharacter = false;
				e.target.myCheckSign.setVisible(false);
			}else if(ints_selectedCharacterIndex[1] == objs_character.indexOf(e.target)){ // if player clicked the chosen character 2
				ints_selectedCharacterIndex[1] = null; // unset the second player image
				e.target.isSelectedCharacter = false;
				e.target.myCheckSign.setVisible(false);
			}
			else if( ints_selectedCharacterIndex[0] == null ){ // if player has not selected
				ints_selectedCharacterIndex[0] = objs_character.indexOf(e.target); // set the first player image to the character which player chose.
				e.target.isSelectedCharacter = true;
				e.target.myCheckSign.setVisible(true);
			}else if( (ints_selectedCharacterIndex[0] != null) && (ints_selectedCharacterIndex[1] == null) ){ // if player has not selected the second character
				ints_selectedCharacterIndex[1] = objs_character.indexOf(e.target); // set the second player image to the character which player chose.
				e.target.isSelectedCharacter = true;
				e.target.myCheckSign.setVisible(true);
			}else if( (ints_selectedCharacterIndex[0] != null) && (ints_selectedCharacterIndex[1] != null) ){ // if player has selected both character
				// do nothing
			}
			CF.renderAll();
		}
		// when click on the return button
		if( e.target === obj_returnGameMainMenuBtn ){
			removeAllClickEventOfFabricCanvas();
			CF.clear();
			canvas_fabric.remove( obj_background );
			document.body.style.backgroundColor =  'rgba(0,0,0,0)';
//			prepareForGameStartScene( CF );

			startLoadMainGame();
		}
	});
}