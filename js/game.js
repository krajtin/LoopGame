var game = {
	
	 data : {
        // score
        score : 0,
		invisible:true,
		
		
    },
 
    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(1100, 550, {wrapper : "screen", scale : 'auto'})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
		
        // add "#debug" to the URL to enable the debug Panel
		 me.debug.renderHitBox = true;
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
				
            });
        }
		// initialize the "sound engine"
        me.audio.init("mp3,ogg");
		
		me.pool.register("rebote", game.Rebote);
		me.pool.register("bloque", game.Bloque);
		me.pool.register("cannon", game.Cannon);
		me.pool.register("esfera", game.Esfera);
		me.pool.register("jugador", game.Jugador);
		me.pool.register("aplastar", game.Aplastar);
		me.pool.register("creadorNiveles", game.CreadorNiveles);
		me.pool.register("gameover", game.GameOverEntity);
		me.pool.register("ganon", game.Ganon);
		me.pool.register("proyectilGanon", game.ProyectilGanon);
		me.pool.register("plataformafinal", game.PlataformaFinal);
		
		me.pool.register("laser", game.Laser);
		me.pool.register("enemy", game.Enemy);//El primer parametro es el nombre que le queremos asociar, vamos una referencia.
		
		
        // Initialize the audio.
        me.audio.init("mp3,ogg");
 
        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);
 
        // Load the resources.
        me.loader.preload(game.resources);
 
        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
 
 
 
    // Run on game resources loaded.
    "loaded" : function () {
		
		this.menuS=new game.TitleScreen();
		me.state.set(me.state.MENU,this.menuS);
		
		this.gameOverS=new game.GameOverScreen();
		me.state.set(me.state.GAMEOVER,this.gameOverS);
		
        // set the "Play/Ingame" Screen Object
        this.playScreen = new game.PlayScreen();
        me.state.set(me.state.PLAY, this.playScreen);
		
		 // add some keyboard shortcuts
        me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {

            // change global volume setting
            if (keyCode === me.input.KEY.ENTER) {
 				if(!me.state.isPaused())
				{
					this.overlay = new me.ColorLayer("overlay", new me.Color(0, 0, 0, 0.5),99);
					 me.game.world.addChild(this.overlay);
					 me.state.pause(true);
					
				}
				else
				{
					// Remove the overlay later
					me.game.world.removeChild(this.overlay);
					 me.state.resume(true);
				}
					
				
				
				
					
            } 

            // toggle fullscreen on/off
            if (keyCode === me.input.KEY.F) {
                if (!me.device.isFullscreen) {
                    me.device.requestFullscreen();
                } else {
                    me.device.exitFullscreen();
                }
            }
        });
        // start the game
         me.state.change(me.state.MENU);
    }
};