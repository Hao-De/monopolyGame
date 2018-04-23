function endGame(){
	let WIDTH_LARGER_THAN_HEIGHT = ( obj_endGameBG.getWidth() >= obj_endGameBG.getHeight() );
	let bgScale = getScaleValue(obj_endGameBG);
	let hasShowChartBefore = false,
		hasShowMainBefore = false,
		hasShowSubLayout = false,
		hasShowSubBefore = [], // length = length of mainClass
		hasShowQuesLayout = false;

	let padding = {//NOTE edit
		top: bgScale * 350,
		bottom: bgScale * 100,
		left: bgScale * 100,
		right: bgScale * 100
	}

	// this element exists in order to limit all element inside
	let elementRange = new fabric.Rect({
		left: obj_endGameBG.left,
		top: obj_endGameBG.top + (padding.top-padding.bottom)/2,
		width: obj_endGameBG.getWidth() - padding.left - padding.right,
		height: obj_endGameBG.getHeight() - padding.top - padding.bottom,
		selectable: false,
		hasControls: false,
		hasBorders: true,
		hasRotatingPoint: false,
		originY: 'center',
		originX: 'center',
	});

	for(let c=0, main_len=conceptSet.length; c<main_len; c++){
		hasShowSubBefore[ c ] = false;
	}
	let p1Name = CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[obj_player1.int_order]];
	let p2Name = CHARACTER_DEFAULT_NAME[ints_selectedCharacterIndex[obj_player2.int_order]];
	let endWord;
	let checkSignSample,
		alertPicSample,
		classButtonSample,
		classButtonWrongSample,
		classButtonCorrectSample,
		lastPageButtonSample,
		backToSubButtonSample,
		playAgainButtonSample,
		reviewButtonSample,
		seeBookButtonSample;

	let currentShowMainIndex,
		currentShowSubIndex;
	let url; // suggest link

	let group_groupOfSeeAnalysisBtn;	// button (to switch from ending word scene to chart scene)

	let chartCanvas, 					// the canvas drawing chart
		group_seeMain,					// button (to switch to main class scene)
		group_againBtn;					// button (to restart game)

	let mainclassTitle, 				// title (for main class scene)
		mainGroupBtnList = [], 			// button list (for main class scene)
		group_backToAnalysis;			// back button (for main class scene)

	let subclassTitle,					// title (for sub class scene)
		subGroupBtnList = [],			// button list (for sub class scene)
		group_backToMainScene;			// back button (for sub class scene)

	let QuesTitle,						// title (for question scene)
		group_backToSubScene,			// back button (for question scene)
		group_openLink,					// link button (for question scene, open link on new tab)
		btn_forwardQues,				// forward button (for question scene)
		btn_backwardQues;				// backward button (for question scene)

	$("#endCanvas").parent().css("display",'block');
	canvas_end_fabric.bringToFront(obj_endGameBG);

	// deal information
	endWord = "遊戲結束\n"+
		p1Name+"總資產："+obj_player1.int_score+"元\n"+
		p2Name+"總資產："+obj_player2.int_score+"元\n這次遊戲，";
	if(obj_player1.int_score > obj_player2.int_score){
		endWord += p1Name+"獲勝";
	}else if( obj_player1.int_score === obj_player2.int_score ){
		endWord += "兩方平手";
	}else{
		endWord += p2Name+"獲勝";
	}

	// create UI object
	let tempEventText = new fabric.Text( endWord, {
		fontFamily: "globalFont",
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false,
		originY: 'center',
		originX: 'center',
		left: canvas_fabric.width/2,
		top: canvas_fabric.height/2,
		fontSize: ( obj_endGameBG.getHeight()/12 ) * SCALE_OF_FONTSIZE
	});
	let text_seeAnalysisBtn = new fabric.Text( "點我觀看答題分析", {
		fontFamily: "globalFont",
		selectable: false,
		hasControls: false,
		hasBorders: false,
		hasRotatingPoint: false,
		originY: 'center',
		originX: 'center',
		left: canvas_fabric.width/2,
		top: canvas_fabric.height/2,
		fontSize: ( obj_endGameBG.getHeight()/15 ) * SCALE_OF_FONTSIZE
	});
	let rect_borderOfSeeAnalysisBtn = new fabric.Rect({
		left: text_seeAnalysisBtn.left,
		top: text_seeAnalysisBtn.top,
		width: text_seeAnalysisBtn.width + 20,
		height: text_seeAnalysisBtn.height + 20,
		fill: "rgba(0,0,200,0.4)",
		stroke: "black",
		strokeWidth: 5,
		selectable: false,
		hasControls: false,
		hasBorders: true,
		hasRotatingPoint: false,
		originY: 'center',
		originX: 'center'
	});
	group_groupOfSeeAnalysisBtn = new fabric.Group([ rect_borderOfSeeAnalysisBtn, text_seeAnalysisBtn ], {
		left: canvas_fabric.width/2,
		top: tempEventText.top + tempEventText.getHeight()/2 + text_seeAnalysisBtn.getHeight(),
		hasBorders: false,
		hasRotatingPoint: false,
		hasControls: false,
		selectable: false,
		originY: 'center',
		originX: 'center',
		isLink: true
	});

	// adding UI
	canvas_end_fabric.add(tempEventText);
	canvas_end_fabric.add(group_groupOfSeeAnalysisBtn);
	group_groupOfSeeAnalysisBtn.setCoords();
	canvas_end_fabric.renderAll();

	// preload some image
	preloadChartImage();

	// add UI event
	group_groupOfSeeAnalysisBtn.on('mousedown', function(e){
		let handlerForShowChart = this;
		if( e.target === group_groupOfSeeAnalysisBtn ){
			group_groupOfSeeAnalysisBtn.off('mousedown', handlerForShowChart);
			canvas_end_fabric.remove( tempEventText, group_groupOfSeeAnalysisBtn );
			showChartScene();
		}
	} );

	function showChartScene(){
		console.log("[chart] showChartScene");
		if( hasShowChartBefore ){
			chartCanvas.style.display = 'block';
			group_againBtn.set({visible:true});
			group_seeMain.set({visible:true});
			canvas_end_fabric.renderAll();
		}else{
			// show chart
			chartCanvas = createChart();

			// create UI object
			group_seeMain = fabric.util.object.clone( reviewButtonSample );
			group_seeMain.set({
				left: canvas_fabric.width/2 + elementRange.getWidth()*1/4,
				top: elementRange.getTop() + elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				width: reviewButtonSample.getWidth() * bgScale,
				height: reviewButtonSample.getHeight() * bgScale
			});

			group_againBtn = fabric.util.object.clone( playAgainButtonSample );
			group_againBtn.set({
				left: canvas_fabric.width/2 - elementRange.getWidth()*1/4,
				top: elementRange.getTop() + elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				width: playAgainButtonSample.getWidth() * bgScale,
				height: playAgainButtonSample.getHeight() * bgScale
			});

			// adding UI
			canvas_end_fabric.add( group_seeMain );
			canvas_end_fabric.add( group_againBtn );
			canvas_end_fabric.renderAll();

			// add button event
			group_againBtn.on('mousedown', function(){
				// refresh the page
				document.location = document.location;
			});
			group_seeMain.on('mousedown', function(){
				// hide chartCanvas
				chartCanvas.style.display = 'none';
				group_againBtn.set({visible:false});
				group_seeMain.set({visible:false});
				showMainclassScene();
			});
			// set flag
			hasShowChartBefore = true;
		}
	}

	function showMainclassScene(){
		console.log("[chart] showMainclassScene");
		/* -----------
		 * |  title  |  1/5
		 * |---------|
		 * |    R    |
		 * |    O    |  3/5
		 * |    W    |
		 * |    S    |
		 * |---------|
		 * | buttons |  1/5
		 * -----------
		 */
		if( hasShowMainBefore ){
			mainclassTitle.set({'visible':true});
			group_backToAnalysis.set({'visible':true});
			for(let c=0, main_len=mainGroupBtnList.length; c<main_len; c++){
				mainGroupBtnList[c].set({'visible':true});
			}
			canvas_end_fabric.renderAll();
		}else{
			// title
			mainclassTitle = new fabric.Text("選擇題目概念",{
				left: canvas_end_fabric.width/2,
				top: elementRange.getTop() - elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				fontFamily: "globalFont",
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originY: 'center',
				originX: 'center',
				fontSize: Math.floor( obj_endGameBG.getHeight()/15 ) * SCALE_OF_FONTSIZE
			});
			canvas_end_fabric.add( mainclassTitle );

			// rows
			let rows = Math.ceil( conceptSet.length/2 );
			let intervalBetweenRowBTN = Math.floor( elementRange.getHeight()*( 3/5 * 1/rows ) );
			for(let c=0, main_len=conceptSet.length; c<main_len; c++){
				let col = c%2;
				let mainclassWord = conceptSet[ c ].title + "　";
				if( conceptSet[c].totalAskedAmount ){
					mainclassWord += Math.round( 100*( conceptSet[c].totalCorrectAmount/conceptSet[c].totalAskedAmount ) ) + "%";
				}else{
					mainclassWord += "---%";
				}

				let gapBetweenAskedAndCorrect = conceptSet[c].totalAskedAmount - conceptSet[c].totalCorrectAmount;
				let tempBorder;
				// change button look accroding to the correct answer
				if( gapBetweenAskedAndCorrect > 0 ){
					tempBorder = fabric.util.object.clone( classButtonWrongSample );
				}else if( gapBetweenAskedAndCorrect == 0 && conceptSet[c].totalAskedAmount > 0 ){
					tempBorder = fabric.util.object.clone( classButtonCorrectSample );
				}else{
					tempBorder = fabric.util.object.clone( classButtonSample );
				}

				tempBorder.set({
					width: Math.floor( elementRange.getWidth()/2 - elementRange.getWidth()/5 ),
					height: intervalBetweenRowBTN - Math.floor( elementRange.getWidth()/24 ),
					selectable: false,
					hasControls: false,
					hasBorders: true,
					hasRotatingPoint: false,
					originY: 'center',
					originX: 'center'
				});
				// main class name
				let tempText = new fabric.Text( mainclassWord, {
					width: tempBorder.getWidth(),
					height: tempBorder.getHeight(),
					fontFamily: "globalFont",
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
					originY: 'center',
					originX: 'center',
					fontSize: Math.floor( obj_endGameBG.height/17 ) * SCALE_OF_FONTSIZE
				});
				// draw alert image object
				let alertPic = fabric.util.object.clone( alertPicSample );
				alertPic.set({
					visible: (gapBetweenAskedAndCorrect>0),
					top: (-1)*tempText.getHeight(),
					width: tempText.getHeight(),
					height: tempText.getHeight()
				});
				let tempGroup = new fabric.Group( [ tempBorder, tempText, alertPic ], {
					left: canvas_fabric.getWidth()/2 + (2 * col - 1) * elementRange.getWidth()*1/4,
					top: elementRange.getTop() + elementRange.getHeight()*( 1/5 - 1/2 ) + (Math.floor(c/2)+1/2)*intervalBetweenRowBTN,
					hasBorders: false,
					hasRotatingPoint: false,
					hasControls: false,
					selectable: false,
					originY: 'center',
					originX: 'center',
					isLink: true
				});
				// add button event
				tempGroup.on('mousedown', function(){
					// hide elements of this scene
					hideMainElement();
					if( 'subClass' in conceptSet[c] && typeof(conceptSet[c].subClass)!=='undefined' ){
						showSubclassScene( c );
					}else{ // if the main class contains no subclass, then skip subclass scene
						;// showQuesScene( c, null );
					}
				});
				mainGroupBtnList.push( tempGroup );
				canvas_end_fabric.add( tempGroup );
			}
			// buttons
			// create UI object
			group_backToAnalysis = fabric.util.object.clone( lastPageButtonSample );
			group_backToAnalysis.set({
				left: canvas_end_fabric.width/2,
				top: elementRange.getTop() + elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				width: lastPageButtonSample.getWidth() * bgScale,
				height: lastPageButtonSample.getHeight() * bgScale
			});

			// adding UI
			canvas_end_fabric.add( group_backToAnalysis );
			canvas_end_fabric.renderAll();
			// add button event
			group_backToAnalysis.on('mousedown', function(){
				// hide elements of this scene
				hideMainElement();
				showChartScene();
			});

			// set flag
			hasShowMainBefore = true;
		}
	}

	function hideMainElement(){
		console.log("[chart] hideMainElement");
		mainclassTitle.set({'visible':false});
		group_backToAnalysis.set({'visible':false});
		for(let c=0, main_len=mainGroupBtnList.length; c<main_len; c++){
			mainGroupBtnList[c].set({'visible':false});
		}
	}

	function showSubclassScene( mainIndex ){
		console.log("[chart] showSubclassScene",mainIndex);
		// show title and back button
		if( hasShowSubLayout ){
			subclassTitle.set({'visible':true});
			group_backToMainScene.set({'visible':true});
		}
		else{
			// title
			subclassTitle = new fabric.Text("選擇次概念",{
				left: canvas_end_fabric.width/2,
				top: elementRange.getTop() - elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				fontFamily: "globalFont",
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originY: 'center',
				originX: 'center',
				fontSize: Math.floor( obj_endGameBG.getHeight()/15 ) * SCALE_OF_FONTSIZE
			});
			canvas_end_fabric.add( subclassTitle );
			// buttons
			// create UI object
			group_backToMainScene = fabric.util.object.clone( lastPageButtonSample );
			group_backToMainScene.set({
				left: canvas_end_fabric.width/2,
				top: elementRange.getTop() + elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				width: lastPageButtonSample.getWidth() * bgScale,
				height: lastPageButtonSample.getHeight() * bgScale
			});

			// adding UI
			canvas_end_fabric.add( group_backToMainScene );
			canvas_end_fabric.renderAll();
			// add button event
			group_backToMainScene.on('mousedown', function(){
				// hide elements of this scene
				hideSubElement();
				showMainclassScene();
			});
			hasShowSubLayout = true;
		}
		// show sub button grid layout
		if( hasShowSubBefore[mainIndex] ){
			for(let c=0, sub_len=subGroupBtnList[mainIndex].length; c<sub_len; c++){
				subGroupBtnList[mainIndex][c].set({'visible':true});
			}
		}else{
			subGroupBtnList[mainIndex] = [];

			if( conceptSet[mainIndex].subClass!==null && conceptSet[mainIndex].subClass.length>0 ){
				// rows
				let rows = WIDTH_LARGER_THAN_HEIGHT? 2 : Math.ceil( conceptSet[mainIndex].subClass.length/2 ) ;
				let cols = WIDTH_LARGER_THAN_HEIGHT? Math.ceil( conceptSet[mainIndex].subClass.length/2 ) : 2 ;
				let intervalBetweenRowBTN = Math.floor( elementRange.getHeight()*( 3/5 * 1/rows ) );
				let intervalBetweenColBTN = Math.floor( elementRange.getWidth()/cols );
				for(let c=0, sub_len=conceptSet[mainIndex].subClass.length; c<sub_len; c++){
					let col = c % cols;
					let row = Math.floor( c / cols );
					let gapBetweenAskedAndCorrect = conceptSet[mainIndex].subClass[c].totalAskedAmount - conceptSet[mainIndex].subClass[c].totalCorrectAmount;
					let alertPic = null; // alert image
	//				let fillColor  = "#FCD59B"; // default color
	//				fillColor = (gapBetweenAskedAndCorrect>0)? "#F23557" : fillColor ; // set color if has wrong answer
	//				fillColor = ( gapBetweenAskedAndCorrect==0 && conceptSet[mainIndex][c].totalAskedAmount>0 )? "rgba(0,255,0,1)" : fillColor ; // set color if all the answer is correct

					let tempBorder;
					// change button look accroding to the correct answer
					if( gapBetweenAskedAndCorrect > 0 ){
						tempBorder = fabric.util.object.clone( classButtonWrongSample );
					}else if( gapBetweenAskedAndCorrect == 0 && conceptSet[mainIndex].subClass[c].totalAskedAmount > 0 ){
						tempBorder = fabric.util.object.clone( classButtonCorrectSample );
					}else{
						tempBorder = fabric.util.object.clone( classButtonSample );
					}
					tempBorder.set({
						width: intervalBetweenColBTN - elementRange.getWidth()/50,
						height: intervalBetweenRowBTN - Math.floor( elementRange.getWidth()/24 ),
						selectable: false,
						hasControls: false,
						hasBorders: true,
						hasRotatingPoint: false,
						originY: 'center',
						originX: 'center'
					});
					// sub class name
					let tempText = new fabric.Text( conceptSet[ mainIndex ].subClass[ c ].title, {
						fontFamily: "globalFont",
						selectable: false,
						hasControls: false,
						hasBorders: false,
						hasRotatingPoint: false,
						originY: 'center',
						originX: 'center',
						fontSize: Math.floor( elementRange.height/17 ) * SCALE_OF_FONTSIZE
					});
					// shrink font size to fit rectangle
					while( tempText.getWidth() >= tempBorder.getWidth() - 10 ){
						tempText.setFontSize( tempText.getFontSize() - 2 );
					}
					// draw alert image object
					alertPic = fabric.util.object.clone( alertPicSample );
					alertPic.set({
						visible: (gapBetweenAskedAndCorrect>0),
						top: (-1)*tempText.getHeight(),
						width: tempText.getHeight(),
						height: tempText.getHeight()
					});
					let tempGroup = new fabric.Group( [ tempBorder, tempText, alertPic ], {
						left: elementRange.getLeft() - elementRange.getWidth()/2 + intervalBetweenColBTN * ( col + 0.5 ),
						top: elementRange.getTop() + elementRange.getHeight()*( 1/5 - 1/2 ) + intervalBetweenRowBTN * ( row + 0.5 ),
						hasBorders: false,
						hasRotatingPoint: false,
						hasControls: false,
						selectable: false,
						originY: 'center',
						originX: 'center',
						isLink: true
					});

					if( conceptSet[mainIndex].subClass[c].totalAskedAmount > 0 ){
						// add button event
						tempGroup.on('mousedown', function(){
							// hide elements of this scene
							hideSubElement();
							showQuesScene( mainIndex, c );
						});
					}
					subGroupBtnList[mainIndex].push( tempGroup );
					canvas_end_fabric.add( tempGroup );
				}
			}
			// set flag
			hasShowSubBefore[mainIndex] = true;
		}
		canvas_end_fabric.renderAll();
	}

	function hideSubElement(){
		console.log("[chart] hideSubElement");
		subclassTitle.set({'visible':false});
		group_backToMainScene.set({'visible':false});
		for( let c1=0, main_len=subGroupBtnList.length; c1<main_len; c1++ ){
			if( subGroupBtnList[c1] ){
				for(let c=0, sub_len=subGroupBtnList[c1].length; c<sub_len; c++){
					subGroupBtnList[c1][c].set({'visible':false});
				}
			}
		}
	}

	function showQuesScene( mainIndex, subIndex ){
		console.log("[chart] showQuesScene",mainIndex+" "+subIndex);
		currentShowMainIndex = mainIndex;
		currentShowSubIndex = subIndex;
		url = conceptSet[ mainIndex ].subClass[ subIndex ].link;

		let className = conceptSet[ mainIndex ].title + " - " + conceptSet[mainIndex].subClass[ subIndex ].title;
		let currentQuesIndex = 0;
		let quesList = conceptSet[ mainIndex ].subClass[ subIndex ].askedArray;

		if( hasShowQuesLayout ){
			QuesTitle.setText( className );
			QuesTitle.set({visible: true});
			group_backToSubScene.set({visible: true});
			group_openLink.set({visible: true});
			btn_forwardQues.set({visible: true});
			btn_backwardQues.set({visible: true});
		}else{
			// title
			QuesTitle = new fabric.Text( className,{
				left: canvas_end_fabric.width/2,
				top: elementRange.getTop() - elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				fontFamily: "globalFont",
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originY: 'center',
				originX: 'center',
				fontSize: Math.floor( obj_endGameBG.getHeight()/15 ) * SCALE_OF_FONTSIZE
			});

			// create UI object
			group_backToSubScene = fabric.util.object.clone( backToSubButtonSample );
			group_backToSubScene.set({
				left: canvas_end_fabric.width*2/7,
				top: elementRange.getTop() + elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				width: backToSubButtonSample.getWidth() * bgScale,
				height: backToSubButtonSample.getHeight() * bgScale
			});

			group_openLink = fabric.util.object.clone( seeBookButtonSample );
			group_openLink.set({
				left: canvas_end_fabric.width*5/7,
				top: elementRange.getTop() + elementRange.getHeight()*( 4/5 - 1/2 + (1/5 * 1/2) ),
				width: seeBookButtonSample.getWidth() * bgScale,
				height: seeBookButtonSample.getHeight() * bgScale
			});

			// adding UI
			canvas_end_fabric.add( QuesTitle );
			canvas_end_fabric.add( group_backToSubScene );
			canvas_end_fabric.add( group_openLink );
			canvas_end_fabric.renderAll();
			// add button event
			group_backToSubScene.on('mousedown', function(){
				// hide elements of this scene
				hideQuesElement( currentShowMainIndex, currentShowSubIndex );
				showSubclassScene( currentShowMainIndex );
			});
			group_openLink.on('mousedown', function(){
				let win = window.open(url, '_blank');
				if (win) {
					//Browser has allowed it to be opened
					win.focus();
				} else {
					console.warn("browser has blocked new tab.");
					//Browser has blocked it
					alert('Please allow popups for this website.');
				}
			});
			// NOTE clip from here

			hasShowQuesLayout = true;
		}

		// add button event
		btn_backwardQues.on('mousedown', function(){
			if( currentQuesIndex !== (quesList.length-1) ){
				showQues( mainIndex, subIndex, ++currentQuesIndex );
			}
		});
		// add button event
		btn_forwardQues.on('mousedown', function(){
			if( currentQuesIndex !== 0 ){
				showQues( mainIndex, subIndex, --currentQuesIndex );
			}
		});

		if( ('hasShowQuesBefore' in conceptSet[ mainIndex ].subClass[ subIndex ]) && conceptSet[ mainIndex ].subClass[ subIndex ].hasShowQuesBefore ){
			showQues( mainIndex, subIndex, 0 );
		}else{
			let quesRange = getRangeByTwoPoint( 
				{
					x: elementRange.getLeft() - elementRange.getWidth()*( 1/2 - 1/10 ) + elementRange.getWidth()/18,
					y: elementRange.getTop() - elementRange.getHeight()*( 1/2 - 1/5 )
				}, {
					x: elementRange.getLeft() + elementRange.getWidth()*( 1/2 - 1/10 ) - elementRange.getWidth()/18,
					y: elementRange.getTop() + elementRange.getHeight()*( 1/2 - 1/5 )
				} );
			for(let quesIndex=0, len=quesList.length; quesIndex<len; quesIndex++){
				let tempQuesObj = quesList[ quesIndex ];
				let temp_options = [];
				let listToAdd = [];
				let checkSign;
				let temp_answer_text;

				checkSign = fabric.util.object.clone( checkSignSample );

				// create options' object and their text
				let unformatted_option_text = [];
				for(let c = 0; c<tempQuesObj.optionText.length; c++){
					temp_options[c] = fabric.util.object.clone( obj_sampleOption );
					temp_options[c].isLink = false;
					temp_options[c].isCorrect = ( c === tempQuesObj.correctIndex ) ? true : false;
					unformatted_option_text[c] = new fabric.Text( tempQuesObj.optionText[c], {
						fontFamily: "globalFont"
					});
				}

				// create unformatted question text
				let unformatted_ques_text = new fabric.Text( tempQuesObj.questionText, {
					left: quesRange.left,
					top: quesRange.top,
					fontFamily: "globalFont"
				});

				// create unformatted correct answer text
				let answerString = "正確答案是：" + tempQuesObj.optionText[tempQuesObj.correctIndex];
				let unformatted_answer_text = new fabric.Text( answerString, {
					fontFamily: "globalFont"
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
					obj_ques_text = wrapCanvasText( unformatted_ques_text, canvas_end_fabric, quesRange.width, 0, 'left' );

					// adjust answer text's font size
					unformatted_answer_text.fontSize = maxFontSize - decrease;
					temp_answer_text = wrapCanvasText( unformatted_answer_text, canvas_end_fabric, quesRange.width, 0, 'left' );

					// adjust option's size and option text's font size
					for(let c = 0; c<temp_options.length; c++){
						temp_options[c].set({
							width: maxFontSize - decrease,
							height: maxFontSize - decrease
						});
						unformatted_option_text[c].fontSize = maxFontSize - decrease;
						objs_option_text[c] = wrapCanvasText( unformatted_option_text[c], canvas_end_fabric, quesRange.width, 0, 'left' );
						totalOptionHeight += objs_option_text[c].height + intervalAmongOptions;
					}
					decrease += 2; 
				}while( obj_ques_text.height + temp_answer_text.height + totalOptionHeight + intervalBetweenQuesAndOptions > quesRange.height );

				obj_ques_text.set({
					selectable: false,
					hasControls: false,
					hasBorders: false,
					hasRotatingPoint: false,
				});
				for(let c = 0; c<temp_options.length; c++){
					if(c===0){
						temp_options[c].set({
							visible: true,
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							left: quesRange.left+temp_options[c].width/2,
							top: obj_ques_text.top + obj_ques_text.height + intervalBetweenQuesAndOptions + temp_options[c].height/2,
						});
						objs_option_text[c].set({
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							left: quesRange.left+temp_options[c].width,
							top: obj_ques_text.top + obj_ques_text.height + intervalBetweenQuesAndOptions
						});
					}else{
						temp_options[c].set({
							visible: true,
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							left: quesRange.left+temp_options[c].width/2,
							top: objs_option_text[c-1].top + objs_option_text[c-1].height + intervalAmongOptions + temp_options[c].height/2,
						});
						objs_option_text[c].set({
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							left: quesRange.left+temp_options[c].width,
							top: objs_option_text[c-1].top + objs_option_text[c-1].height + intervalAmongOptions
						});
					}
					if( c===(temp_options.length-1) ){
						temp_answer_text.set({
							selectable: false,
							hasControls: false,
							hasBorders: false,
							hasRotatingPoint: false,
							left: quesRange.left,
							top: objs_option_text[c].top + objs_option_text[c].height + intervalAmongOptions
						});
					}

					listToAdd.push(temp_options[c]);

					// change font color of correct option
					if( c === tempQuesObj.correctIndex ){
						objs_option_text[c].set({
							fill: 'green'
						});
					}
					listToAdd.push(objs_option_text[c]);

					// add check sign on the selected option
					if( c === tempQuesObj.selectedIndex ){
						checkSign.set({
							visible: true,
							top: temp_options[c].getTop(),
							left: temp_options[c].getLeft(),
							width: temp_options[c].getWidth(),
							height: temp_options[c].getHeight()
						});
						listToAdd.push(checkSign);
					}
				}
				listToAdd.push(obj_ques_text);
				listToAdd.push(temp_answer_text);

				// create group
				let group_ques = new fabric.Group( listToAdd, {
					left: quesRange.left,
					top: quesRange.top,
					hasBorders: false,
					hasRotatingPoint: false,
					hasControls: false,
					selectable: false,
					originY: 'top',
					originX: 'left',
					isLink: false,
					visible: false
				});
				canvas_end_fabric.add( group_ques );
				conceptSet[ mainIndex ].subClass[ subIndex ].askedArray[quesIndex].layoutGroup = group_ques;
			}
			showQues( mainIndex, subIndex, 0 );
			conceptSet[ mainIndex ].subClass[ subIndex ].hasShowQuesBefore = true;
		}

		function showQues( mainIndex, subIndex, quesIndexToShow ){
			console.log("[chart] showQues",quesIndexToShow);
			console.log("[chart] showQues index->",mainIndex+" "+subIndex);
			let len = conceptSet[ mainIndex ].subClass[ subIndex ].askedArray.length;
			for(let c=0; c<len; c++){
				if(c===quesIndexToShow){
					conceptSet[ mainIndex ].subClass[ subIndex ].askedArray[c].layoutGroup.set({visible: true});
				}else{
					conceptSet[ mainIndex ].subClass[ subIndex ].askedArray[c].layoutGroup.set({visible: false});
				}
			}
		}
	}

	function hideQuesElement( mainIndex, subIndex ){
		console.log("[chart] hideQuesElement",mainIndex+" "+subIndex);
		// hide layout
		QuesTitle.set({visible: false});
		group_backToSubScene.set({visible: false});
		group_openLink.set({visible: false});
		btn_forwardQues.set({visible: false});
		btn_backwardQues.set({visible: false});
		// remove button event
		btn_backwardQues.off('mousedown');
		btn_forwardQues.off('mousedown');
		// hide question group
		let len = conceptSet[ mainIndex ].subClass[ subIndex ].askedArray.length;
		for(let c=0; c<len; c++){
			conceptSet[ mainIndex ].subClass[ subIndex ].askedArray[c].layoutGroup.set({visible: false});
		}
	}

	function createChart(){
		// create div
		let tempCanvas = document.createElement("canvas");
		let canvasId = "judgeCanvas";
		tempCanvas.id = canvasId;
		tempCanvas.width = elementRange.getWidth();
		tempCanvas.height = elementRange.getHeight()*4/5;
		let left = elementRange.getLeft() - elementRange.getWidth()/2;
		let top = elementRange.getTop() - elementRange.getHeight()/2;
		tempCanvas.style = "z-index: 20; position: absolute; left: "+ left +"; top: "+ top +";";
		document.body.appendChild( tempCanvas );

		// data for chart
		let correctAmount = conceptSet.totalCorrectAmount;
		let wrongAmount = conceptSet.totalAskedAmount - conceptSet.totalCorrectAmount;
		let percentOfCorrect = Math.floor( 100*conceptSet.totalCorrectAmount/conceptSet.totalAskedAmount);
		let adjective;
		if(percentOfCorrect>=90) {adjective="太棒了！";}
		else if(percentOfCorrect>=80) {adjective="不錯耶！";}
		else if(percentOfCorrect>=60) {adjective="再加油唷！";}
		else {adjective="還有努力的空間！";}
		let title = adjective + "你總共答對了"+ correctAmount +"題";

		// layout setting
		let minSide = Math.floor( Math.min( elementRange.getHeight(), elementRange.getWidth() ) );
		let titleSize = Math.floor( minSide/12 );
		let chartPadding = Math.floor( minSide/20 );

		// init canvas
		Chart.defaults.global.defaultFontFamily = 'globalFont';
		Chart.defaults.global.defaultFontColor = 'black';
		var ctx = document.getElementById( canvasId );
		var data = {
			labels: [
				"答錯"+(100-percentOfCorrect)+"%",
				"答對"+percentOfCorrect+"%"
			],
			datasets: [
				{
					data: [wrongAmount, correctAmount],
					backgroundColor: [
						"rgba(255,0,0,1)",
						"rgba(0,255,0,1)"
					],
					hoverBackgroundColor: [
						"rgba(255,0,0,0.7)",
						"rgba(0,255,0,0.7)"
					]
				}
			]
		};
		var pieOptions = {
			title: {
				display: true,
				text: title,
				fontSize: titleSize,
				fontStyle: '' // remove 'bold' style
			},
			layout: {
				padding: chartPadding
			},
			legend: {
				position: 'right',
				labels:{
					fontSize: Math.floor( minSide/20 )
				}
			},
			responsive: false,
			animateScale : true
		};
		// For a pie chart
		var myPieChart = new Chart(ctx,{
			type: 'pie',
			data: data,
			options: pieOptions
		});

		return tempCanvas;
	}

	function preloadChartImage(){
		// create check sign
		fabric.Image.fromURL(
			'./images/check_sign.png',
			function( img ) {
				checkSignSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center'
			}
		);
		// draw alert image object
		fabric.Image.fromURL(
			'./images/end_scene/light.png',
			function( img ) {
				img.isLink = false;
				alertPicSample = img;
			},{
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center'
			}
		);
		// create classButtonSample sign
		fabric.Image.fromURL(
			'./images/end_scene/classBtn.png',
			function( img ) {
				classButtonSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center'
			}
		);
		// create classButtonCorrectSample sign
		fabric.Image.fromURL(
			'./images/end_scene/classBtn(correct).png',
			function( img ) {
				classButtonCorrectSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center'
			}
		);
		// create classButtonWrongSample sign
		fabric.Image.fromURL(
			'./images/end_scene/classBtn(wrong).png',
			function( img ) {
				classButtonWrongSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center'
			}
		);
		// create lastPageButtonSample sign
		fabric.Image.fromURL(
			'./images/end_scene/back.png',
			function( img ) {
				lastPageButtonSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center',
				isLink: true
			}
		);
		// create backToSubButtonSample sign
		fabric.Image.fromURL(
			'./images/end_scene/backToSub.png',
			function( img ) {
				backToSubButtonSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center',
				isLink: true
			}
		);
		// create playAgainButtonSample sign
		fabric.Image.fromURL(
			'./images/end_scene/playAgain.png',
			function( img ) {
				playAgainButtonSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center',
				isLink: true
			}
		);
		// create reviewButtonSample sign
		fabric.Image.fromURL(
			'./images/end_scene/review.png',
			function( img ) {
				reviewButtonSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center',
				isLink: true
			}
		);
		// create seeBookButtonSample sign
		fabric.Image.fromURL(
			'./images/end_scene/seeBook.png',
			function( img ) {
				seeBookButtonSample = img;
			},{
				visible: true,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center',
				isLink: true
			}
		);
		// draw forward arrow object
		fabric.Image.fromURL(
			'./images/end_scene/left.png',
			function( img ) {
				img.isLink = true;
				btn_forwardQues = img;

				canvas_end_fabric.add( btn_forwardQues );
				canvas_end_fabric.renderAll();
			},{
				visible: false,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center',
				top: elementRange.getTop(),
				left: elementRange.getLeft() - elementRange.getWidth()*( 1/2 - 1/10 ) + elementRange.getWidth()/18 - elementRange.getWidth()*( 1/10 * 1/2 ),
				width: elementRange.getWidth()*(1/15),
				height: elementRange.getWidth()*(1/15) * (228/198)
			}
		);
		// draw backward arrow object
		fabric.Image.fromURL(
			'./images/end_scene/right.png',
			function( img ) {
				img.isLink = true;
				btn_backwardQues = img;

				canvas_end_fabric.add( btn_backwardQues );
				canvas_end_fabric.renderAll();
			},{
				visible: false,
				selectable: false,
				hasControls: false,
				hasBorders: false,
				hasRotatingPoint: false,
				originX: 'center',
				originY: 'center',
				top: elementRange.getTop(),
				left: elementRange.getLeft() + elementRange.getWidth()*( 1/2 - 1/10 ) - elementRange.getWidth()/18 + elementRange.getWidth()*( 1/10 * 1/2 ),
				width: elementRange.getWidth()*(1/15),
				height: elementRange.getWidth()*(1/15) * (216/198)
			}
		);
	}
}
