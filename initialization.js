"use strict";
/****************************
******** Initialize ********
****************************/
$(document).ready(function($){
	console.log("clear console.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
	// progress layer
	let progressCanvas 	= document.getElementById("progressCanvas");
	// layer 0 : background and status
	canvas_js 			= document.getElementById("backgroundLayerCanvas"); 
	// layer 1 : objects on the map. e.g., characters, mascot.
	canvas_object_js 	= document.getElementById("objectLayerCanvas");
	// layer 2 : window of episode (event). e.g., event, question, shop.
	canvas_episode_js 	= document.getElementById("episodeLayerCanvas");
	// layer 3 : mini game. (usually invisible)
	canvas_minigame_js 	= document.getElementById("minigameLayerCanvas");
	// layer 4 : end canvas.
	canvas_end_js = document.getElementById("endCanvas");
	
	// initial size of canvas
	let viewWidth = $(document).width();
	let viewHeight = $(document).height();
	
//	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//		console.log("test-phone");
//		viewWidth = screen.width;
//		viewHeight = screen.height;
//	}else{
//		console.log("test-web");
//		viewWidth = window.innerWidth;
//		viewHeight = window.innerHeight;
//	}
//	canvas_js.width = window.innerWidth;
//	canvas_js.height = window.innerHeight;
	
//	console.log("test-clientWidth", document.body.clientWidth,document.body.clientHeight);
//	console.log("test-window", window.innerWidth,window.innerHeight);
//	console.log("test-screen", screen.width,screen.height);
	
	// set width and height of all layer canvas
	canvas_js.width = 
		progressCanvas.width = 
		canvas_object_js.width = 
		canvas_episode_js.width = 
		canvas_minigame_js.width = 
		canvas_end_js.width = viewWidth;
	canvas_js.height = 
		progressCanvas.height = 
		canvas_object_js.height = 
		canvas_episode_js.height = 
		canvas_minigame_js.height = 
		canvas_end_js.height = viewHeight;
	
	canvas_fabric = new fabric.Canvas(
		'backgroundLayerCanvas', 
		{
			renderOnAddRemove:false,
			selection: false,
			stateful: false
		}
	);
	canvas_object_fabric = new fabric.Canvas(
		'objectLayerCanvas', 
		{
			renderOnAddRemove:false,
			selection: false,
			stateful: false
		}
	);
	canvas_episode_fabric = new fabric.Canvas(
		'episodeLayerCanvas', 
		{
			renderOnAddRemove:false,
			selection: false,
			stateful: false
		}
	);
	canvas_minigame_fabric = new fabric.Canvas(
		'minigameLayerCanvas', 
		{
			renderOnAddRemove:false,
			selection: false,
			stateful: false
		}
	);
	canvas_end_fabric = new fabric.Canvas(
		'endCanvas', 
		{
			renderOnAddRemove:false,
			selection: false,
			stateful: false
		}
	);
//	console.log("test-canvas_js", canvas_js.width,canvas_js.height);
//	console.log("test-canvas_fabric", canvas_fabric.width,canvas_fabric.height);
	
	// layer canvas( i.e. set z-index to fabric canvas )
	$("#backgroundLayerCanvas").parent().css({
		'z-index': 0,
		position: "absolute",
		left: 0,
		top: 0
	});
	$("#objectLayerCanvas").parent().css({
		'z-index': 1,
		position: "absolute",
		left: 0,
		top: 0
	});
	$("#episodeLayerCanvas").parent().css({
		'z-index': 2,
		position: "absolute",
		left: 0,
		top: 0
	});
	$("#minigameLayerCanvas").parent().css({
		'z-index': 3,
		position: "absolute",
		left: 0,
		top: 0,
		display: 'none'
	});
	$("#endCanvas").parent().css({
		'z-index': 4,
		position: "absolute",
		left: 0,
		top: 0,
		display: 'none'
	});
	progressCanvas.style.display = 'none';
	prepareForSelectCharacterScene( canvas_episode_fabric );
	
	
	
	/****************************************
	 ******** scale when mouse over *********
	 ****************************************/
	if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
		canvas_episode_fabric.on('mouse:over', function(e) {
			if( e.target && e.target.isLink && !e.target.isSelectedCharacter ){
				e.target.setScaleX(1.1);
				e.target.setScaleY(1.1);
				canvas_episode_fabric.renderAll();
				setCursorOnCanvas( canvas_episode_fabric, 'pointer');
			}
		});
		canvas_episode_fabric.on('mouse:out', function(e) {
			if( e.target && e.target.isLink && !e.target.isSelectedCharacter ){
				e.target.setScaleX(1);
				e.target.setScaleY(1);
				canvas_episode_fabric.renderAll();
				setCursorOnCanvas( canvas_episode_fabric, 'default');
			}
		});
		canvas_minigame_fabric.on('mouse:over', function(e) {
			if( e.target && e.target.isLink && !e.target.isSelectedCharacter ){
				e.target.setScaleX(1.1);
				e.target.setScaleY(1.1);
				canvas_minigame_fabric.renderAll();
				setCursorOnCanvas( canvas_minigame_fabric, 'pointer');
			}
		});
		canvas_minigame_fabric.on('mouse:out', function(e) {
			if( e.target && e.target.isLink && !e.target.isSelectedCharacter ){
				e.target.setScaleX(1);
				e.target.setScaleY(1);
				canvas_minigame_fabric.renderAll();
				setCursorOnCanvas( canvas_minigame_fabric, 'default');
			}
		});
		canvas_end_fabric.on('mouse:over', function(e) {
			if( e.target && e.target.isLink && !e.target.isSelectedCharacter ){
				e.target.setScaleX(1.1);
				e.target.setScaleY(1.1);
				canvas_end_fabric.renderAll();
				setCursorOnCanvas( canvas_end_fabric, 'pointer');
			}
		});
		canvas_end_fabric.on('mouse:out', function(e) {
			if( e.target && e.target.isLink && !e.target.isSelectedCharacter ){
				e.target.setScaleX(1);
				e.target.setScaleY(1);
				canvas_end_fabric.renderAll();
				setCursorOnCanvas( canvas_end_fabric, 'default');
			}
		});
	}

});
// load game after select charecter
function startLoadMainGame(){
	progressCanvas.style.display = 'block';
	progressCanvas.style.cursor = 'wait';
	let ctx = progressCanvas.getContext('2d');
	let cw = progressCanvas.width;
	let ch = progressCanvas.height;
	let circ = Math.PI * 2;
	let quart = Math.PI / 2;
	ctx.lineCap = 'round';
	ctx.textAlign="center"; 
	ctx.font=((cw<ch)?cw/20:ch/20)+"px globalFont"; 
	let arcLineWidth = ((cw<ch)?cw/13:ch/13);
	var draw = function(current) {
		// clear canvas
		ctx.fillStyle = '#C9E4E7';
		ctx.fillRect(0, 0, cw,ch);
		// draw arc
		ctx.strokeStyle = '#99CC33';
		ctx.lineWidth = arcLineWidth;
		ctx.beginPath();
		ctx.arc(cw/2, ch/2, ((cw<ch)?cw/4:ch/4), -(quart), ((circ) * current) - quart, false);
		ctx.stroke();
		// draw text
		ctx.fillStyle = '#88cc00';
		if( current<1 ){
			ctx.fillText(Math.floor(current*100)+"%",cw/2,ch/2);
		}else{
			ctx.fillText("START",cw/2,ch/2);
		}
	};

	window._progressCount = 0;
	Object.defineProperty( window, 'progressCount', {
		get(){
			return window._progressCount;
		},
		set: function( val ) {
			window._progressCount = val;
			draw( val/TOTAL_IMAGE_COUNT );
			// when load conplete
			if( val === TOTAL_IMAGE_COUNT ){
				progressCanvas.style.cursor = 'pointer';
				progressCanvas.addEventListener("click",function(){
					// show start scene
					prepareForGameScene( canvas_fabric );
					progressCanvas.style.display = 'none';
					canvas_fabric.calcOffset();
					canvas_fabric.renderAll();
				});
			}
		}
	});
	window.progressCount = 0;

	// load font family
	let fontLoader = new FontLoader(['globalFont'], {
		fontLoaded: function(font) {
			console.log("[fontLoader] font loaded: " + font.family + ", " + font.style + ", " + font.weight);
			// preload some image
			preloadGameImage(); 
			// preload some audio
			preloadGameAudio();
			// handle job of classifying questions
			classifyQuestionBank();
			// draw background object
			setBackground("./images/map.png", 1600 , 931.79433368311, 
				function(){
					window.progressCount++; // increase progress counter of loading image
					correctPositionOfBlocks();
					preloadBlocksRelatedImage();
//					console.log("test-afterInit-clientWidth", document.body.clientWidth,document.body.clientHeight);
//					console.log("test-afterInit-window", window.innerWidth,window.innerHeight);
//					console.log("test-afterInit-screen", screen.width,screen.height);
//					console.log("test-afterInit-canvas_js", canvas_js.width,canvas_js.height);
//					console.log("test-afterInit-canvas_fabric", canvas_fabric.width,canvas_fabric.height);
				}
			);
		},
		complete: function(error) {
			if(error){
				console.log("[fontLoader] error:", error);
			}
		}
	}, 2000);
	fontLoader.loadFonts();

}