//Key Variables
let currentGame;
let currentPlayer;
let currentPlayerTwo;
let animationID;
let enemyFrequency = 0; // support the logic for generating enemies
let enemySpeed = 1.5;
let divisor = 60;
let gameOver = false;

let startTime = 0;
let countdown = 20;

// Medikit Spawning
let medikitSpawnTimer = 0;
let overallMedikitTimer = 0; // Variable for tracking overall time for medikit spawning
let pillSpawned = false; 
const medikitSpawnInterval = 20 * divisor;

let accelerator = 20;

const weaponImg = document.getElementById('weapon-img');

/* let background = new Image();
background.src = "./images/field.jpg"; */

function startGame(){
  gameOver = false;
  startTime = Date.now();
  currentGame = new Game();
/*   ctx.drawImage(background, 0, 0,canvas.width,canvas.height); // draw background image
 */  currentGame.bullets = [];

   //Instantiate a new player
   currentPlayer = new Player(50,50);
   currentPlayer.drawPlayer();

    //Instantiate player 2
   currentPlayerTwo = new PlayerTwo(20,20);
   currentPlayerTwo.drawPlayer();

   // Clear any previous animation loop
   cancelAnimationFrame(animationID);

   animationID = requestAnimationFrame(updateCanvas);

};


function updateCanvas() {

  if(gameOver){
    return;
  }

  if (currentPlayer.hasPistol) {
    document.querySelector('.weapon-type').innerText = 'Pistol';
  } else {
    document.querySelector('.weapon-type').innerText = 'Shotgun';
  }

  const currentTime = Date.now();
  const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds

  if (elapsedTimeInSeconds >= accelerator) { // Increase level every 20 seconds
    enemySpeed += 0.5;
    if (divisor >= 12) {
        divisor -= 10;
    }
    startTime = currentTime; // Reset the start time
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
/*   ctx.drawImage(background, 0, 0,canvas.width,canvas.height); // redraw the background
 */
  currentPlayer.drawPlayer();
  currentPlayerTwo.drawPlayer();
  enemyFrequency++;

   // Update and draw bullets
for (let i = currentGame.bullets.length - 1; i >= 0; i--) {
  const bullet = currentGame.bullets[i];

  if (bullet.isAlive) {
    bullet.update();
    bullet.draw();

    // Check for collisions with enemies
    for (let j = currentGame.enemies.length - 1; j >= 0; j--) {
      const enemy = currentGame.enemies[j];

      if (enemy.collidesWith(bullet.x, bullet.y)) {
        if (!enemy.wasHit) { // Check if the enemy was not hit before
          if(!audioMuted){grunt.play()};
          enemy.destroy();
          currentGame.score++;
          scoreValue.innerText = currentGame.score;
          enemy.wasHit = true; // Mark the enemy as hit
        }

        // Remove the bullet from the array
        currentGame.bullets.splice(i, 1);
      }
    }
  } else {
    // Remove dead bullets from the array
    currentGame.bullets.splice(i, 1);
  }
}

if (enemyFrequency % divisor === 1) {
    // Determine which side to spawn the enemy
    const side = Math.floor(Math.random() * 4); // 0 for top, 1 for right, 2 for bottom, 3 for left
  
    let randomEnemyX, randomEnemyY;
    let randomEnemyWidth = 50;
    let randomEnemyHeight = 50;
  
    // Set initial position based on the chosen side
    switch (side) {
      case 0: // Top
        randomEnemyX = Math.floor(Math.random() * canvas.width);
        randomEnemyY = -randomEnemyHeight;
        break;
      case 1: // Right
        randomEnemyX = canvas.width;
        randomEnemyY = Math.floor(Math.random() * canvas.height);
        break;
      case 2: // Bottom
        randomEnemyX = Math.floor(Math.random() * canvas.width);
        randomEnemyY = canvas.height;
        break;
      case 3: // Left
        randomEnemyX = -randomEnemyWidth;
        randomEnemyY = Math.floor(Math.random() * canvas.height);
        break;
    }
  
    let newEnemy = new Enemy(
      randomEnemyX,
      randomEnemyY,
      randomEnemyWidth,
      randomEnemyHeight
    );
    
    // Set the direction for the enemy
    newEnemy.direction = side;
  
    currentGame.enemies.push(newEnemy);
  }
 

  for (let i = 0; i < currentGame.enemies.length; i++) {
    const enemy = currentGame.enemies[i];
  
    // Calculate the distance to each player
    const distanceToPlayer1 = Math.sqrt(Math.pow(currentPlayer.x - enemy.x, 2) + Math.pow(currentPlayer.y - enemy.y, 2));
    const distanceToPlayer2 = Math.sqrt(Math.pow(currentPlayerTwo.x - enemy.x, 2) + Math.pow(currentPlayerTwo.y - enemy.y, 2));
  
    // Determine the closer player
    let targetPlayer;
    if (distanceToPlayer1 < distanceToPlayer2) {
      targetPlayer = currentPlayer;
    } else {
      targetPlayer = currentPlayerTwo;
    }
  
    // Calculate the angle between the enemy and the target player
    const angle = Math.atan2(targetPlayer.y - enemy.y, targetPlayer.x - enemy.x);
  
    // Adjust the enemy's movement based on the angle
    enemy.x += enemySpeed * Math.cos(angle);
    enemy.y += enemySpeed * Math.sin(angle);
  
    if (enemy.wasHit && enemy.currentBloodFrame >= enemy.bloodFrames) {
      // Remove enemies after the blood animation is finished
      currentGame.enemies.splice(i, 1);
    } else {
      enemy.drawEnemy();
    }
  
    // Logic for removing enemies
    if (
      currentGame.enemies.length > 0 &&
      (enemy.x >= canvas.width ||
        enemy.x + enemy.width <= 0 ||
        enemy.y >= canvas.height ||
        enemy.y + enemy.height <= 0)
    ) {
      currentGame.enemies.splice(i, 1); // remove that enemy from the array
    }
  }
  

// Code for spawning medikits
medikitSpawnTimer++;
overallMedikitTimer++;

const isMedikitInGame = currentGame.medikits.length > 0;

// Check if enough time has passed for a new medikit to be spawned
if (!isMedikitInGame && overallMedikitTimer >= medikitSpawnInterval && currentGame.health < 100) {

  const medikitSize = 30;
  const randomMedikitPosition = getRandomPosition(medikitSize, medikitSize);

  const newMedikit = new Medikit(
    randomMedikitPosition.x,
    randomMedikitPosition.y,
    medikitSize,
    medikitSize
  );

  currentGame.medikits.push(newMedikit);

  // Reset medikit spawn timer
  medikitSpawnTimer = 0;

  // Reset overall medikit timer when a new medikit is spawned
  overallMedikitTimer = 0;
} else {
  // Increment overall medikit timer if no new medikit is spawned
  overallMedikitTimer++;
}

// Check for collisions with medikits
for (let i = currentGame.medikits.length - 1; i >= 0; i--) {
  const medikit = currentGame.medikits[i];

  if (medikit.collidesWith(currentPlayer.x, currentPlayer.y, currentPlayer.width, currentPlayer.height)) {
    // Player collided with medikit
    if (!audioMuted) {
      medical.play();
    }
    if (currentGame.health <= 80) {
      currentGame.health += 20;
      healthValue.innerText = currentGame.health;
      // Display the bonus indicator and then hide it after a delay
      const healthIndicator = document.getElementById('health-indicator');
      healthIndicator.classList.remove('hidden');
      setTimeout(() => {
            healthIndicator.classList.add('hidden');
        }, 1000); 
    } else if (currentGame.health === 90) {
      currentGame.health += 10;
      healthValue.innerText = currentGame.health;
      const tenIndicator = document.getElementById('ten-indicator');
      tenIndicator.classList.remove('hidden');
      setTimeout(() => {
            tenIndicator.classList.add('hidden');
        }, 1000); 
    }
    // Remove the medikit from the array
    currentGame.medikits.splice(i, 1);

    // Reset overall medikit timer when a medikit is collected
    overallMedikitTimer = 0;
  } else {
    // Draw and update medikit
    medikit.drawMedikit();
  }
}

// Check if the player's score is a multiple of 50 and spawn a pill
if (currentGame.score % 50 === 0 && currentGame.score !== 0 && !pillSpawned) {
  // Spawn a new pill only if the player's score is a multiple of 50
  const pillWidth = 30; 
  const pillHeight = 10;
  const randomPillPosition = getRandomPosition(pillWidth, pillHeight);

  const newPill = new Pill(
    randomPillPosition.x,
    randomPillPosition.y,
    pillWidth,
    pillHeight
  );

  currentGame.pills.push(newPill);
  if(accelerator>2){
  accelerator--;
  }

  // Set the flag to true to indicate that a pill has been spawned
  pillSpawned = true;
}

// Check for collisions with pills
for (let i = currentGame.pills.length - 1; i >= 0; i--) {
  const pill = currentGame.pills[i];

  if (pill.collidesWith(currentPlayer.x, currentPlayer.y, currentPlayer.width, currentPlayer.height)) {
    currentGame.pills.splice(i, 1);
    enemySpeed-=0.75;
    divisor+=15;
    if(!audioMuted){
    magic.play();
    }
  } else {
    // Draw and update the pill
    pill.drawPill();
  }
}

// Reset the flag when the player's score is not a multiple of 50
if (currentGame.score % 50 !== 0) {
  pillSpawned = false;
}

if (currentGame.score === 100 && !shotgunSpawned) {
  // Spawn a new shotgun only if the player's score is a multiple of 100
  const shotgunWidth = 100; 
  const shotgunHeight = 50;
  const randomShotgunPosition = getRandomPosition(shotgunWidth, shotgunHeight);

  const newShotgun = new Shotgun(
    randomShotgunPosition.x,
    randomShotgunPosition.y,
    shotgunWidth,
    shotgunHeight
  );

  currentGame.shotguns.push(newShotgun);

  // Set the flag to true to indicate that a shotgun has been spawned
  shotgunSpawned = true;
}

// Check for collisions with shotguns
for (let i = currentGame.shotguns.length - 1; i >= 0; i--) {
  const shotgun = currentGame.shotguns[i];

  if (shotgun.collidesWith(currentPlayer.x, currentPlayer.y, currentPlayer.width, currentPlayer.height)) {
    currentGame.shotguns.splice(i, 1);
    if(!audioMuted){
      reload.play();
    }
    currentPlayer.hasPistol = false;
    currentPlayer.hasShotgun = true;
    weaponImg.src = gunType();
  } else {
    // Draw and update the shotgun
    shotgun.drawShotgun();
  }
}

if (currentGame.score !== 100) {
  shotgunSpawned = false;
}

//Logic for ending the game
if(currentGame.health===0){
  endGame();
  finalScore.innerText = currentGame.score;
  gameOver = true;
}
  animationID = requestAnimationFrame(updateCanvas);
}

function getRandomPosition(width, height) {
  const randomX = Math.floor(Math.random() * (canvas.width - width));
  const randomY = Math.floor(Math.random() * (canvas.height - height));
  return { x: randomX, y: randomY };
}

function resetScore(){
  gameOver = true;
  currentGame.health = 100;
  currentGame.score = 0;
  currentPlayer.hasPistol = true;
  currentPlayerTwo.hasPistol = true;
  scoreValue.innerText = currentGame.score;
  healthValue.innerText = currentGame.health;
  enemySpeed = 1.5;
  divisor = 60;  
}

function endGame(){
  info.style.display = 'none';
  canvas.style.display = 'none';
  arrowControls.style.display = 'none';
  GameOver.style.display = '';
  muteButton.style.display = 'none';
  weaponType.style.display = 'none'
 }
