class Enemy {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = 50;
      this.height = 50;
      this.img = './images/enemy-knife.png';
      this.destroyed = false;
      this.wasHit = false;
      this.bloodFrames = 10;
      this.currentBloodFrame = 0;
      this.bloodImage = new Image();
      this.bloodImage.src = './images/blood.png';
      this.angle = 0; // Rotation angle
    }
  
    drawEnemy() {
      if (this.wasHit && this.currentBloodFrame < this.bloodFrames) {
        ctx.drawImage(this.bloodImage, this.x, this.y, this.width, this.height);
        this.currentBloodFrame++;
      } else {
        const enemyImg = new Image();
    
        // Calculate the distance between each player and the enemy
        const distanceToPlayer1 = Math.sqrt(Math.pow(currentPlayer.x - this.x, 2) + Math.pow(currentPlayer.y - this.y, 2));
        const distanceToPlayer2 = Math.sqrt(Math.pow(currentPlayerTwo.x - this.x, 2) + Math.pow(currentPlayerTwo.y - this.y, 2));
    
        // Determine which player is closer
        let targetPlayer;
        if (distanceToPlayer1 < distanceToPlayer2) {
          targetPlayer = currentPlayer;
        } else {
          targetPlayer = currentPlayerTwo;
        }
    
        // Calculate the angle to move towards the target player
        const angle = Math.atan2(targetPlayer.y - this.y, targetPlayer.x - this.x);
    
        // Move towards the target player
        const speed = 1; // Adjust this value to control the speed of movement
        this.x += Math.cos(angle) * speed;
        this.y += Math.sin(angle) * speed;
    
        // Determine if the enemy should attack player 1
        let attackPlayer1 = distanceToPlayer1 <= 75;
        // Determine if the enemy should attack player 2
        let attackPlayer2 = distanceToPlayer2 <= 75;
    
        // Check which player is closer
        if (distanceToPlayer1 < distanceToPlayer2) {
          attackPlayer2 = false; // Don't attack player 2 if player 1 is closer
        } else {
          attackPlayer1 = false; // Don't attack player 1 if player 2 is closer
        }
    
        if (attackPlayer1 || attackPlayer2) {
          const attacking = Math.floor(Date.now() / 300) % 2 === 0;
          if (attacking) {
            enemyImg.src = './images/enemy-knife-attack.png';
            if (!audioMuted) {
              slash.play();
            }
    
            if (!this.wasAttacking && ((attackPlayer1 && distanceToPlayer1 <= 65) || (attackPlayer2 && distanceToPlayer2 <= 65))) {
              if (attackPlayer1 && currentGame.health > 0) {
                currentGame.health -= 10;  
                currentPlayer.isWounded = true;
                setTimeout(() => {
                  currentPlayer.isWounded = false;
                }, 500);
              }
              if (attackPlayer2 && currentGame.healthTwo > 0) {
                currentGame.healthTwo -= 10;
                currentPlayerTwo.isWounded = true;
                setTimeout(() => {
                  currentPlayerTwo.isWounded = false;
                }, 500);
              }
              healthValue.innerText = currentGame.health;
              healthValueTwo.innerText = currentGame.healthTwo;
              if (!audioMuted) {
                wound.play();
              }
            }
    
            this.wasAttacking = true;
          } else {
            enemyImg.src = this.img;
            this.wasAttacking = false;
          }
        } else {
          enemyImg.src = this.img;
          this.wasAttacking = false;
        }
    
        if (!attackPlayer1 && !attackPlayer2) {
          this.wasAttacking = false;
        }
    
        // Draw the enemy
        const drawAngle = angle + Math.PI / 2; // Adjust the angle for proper rotation
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(drawAngle);
        ctx.drawImage(enemyImg, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
      }
    }    
  
    collidesWith(x, y) {
      return (
        x < this.x + this.width &&
        x + this.width > this.x &&
        y < this.y + this.height &&
        y + this.height > this.y
      );
    }
  
    destroy() {
      this.destroyed = true;
      this.wasHit = true; // Mark the enemy as hit
    }
  }
  