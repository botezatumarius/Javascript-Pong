const gameBoard = document.querySelector("#board");
const ctx = gameBoard.getContext("2d");
const score = document.querySelector("#score");
const resetBtn = document.getElementById("reset");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackgroundColor = "#50c75a";
const palette1Color = "#50bbc7";
const palette2Color = "red";
const paletteBorderColor = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const paletteSpeed = 50;
const ballRadius = 13;
let player1Score = 0;
let player2Score = 0;
let intervalId;
let ballX;
let ballY;
let ballSpeed;
let ballXDirection;
let ballYDirection;
let palette1 = {
    x:0,
    y:0,
    width:25,
    height:100
};
let palette2 = {
    x:gameWidth - 25,
    y:gameHeight - 100,
    width:25,
    height:100
};

window.addEventListener("keydown",changeDirection);
resetBtn.addEventListener("click",resetGame);

gameStart();

function gameStart(){
    createBall();
    nextMove();
}

function nextMove(){
    intervalId = setTimeout(()=>{
        clearBoard();
        moveBall();
        displayBall();
        displayPalette();
        checkCollision();
        nextMove();
    },10);
}

function checkCollision(){
    if (ballY <= ballRadius)
        ballYDirection *= -1;
    if (ballY >= gameHeight - ballRadius)
        ballYDirection *= -1;
    if (ballX < ballRadius) {
        createBall();
        player2Score += 1;
        changeScore();
    }
    if (ballX > gameWidth - ballRadius) {
        createBall();
        player1Score += 1; 
        changeScore();
    }
    if (ballX >= gameWidth - palette2.width - ballRadius)
        if (ballY >= palette2.y && ballY <= palette2.y + palette2.height){
            ballX = gameWidth - palette2.width - ballRadius; //to avoid ball getting stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    if (ballX <= palette1.width + ballRadius)
        if (ballY >= palette1.y && ballY <= palette1.y + palette1.height){
            ballX = palette1.width + ballRadius; //to avoid ball getting stuck
            ballXDirection *= -1;
            ballSpeed += 1;
        }
}

function changeScore(){
    score.textContent = `${player1Score} : ${player2Score}`;
}

function displayPalette(){
    ctx.fillStyle = palette1Color;
    ctx.strokeStyle = paletteBorderColor;
    ctx.fillRect(palette1.x,palette1.y,palette1.width,palette1.height);
    ctx.strokeRect(palette1.x,palette1.y,palette1.width,palette1.height);

    ctx.fillStyle = palette2Color;
    ctx.strokeStyle = paletteBorderColor;
    ctx.fillRect(palette2.x,palette2.y,palette2.width,palette2.height);
    ctx.strokeRect(palette2.x,palette2.y,palette2.width,palette2.height);
}

function displayBall(){
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.beginPath();
    ctx.arc(ballX,ballY,ballRadius,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
}

function moveBall(){
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
}

function clearBoard(){
    ctx.fillStyle = boardBackgroundColor;
    ctx.fillRect(0,0,gameWidth,gameHeight);
}

function createBall(){
    ballSpeed = 1;
    ballX = gameWidth/2;
    ballY = gameHeight/2;
    if (Math.round(Math.random()) == 1)
        ballXDirection = 1;
    else ballXDirection = -1;

    if (Math.round(Math.random()) == 1)
        ballYDirection = Math.random();
    else ballYDirection = Math.random() * -1; 
}

function resetGame(){
    clearInterval(intervalId);
    player1Score = 0;
    player2Score = 0;
    changeScore();
    palette1 = {
        x:0,
        y:0,
        width:25,
        height:100
    };
    palette2 = {
        x:gameWidth - 25,
        y:gameHeight - 100,
        width:25,
        height:100
    };
    gameStart();
}

function changeDirection(event){
    const code = event.keyCode;
    const upArrow = 38;
    const downArrow = 40;
    const wButton = 87;
    const sButton = 83;

    switch (true){
        case (code == upArrow && palette2.y > 0):
            palette2.y -= paletteSpeed;
            break;
        case (code == downArrow && palette2.y < gameHeight-100):
            palette2.y += paletteSpeed;
            break;
        case (code == wButton && palette1.y > 0):
            palette1.y -= paletteSpeed;
            break;
        case (code == sButton && palette1.y < gameHeight-100):
            palette1.y += paletteSpeed;
            break;
    }
}