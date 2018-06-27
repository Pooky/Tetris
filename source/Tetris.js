// grid
enyo.kind({
	name: "Tetris.Canvas",
	kind: enyo.Control,
	
	maxX: 10,
	maxY: 10,
	
	activeShape: null, //tvary společně se souřadnicemi
	shapes: [], // už dříve položené tvary
	active: true,
	score: 0,
	
	className: "canvas",
	
	setTimer: function(){
		if(this.active){
			enyo.job("down", enyo.bind(this, "moveDown"), 1000);
			enyo.job("timer", enyo.bind(this, "setTimer"), 1000);			
		}
	},
	stopTimer: function(){
		
		this.active = false;

		enyo.job.stop("down");
		enyo.job.stop("timer");
		
	},
	startTimer: function(){
		this.active = true;
		this.setTimer();
	},
	reset: function(){
		
		this.shapes = [];
		this.active = true;
		this.score = 0;
		
		this.activeShape = null;
		this.renderShape();
	},
	startGame: function(){
		
		// načtení pár objektů pro test
		this.shapes = this.shapes.concat(new Shape([0,9], [1,9], [2,9],[3,9]).transform());
		this.shapes = this.shapes.concat(new Shape([4,9], [5,9], [6,9],[7,9]).transform());
		this.shapes = this.shapes.concat(new Shape([5,8], [5,7], [6,8],[6,7]).transform());	  
		
		this.addShape(new Shapes().randomShape());
		
		this.setTimer();
	},
	create: function(){
			
	  this.inherited(arguments);
	  // řádky
	  for (x = 0; x < 10; x++) {
		
		  var row = {tag: "div", className: "row", name: "row" + x};
		  var current = this.$.grid.createComponent(row);
		  
			// buňky
			for(y = 0; y < 10; y++){
				  var cell = {tag: "div", className: "cell", name: "x" + x + "y" + y};
				  current.createComponent(cell);
			}		  
		  
	  }
	 
	},
	addShape: function(shape){

		// uložíme starý tvar
		if(this.activeShape != null){
			this.shapes = this.shapes.concat(this.activeShape.transform());
		}
		// kontrola plné linky
		this.checkLines();
		
		// kontrola konce
		if(this.checkEnd()){
			
			this.stopTimer();
			//this.$.end.applyStyle("display", "block");
			this.$.modalDialog.openAtCenter();
			this.$.finalScore.setContent("Score: " + this.score);
			
		}else{
			// nový tvar
			this.activeShape = shape;
			this.renderShape();		
		}

	},
	// otočení objektu
	turnOver: function(){
		
		if(this.checkSpace("rotate")){
			this.activeShape.rotate();
			this.renderShape();
		}else{
			console.log("rotate-block");
		}		
	},
	// posune o jedno pole dolů, aktivní tvar
	moveDown: function(){
	
		if(this.checkSpace("down")){
			this.activeShape.increaseY();
			this.renderShape();
		}else{
			console.log("down-border");
			// níž už to nejde, uložíme tvar a přidáme nový
			this.addShape(new Shapes().randomShape());
		}

		// jelikož se posouváme dolů, musíme všechny y souřadnice zvětšit o jedno.
		
	},
	moveRight: function(){
		
		if(this.checkSpace("right")){
			this.activeShape.increaseX();
			this.renderShape();			
		}else{
			console.log("right-border");
		}

	},
	moveLeft: function(){
		
		if(this.checkSpace("left")){
			this.activeShape.decreaseX();
			this.renderShape();
		}else{
			console.log("left-border");
		}
		
	},
	/**
	 * Kontrola vyplnění celé řady, případně zpracování posunutí.
	 */
	checkLines: function(){
		
		var pointsY = [];
		
		for(i in this.shapes){
			pointsY = pointsY.concat(this.shapes[i].getY());
		}
		// spočítáme výskyt Y hodnot
		var amounts = {};
		for(i in pointsY){
			if(amounts[pointsY[i]]){
				amounts[pointsY[i]]++;
			}else{
				amounts[pointsY[i]] = 1;
			}
		}
		for(key in amounts){
			if(amounts[key] == 10){
				// clear line
				this.clearLine(key);
				// připočteme score
				this.score += 100;
				this.$.score.setContent("Score: " + this.score);
				
			}
		}
		//console.log(pointsY);
		//console.log(amounts);
		
		//this.stopTimer();
		
	},
	/**
	 * Funkce vyčistí linku a posune všechny prvky nad ní, dolů
	 * @param {int} pointY
	 */
	clearLine: function(pointY){
		
		var resultPoints = [];
		for(var i = 0; i < this.shapes.length; i++){
			// pokud se jedná o bod na dané lince, tak už ho nebudeme ukládat
			if(this.shapes[i].getY() != pointY){
				resultPoints.push(this.shapes[i]);
			}
			
		}
		this.shapes = resultPoints;
		
		
		// Nyní přepočítáme všechny hodnoty bodů, které nám zůstaly a jsou větší než Y
		
		this.shapes.sort(function(a,b){
			return b.getY() > a.getY();			
		})
		console.log(this.shapes);
		
		for(i in this.shapes){
			
			var point = this.shapes[i];
			
			if(point.getY() < pointY){
				
				// každá bod posuneme až kam to jde
				var y = point.getY();
				var control = true;
				
				while(control == true){
					
					if(this.checkSinglePosition(y + 1, point.getX())){
						y++;
					}else{
						control = false;
					}
					
				}
				
				point.setY(y);
				
			}
		}
	},
	checkSinglePosition: function(pointY, pointX){
		
			if(pointY >= this.maxY)
				return false;
			
			for(i in this.shapes){
				if(this.shapes[i].getY() == pointY && this.shapes[i].getX() == pointX) return false;
			}
			return true;	
	},
	/**
	 * Pouze kontrola souřadnic, pokud je obsazen bod [4, 0] nebo [5, 0]
	 */
	checkEnd: function(){
		
		
		for(i in this.shapes){
			
			if(!this.shapes[i].comparePoints([4, 0])){
				return true;
			}
			if(!this.shapes[i].comparePoints([5, 0])){
				return true;
			}
		}
		return false;
		
	},
	// Funkce kontroluje zda žádný z bodů tvaru, nekoliduje s jiným tvarem.
	checkPosition: function(shape){
		
		if(this.shapes.length != 0){
			// musíme projít každou souřadnici ze 4
			for(i in this.shapes){
				if(!this.shapes[i].comparePoints(shape.getA())) return false;
				if(!this.shapes[i].comparePoints(shape.getB())) return false;
				if(!this.shapes[i].comparePoints(shape.getC())) return false;				
				if(!this.shapes[i].comparePoints(shape.getD())) return false;				
			}
			
		}
		return true;
	},
	checkSpace: function(move){
		
		// klon aktivního prvku
		var shape = new Shapes().cloneShape(this.activeShape);					
		
		if(move == "rotate"){
			
			shape.rotate();
			// x hranice
			if(shape.getA()[0] < 0 || shape.getA()[0] >= this.maxX) return false;
			if(shape.getB()[0] < 0 || shape.getB()[0] >= this.maxX) return false;			
			if(shape.getC()[0] < 0 || shape.getC()[0] >= this.maxX) return false;			
			if(shape.getD()[0] < 0 || shape.getD()[0] >= this.maxX) return false;			
			
			// y hranice
			if(shape.getA()[1] >= this.maxY) return false;
			if(shape.getB()[1] >= this.maxY) return false;
			if(shape.getC()[1] >= this.maxY) return false;			
			if(shape.getD()[1] >= this.maxY) return false;
			
			// volný prostor
			if(!this.checkPosition(shape)) return false;
			
		}
		if(move == "left"){
			
			shape.decreaseX();
			// kontrola okraje, jelikož snižujeme X tak musíme ověřit jestli nepůjde pod nulu
			if(shape.getA()[0] < 0) return false;
			if(shape.getB()[0] < 0) return false;
			if(shape.getC()[0] < 0) return false;			
			if(shape.getD()[0] < 0) return false;

			if(!this.checkPosition(shape)) return false;
		}
		if(move == "right"){
			
			shape.increaseX();
			if(shape.getA()[0] >= this.maxX) return false;
			if(shape.getB()[0] >= this.maxX) return false;
			if(shape.getC()[0] >= this.maxX) return false;			
			if(shape.getD()[0] >= this.maxX) return false;
			
			if(!this.checkPosition(shape)) return false;
		}
		// posunutí dolů, je potřeba zkontrolovat celý canvas
		if(move == "down"){
			
			shape.increaseY();
			if(shape.getA()[1] >= this.maxY) return false;
			if(shape.getB()[1] >= this.maxY) return false;
			if(shape.getC()[1] >= this.maxY) return false;			
			if(shape.getD()[1] >= this.maxY) return false;	
			
			if(!this.checkPosition(shape)) return false;
		}
		return true;
		
	},
	renderShape: function(){
		// přepíšeme canvas
		this.rewriteCanvas();
		var rows = this.$.grid.getComponents();
		
		// vykreslíme tvary které již máme dole
		for(x in this.shapes){
			
			var point = this.shapes[x];
			rows[point.getY()].children[point.getX()].applyStyle("background-color", point.getColor());
		}
		
		// aktivní tvar
		var shape = this.activeShape;
		if(shape != null){
			rows[shape.getA()[1]].children[shape.getA()[0]].applyStyle("background-color", shape.getColor());
			rows[shape.getB()[1]].children[shape.getB()[0]].applyStyle("background-color", shape.getColor());		
			rows[shape.getC()[1]].children[shape.getC()[0]].applyStyle("background-color", shape.getColor());		
			rows[shape.getD()[1]].children[shape.getD()[0]].applyStyle("background-color", shape.getColor());			
		}

		
	},
	rewriteCanvas: function(){
		
		var rows = this.$.grid.getComponents();
		for(i in rows){
			for(z in rows[i].children){
				rows[i].children[z].applyStyle("background-color", "white");
			}
		}
		
	
	},
	saveClick: function(){
		
		// uložíme highscore a vrátíme ho na začátek.
		this.owner.$.main.$.db.insertData({ table: "highscore", data: [{nickname: this.$.nickname.getValue(), score: this.score}]});
		
		this.$.modalDialog.close();
		this.owner.$.main.showMenu();
		
	},
	cancelClick: function(){
		this.$.modalDialog.close();
		this.owner.$.main.showMenu();
	},
	goBack: function(){
		this.owner.$.main.showMenu();
	},
	components: [
		{kind: enyo.HtmlContent, content: "<h1>Tetris 1.0</h1>"},
		{kind: enyo.HtmlContent, className: "canvas-grid", components: [
			{layoutKind: "VFlexLayout", width: "500px", components: [
				{tag: "div", flex: 1, name: "grid", id: "grid"},
				{tag: "div", className: "controls", components: [
					{layoutKind: "HFlexLayout", align: "center", className: "controlBox", components: [
						{kind: enyo.Button, caption: "LEFT", name: "leftButton", onclick: "moveLeft"},
						{kind: enyo.Button, caption: "RIGHT", name: "rightButton", onclick: "moveRight"},
						{kind: enyo.Button, caption: "PAUSE", name: "stopButton", onclick: "stopTimer"},
						{kind: enyo.Button, caption: "UNPAUSE", name: "unpauseButton", onclick: "startTimer"},
						{kind: enyo.Button, caption: "TURN OVER", name: "turnButton", onclick: "turnOver"}					
					]},
					{kind: enyo.HtmlContent, content: "<p><a href='#back'>Go back</a></p>", className: "go-back", onLinkClick: "goBack"},	
				]},
				{tag: "div", name: "info", className: "score", components: [
					{tag: "p", content: "Score: 0", name: "score"},
				]},
			]}
		]}, 
		{kind: "ModalDialog", components: [
          {content: "Game Over ", className: "game-over"},
          {name: "finalScore", style: "margin: 20px 0px 15px 25px; font-size: 16pt"},		  
		  {kind: "Input", name:"nickname", hint: "Vaše jméno", style: "margin: 25px;"},
          {layoutKind: "HFlexLayout", pack: "center", align: "center", components: [
              {kind: "Button", caption: "Uložit", onclick: "saveClick"},
              {kind: "Button", caption: "Cancel", onclick: "cancelClick"}
          ]}
      ]},
	]
});

