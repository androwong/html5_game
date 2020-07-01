/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isJumping;
var game_score = 0;
var flagpole;
var lives;
var platforms;
var enemies;


function setup()
{
	createCanvas(1024, 576);
    lives = 4;
    startGame();
}
function startGame() {
    
    floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isJumping = false;

	// Initialise arrays of scenery objects.
    
    trees_x = [100, 352, 488, 852, 1024, 1700];
    
    clouds = [{x_pos: 400, width: 100}, {x_pos: 700, width: 100}, {x_pos: 100, width: 100}]
    
    mountain = [{x_pos: 400, y_pos: 100}, {x_pos: 800, y_pos: 100}, {x_pos: 100, y_pos: 100}]
    
    canyon = [{x_pos: 300, width: 100},{x_pos: 700, width: 100},{x_pos: 100, width: 100}]
    
    collec = [{x_pos: 700, y_pos: 432, size: 40, isFound:false},
    {x_pos: 1400, y_pos: 432, size: 40, isFound:false},
    {x_pos: 2000, y_pos: 432, size: 40, isFound:false}];
    
    flagpole = {x_pos: 3000, isReached: false};

    lives--;

    platforms = [];
    enemies = [];

    platforms.push(createPlatform(600, floorPos_y - 100, 100));
    platforms.push(createPlatform(1000, floorPos_y - 150, 100));

    enemies.push( new Enemy(0, floorPos_y,100));
    enemies.push( new Enemy(1000, floorPos_y,200));
    
}
function draw()
{
    
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos,0);

	// Draw clouds.
   drawClouds();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();

    renderFlagpole();
    if (!flagpole.isReached) {
        checkFlagpole();
    }
    
	
    // Draw t_collec items.
    
    for (var i = 0; i < collec.length; i++)
    {
        if (collec[i].isFound == false)
        {
           drawCollec(collec[i]);
           checkCollec(collec[i]);

        }
        
    }
// Draw canyons.
    
    for (var i = 0; i < canyon.length; i++)
    {
        
        drawCanyon(canyon[i])
        checkCanyon(canyon[i])
        
    }

    for(var i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }

    for(var i=0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].isContact(gameChar_world_x, gameChar_y))
        {
            //console.log("you die!");
            startGame();
            break;
        }
            
    }
     pop();
    
	// Draw game character.
	
    drawGameChar();
     
    if(gameChar_y < floorPos_y)
    {
        //console.log(gameChar_y, floorPos_y);
        var isContact = false;
        for( var i =  0; i < platforms.length; i++) {
            if (platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                {
                    isContact = true;
                    break;
                }
        }
        if(isContact == false)
        {
            gameChar_y += 2;
            isFalling = true;
        }
        else
        {
            isFalling = false;
        }
    }
    else
    {
        isFalling = false;
    }


	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -=  5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight && !flagpole.isReached)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    
    // Logic to make the game character rise and fall.
    if(gameChar_y > floorPos_y){
        gameChar_y +=2;
        isFalling = true;
    }
    // else{
    //     isFalling = false;
    // }
    if(isFalling && gameChar_y == floorPos_y){
        
        gameChar_y = floorPos_y - 100;
        
    }
    // else
    // {
    //     isFalling = false;
    // }
    
   if(gameChar_y !== floorPos_y && isFalling)
    {
        gameChar_y += 4;
    }
    if(gameChar_y > 700 && lives >= 1) {
        startGame();
    }
    if(lives < 1) {
        textSize(50);
        text("Game Over. Press space to continue", 160, 200);
        fill(0, 102, 153);
    }
    if(flagpole.isReached === true) {
        textSize(50);
        text("Reached. Press space to continue", 160, 200);
        fill(0, 102, 153);
    }
    

	// Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;
    
        
    
    textSize(32);
    text("lives: "+ lives, 160, 30);
    fill(0, 102, 153);

    textSize(32);
    text("score: "+ game_score, 10, 30);
    fill(0, 102, 153);

    //console.log(isFalling);
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	
//    if(keyCode == 37)
//    {
//        isLeft = true;
//        console.log("isLeft:" + isLeft);
//    } 
//    if(keyCode == 39)
//    { 
//        isRight = true;
//        ("isRight:" + isRight);
//    }
//    
//    if(keyCode == 32)
//    {
//        isJumping = true;
//        ("isJumping:" + isJumping);
//    }
    if(flagpole.isReached && key == ' ')
    {
        return ToStart();

    } else if(lives == 0 && key == ' ')
    {
        return ToStart();
        
    }
    if(key == "A" || keyCode == 37)
    {
        isLeft = true;
    } 
    if(key == "D" || keyCode == 39)
    { 
        isRight = true;
        ("isRight:" + isRight);
    }
    
    if(key == " " || key == "W")
    {
       if(!isFalling)
           {
               gameChar_y -=150;
           }
     
    }

}

