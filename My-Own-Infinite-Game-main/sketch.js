var PLAY = 1;
var END = 0;
var gameState = PLAY

var canvas
function preload() {

    frog_running = loadAnimation("frog-running.png", "frog-running_2.png", "frog-running_3.png", "frog-running_4.png");
    frog_dead = loadAnimation("dead_3.png")
    frog_jump = loadImage("frog-jump.png")
    frogImg = loadImage("frog-idle.png");
    groundImage = loadImage("ground.png");
    crocodileImg = loadAnimation("crocodile.png","crocodile_2.png", "crocodile_open.png", "crocodile_open_2.png")
    backgroundImg = loadImage("background.jpg")
    restartImg = loadImage("restart.png")
    birdImg = loadImage("bird.png")
    jump_fall = loadImage("jump_fall.png")
    nightbackground = loadImage("night_background.jpg")

}

function setup() {
    canvas = createCanvas(windowWidth,windowHeight);
    frog = createSprite(300, height-250, 50, 50)
    frog.addAnimation("running", frog_running)
    frog.addAnimation("dead", frog_dead)
    frog.addAnimation("jumping", frog_jump)
    frog.addAnimation("jumpfall", jump_fall)
    frog.scale = 0.3
    frog.depth = 1

    restart = createSprite(width/2, 45);
    restart.addImage(restartImg);

    score = 0
    score.depth = 2

    background1 = createSprite(width/2, height/2,width,height)
    background1.addImage(backgroundImg)
    background1.depth = -1
    background1.scale = 1.3

    


    ground = createSprite(width/2, height+230, width, 20);
    ground.addImage("ground", groundImage);


    invisibleGround = createSprite(200,height-120, 400, 20);
    invisibleGround.visible = false;

    crocodilesGroup = createGroup();
    birdGroup = createGroup()

}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function draw() {
    background(200)
    drawSprites()
    textSize(20)
    text("Score: " + score, width - 210, 50);

    if (gameState === PLAY) {
        //scoring
        score = score + Math.round(getFrameRate() / 60);
        if (ground.x < 0) {
            ground.x = ground.width / 2;

        }


        if (frog.y >= height-350 && keyDown("space")) {
            frog.velocityY = -20;
            frog.changeAnimation("jumping")
        }

        if (frog.isTouching(invisibleGround)) {
            frog.changeAnimation("running")
        }

        if (frog.velocityY >= 5) {
            frog.changeAnimation("jumpfall")
        }

        ground.velocityX = -(8 + 3 * score / 100)

        if (crocodilesGroup.isTouching(frog) || (birdGroup.isTouching(frog))) {
            gameState = END;
        }

        //add gravity
        frog.velocityY = frog.velocityY + 0.8
        frog.collide(invisibleGround);

        if(mousePressedOver(backgroundImg)){
            background2 = createSprite(960, 500, 50, 50)
             background2.addImage(nightbackground)
                 background2.depth = -1
                   background2.scale = 5
        }

        spawnBird()
        spawnCrocodile()

    }
    else if (gameState === END) {

        //setting the velocity of each object to 0
        ground.velocityX = 0;
        frog.velocityY = 0;
        crocodilesGroup.setVelocityXEach(0);

        if (mousePressedOver(restart)) {
			reset();
		}

        //changing the frog animation
        frog.changeAnimation("dead", frog_dead);

        //setting lifetime of the game objects so that they are never destroyed
        crocodilesGroup.setLifetimeEach(-1);

    }
}

function spawnCrocodile() {
    if (frameCount % 120 === 0) {
        crocodile = createSprite(width+100, height-150, 50, 50)
        crocodile.addAnimation("crocodile", crocodileImg)
        crocodile.velocityX = -(6 + score / 100);
        crocodile.setCollider("rectangle", -55, 0, 100, 70)


        //giving the scale and lifetime to the crocodile           
        crocodile.scale = 0.8;
        crocodile.lifetime = 1000;

        //adding every crocodile to the group 
        crocodilesGroup.add(crocodile);
    }
}


function spawnBird() {
    if (frameCount % 200 === 0) {
        bird = createSprite(1900, 500, 50, 50)
        bird.addImage(birdImg)
        bird.velocityX = -(6 + score / 100);
        bird.scale = 7


        //giving the scale and lifetime to the crocodile           
        bird.scale = 2;
        bird.lifetime = 1000;

        //adding every crocodile to the group 
        birdGroup.add(crocodile);
    }
}

function reset() {
    gameState = PLAY
    crocodilesGroup.destroyEach()
    birdGroup.destroyEach()
    frog.changeAnimation("running")
    score = 0

}

