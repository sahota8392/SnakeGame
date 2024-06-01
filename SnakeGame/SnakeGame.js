const canvas = document.getElementById('game'); //linking javascript const to the html canvas where we set the width and height and location of canvas
const ctx = canvas.getContext('2d');  //context is assigned canvas and 2D, can give 3D


//just setting values which we used to create function to stop snake hitting own body
class SnakePart {                
    constructor(x,y) {
        this.x = x; 
        this.y = y;
    }
}

//if you open console on browser and see drawgame there, it will show the speed 
let speed = 7;  
let tileCount = 20;                            //saying 20 tiles in the canvas across down
let tileSize = (canvas.width/tileCount)-5;    //size of the snake compared to the tiles, reducing it further by 5
let headX = 10;         //positioning the head of the snake with tileCount we set - 10 across 
let headY = 10;         //position the end of snake - 10 down
const snakeParts = [];  //we modify contents only so we use CONST
let tailLength = 0;     //beginning length of the tail
//setting position of the "apple" you will eat with snake
let appleX = 5;         
let appleY = 5;
//these are variables to move the snake, values change based on arrows
let xVelocity=0;  
let yVelocity=0;
let score = 0;
let appleColor = 'white';   //default apple color (micro A)
let isPaused = false;       //pause-resume (micro B)
let highscore = 0;          //highest score (micro C)


document.addEventListener('keydown', keyDown);              //arrow keys start the game moving snake
document.addEventListener('keydown', togglePauseResume);    //pause and resume
document.addEventListener('DOMContentLoaded', () => {fetchHighScore();});   //highest score updates

//highest Score
async function fetchHighScore() {
    try {
        const response = await fetch('http://localhost:3500/highscore');
        const data = await response.json();
        highscore = data.highscore;
        document.getElementById("highscore").innerText = highscore;
    } catch (error) {
        console.error('Error fetching high score', error);
    }
}

fetchHighScore();

//sound to make when you eat apple and GameOver Sound
const HissSound = new Audio("SnakeHiss.mp3");
const GameOver = new Audio("GameOver.mp3");

//Pause-Resume
async function togglePauseResume(event) {
    if (event.keyCode == 32) {
        try {
            const response = await fetch('http://localhost:4500/pause-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            isPaused = data.isPaused;
        } catch (error) {
            console.error('Error in pause/resume', error);
        }
    }
}

async function updateHighScoreOnServer(newHighScore) {
    try {
        await fetch('http://localhost:3500/highscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score: newHighScore })
        });
    } catch (error) {
        console.error('Error updating high score', error);
    }
}

async function fetchPauseResumeStatus() {
    try {
        const response = await fetch('http://localhost:4500/status');
        const data = await response.json();
        isPaused = data.isPaused;
    } catch(error) {
        console.error('Error fetching status for pause/resume', error)
    }
}

function drawGame(){
    if(isPaused){
        setTimeout(drawGame, 1000/speed);
        return;
    }

    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return;
    }

    console.log('draw game');     //during creation, seeing the speed increase
    clearScreen();
    checkAppleCollison();
    drawApple();
    drawSnake();
    drawScore();

    if(score >2){
        speed = 10;
    }
    if(score>10){
        speed = 14;
    }
    if(score > 30){
        speed= 17;
    }
    if(score >50){
        speed = 25;
    }
    setTimeout(drawGame, 1000/speed);
}

//gameOver defaulted to false saying game is not over or not true
function isGameOver(){
    let gameOver= false;        

//if x and y velocity is 0, game is not started nor is it over
    if (yVelocity ===0 && xVelocity ===0) { 
        return false;
    }

//walls set if you hit the walls, game over
    if(headX < 0){                              //left wall, 0 is the index in the tiles basically, same as below
        gameOver = true;
    }
    else if(headX === tileCount){               //right wall
        gameOver = true;
    }
    else if(headY < 0){                         //top wall
        gameOver = true;
    }
    else if(headY === tileCount){               //bottom wall
        gameOver = true;
    }

//can't hit own body, if we don't use the velocity if in Row 97, this will be gameover right away as body touches itself in beginning
    for (let i=0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x == headX && part.y == headY){
            gameOver=true;
            break;
        }    
    }
