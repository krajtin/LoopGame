
game.Cannon=me.Sprite.extend({
	init:function(x,y,settings)
	{
		this.image = me.loader.getImage("cannon");
		this.poderDisparar=true;
		this.temporizador=0;
		this._super(me.Sprite,"init",[x,y,{
			image:this.image,
			framewidth:30,
			frameheight:31,
			
		}]);
		
	},
	update:function(time)
	{

		this._super(me.Sprite,"update",[time]);
		this.temporizador+=time;
		if(this.poderDisparar && this.temporizador>2000)
			this.disparar();
	},
	disparar:function()
	{
		
			me.game.world.addChild(me.pool.pull("esfera", this.pos.x-this.image.width,this.pos.y+this.image.height,{_objetoCannon:this,direccion:-1}));
			
			this.poderDisparar=false;
	}
});

/************************************************************************************/
/*                                                                                  */
/*        Esfera entidad                                                            */
/*                                                                                  */
/************************************************************************************/
game.Esfera=me.Entity.extend({
	init:function(x,y,settings)
	{
		this._objetoCannon=settings._objetoCannon;
		this.velocidadX=settings.velocidadX || 0;
		this.velocidadY=settings.velocidadY || 0;
		
		
		this._super(me.Entity,"init",[x,y,{
			image:'esfera',
			width:16,
			height:16,
			
		}]);
		 //Variable que se usa para si el objeto de la vista
        this.alwaysUpdate = true;
		this.body.removeShapeAt(0);
		this.body.addShape(new me.Ellipse(0, 0, 16, 16));
		
					
		 //Cuando invocamos el metodo setVelocity(), 
		 // aplicamos a las propiedades .accel.x/.accel.y los valores del parametro,
		 // despues llama al metodo setMaxVelocity() 
		 //que aplica  a .maxVel.y/.maxVel.x el mismo valor que las variables del anterior metodo
		 //
		 
		// this.body.setVelocity(4,4);
		
		// this.body.setMaxVelocity(15,15);
		//Se establece valores a los vectores x y
		//Quien consigue mover el objeto son los vectores vel.x/vel.y
		//
		this.body.vel.set(this.velocidadX,this.velocidadY);
        this.prevVel = this.body.vel.clone();
        this.prev = this.body.pos.clone();
		this.body.collisionType = me.collision.types.ENEMY_OBJECT;
		this.body.gravity=0;
		
		this.renderable.addAnimation ("parpadeo",  [0,1],400);
		this.renderable.setCurrentAnimation("parpadeo");


		
	},
	update:function(time)
	{
		this._super(me.Entity,"update",[time]);
		
		this.body.update(time);
		if (!this.inViewport && (this.pos.y < me.video.renderer.getHeight())) {
            // if yes reset the game
            me.game.world.removeChild(this);
           
				// this._objetoCannon.temporizador=0;
				// this._objetoCannon.poderDisparar=true;
            
            return true;
        }
		
		this.prevVel.setV(this.body.vel);
        this.prev.setV(this.pos);
		me.collision.check(this);
		return true;
	},
	onCollision : function (response, other) {
			switch (other.body.collisionType) {
					case me.collision.types.WORLD_SHAPE:
				
					if(other.type==="seguir")
					{
						return false;
					}
				 
					else
					{
						
					
						if (response.overlapV.y !== 0) {
							this.body.vel.y *= -1;
						} else if (response.overlapV.x !== 0) {
							this.body.vel.x *= -1;
						}
						return false;
					}
                break;

				case me.collision.types.PLAYER_OBJECT:
				
					other.muerto();
					
					return false;
				break;
				default:
				return false;
           
        }


    }
	
});
/************************************************************************************/
/*                                                                                  */
/*        Bloque entidad                                                            */
/*                                                                                  */
/************************************************************************************/
game.Bloque=me.Entity.extend({
	init:function(x,y,settings){
		
		this.esMovH=settings.esMovH || false;
		this.esMovV=settings.esMovV || false;
		this.esMovB=settings.esMovB || false;
		this.esDesaparacer=settings.esDesaparacer || false;
		
		this.scaleX=settings.scaleX || 1;
		this.scaleY=settings.scaleY || 1;
		
		
		this.velocidadX=settings.velocidadX || 0;
		this.velocidadY=settings.velocidadY || 0;
		
		this.trigger=true;
		this.timer_trigger;
		this.timeout =settings.timeout || 2000;
		this.recuperacion=settings.recuperacion || 500;
		
		var maskWidth=settings.width;
		var maskHeight=settings.height;
		settings.image="plataforma";
        // adjust the setting size to the sprite one
		//Si borramos las propiedades width height, melonJS lo cogerá del editor Tiled "Ancho y Alto" en la seccion Atributos
        settings.width = 80;
        settings.height = 19;
		
		

        // Creamos la mascara de colision almacenada en un array
		//Si necesitamos añadir otro tipo de mascara usamos-->  settings.shapes[1] = new me.Rect(0, 0,maskWidth, maskHeight); usando otro indice en el array
        // settings.shapes[0] = new me.Rect(0, 0,settings.width*this.scaleX, settings.height*this.scaleY);
       
       
		//Llamada al constructor
		this._super(me.Entity,"init",[x,y,settings]);
		this.body.removeShapeAt(0);
		this.body.addShape(new me.Rect(0, 0, settings.width*this.scaleX, settings.height*this.scaleY));
		this.body.setVelocity(this.velocidadX,this.velocidadY);
		
		this.body.setMaxVelocity(20,45);
		
		
		this.body.gravity=0;
		this.irIzquierda=false;
		this.walkTop = false;
		this.irArriba=false;
		this.parar=false;
		//Desplazar mascara de colision,si no se inicializa, el valor es de 0.5,0.5.
		//Si queremos que la mascara crezca a partir de la imagen objeto, usamos 0, "this.anchorPoint.set(0, 0.5);"
		
		this.renderable.scale(this.scaleX,this.scaleY);
		  /*Estudiar MAS ADELANTE
		  this.angle = this.angleTo(this).radToDeg();
		  if (this.angle < 0)
		  this.angle = 360 - (-this.angle);
	
		  this.angle = (this.angle - 90).degToRad();
		
		    this.renderable.angle=this.angle;
			//this.renderable.angle=90* Math.PI/180;
	*/
		/*## Variables para moverHorizontal();##*/
        this.startX = this.pos.x;
        this.endX   = this.pos.x + maskWidth - settings.framewidth;
		//Asignamos una variable en el Tiled,si es inicio el objeto empecerá donde lo hemos creado e irá de izquierda a derecha, si es final su posicion será, si es null o no está definido no usará el metodo moverHorizontal();
		
		if(settings.empieceX=="inicio")
		{
			this.walkLeft = true;
		}
		
		else if(settings.empieceX=="final")
		{
			this.walkLeft = false;
			this.pos.x  = this.pos.x + maskWidth - settings.framewidth;
		}
		
		/*##                                    ##*/	
			
		
		
		
		
		this.startY = this.pos.y;
        this.endY   = this.pos.y + maskHeight - settings.frameheight
       
		
		if(settings.empieceY=="inicio")
		{
			this.walkTop = true;
		}
		
		else if(settings.empieceY=="final")
		{
			this.walkTop = false;
			this.pos.y  = this.pos.y + maskHeight - settings.frameheight;

		}
      
		//Tipo de colision
		this.body.collisionType = me.collision.types.WORLD_SHAPE;
		

		
		
	},
	 update : function (time) {

	 
			if(this.esMovV)
				this.moverVertical();
			if(this.esMovH)
				this.moverHorizontal();
			if(this.esMovB)
				this.movimientoBrusco();
			if(this.esDesaparacer)
				this.desaparecer();
       
            this.body.update(time);
			
			 if (this.body.vel.x!=0 || this.body.vel.y!=0 || (this.renderable&&this.renderable.isFlickering())) {
            this._super(me.Entity, 'update', [time]);
            return true;
        }

        return false;
			
			

        

	 },
	 moverVertical:function()
	 {
		  if (this.walkTop && this.pos.y <= this.startY) {
                this.body.vel.y = this.body.accel.y * me.timer.tick;
                this.walkTop = false;
                
            } 
			else if (!this.walkTop && this.pos.y >= this.endY) {
				this.body.vel.y = -this.body.accel.y * me.timer.tick;
                this.walkTop = true;
               
            }

	 },
	 moverHorizontal:function()
	 {
		  if (this.walkLeft && this.pos.x <= this.startX) {
                this.body.vel.x = this.body.accel.x * me.timer.tick;
                this.walkLeft = false;
               
            } 
			else if (!this.walkLeft && this.pos.x >= this.endX) {
				
                this.body.vel.x = -this.body.accel.x  * me.timer.tick;
                this.walkLeft = true;
              
            }
			 

	 },
	 
	movimientoBrusco:function()
	{
		//Creamos una referencia del objeto porque cuando usamos la palabra this
		//dentro del metodo setTimeout para llamar a un metodo de nuestro objeto 
		//se produce un error. Esto ocurre porque la palabra this se establece 
		//como un objeto window (o global).
		//Para poder ejecutar debemos escribir el siguiente codigo
		//"setTimeout(function(){_this.miFuncion()}, 1000);"
		// Mas informacion en https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#The_%27this%27_problem
		//

		
		var _this=this;
		if (this.trigger) {
			if(this.pos.y>=this.endY)
			{
				this.body.vel.y=0;
				this.timer_trigger = setTimeout(function(){_this.stopTimeOut(true)}, 1000);
			}
				
			else
			{
					this.walkTop = false;
					this.body.vel.y = this.body.accel.y * 4  * me.timer.tick;
			}
				
           
        }
        if (!this.trigger) {
			this.walkTop = true;
            this.body.vel.y = -this.body.accel.y * 2  * me.timer.tick;
            if (this.pos.y < this.startY) {
                this.body.vel.y = 0;
				this.walkTop = false;
				this.trigger=true;
				this.esMovB=false;
				
            }
        }
			
		

	},
	desaparecer:function(){
		
		var _this=this;
		if (this.trigger) {
			
			if(!this.timer_trigger)
			this.timer_trigger = setInterval(function(){
				
				_this.renderable.alpha-=0.33;
				
				if(_this.renderable.alpha<=0.05)
				{
					_this.body.collisionType = me.collision.types.NO_OBJECT;
					_this.trigger=false;
					 clearInterval(_this.timer_trigger);
					
					
					
				}
					
			
			}, this.timeout);
			
			
        }
		
        if (!this.trigger) {
			
			this.trigger=true;	
			this.timer_trigger = setTimeout(function(){
				
				_this.renderable.alpha=1;
				_this.body.collisionType = me.collision.types.WORLD_SHAPE;
				clearTimeout(_this.timer_trigger);
				_this.timer_trigger=null;
			}, this.recuperacion);					
            
           
        }
		
	},
	stopTimeOut:function(bool) {
		
		if (bool) {
			this.trigger = false;
			clearTimeout(this.timer_trigger);
		}
	}
	

	 
	
});
/************************************************************************************/
/*                                                                                  */
/*        Jugador entidad                                                            */
/*                                                                                  */
/************************************************************************************/
game.Jugador=me.Entity.extend({
		init:function(x,y,settings)
		{
			
			this.confusion=settings.confusion || 1;
			this.pasarNivel=false;
			this.startX=x;
			this.startY=y
			
			this.allowedToJump = true; // we don't want infinite jumps while jumping :)
        // this flag is false by default. If the player press the jump button, we set it to false.
        // when the jump movement ends (we touch the ground), we allow the player to jump again

        this.maxJumpDistance = 50; // the maximum distance (height) the player can hold the jump button before we cut his movement
        // and he starts falling (he can release before this distance to jump lower)

        this.jumpStartVector = null;

		
			this.contactoPl=false;
			
			this.tiempoSaltando=0;
			
			 
			 //constructor super Entity
			this._super(me.Entity,"init",[x,y,{//Restando el alto de la imagen con el alto del canvas conseguimos que el objeto se instancie justo al limite del ancho del canvas.
				image:"jugador",
				width:30,
				height:30
			}]);
			//asignando vector x,y
			this.body.setVelocity(3,6);
			this.body.setMaxVelocity(3,15);
			
			//Rozamiento del objeto x y
			this.body.setFriction(0.3,0);//Usamos valor 0 en el vector y para que la gravedad actue siempre
			this.body.gravity=0.5;
			this.body.removeShapeAt(0);
			this.body.addShape(new me.Rect(0, 0, 25, 25));
			this.body.collisionType = me.collision.types.PLAYER_OBJECT;
			 this.body.setCollisionMask(me.collision.types.WORLD_SHAPE | me.collision.types.ENEMY_OBJECT | me.collision.types.NO_OBJECT | me.collision.types.ACTION_OBJECT | me.collision.types.PROJECTILE_OBJECT);
			 
			 //Referencia del jugador
			 me.game.jugador = this;
			
		},
		
	    update: function (time) {
			if(!game.data.invisible)
			{
				this.levitacion();
				
			}
			else
				this.body.gravity=0.5;
				
			this._super(me.Entity, "update", [time]);
			
			
			if(this.contactoPl &&(this.body.falling || this.body.jumping))
			{
				this.body.setFriction(0.3,0);
				this.contactoPl=false;
			}
			
			if (me.input.isKeyPressed("left")){
				
            this.body.vel.x =  -this.body.accel.x * me.timer.tick * this.confusion;
				if(this.confusion==1)
					this.renderable.flipX(true);
				else
					this.renderable.flipX(false);
			
			}
			else if(me.input.isKeyPressed("right"))
			{
				
				this.body.vel.x = this.body.accel.x * me.timer.tick * this.confusion;
					if(this.confusion==-1)
						this.renderable.flipX(true);
					else
						this.renderable.flipX(false);

			}
			
				
			
		
		if (me.input.isKeyPressed('up')) {
			
            // if the character is not falling and we are allowed to jump, accelerate up!
            if (!this.body.falling && this.allowedToJump) {
                this.body.jumping = true; // declare that we are jumping
             
                this.body.vel.y = -this.body.accel.y * me.timer.tick; // accelerate
				

                // we store the jump start position to calculate the maximum distance later.
                if (this.jumpStartVector === null) {
					//Con el metodo clone() obtenemos una referencia
					//del objeto Vector2d con todos sus tipos de metodos y atributos
					//
                    this.jumpStartVector = this.pos.clone();
					me.audio.play("saltar_sonido",false,null,0.3);
                }

                
            }
			
			if (this.jumpStartVector !== null) {
				//El metodo distance() retorna la distancia
				//entre el vector pos y el vector del parametro
				//Si el resultado retornado es mayor que la distancia 
				//maxima del salto entonces ya no podrás saltar mas
				//
				if (this.pos.distance(this.jumpStartVector) > this.maxJumpDistance) {
					this.allowedToJump = false;
				}
			}

			// if we reach the ground or something solid, we reset the variables
			// that are used to keep the jumping state.
			//
			if (this.body.vel.y === 0 && !this.allowedToJump) {
				
				this.jumpStartVector = null;
				this.allowedToJump = true;
				this.body.jumping = false;
				
			}
        }
			
		
     
		this.body.update(time);	
		me.collision.check(this);			
		 
			
			//Con el metodo clamp(number inicio,number fin) 
			//conseguimos que el objeto se detenga en las posiciones 
			//indicadas mientras se mueve.En este caso, el objeto se detendra cuando se situe 
			//en la coordenada x0 o en x tamaño del canvas - la imagen suya
			//
			this.pos.x = this.pos.x.clamp(0, me.game.viewport.width - this.width);
			this.pos.y = this.pos.y.clamp(0, me.game.viewport.height - 20);
			
			return true;
		},
		levitacion:function()
		{
			this.body.gravity=0;
			this.body.vel.y=0;
		},
		alReves:function()
		{
			var _this=this;
			me.game.viewport.fadeOut("#FFF", 75);
			this.confusion=-1;
			// if(this.confusion==-1)
			// {
				// window.setTimeout(function()
				// {
					// me.game.viewport.fadeOut("#25A", 75);
					// _this.confusion=1;
				// },10000);
			// }
			
		},
		onCollision: function (res, other) {
			
			switch (other.body.collisionType) {
				case me.collision.types.WORLD_SHAPE:
				
				if (other.type === "seguir") {
					
					if ((res.overlapV.y > 0)) 
					{
						
						this.jumpStartVector = null;
						this.allowedToJump = true;
						this.body.jumping = false;
						
						 // this.body.setFriction(0,0);
						this.contactoPl=true;
						 // this.pos.x= other.pos.x;
						 
						if (other.walkLeft) {
							this.pos.x -= other.body.accel.x;
						}
						if (!other.walkLeft) {
							 this.pos.x += other.body.accel.x;
						}
						
						if (other.walkTop) {
							this.pos.y -= other.body.accel.y;
						}
						
						
						
						
									
					}
					return true;
				}
				if(other.type==="pinchos")
				{
					
					this.muerto();
					return false;

				}
				if(other.type==="rebote")
				{
					if ((res.overlapV.y > 0)) 
						this.body.vel.y= -this.body.accel.y * 5 * me.timer.tick;
					return true;

				}
				if(other.type==="nivel")
				{
					
					this.pasarNivel=true;
					return false;

				}
				if(other.type==="troll")
				{
					if ((res.overlapV.y > 0)) 
					{
						this.jumpStartVector = null;
						this.allowedToJump = true;
						this.body.jumping = false;
						
							if (other.walkTop)
							{
								this.pos.y -= other.body.accel.y * 2;
							}
							
							
						
						
						other.esMovB=true;
						
					}
					return true;

				}
				 if (other.type === "atravesable") {
                    if (this.body.falling  && (res.overlapV.y > 0) 
						&&(~~this.body.vel.y >= ~~res.overlapV.y)){
						
                        // Disable collision on the x axis
                        res.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }
				
				 if (other.type === "confusion") {
                    this.alReves();
					me.game.world.removeChild(other);
                    return false;
                }
				
				
				
				break;		
				case me.collision.types.NO_OBJECT:
				
				return false;
				break;				
				
				case me.collision.types.ENEMY_OBJECT:
				
				return false;
				break;
				case me.collision.types.PROJECTILE_OBJECT:
				me.game.world.removeChild(other);
				this.muerto();
				return false;
				break;
						
				default:
			return false;
				
			}
			
			 // Make the object solid
			return true;
			
			
			
		},
		muerto:function()
		{
			me.game.viewport.fadeIn("#aa2255", 200);
			me.audio.play("muerto_sonido",false,null,0.8);
			this.renderable.flicker(750);
			this.pos.x=this.startX;
			this.pos.y=this.startY;
			game.data.score++;
			
		},
		
});

game.CreadorNiveles=me.LevelEntity.extend({
	
	init:function(x,y,settings)
	{
		//this.nextlevel es una propiedad definida 
		//en la clase y se le asigna el valor de settings.to;
		this.poderTocar=true;
		this._super(me.LevelEntity,"init",[x,y,settings]);
		
	},
	
	onCollision: function (res, other) {
		switch (other.body.collisionType) {
			case me.collision.types.PLAYER_OBJECT:
			if(other.pasarNivel)
				this.goTo(this.nextlevel);
						
			return false;
			break;
			
			return false;
			
		}
			
			
	}
	
	
});

game.GameOverEntity = me.CollectableEntity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
		
        // call the super constructor
        this._super(me.CollectableEntity, 'init', [x, y , settings]);
		this.body.collisionType = me.collision.types.ACTION_OBJECT;

    },

    /**
     * collision handling
     */
    onCollision : function (response) {

        // do something when collide
	
        // switch to GAMEOVER state
        me.state.change(me.state.GAMEOVER);
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        me.game.world.removeChild(this);

        return false;
    }
});
game.Aplastar=me.Entity.extend({
	
	init:function(x,y,settings)
	{
		this.iniciar=false;
		this.trigger=true;
		this.startY = settings.y;
		this.timer_trigger;
		settings.image="cuadrado";
		settings.width=20;
		settings.height=20;
		settings.shapes[0]=new me.Rect(0, 0, 90, 90);
		this._super(me.Entity,"init",[x,y,settings]);
		this.body.setVelocity(0.5,0.5);
		this.body.setMaxVelocity(10,10);
		
		
		this.body.addShape(new me.Rect(20, 20, 45, 45));
		
		this.body.collisionType = me.collision.types.ENEMY_OBJECT;
		this.body.gravity=0;
				
	},
	update:function(time)
	{
		this._super(me.Entity,"update",[time]);
		
		this.body.update(time);
		this.movimientoBrusco(this.iniciar);
		
		return true;
	},
	onCollision: function (res, other) {
			switch (other.body.collisionType) {
				case me.collision.types.PLAYER_OBJECT:
				
					//Si el jugador colisiona con la mascara de colision 1
					if(res.indexShapeB==1)
					other.muerto();
					
					//Si lo hace con el 0 bajará el objeto siempre que su velocidad sea 0
					else if(res.indexShapeB==0 && this.body.vel.y==0)
					{
						this.iniciar=true;
						this.trigger=true;
					}
						

				
				return false;
				break;
				
				
				
			}
			
			
		},
	movimientoBrusco:function(bool)
	{
		
		
		var _this=this;
		if (this.trigger && bool) {
            this.body.vel.y = this.body.accel.y  * me.timer.tick;
            this.timer_trigger = setTimeout(function(){_this.stopTimeOut(true)}, 1000);
        }
        if (!this.trigger) {
            this.body.vel.y = -this.body.accel.y   * me.timer.tick;
            if (this.pos.y < this.startY) {
                this.body.vel.y = 0
				
            }
        }

	},
	stopTimeOut:function(bool) {
		
		if (bool) {
			this.trigger = false;
			clearTimeout(this.timer_trigger);
			this.iniciar=false;
			

		}
	}
	

	
			
	
});

