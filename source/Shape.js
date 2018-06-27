/**
 * Tvar toho co padá, každý prvek má 4 souřadnice [x,y]
 */
enyo.kind({
	name: "Shape",
	kind: enyo.Object,
	constructor: function(a, b, c, d, type){
		this.a = a;
		this.b = b;		
		this.c = c;
		this.d = d;
		this.type = type;
		this.color = this.createColor();
	},
	published: {
		a: [0,0],
		b: [0,0],
		c: [0,0],
		d: [0,0],
		type: null, // typ tvaru
		complete: true, // kompletni tvar?
		color: null,
	},
	increaseX: function(){
		this.a[0]++;
		this.b[0]++;		
		this.c[0]++;		
		this.d[0]++;		
	},
	decreaseX: function(){
		this.a[0]--;
		this.b[0]--;		
		this.c[0]--;		
		this.d[0]--;		
	},	
	increaseY: function(){
		if(this.a[1] != -1) this.a[1]++;
		if(this.b[1] != -1) this.b[1]++;		
		if(this.c[1] != -1) this.c[1]++;		
		if(this.d[1] != -1) this.d[1]++;		
	},
	decreaseY: function(){
		if(this.a[1] != -1) this.a[1]--;
		if(this.b[1] != -1) this.b[1]--;		
		if(this.c[1] != -1) this.c[1]--;		
		if(this.d[1] != -1) this.d[1]--;		
	},
	isComplete: function(){
		return this.complete;
	},
       // konvertuje objekt do jednotlivých bodů
       transform: function(){
       
         var result = [];
         
         result.push(new Point(this.a[0], this.a[1], this.color));
         result.push(new Point(this.b[0], this.b[1], this.color));
         result.push(new Point(this.c[0], this.c[1], this.color));
         result.push(new Point(this.d[0], this.d[1], this.color));         

         return result;
       },
	rotate: function(){
		
		switch(this.type){
			case 1:
				
				break;
			case 2:
				// nic se nemění
				break;
			case 3:
				// čára, musíme zjisti jestli už je otočená a nebo ne
				if(this.b[0] + 1 == this.c[0]){
					// máme tvar vodorovně a musíme ho postavit nahoru
					this.a[0] = this.b[0];
					this.c[0] = this.b[0];
					this.d[0] = this.b[0];
					
					this.a[1] = this.b[1] - 1;
					this.c[1] = this.b[1] + 1;
					this.d[1] = this.b[1] + 2;					
				
				}else{
					
					// tvar je svisle, musíme ho dát na bok
					this.a[1] = this.b[1];
					this.c[1] = this.b[1];
					this.d[1] = this.b[1];
					
					this.a[0] = this.b[0] - 1;
					this.c[0] = this.b[0] + 1;					
					this.d[0] = this.b[0] + 2;					
					
				}
				break;
			case 4:
				
				// L leží dole s koncem v pravo
				if(this.b[0] + 1 == this.d[0] && this.b[1] - 1 == this.d[1]){
					
					// vrátíme ho do původní polohy
					this.a[0] = this.b[0];
					this.c[0] = this.b[0];
					this.d[0] = this.b[0] + 1;					
					
					this.a[1] = this.b[1] - 1;
					this.c[1] = this.b[1] + 1;
					this.d[1] = this.b[1] + 1;
					
				}else{
					
					// transormace do pozice 2
					this.a[0] = this.b[0] - 1;
					this.c[0] = this.b[0] + 1;
					this.d[0] = this.b[0] + 1;					
					
					this.a[1] = this.b[1];
					this.c[1] = this.b[1];
					this.d[1] = this.b[1] - 1;					
					
				}
				
				break;
		}
		
		//TODO: Dokončit implementaci rotace, není to taková sranda
		/**
		 * HINT
			// Dlouhá čára
			[4,0], [4,1], [4,2],[4,3] --- počáteční body
			[3,1], [4,1], [5,1],[6,1] --- body po trasnformaci
			// Velké L
			[4,0], [4,1], [4,2],[5,2] --- počáteční body L
			[3,1], [4,1], [5,1],[5,0] --- leží dole s koncem na pravo
			[3,0], [4,1], [5,1],[3,1] --- leží dole s koncem na levo
			[4,0], [4,1], [4,2],[3,2] --- L směrem do leva			
		 */
		
	},
	/**
	 * Vrátí všechny X body
	 */
	getXPoints: function(){
		
		return [this.a[0], this.b[0], this.c[0], this.d[0]];
		
	},
	getYPoints: function(){
		
		return [this.a[1], this.b[1], this.c[1], this.d[1]];
	
	},
	createColor: function(){
		
		var red = Math.floor((Math.random()*255)+1);
		var green = Math.floor((Math.random()*255)+1);
		var blue = Math.floor((Math.random()*255)+1);

		var color = "#" + (red.toString(16)) + (green.toString(16)) + (blue.toString(16));

		return color;
	},
	/**
	 * Porovná aktuální pozici s bodem, který mu bude předán
	 * @param {array} point
	 */
	comparePoints: function(point){
		
		if(this.a[0] != -1)
			if(point[0] == this.a[0] && point[1] == this.a[1]) return false;
		if(this.b[0] != -1)
			if(point[0] == this.b[0] && point[1] == this.b[1]) return false;
		if(this.c[0] != -1)
			if(point[0] == this.c[0] && point[1] == this.c[1]) return false;
		if(this.d[0] != -1)
			if(point[0] == this.d[0] && point[1] == this.d[1]) return false;
		
		return true;
		
	},
	compareYPoints: function(pointY){
		
		if(this.a[1] != -1)
			if(pointY == this.a[1]) return false;
		if(this.b[1] != -1)
			if(pointY == this.b[1]) return false;
		if(this.c[1] != -1)
			if(pointY == this.c[1]) return false;
		if(this.d[1] != -1)
			if(pointY == this.d[1]) return false;
		
		return true;	
	}

})