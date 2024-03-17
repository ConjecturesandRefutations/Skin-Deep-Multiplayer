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
const medikitSpawnInterval = 13 * divisor;

let accelerator = 20;

/* let background = new Image();
background.src = "./images/field.jpg"; */

function startGame(){
  gameOver = false;
  startTime = Date.now();
  currentGame = new Game();
/*   ctx.drawImage(background, 0, 0,canvas.width,canvas.height); // draw background image
 */  currentGame.bullets = [];
     currentGame.bulletsTwo = [];

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

   // Update and draw Player 1 bullets
for (let i = currentGame.bullets.length - 1; i >= 0; i--) {
  const bullet = currentGame.bullets[i];

  if (bullet.isAlive) {
    bullet.update();
    bullet.draw();


        // Check for collisions with currentPlayerTwo
        if (currentPlayerTwo.collidesWith(bullet.x, bullet.y, bullet.width, bullet.height)) {
          if(!audioMuted){shot.play()};
          currentPlayerTwo.isHit = true;
                setTimeout(() => {
                  currentPlayerTwo.isHit = false;
                }, 300);
          // Decrease healthTwo by 10
            currentGame.healthTwo -= 10;
            healthValueTwo.innerText = currentGame.healthTwo;
          
          healthValueTwo.innerText = currentGame.healthTwo;  
        
          // Remove the bullet from the array
          currentGame.bullets.splice(i, 1);
          
          continue;
        }

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

// Update and draw Player 2 bullets
for (let i = currentGame.bulletsTwo.length - 1; i >= 0; i--) {
  const bulletTwo = currentGame.bulletsTwo[i];

  if (bulletTwo.isAlive) {
    bulletTwo.update();
    bulletTwo.draw();

           // Check for collisions with currentPlayer
           if (currentPlayer.collidesWith(bulletTwo.x, bulletTwo.y, bulletTwo.width, bulletTwo.height)) {
            if(!audioMuted){shot.play()};
            currentPlayer.isHit = true;
                setTimeout(() => {
                  currentPlayer.isHit = false;
                }, 300);
            // Decrease healthTwo by 10
              currentGame.health -= 10;
              healthValue.innerText = currentGame.health;
          
            // Remove the bullet from the array
            currentGame.bulletsTwo.splice(i, 1);
            
            continue;
          }

    // Check for collisions with enemies
    for (let j = currentGame.enemies.length - 1; j >= 0; j--) {
      const enemy = currentGame.enemies[j];

      if (enemy.collidesWith(bulletTwo.x, bulletTwo.y)) {
        if (!enemy.wasHit) { // Check if the enemy was not hit before
          if(!audioMuted){grunt.play()};
          enemy.destroy();
          currentGame.scoreTwo++;
          scoreValueTwo.innerText = currentGame.scoreTwo;
          enemy.wasHit = true; // Mark the enemy as hit
        }

        // Remove the bullet from the array
        currentGame.bulletsTwo.splice(i, 1);
      }
    }
  } else {
    // Remove dead bullets from the array
    currentGame.bulletsTwo.splice(i, 1);
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
if (!isMedikitInGame && overallMedikitTimer >= medikitSpawnInterval && (currentGame.health < 100 || currentGame.healthTwo < 100)) {

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

// Check for player 1 collisions with medikits
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
      healthIndicator.innerText = '+20';
      healthIndicator.classList.remove('hidden');
      setTimeout(() => {
          healthIndicator.classList.add('hidden');
      }, 1000); 
  } else if (currentGame.health === 90) {
      currentGame.health += 10;
      healthValue.innerText = currentGame.health;
      const healthIndicator = document.getElementById('health-indicator');
      healthIndicator.innerText = '+10';
      healthIndicator.classList.remove('hidden');
      setTimeout(() => {
          healthIndicator.classList.add('hidden');
      }, 1000); 
  } else if (currentGame.health === 95) {
      currentGame.health += 5;
      healthValue.innerText = currentGame.health;
      const healthIndicator = document.getElementById('health-indicator');
      healthIndicator.innerText = '+5';
      healthIndicator.classList.remove('hidden');
      setTimeout(() => {
          healthIndicator.classList.add('hidden');
      }, 1000); 
  } else if (currentGame.health === 85) {
      currentGame.health += 15; // Health is increased by 15 instead of 85
      healthValue.innerText = currentGame.health;
      const healthIndicator = document.getElementById('health-indicator');
      healthIndicator.innerText = '+15'; // Change indicator text to +15
      healthIndicator.classList.remove('hidden');
      setTimeout(() => {
          healthIndicator.classList.add('hidden');
      }, 1000); 
  }
   else 
    // Remove the medikit from the array
    currentGame.medikits.splice(i, 1);

    // Reset overall medikit timer when a medikit is collected
    overallMedikitTimer = 0;
  } else {
    // Draw and update medikit
    medikit.drawMedikit();
  }
}


// Check for player 2 collisions with medikits
for (let i = currentGame.medikits.length - 1; i >= 0; i--) {
    const medikit = currentGame.medikits[i];
  
    if (medikit.collidesWith(currentPlayerTwo.x, currentPlayerTwo.y, currentPlayerTwo.width, currentPlayerTwo.height)) {
      // Player collided with medikit
      if (!audioMuted) {
        medical.play();
      }
      if (currentGame.healthTwo <= 80) {
        currentGame.healthTwo += 20;
        healthValueTwo.innerText = currentGame.healthTwo;
        // Display the bonus indicator and then hide it after a delay
        const healthIndicatorTwo = document.getElementById('health-indicator-two');
        healthIndicatorTwo.innerText = '+20';
        healthIndicatorTwo.classList.remove('hidden');
        setTimeout(() => {
            healthIndicatorTwo.classList.add('hidden');
        }, 1000); 
    } else if (currentGame.healthTwo === 90) {
        currentGame.healthTwo += 10;
        healthValueTwo.innerText = currentGame.healthTwo;
        const healthIndicatorTwo = document.getElementById('health-indicator-two');
        healthIndicatorTwo.innerText = '+10';
        healthIndicatorTwo.classList.remove('hidden');
        setTimeout(() => {
            healthIndicatorTwo.classList.add('hidden');
        }, 1000); 
    } else if (currentGame.healthTwo === 95) {
        currentGame.healthTwo += 5;
        healthValueTwo.innerText = currentGame.healthTwo;
        const healthIndicatorTwo = document.getElementById('health-indicator-two');
        healthIndicatorTwo.innerText = '+5';
        healthIndicatorTwo.classList.remove('hidden');
        setTimeout(() => {
            healthIndicatorTwo.classList.add('hidden');
        }, 1000); 
    } else if (currentGame.healthTwo === 85) {
        currentGame.healthTwo += 15; // Health is increased by 15 instead of 85
        healthValueTwo.innerText = currentGame.healthTwo;
        const healthIndicatorTwo = document.getElementById('health-indicator-two');
        healthIndicatorTwo.innerText = '+15'; // Change indicator text to +15
        healthIndicatorTwo.classList.remove('hidden');
        setTimeout(() => {
            healthIndicatorTwo.classList.add('hidden');
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
if ((currentGame.score % 50 === 0 && currentGame.score !== 0 && !pillSpawned) || (currentGame.scoreTwo % 50 === 0 && currentGame.scoreTwo !== 0 && !pillSpawned)) {
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

// Check for player 1 collisions with pills
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


// Check for player 2 collisions with pills
for (let i = currentGame.pills.length - 1; i >= 0; i--) {
    const pill = currentGame.pills[i];
  
    if (pill.collidesWith(currentPlayerTwo.x, currentPlayerTwo.y, currentPlayerTwo.width, currentPlayerTwo.height)) {
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

// Logic for spawning player 1 shotgun
if (currentGame.score === 50 && !shotgunSpawnedPlayer1) {
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

  // Set the flag to true to indicate that a shotgun has been spawned for player 1
  shotgunSpawnedPlayer1 = true;
}

// Check for collisions with shotguns for player 1
for (let i = currentGame.shotguns.length - 1; i >= 0; i--) {
  const shotgun = currentGame.shotguns[i];

  if (shotgun.collidesWith(currentPlayer.x, currentPlayer.y, currentPlayer.width, currentPlayer.height)) {
    currentGame.shotguns.splice(i, 1);
    if (!audioMuted) {
      reload.play();
    }
    currentPlayer.hasPistol = false;
    currentPlayer.hasShotgun = true;
  } else {
    // Draw and update the shotgun
    shotgun.drawShotgun();
  }
}

if (currentGame.score !== 50) {
  shotgunSpawnedPlayer1 = false;
}

// Logic for spawning player 2 shotgun
if (currentGame.scoreTwo === 50 && !shotgunSpawnedPlayer2) {
  // Spawn a new shotgun only if the player's score is a multiple of 100
  const shotgunTwoWidth = 100;
  const shotgunTwoHeight = 50;
  const randomShotgunTwoPosition = getRandomPosition(shotgunTwoWidth, shotgunTwoHeight);

  const newShotgunTwo = new ShotgunTwo(
    randomShotgunTwoPosition.x,
    randomShotgunTwoPosition.y,
    shotgunTwoWidth,
    shotgunTwoHeight
  );

  currentGame.shotgunsTwo.push(newShotgunTwo);

  // Set the flag to true to indicate that a shotgun has been spawned for player 2
  shotgunSpawnedPlayer2 = true;
}

// Check for collisions with shotguns for player 2
for (let i = currentGame.shotgunsTwo.length - 1; i >= 0; i--) {
  const shotgunTwo = currentGame.shotgunsTwo[i];

  if (shotgunTwo.collidesWith(currentPlayerTwo.x, currentPlayerTwo.y, currentPlayerTwo.width, currentPlayerTwo.height)) {
    currentGame.shotgunsTwo.splice(i, 1);
    if (!audioMuted) {
      reload.play();
    }
    currentPlayerTwo.hasPistol = false;
    currentPlayerTwo.hasShotgun = true;
  } else {
    // Draw and update the shotgun
    shotgunTwo.drawShotgun();
  }
}

if (currentGame.scoreTwo !== 50) {
  shotgunSpawnedPlayer2 = false;
}

//Logic for ending the game
if((currentGame.health<=0) || (currentGame.healthTwo<=0)){
  endGame();
  gameOver = true;
  if (currentGame.health===0){
  winner.innerText = 'Player Two';
  } else {
    winner.innerText = 'Player One';
  }
}
console.log(currentGame.health)
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
  currentGame.healthTwo = 100;
  currentGame.score = 0;
  currentGame.scoreTwo = 0;
  currentPlayer.hasPistol = true;
  currentPlayerTwo.hasPistol = true;
  scoreValue.innerText = currentGame.score;
  scoreValueTwo.innerText = currentGame.scoreTwo;
  healthValue.innerText = currentGame.health;
  healthValueTwo.innerText = currentGame.healthTwo;
  enemySpeed = 1.5;
  divisor = 60;  
}

function endGame(){
  info.style.display = 'none';
  infoTwo.style.display = 'none';
  canvas.style.display = 'none';
  GameOver.style.display = '';
  muteButton.style.display = 'none';
 }