game.Ganon=me.Entity.extend({
	
	init:function(x,y,settings){
	
		me.audio.mute("megaman_2_Castle_Stage");
		me.audio.play("batallaFinal_sonido",false,null,0.08);
		this.vidas=3;
		this.invulnerable=false;
		var width = settings.width;
		var height = settings.height;
		this._jugador;
		this.poderSonar=true;
		this.walkLeft = false;
		this.tiempo=settings.tiempo || 1000;
		this.contador=0;
		settings.width=63;
		settings.height=54;
		this._super(me.Entity,"init",[x,y,settings]);
		this.body.setVelocity(2,2);
		this.body.gravity=0;
		this.body.removeShapeAt(0);
		this.body.addShape(new me.Rect(0,0,60,60));
		this.body.collisionType = me.collision.types.ENEMY_OBJECT;
		this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT | me.collision.types.PROJECTILE_OBJECT);
		this.renderable.scale(2,2);
		
		 
		
		this.startX = this.pos.x;
		this.endX   = this.pos.x + width - settings.framewidth
		
		
		
	},
	update:function(time)
	{
		this._super(me.Entity,"update",[time]);
		if(this.vidas<=0)
		{
			me.game.world.addChild(new game.Bloque(875,200,{framewidth:80,frameheight:19,width:80,height:19}));
			me.game.world.addChild(new game.CreadorNiveles(100,120,{duration:100,fade:null,to:"map6",width:20,height:130}));
			me.audio.play("ganon_die",false,null,0.8);
				

			me.game.world.removeChild(this);
			game.data.invisible=true;
			
		}
			
		if(this.invulnerable)
			this.danno();
		this.body.update(time);
		me.collision.check(this);
		//Almacenamos en el contador la variable time redondeada
		this.contador+=~~time;
		if(this.contador<this.tiempo)
			this.moverHorizontal();
		else if(this.contador>=this.tiempo && this.contador<20000)
			this.youMustDie(this.contador);
		else if(this.contador>20000)
		{
			this.poderSonar=true;
			this.contador=0;
			game.data.invisible=true;
		}
		
		
		return true;
	},
	danno:function()
	{
		this.invulnerable=false;
		this.renderable.flicker(750);
		this.vidas--;
	},
	
	moverHorizontal:function()
	{
		
		  if (this.walkLeft && this.pos.x <= this.startX) {
			  this.walkLeft = false;
		} else if (!this.walkLeft && this.pos.x >= this.endX) {
			   this.walkLeft = true;
		}
	
		this.renderable.flipX(this.walkLeft);
		this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
		
	 
		
	},
	youMustDie:function(contador)
	{
		var posicionProyectil=0;
		//Obtenemos una referencia del jugador del eje x e y
		this._jugador=this.toJugador();
		var _this=this;
		if(this.poderSonar)
		{
			//Detenemos a Ganon
			this.body.vel.x=0;
			
			
			//Si el numero es negativo que mire hacia la izquierda
			//es decir hacia el jugador
			//
			if(this._jugador.x<0)
				this.walkLeft = true;
			else
			{
				this.walkLeft = false;
				posicionProyectil=80;
			}
				
			//Aplicamos el cambio de direccion del sprite
			this.renderable.flipX(this.walkLeft);
		
			this.poderSonar=false;
			me.audio.play("you_must_die", false,function(){
			me.game.world.addChild(new game.ProyectilGanon(_this.pos.x+posicionProyectil,_this.pos.y,{velocidadX:_this._jugador.x,velocidadY:_this._jugador.y}));
			game.data.invisible=false;
				
			},0.2);

		}
		
		 
	},
	 toJugador: function()
    {
        if( me.game.jugador ) {
            return new me.Vector2d(
                me.game.jugador.pos.x
                    + me.game.jugador.width / 2
                    - this.pos.x - this.width / 2,
                me.game.jugador.pos.y
                    + me.game.jugador.height / 2
                    - this.pos.y - this.height / 2
            );
        }
        return;
    },
	onCollision:function(res,other)
	{
		switch (other.body.collisionType) {
			
				case me.collision.types.PLAYER_OBJECT:
				other.muerto();
				return false;
				break;
				case me.collision.types.PROJECTILE_OBJECT:
				if(other.rebote)
				{
					me.game.world.removeChild(other);
					this.invulnerable=true;
				}
				return false;
				break;
				return false;
		}
				
	}
	
});
game.PlataformaFinal=me.Entity.extend({
	init:function(x,y,settings)
	{
		this.golpeado=false;
		
		settings.image="plataformaFinal";
		settings.width=47;
		settings.height=13;
		settings.framewidth=47;
		settings.frameheight=13;
		
		this._super(me.Entity,"init",[x,y,settings]);
		this.body.removeShapeAt(0);
		this.body.addShape(new me.Rect(0, 0, 47*3, 13));
		this.renderable.scale(3,1);
		this.body.setVelocity(1,1);
		this.body.gravity=0;
		this.body.collisionType=me.collision.types.WORLD_SHAPE;
		this.body.setCollisionMask(me.collision.types.PROJECTILE_OBJECT);
		
		
		
	},
	update:function(time)
	{
		this._super(me.Entity,"update",[time]);
		this.body.update(time);
		this.levantar();
		return true;
	},
	levantar:function()
	{
		if(this.golpeado)
		{
			this.body.vel.y=-this.body.accel.y * me.timer.tick;
			this.golpeado=false;
		}
	}
});

