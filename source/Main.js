
// Uvodní obrazovka
enyo.kind({
  name: "main",
  kind: enyo.VFlexBox,
  canvas: null,
  create: function(){
    
      this.inherited(arguments);
      this.$.db.setSchemaFromURL('db/schema.json');      
      this.canvas = new Tetris.Canvas();
  },
  components: [
	  {kind: enyo.Header, content: "Online Tetris with Enyo 1.0"},
	  {kind: "Image", src: "images/tetris-original.jpg", style: "height: 760px; width: 800px; z-index: -5"},
	  {kind: enyo.VFlexBox, style: "position: absolute; top: 380px; left: 275px;width: 250px", components: [
		 {kind: enyo.Button, caption: "Nová hra", onclick: "startGame"},
		 {kind: enyo.Button, caption: "High score", onclick: "showHighScore"},
		 {kind: enyo.Button, caption: "About game", onclick: "showAuthor"},
		 {kind: enyo.Button, caption: "Exit", onclick: "close"},               
	  ]},
         {
             name: "db",
             kind: "onecrayon.Database",
             database: 'ext:table',
             version: "1",
             estimatedSize: 1048576,
             debug: true,
         }
	  /*{kind: "RowGroup", caption: "Feed URL", style: "width:150px; margin: auto", components: [
		  {kind: "InputBox", components: [
			  {name: "feedUrl", kind: "Input", flex: 1},
			  {kind: "Button", caption: "Get Feed", onclick: "btnClick"}
		  ]}
	  ]}*/
  ],
  startGame: function(){
  
    this.canvas = new Tetris.Canvas();
    this.canvas.startGame();
    this.canvas.renderInto(document.body);

  },
  showMenu: function(){
    
    this.owner.$.main.renderInto(document.body);
  
  },

  showAuthor: function(){
      new AboutAuthor().renderInto(document.body);
  },

  close: function(){
    window.close();
  },
  showHighScore: function(){
    new HighScore().renderInto(document.body);
  },
  dbRun: function(){
    //this.$.db.query("CREATE TABLE IF NOT EXISTS highscore (id int(11), name varchar(255), score int(11));");
    this.$.db.insertData({ table: "highscore", data: [{nickname: "franta", score: 5}]});
    
  },
});