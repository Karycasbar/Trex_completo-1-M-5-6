var trex ,trex_running, trex_colision;
var ImagenSuelo;
var sueloInvisible;
var nube, ImagenNube;
var obstaculo, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var obstaclesGroup, cloudsGroup;
var restart, restartImg, gameOver, gameOverImg;
var jumpSound, dieSound, checkSound;
function preload(){ //funcion para precargar archivos(imagenes, audio y videos)
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");  
  ImagenSuelo = loadImage("ground2.png");
  ImagenNube = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  trex_colision = loadImage("trex_collided.png");

  jumpSound = loadSound("jump.mp3"); //loadSound es para cargar archivos de audio
  dieSound = loadSound("die.mp3");
  checkSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(600,200)//canvas crea el area del juego

  
  //crear sprite de Trex
  trex = createSprite(50,180,20,50); 
  trex.addAnimation("running", trex_running); //Asignar la animacion de correr  
  trex.addAnimation("collided", trex_colision); //Asignar la animacion de colisionar
  trex.scale = 0.5; //escala
  

  //crear sprite del suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", ImagenSuelo);

  //crear sprite del suelo invisible
  sueloInvisible = createSprite(200,190,400,10);
  sueloInvisible.visible = false; //cambiar la visibilidad del sprite para que sea falso y asi no verla

  //crear grupos de obstaculos y nubes
  obstaclesGroup = new Group(); //asi de crea el grupo para los obstaculos
  cloudsGroup = new Group(); //asi de crea el grupo para las nube

  restart = createSprite(300,140);
  restart.addImage(restartImg);

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);

  restart.scale = 0.5;
  gameOver.scale = 0.5;
}

function draw(){
  background("white"); //para poner el color de fondo
  text("Puntuación " + score, 500, 50); //asi creamos el texto en el juego  

  //Estados de juego
  if(gameState === PLAY){ //condicion para poder crear el estado del juego PLAY (jugar)
    ground.velocityX = -(6 + score/100); //mover el suelo

    //generar puntuación
    score = score + Math.round(getFrameRate() / 60); //FrameRate se usa para obtener los frames por segundo, lo cual hace que la puntuacion sea lenta
    if(score > 0 && score % 100 === 0){ //con esta condición checamos que en puntación sea mayor a 0 y que puntuacion obtengamos cada 100 frames lo cual nos ayudara con el sonido
      checkSound.play(); //play nos ayuda a reproducir el sonido cuando se indique
    }

    //reiniciar el suelo
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

  //salto del trex
  if(keyDown("space") && trex.y >= 160){
    trex.velocityY = -10;
    jumpSound.play();
  }
  //caida/gravedad del trex
  trex.velocityY = trex.velocityY + 0.5;

  //llamado de la función de nubes
    spawnClouds();

    //llamado de la función de obstaculos
      spawnObstacles();

//cambiar el estado a game over
  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
    dieSound.play();
  }

  gameOver.visible = false;
  restart.visible = false;

  }
  else if(gameState === END){
    //detener el suelo
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    gameOver.visible = true;
    restart.visible = true;

    //cambiar la animación del Trex
    trex.changeAnimation("collided", trex_colision);

    //establecer lifetime de los objetos para que no sean destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    }
  }

  //console.log(trex.y);


 


  //evitar que el trex caiga
  trex.collide(sueloInvisible);



  drawSprites();
}

function spawnClouds(){
  if(frameCount % 60 === 0){ 
  nube = createSprite(600, 100, 40, 10);
  nube.addImage(ImagenNube);
  nube.y = Math.round(random(10,60))
  nube.scale = 0.4;
  nube.velocityX = -(6 + score/100);

  //ajustar la profundidad
  nube.depth = trex.depth;
  trex.depth = trex.depth + 1;

  //asignar ciclo de vida
  nube.lifetime = 210;

  //agregar cada nube al grupo
  cloudsGroup.add(nube);
  }
}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    obstaculo = createSprite(600, 165, 10, 40);
    obstaculo.velocityX = -(6 + score/100);

    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstaculo.addImage(obstacle1);
      break;
      case 2: obstaculo.addImage(obstacle2);
      break
      case 3: obstaculo.addImage(obstacle3);
      break
      case 4: obstaculo.addImage(obstacle4);
      break
      case 5: obstaculo.addImage(obstacle5);
      break
      case 6: obstaculo.addImage(obstacle6);
      break
      default: break;
    }
    //asignar escala y tiempo de vida
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 210;

    //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstaculo);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  score = 0;
}
