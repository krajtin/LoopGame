game.TitleScreen = me.ScreenObject.extend({
 
  /**
   *  action to perform on state change
   */
  onResetEvent : function() {
 
    // title screen
    me.game.world.addChild(
      new me.Sprite (
        0,0,
        {image:me.loader.getImage('title_screen')}
      ),
      1
    );
 
    // add a new renderable component with the scrolling text
    me.game.world.addChild(new (me.Renderable.extend ({
      // constructor
      init : function() {
        this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
        // font for the scrolling text
        this.font = new me.BitmapFont("atascii", 24);
 
         
		
      },
 
      
 
      draw : function (renderer) {
        this.font.draw(renderer, "PRESIONA ESPACIO PARA JUGAR", 100, 350);
       
      },
      
    })), 2);
 
    //
    me.input.bindKey(me.input.KEY.SPACE, "comenzar", true);
   
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "comenzar") {
		 
        me.state.change(me.state.PLAY);
		me.audio.play("megaman_2_Castle_Stage",true,null,0.2);
      }
    });
  },
 
  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent : function() {
    me.input.unbindKey(me.input.KEY.SPACE);
    
    me.event.unsubscribe(this.handler);
   }
});
game.GameOverScreen = me.ScreenObject.extend({
 
  /**
   *  action to perform on state change
   */
  onResetEvent : function() {
 
    // title screen
    me.game.world.addChild(
      new me.Sprite (
        0,0,
        {image:me.loader.getImage('game_over')}
      ),
      1
    );
 
    // add a new renderable component with the scrolling text
    me.game.world.addChild(new (me.Renderable.extend ({
      // constructor
      init : function() {
        this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
        // font for the scrolling text
        this.font = new me.BitmapFont("atascii", 24);
		this.font.resize(3);
 
         
		
      },
 
      
 
      draw : function (renderer) {
        this.font.draw(renderer, "GAME OVER", 100, 250);
		this.font.resize(1);
		this.font.draw(renderer, "\nINTENTOS "+game.data.score+"\n\nPRESIONA ESPACIO PARA VOLVER A JUGAR", 100, 350);
		
       
      },
      
    })), 2);
 
    //
    me.input.bindKey(me.input.KEY.SPACE, "terminar", true);
   
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "terminar") {
		 game.data.score=0;
        me.state.change(me.state.MENU);
      }
    });
  },
 
  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent : function() {
    me.input.unbindKey(me.input.KEY.SPACE);
    
    me.event.unsubscribe(this.handler);
   }
});