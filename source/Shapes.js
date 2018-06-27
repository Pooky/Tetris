/**
 * Tvary pro tetris
 */
enyo.kind({
	name: "Shapes",
	kind: enyo.Object,
	randomShape: function(){
		return this.getShape(Math.floor((Math.random()*4)+1));
	},
	getShape: function(number){
		
		var shape = null;
		
		switch(number){
			case 1:
				shape = new Shape([4,0], [4,1], [3,1],[4,2], 1); // takovej ten 'parníček'
				break;
			case 2:
				shape = new Shape([4,0], [5,0], [4,1],[5,1], 2); // kostka
				break;
			case 3: 
				shape = new Shape([4,0], [4,1], [4,2],[4,3], 3); // svislá čára
				break;
			case 4:
				shape = new Shape([4,0], [4,1], [4,2],[5,2], 4); // velké L  
				break;
		}
		return shape;
		
	},
	cloneShape: function(shape){
		
		// klon aktivního prvku
		var newShape = new Shape(
			enyo.cloneArray(shape.getA()),
			enyo.cloneArray(shape.getB()),
			enyo.cloneArray(shape.getC()),
			enyo.cloneArray(shape.getD()),
			shape.type
		);
		return newShape;
	},
	clonePoints: function(inputShape, outputShape){
		
		console.log(inputShape);
		
		outputShape.setA(enyo.cloneArray(inputShape.getA()));
		outputShape.setB(enyo.cloneArray(inputShape.getB()));
		outputShape.setC(enyo.cloneArray(inputShape.getC()));		
		outputShape.setD(enyo.cloneArray(inputShape.getD()));		
		
		return outputShape;
		
	}
})