//if game is over, show this message and play this sound
    if(gameOver) {
        GameOver.play();
        ctx.fillStyle = "white";
        ctx.font ="70px Impact";

//can use the graident effect below if we don't want the white effect from above
        const gradient = ctx.createLinearGradient(0,0,canvas.width,0);
        gradient.addColorStop("0", "goldenrod");
        gradient.addColorStop("0.5", "yellow");
        gradient.addColorStop("1", "yellowgreen");
        ctx.fillStyle=gradient;
        ctx.fillText("Game Over!", canvas.width/12, canvas.height/2);
    }
    return gameOver;
}

function drawScore() {
    ctx.fillStyle="white";
    ctx.font= "10px Verdana";
    ctx.fillText ("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {  //styles below are way to give style without CSS
    ctx.fillStyle = '#96AB98';
    ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
}


function drawSnake() {
//color of the snake body as it grows
    ctx.fillStyle ='black';
    for(let i=0; i < snakeParts.length; i++){
        let part = snakeParts[i];   //getting item from the snakeParts array item
            ctx.fillRect((part.x*tileCount), (part.y*tileCount), tileSize, tileSize); 
//the part.x and part.y are coming from the constructor class-row 7
    }

//can use the IF FUNCTION below but we use WHILE so we can penalize if snake hits wall or itself
    snakeParts.push(new SnakePart(headX, headY)) //putting in positon of where head was
    while(snakeParts.length > tailLength){ 
//if snakepart length is greater than tail length we are removing the first item in the list; that's the furthest away from the head
        snakeParts.shift(); 
//remove furthest item from the beginning snake head if more than tail length, if we don't use, the tail length doesn't stop
    }

    ctx.fillStyle = 'maroon';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
/*  ctx is referring to the canvas in 2D-we can use 3d too
-Rect is the shape of the snake (headX and headY * tileCount positoins in tile map)
-width and height are set to the tileSize
    */
}


function changeSnakePosition() {
//will change the head position
    headX = headX + xVelocity;  
    headY = headY + yVelocity;
}

//the apple snake will eat, color and the location and size of it
function drawApple(){
    ctx.fillStyle = appleColor;   //will update appleColor when apple is eaten
    ctx.fillRect((appleX * tileCount), (appleY * tileCount), tileSize, tileSize);
}

//code to move the white apple to each different random location
function checkAppleCollison(){  
    if(appleX === headX && appleY === headY){
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        if(score > highscore){     //highest score, localStorage updates if score is higher
            highscore = score;
            localStorage.setItem("score", highscore);  
            updateHighScoreOnServer(highscore);   
        }
        HissSound.play();       //plays the sound after taillength and score update
        fetchNewAppleColor();   //calls apple microservice changing color of apple when eaten
    }
}

//fetch new apple color when eaten from 'apple_microservice.py' created by team member
async function fetchNewAppleColor() {
    try {
        const response = await fetch('http://localhost:5555/apple_eaten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if(data && data.color) {
            appleColor = data.color;        //pre-change color
        } else {
            console.error('No color update from server, ERROR');
        }
    } catch(error) {
        console.error('Error fetching new apple color', error);
    }
}

//https://www.toptal.com/developers/keycode    keycodes for each key on keyboard
function keyDown(event) {  
//up arrow
    if(event.keyCode == 38){ 
        if(yVelocity == 1)      //if this going up, you can't go down
            return;   
        yVelocity = -1;         //y will increase if we go down, -1 will decrease
        xVelocity = 0;          //will not move left or right
    }

//down arrow
    if(event.keyCode == 40){ 
        if(yVelocity == -1)     //if this is going down, you can click up and go up
            return;   
        yVelocity = 1;         
        xVelocity = 0;          
    }

//right arrow
    if(event.keyCode == 39){  
        if(xVelocity == -1)     //if you are going left, you can't go right
            return;  
        yVelocity = 0;         
        xVelocity = 1;          
    }

//left arrow
    if(event.keyCode == 37){    
        if(xVelocity == 1)      //velocity 1 is going right, which is stopped here
            return;
        yVelocity = 0;         
        xVelocity = -1;          
    }
}

function minInstructions() {
    const instructions = document.getElementById('instructions');
    const button = document.querySelector('.minimize-button');
    if (instructions.classList.contains('hidden')) {
        instructions.classList.remove('hidden');
        button.textContent = '[-]';
    } else {
        instructions.classList.add('hidden');
        button.textContent = '[+]';
    }
}

// Initially hide the instructions
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('instructions').classList.add('hidden');
    document.querySelector('.minimize-button').textContent = '[+]';
});

drawGame();