game.ProyectilGanon=me.Entity.extend({
	
	init:function(x,y,settings)
	{
		this.rebote=false;
		settings.image="bola_fuego";
		settings.width=160;
		settings.height=56;
		settings.framewidth=80;
		settings.frameheight=56;
		
		this._super(me.Entity,"init",[x,y,settings]);
		this.body.removeShapeAt(0);
		this.body.addShape(new me.Ellipse(0, 0, 52, 55));
		this.anchorPoint.set(0.1, 1.2);
		this.body.vel.set(settings.velocidadX/100,settings.velocidadY/100);
		this.body.setMaxVelocity(10,10);
		this.body.gravity=0;
		this.body.collisionType=me.collision.types.PROJECTILE_OBJECT;
		// this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT | me.collision.types.WORLD_SHAPE );
		
		
		
	},
	
	update:function(time){
		
	
		this._super(me.Entity,"update",[time]);
		this.body.update(time);
		me.collision.check(this);
		
		// this.body.vel.x = (this.body.accel.x * me.timer.tick)/100;
        // this.body.vel.y = (this.body.accel.y * me.timer.tick)/100;
		
		return true;
	},
	onCollision:function(res,other)
	{
		switch (other.body.collisionType) {
							
		case me.collision.types.WORLD_SHAPE:
			if(other.type==="finalJuego")
			{
			this.rebote=true;
			this.body.vel.y*=-1;
			this.body.vel.x*=-1;
			}


			return false;
			break;
			default:
			return false;
		}
	}
	
});


