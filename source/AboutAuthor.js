enyo.kind({
    name: "AboutAuthor",
    kind: enyo.VFlexBox,
    data: [],
    className: "center",
    components: [
        {kind: enyo.Header, content: "Online Tetris with Enyo 1.0"},
        {kind: "Image", src: "images/tetris-original.jpg", style: "height: 760px; width: 800px; z-index: -5"},
        {kind: "HtmlContent", content: "<h1>About the game</h1><p>This game was made form <a href='https://en.wikipedia.org/wiki/Palm_OS'>PalmOS</a> latter named WebOS. First javascript based mobile-system which used HTML, JS and CSS for applications.</p><br>Source code for WebOS: <a href='https://github.com/Pooky/webos-tetris'>on Github</a><br>EnyoJS: <a href='http://enyojs.com/'>http://enyojs.com/</a><p><i>This version was slightly modified for Browser purpouses, source code can be find here:</i></p><br>Created by Pooky @ 2013<p><a href='#back'>Go back</a>", className: "about-layout", onLinkClick: "htmlContentLinkClick"},
    ],
    constructor: function(){
       this.inherited(arguments);
    },
    back: function(){
       this.owner.$.main.showMenu();
    },
	htmlContentLinkClick: function(inSender, inUrl) {
      
        if(inUrl = "#back"){
            this.owner.$.main.showMenu();
        }else{
		    // do something when the link is clicked.
            this.$.webView.setUrl(inUrl);
        }
	}
 });
 