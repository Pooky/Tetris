enyo.kind({
   name: "Point",
   kind: enyo.Object,
   constructor: function(x, y, color){
      
      this.x = x;
      this.y = y;
      this.color = color;
   
   },
   published: {
      color: null,
      x: null,
      y: null
   },
   comparePoints: function(point){
      
      if(point[0] == this.x && point[1] == this.y)
         return false;
      else
         return true;
   }
   
});