function keyReleased()
{

	if(key == "A" || keyCode == 37)
    {
        isLeft = false;
    }
    
    if(key == "D" || keyCode == 39)
    { 
        isRight = false;
        ("isRight:" + isRight);
    }
         
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    
    	if(isLeft && isFalling)
	{
		// add your jumping-left code
    stroke(1)
        fill(77, 166, 255)
        rect(gameChar_x-8,gameChar_y-47,15,20)
        rect(gameChar_x-5,gameChar_y-27,6,10)
        rect(gameChar_x-5,gameChar_y-17,15,5)//Body
        line(gameChar_x,gameChar_y-27,gameChar_x-4,gameChar_y-27)//Outlines
        rect(gameChar_x-2,gameChar_y-47,5,22)//Arms
        stroke(1)
        rect(gameChar_x-5,gameChar_y-57,10,10)//Head
        fill(0,0,153)
        rect(gameChar_x+10,gameChar_y-18,5,10)//Shoes
        line(gameChar_x-2,gameChar_y-50,gameChar_x-1,gameChar_y-51)
        line(gameChar_x-4,gameChar_y-50,gameChar_x-2,gameChar_y-50)//Mouth
        fill(255,255,255)
        ellipse(gameChar_x-2,gameChar_y-53,3,3)//Eyes
        noStroke()
        fill(255,153,0)
        triangle(gameChar_x-4,gameChar_y-57,gameChar_x+6,gameChar_y-62,gameChar_x+6,gameChar_y-57)
        triangle(gameChar_x-5,gameChar_y-57,gameChar_x-5,gameChar_y-62,gameChar_x+4,gameChar_y-57)//crown 
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
    stroke(1)
        fill(77, 166, 255)
        rect(gameChar_x-8,gameChar_y-47,15,20)
        rect(gameChar_x-2,gameChar_y-27,6,10)
        rect(gameChar_x-11,gameChar_y-17,15,5)//Body
        line(gameChar_x,gameChar_y-27,gameChar_x-4,gameChar_y-27)//Outlines
        rect(gameChar_x-4,gameChar_y-47,5,22)//Arms
        stroke(1)
        rect(gameChar_x-5,gameChar_y-57,10,10)//Head
        fill(0,0,153)
        rect(gameChar_x-16,gameChar_y-18,5,10)//Shoes
        line(gameChar_x+1,gameChar_y-50,gameChar_x,gameChar_y-51)
        line(gameChar_x+4,gameChar_y-50,gameChar_x+1,gameChar_y-50)//Mouth
        fill(255,255,255)
        ellipse(gameChar_x+3,gameChar_y-53,3,3)//Eyes
        noStroke()
        fill(255,153,0)
        triangle(gameChar_x-4,gameChar_y-57,gameChar_x+6,gameChar_y-62,gameChar_x+6,gameChar_y-57)
        triangle(gameChar_x-5,gameChar_y-57,gameChar_x-5,gameChar_y-62,gameChar_x+4,gameChar_y-57)//crown  


	}
	else if(isLeft)
	{
		// add your walking left code
    stroke(1)
        fill(77, 166, 255)
        rect(gameChar_x-8,gameChar_y-47,15,20)
        rect(gameChar_x-4,gameChar_y-27,9,20)//Body
        line(gameChar_x,gameChar_y-27,gameChar_x-4,gameChar_y-27)//Outlines
        rect(gameChar_x-2,gameChar_y-47,5,22)//Arms
        stroke(1)
        rect(gameChar_x-5,gameChar_y-57,10,10)//Head
        fill(0,0,153)
        rect(gameChar_x-7,gameChar_y-9,13,5)//Shoes
        line(gameChar_x-2,gameChar_y-50,gameChar_x-1,gameChar_y-51)
        line(gameChar_x-4,gameChar_y-50,gameChar_x-2,gameChar_y-50)//Mouth
        fill(255,255,255)
        ellipse(gameChar_x-2,gameChar_y-53,3,3)//Eyes
        noStroke()
        fill(255,153,0)
        triangle(gameChar_x-4,gameChar_y-57,gameChar_x+6,gameChar_y-62,gameChar_x+6,gameChar_y-57)
        triangle(gameChar_x-5,gameChar_y-57,gameChar_x-5,gameChar_y-62,gameChar_x+4,gameChar_y-57)//crown
	}
	else if(isRight)
	{
		// add your walking right code
    stroke(1)
        fill(77, 166, 255)
        rect(gameChar_x-8,gameChar_y-47,15,20)
        rect(gameChar_x-6,gameChar_y-27,9,20)//Body
        line(gameChar_x,gameChar_y-27,gameChar_x-4,gameChar_y-27)//Outlines
        rect(gameChar_x-4,gameChar_y-47,5,22)//Arms
        stroke(1)
        rect(gameChar_x-5,gameChar_y-57,10,10)//Head
        fill(0,0,153)
        rect(gameChar_x-7,gameChar_y-9,13,5)//Shoes
        line(gameChar_x+1,gameChar_y-50,gameChar_x,gameChar_y-51)
        line(gameChar_x+4,gameChar_y-50,gameChar_x+1,gameChar_y-50)//Mouth
        fill(255,255,255)
        ellipse(gameChar_x+3,gameChar_y-53,3,3)//Eyes
        noStroke()
        fill(255,153,0)
        triangle(gameChar_x-4,gameChar_y-57,gameChar_x+6,gameChar_y-62,gameChar_x+6,gameChar_y-57)
        triangle(gameChar_x-5,gameChar_y-57,gameChar_x-5,gameChar_y-62,gameChar_x+4,gameChar_y-57)//crown 

	}
	else if(isFalling || isJumping)
	{
		// add your jumping facing forwards code
    stroke(1)
        fill(77, 166, 255)
        rect(gameChar_x-8,gameChar_y -46,15,30)//Body
        rect(gameChar_x-22,gameChar_y-47,15,5)
        rect(gameChar_x+7,gameChar_y-47,15,5)//Arms
        stroke(1)
        rect(gameChar_x-5,gameChar_y-57,10,10)//Head
        fill(0,0,153)
        rect(gameChar_x-7,gameChar_y-16,5,4)
        rect(gameChar_x+1,gameChar_y-16,5,4)//Shoes
        line(gameChar_x-8,gameChar_y-28,gameChar_x+7,gameChar_y-28)
        line(gameChar_x,gameChar_y-22,gameChar_x,gameChar_y-16)//Seperation
        fill(255,255,255)
        ellipse(gameChar_x+.5,gameChar_y-49,4,3)//Mouth//Mouth
        fill(255,255,255)
        ellipse(gameChar_x-2,gameChar_y-53,3,1.5)
        ellipse(gameChar_x+3,gameChar_y-53,3,1.5)//Eyes
        noStroke()
        fill(255,153,0)
        triangle(gameChar_x-4,gameChar_y-57,gameChar_x+6,gameChar_y-62,gameChar_x+6,gameChar_y-57)
        triangle(gameChar_x-5,gameChar_y-57,gameChar_x-5,gameChar_y-62,gameChar_x+4,gameChar_y-57)//crown

	}
	else
	{
		// add your standing front facing code
    stroke(1)
        fill(77, 166, 255)
        rect(gameChar_x-8,gameChar_y -46,15,40)//Body
        rect(gameChar_x-13,gameChar_y-47,5,22)
        rect(gameChar_x+7,gameChar_y-47,5,22)//Armsc
        stroke(1)
        rect(gameChar_x-5,gameChar_y-57,10,10)//Head
        fill(0,0,153)
        rect(gameChar_x-10,gameChar_y-7,9,5)
        rect(gameChar_x,gameChar_y-7,9,5)//Shoes
        line(gameChar_x-8,gameChar_y-28,gameChar_x+7,gameChar_y-28)
        line(gameChar_x,gameChar_y-20,gameChar_x,gameChar_y-8)//Seperation
        line(gameChar_x-3,gameChar_y-50,gameChar_x+3,gameChar_y-50)//Mouth
        fill(255,255,255)
        ellipse(gameChar_x-2,gameChar_y-53,3,1.5)
        ellipse(gameChar_x+3,gameChar_y-53,3,1.5)//Eyes
        noStroke()
        fill(255,153,0)
        triangle(gameChar_x-4,gameChar_y-57,gameChar_x+6,gameChar_y-62,gameChar_x+6,gameChar_y-57)
        triangle(gameChar_x-5,gameChar_y-57,gameChar_x-5,gameChar_y-62,gameChar_x+4,gameChar_y-57)//crown 
    

	}
    
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds(t_clouds)
{
    for(var i = 0; i < clouds.length; i++)
    {
    fill(255);
	ellipse(clouds[i].x_pos + 100,100,clouds[i].width - 30,50);
    ellipse(clouds[i].x_pos + 150,100,clouds[i].width - 50,50);
    ellipse(clouds[i].x_pos + 50,100,clouds[i].width - 50,50);
    ellipse(clouds[i].x_pos + 100,70,clouds[i].width - 20,60);
    ellipse(clouds[i].x_pos + 100,105,clouds[i].width - 20,60);
   
    }
    
}

// Function to draw mountains objects.

function drawMountains(t_mountains)
{
    for (var i = 0; i < mountain.length; i++)
    {
   noStroke();
    fill(128,128,128);
    triangle(mountain[i].x_pos+300,mountain[i].y_pos+332,mountain[i].x_pos+600,mountain[i].y_pos+332,mountain[i].x_pos+ 450,mountain[i].y_pos+50); triangle(mountain[i].x_pos+250,mountain[i].y_pos+332,mountain[i].x_pos+365,mountain[i].y_pos+332,mountain[i].x_pos+ 310,mountain[i].y_pos+225);

    }
    
}

// Function to draw trees objects.

function drawTrees(t_trees)
{  
    for(var i = 0; i < trees_x.length; i++)
    {
    fill(102,51,0)
        rect(trees_x[i] + 300,floorPos_y - 80,20,80)
        fill(0,204,0);
        triangle(trees_x[i]+280,floorPos_y -62,trees_x[i]+310,floorPos_y - 132,trees_x[i]+340,floorPos_y- 62);
        triangle(trees_x[i]+280,floorPos_y - 82,trees_x[i]+310,floorPos_y-152,trees_x[i]+340,floorPos_y-82);
    }
    
}

// ---------------------------------
// Canyon render and check functions0
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(204,102,0)
    rect(t_canyon.x_pos + 80,floorPos_y,20,80)
    rect(t_canyon.x_pos +140,floorPos_y,20,80)
    rect(t_canyon.x_pos +100,floorPos_y,40,40)
    fill(0,128,255)
    rect(t_canyon.x_pos +100,floorPos_y +30,40,60)
    rect(t_canyon.x_pos+ 80,floorPos_y + 80,80,65)

} 

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{ 
    if(gameChar_world_x < (t_canyon.x_pos + 160) && gameChar_world_x > (t_canyon.x_pos +85) && gameChar_y >= floorPos_y){
        isJumping = true;
        gameChar_y += 9;
        
    }

}

