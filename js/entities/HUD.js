

/**
 * a HUD container and child items
 */

game.HUD = {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // Use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at position
        this.addChild(new game.HUD.ScoreItem(210, 50));
        this.addChild(new game.HUD.LevitarItem(me.game.viewport.width-56, 0));
       
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend( {
    /**
     * constructor
     */
    init: function(x, y) {
       
        this._super(me.Renderable, 'init', [
            x,
			y,
            56,
            56
        ]);

        // create a font
        this.font = new me.BitmapFont("atascii", {x:24});
        this.font.textAlign = "left";
        this.font.set("left", 1);
		
		
	   this.bFont = new me.BitmapFont("atascii", {x:24});
	   this.bFont.textAlign = "center";
       this.bFont.resize(1);
	   
        // local copy of the global score
        this.score = -1;
    },

   

    /**
     * draw the score
     */
    draw : function (renderer) {
        this.font.draw (renderer, game.data.score, this.pos.x, this.pos.y);
		this.bFont.draw(renderer, "INTENTOS", 100 , 50);

    }

});
game.HUD.LevitarItem = me.Sprite.extend( {
    /**
     * constructor
     */
    init: function(x, y) {
       this.image=me.loader.getImage("levitar");
        this._super(me.Sprite, 'init', [ x,y,{
			image:this.image
			}]);
		

        
    },

   

    /**
     * draw the score
     */
    draw : function (renderer) {
      if(!game.data.invisible)
		renderer.drawImage(this.image, this.pos.x, this.pos.y,30,30);

    }

});


