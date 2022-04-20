/*libraries
1.p5.play.js
sprite libararies : https://molleindustria.github.io/p5.play/docs/classes/Sprite.html 
2. p5.js : https://p5js.org/
*/

var trex, trexAnimation;
var ground, groundImage;
var invisableGround;
var clouds, cloudsImage;
var cactus,
  cactusImage1,
  cactusImage2,
  cactusImage3,
  cactusImage4,
  cactusImage5;
var hours;
var score = 0;
var PLAY = 0;
var END = 2;
var gamestate = PLAY;
var cloudsGroup;
var cactusGroup;
var gameover, gameoverImage;
var restart, restartImage;
var die, jump, checkpoint;
var trexcoll, trexcollAnimation
localStorage["HighestScore"]= 0


// to load the images, audio, and vidieos before using in the program
function preload() {
  trexAnimation = loadAnimation("trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudsImage = loadImage("cloud.png");
  cactusImage1 = loadImage("obstacle1.png");
  cactusImage2 = loadImage("obstacle2.png");
  cactusImage3 = loadImage("obstacle3.png");
  cactusImage4 = loadImage("obstacle4.png");
  cactusImage5 = loadImage("obstacle5.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkpoint.mp3");
  trexcoll = loadImage("trex_collided.png")
}

//to intalize the program and creates the objects
function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(30, height-20, 20, 20);
  trex.addAnimation("trex", trexAnimation);
  trex.addAnimation("colide",trexcoll)
  trex.scale = 0.3;
  ground = createSprite(0, height-20, width, 10);
  ground.addImage("floor", groundImage);
  invisableGround = createSprite(300, height-20, 600, 10);
  invisableGround.visible = false;
  cloudsGroup = new Group();
  cactusGroup = new Group();
  //trext debug
  trex.debug = true;
  //trex.setCollider("circle", -10, 0, trex.y-120);
  trex.setCollider("circle", -10, 0, 40);
  gameover = createSprite(width/2, height/2+100);
  gameover.scale = 0.5;
  gameover.addImage("over", gameoverImage);
  restart = createSprite(width/2, height/2+130);
  restart.scale = 0.5;
  restart.addImage("restart", restartImage);
}

//continusly exucutes comands
function draw() {
  if (gamestate === PLAY) {
    score = score + Math.round(getFrameRate() /60);
    if (keyDown("space") && trex.y >= height-40) {
      trex.velocityY = -9;
      jump.play();
    } 
    else if (keyDown("up") && trex.y >= height-40) {
      trex.velocityY = -9;
      jump.play();
    }
    else if (touches.length>0 && trex.y >= height-40) {
      trex.velocityY = -9;
      jump.play();
      touches=[]
    }
    trex.velocityY = trex.velocityY + 0.5;
    
    ground.velocityX = -(4+score/60)

    //calling my function
    createClouds();
    createCactus();
    if (score % 200 === 0 && score > 0) checkpoint.play();
    if (ground.x < 0) {
      ground.x = ground.width / 5;
    }
    if (cactusGroup.isTouching(trex)) {
     die.play();
      trex.changeAnimation("colide", trexcollAnimation);
      gamestate = END;
      //trex.velocityY=-10
    }
    
    gameover.visible = false;
    restart.visible = false;
  } else if (gamestate === END) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    cactusGroup.setLifetimeEach(-1);
    gameover.visible = true;
    restart.visible = true;

    if ( touches.length>0|| mousePressedOver(restart)) {
      restartGame();
    }
  }
  hours = new Date().getHours();
  console.log(hours);
  if (
    hours === 08 ||
    09 ||
    10 ||
    11 ||
    12 ||
    13 ||
    14 ||
    15 ||
    16 ||
    17 ||
    18 ||
    19 ||
    20
  ) {
    background("black");
  } else if (
    hours === 21 ||
    22 ||
    23 ||
    24 ||
    01 ||
    02 ||
    03 ||
    04 ||
    05 ||
    06 ||
    07
  ) {
    background("black");
  }
  drawSprites();
  text(mouseX + "," + mouseY, mouseX, mouseY);
  textSize(15);
  textFont('retrofont');
  text("score: " + score, width/2-250, height/2+100);
  text("HI Score: "+localStorage["HighestScore"],width/2-100,height/2+100)

  //trex should colied with ground
  trex.collide(invisableGround);

  //check y postion
  //console.log(trex.y);
  // console.log(frameCount)
}

function createClouds() {
  if (frameCount % 100 === 0) {
    clouds = createSprite(width-10, height-35, 50, 10);
    clouds.addImage("cloudy", cloudsImage);
    clouds.scale = Math.random(0.3, 0.5);
    clouds.velocityX = -2;
    clouds.y = Math.round(random((height-100), (height-200)));
    // console.log("clouds are created")
    clouds.depth = trex.depth;
    trex.depth += 1;
    // console.log("clouds depth is: " + clouds.depth)
    // console.log("trex depth is: " + trex.depth)
    // lifetime =distnace/ speed
    // cloudlifetime= 580/2 =290
    clouds.lifetime = clouds.x/clouds.velocityX;
    cloudsGroup.add(clouds);
  }
}

function createCactus() {
  if (frameCount % 80 === 0) {
    cactus = createSprite(width-10, height-35, 10, 50);
    cactus.velocityX = -(4+score/60)
    cactus.lifetime = cactus.x/cactus.velocityX;
    cactus.scale = 0.5;
    var number = Math.round(random(1, 5));
    
    switch (number) {
      case 1:
        cactus.addImage("cactus1", cactusImage1);
        break;
      case 2:
        cactus.addImage("cactus2", cactusImage2);
        break;
      case 3:
        cactus.addImage("cactus3", cactusImage3);
        break;
      case 4:
        cactus.addImage("cactus4", cactusImage4);
        break;
      case 5:
        cactus.addImage("cactus5", cactusImage5);
        break;
        default:break
    }
    cactusGroup.add(cactus);
  }
}

function restartGame() {
  gamestate = PLAY;
  cactusGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("trex", trexAnimation);
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score
  }
  score = 0;
}