// ----------------------------------
// t_collec items render and check functions
// ----------------------------------

// Function to draw t_collec objects.

function drawCollec(t_collec)
{ 
    noFill();
    strokeWeight(5);
    stroke(192,1192,192);
    ellipse(t_collec.x_pos,t_collec.y_pos -20, t_collec.size,t_collec.size);
    fill(0,128,255);
    stroke(255);
    strokeWeight(1);
    quad(t_collec.x_pos - 5, t_collec.y_pos - t_collec.size, t_collec.x_pos -10, t_collec.y_pos - (t_collec.size + 15),
    t_collec.x_pos + 10, t_collec.y_pos -(t_collec.size + 15),
    t_collec.x_pos + 5, t_collec.y_pos - t_collec.size);
    noStroke();
}

// Function to check character has collected an item.

function checkCollec(t_collec)
{ 
    var d = dist(gameChar_world_x, gameChar_y, t_collec.x_pos, t_collec.y_pos);
    //console.log("Distance" + d);
    
    if(d < (t_collec.size))
    {
        t_collec.isFound = true;
        game_score++;
    }
}

// Function to draw your flagpole
function renderFlagpole(t_flagpole) {
    fill(0,200,255);
    rect(flagpole.x_pos + 80,floorPos_y - 180, 10, 180);
    fill(255,0,0);
    triangle(flagpole.x_pos + 90,floorPos_y -177, flagpole.x_pos + 132, floorPos_y - 147, flagpole.x_pos + 90, floorPos_y - 117);
    if(gameChar_world_x >= flagpole.x_pos){
        flagpole.isReached = true;
    }
    else{
        flagpole.isReached = false;
    }
}
function checkFlagpole() {
    if(dist(gameChar_world_x, 0, flagpole.x_pos,0) < 20) {
        flagpole.isReached = true;
    }
}

function ToStart() {
    lives =4;
    game_score = 0;
    startGame();
}


function createPlatform(x,y,length) {
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
           fill(255,255,0);
           stroke(0);
           rect(this.x, this.y, this.length, 20);
        },

        checkContact: function(gc_x, gc_y)
        {
            //checks whether game character is incontact with the platform
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}


function Enemy(x,y,range) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;

    this.draw = function()
    {
        fill(0);
        ellipse(this.current_x, this.y - 25, 50);
        fill(255);
        ellipse(this.current_x - 5, this.y - 25, 5);
        ellipse(this.current_x + 5, this.y - 25, 5);

        stroke(255);
        line(this.current_x - 15, this.y - 35, this.current_x-5, this.y-30);
        line(this.current_x + 15, this.y - 35, this.current_x+5, this.y-30);
    }

    this.update = function() 
    {
        this.current_x += this.incr;
        if(this.current_x < this.x) {
            this.incr = 1;
        } else if(this.current_x > this.x + this.range)
        {
            this.incr = -1;
        }
    }
    this.isContact = function(gc_x, gc_y)
    {
        //return true if contact is made
        var d = dist(gc_x, gc_y, this.current_x, this.y);

        if(d < 25)
        {
            return true;
        }
        return false;
    }
}