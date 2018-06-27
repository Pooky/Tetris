enyo.kind({
   name: "HighScore",
   kind: enyo.VFlexBox,
   data: [],
   components: [
      {kind: enyo.Header, content: "HighScore"},
      {flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "listSetupRow", components: [
             {kind: "Item", className: "item", components: [
                  {kind: "HFlexBox", components: [
                         {name: "itemNickname", flex: 1, className: "item-nickname"},
                         {name: "itemScore", className: "item-score"}
                  ]},
             ]}
      ]},
      {kind: enyo.HFlexBox, components: [
         {kind: "Button", content: "Back", flex: 1, onclick: "back"},
         {kind: "Button", content: "Clear all", flex: 1, onclick: "clear"},          
      ]}
      
   ],
   constructor: function(){
      this.inherited(arguments);
   },
   create: function(){
      
      this.inherited(arguments);
      this.owner.$.main.$.db.query("SELECT * FROM highscore ORDER BY score DESC", {
        onSuccess: enyo.bind(this, this.save)
      });   
   },
   save: function(values){
      this.data = values;
      this.$.list.refresh();
   },
   back: function(){
      this.owner.$.main.showMenu();
   },
   clear: function(){
      this.owner.$.main.$.db.query("DELETE FROM highscore", {
         onSuccess: function(){
            this.$.list.reset();
            this.$.list.render();            
         }.bind(this)
      });
      
   },
   listSetupRow: function(inSender, inIndex) {
      
      
      var record = this.data[inIndex];
      if(record){
         
         this.$.itemNickname.setContent(record.nickname);
         this.$.itemScore.setContent(record.score);         
         
         return true;
      }
      return false;
      
   },
   log: function(){
      console.log(this.data);
   }
});
