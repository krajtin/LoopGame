
game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
		
		 me.levelDirector.loadLevel("map1");
			
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		
		// var borrar=this.HUD.getChildAt(1);
		// this.HUD.removeChild(objeto);
		
		// me.game.world.addChild(new me.ColorLayer("background", "#002200", 0));
        // me.game.world.addChild(new game.Player(), 1);//El ultimo parametro es para el z-index
        //me.game.world.addChild(new game.Enemy(50, 50), 2);
		// me.game.world.addChild(new game.Jugador(),1);
		// me.game.world.addChild(new game.Bloque(0,me.game.viewport.height-40),1);
			// this.enemyManager = new game.EnemyManager();
			// this.enemyManager.createEnemies();
			// this.bloqueManager = new game.ColeccionBloques();
			// this.bloqueManager.crearBloques();
			// me.game.world.addChild(this.enemyManager, 2);
			// me.game.world.addChild(this.bloqueManager, 2);
	
		me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,    "down");

        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.D, "right");
       	me.input.bindKey(me.input.KEY.SPACE, "shoot", true);//Con valor true lo hará una vez por veces presionado, con el valor false el evento lo recoge mientras está pulsada la tecla.

    },
	
 
 
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
		
		me.game.world.removeChild(this.HUD);
		 me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.A);
        me.input.unbindKey(me.input.KEY.D);
		me.input.unbindKey(me.input.KEY.SPACE);
		me.input.unbindKey(me.input.KEY.UP);
		
    }
});