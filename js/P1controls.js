class Player {
    constructor() {
      this.x = canvas.width/2 -50;
      this.y = canvas.height/2 -50;
      this.width = 50;
      this.height = 50;
      this.angle = 0;
      this.img = './images/player-pistol.png'
      this.upButtonDown = false;
      this.downButtonDown = false;
      this.leftButtonDown = false;
      this.rightButtonDown = false;
      this.throttleDelay = 100; // Keyboard Throttle Delay (Milliseconds)
      this.isWounded = false;
      this.isHit = false;
      this.hasPistol = true;
      this.hasShotgun = false;
  
      // Event listeners for keyboard controls
      document.addEventListener('keydown', (event) => this.handleKeyDown(event));
      document.addEventListener('keyup', (event) => this.handleKeyUp(event));
  
      // Throttle the keydown event listeners
      this.throttledUpStart = this.throttle(() => this.startMovingPlayer('up'), this.throttleDelay);
      this.throttledDownStart = this.throttle(() => this.startMovingPlayer('down'), this.throttleDelay);
      this.throttledLeftStart = this.throttle(() => this.startMovingPlayer('left'), this.throttleDelay);
      this.throttledRightStart = this.throttle(() => this.startMovingPlayer('right'), this.throttleDelay);
  
    }
  
    drawPlayer() {
      const playerImg = new Image();
      if (this.isWounded && this.hasShotgun) {
        playerImg.src = './images/player-shotgun-wounded.png'; // Wounded with shotgun
      } else if (this.isWounded && this.hasPistol) {
        playerImg.src = './images/player-wounded.png'; // Wounded without shotgun
      } else if (!this.isWounded && this.hasShotgun) {
        playerImg.src = './images/player-shotgun.png'; // Not wounded with shotgun
      } else if(this.isHit){
        playerImg.src = './images/blood.png' // Hit by bullet
      } else {
        playerImg.src = './images/player-pistol.png'; // Not wounded without shotgun (default)
      }
    
      // Calculate the angle of rotation based on the player's current direction
      let angle = this.angle;
    
      // Calculate diagonal movement angles when both up and right or down and left buttons are pressed
      if (this.upButtonDown && this.rightButtonDown) {
        angle = (-Math.PI) / 4; // Diagonal up-right
      } else if (this.downButtonDown && this.leftButtonDown) {
        angle = (3 * Math.PI) / 4; // Diagonal down-left
      } else if (this.downButtonDown && this.rightButtonDown) {
        angle = Math.PI / 4; // Diagonal down-right
      } else if (this.upButtonDown && this.leftButtonDown) {
        angle = (-3 * Math.PI) / 4; // Diagonal up-left
      } else if (this.upButtonDown) {
        angle = -Math.PI / 2; //up
      } else if (this.downButtonDown) {
        angle = Math.PI / 2; //down
      } else if (this.leftButtonDown) {
        angle = Math.PI; //left
      } else if (this.rightButtonDown) {
        angle = 0; //right
      }
    
      // Translate and rotate the player's image
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(angle);
      ctx.drawImage(playerImg, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    
      // Update the player's current direction
      this.angle = angle;
    }
  
    handleKeyDown(event) {
      if (event.keyCode === 38 && !this.upButtonDown) {
        // up arrow key
        this.upButtonDown = true;
        this.throttledUpStart();
      } else if (event.keyCode === 40 && !this.downButtonDown) {
        // down arrow key
        this.downButtonDown = true;
        this.throttledDownStart();
      } else if (event.keyCode === 37 && !this.leftButtonDown) {
        // left arrow key
        this.leftButtonDown = true;
        this.throttledLeftStart();
      } else if (event.keyCode === 39 && !this.rightButtonDown) {
        // right arrow key
        this.rightButtonDown = true;
        this.throttledRightStart();
      }
    }    
  
    handleKeyUp(event) {
      if (event.keyCode === 38) {
        // up arrow key
        this.upButtonDown = false;
        this.stopMovingPlayer();
      } else if (event.keyCode === 40) {
        // down arrow key
        this.downButtonDown = false;
        this.stopMovingPlayer();
      } else if (event.keyCode === 37) {
        // left arrow key
        this.leftButtonDown = false;
        this.stopMovingPlayer();
      } else if (event.keyCode === 39) {
        // right arrow key
        this.rightButtonDown = false;
        this.stopMovingPlayer();
      } else if (event.keyCode === 32) {
        // space key
        this.bulletFired = false;
      }
    }
  
    throttle(callback, delay) {
      let lastCallTime = 0;
      return function () {
        const now = Date.now();
        if (now - lastCallTime >= delay) {
          lastCallTime = now;
          callback.apply(this, arguments);
        }
      };
    }
  
    startMovingPlayer(direction) {
      
      // Use requestAnimationFrame to keep moving the player continuously
      const movePlayer = () => {
        if ((this.upButtonDown || this.downButtonDown || this.leftButtonDown || this.rightButtonDown) && gameOver===false) {
            
          if (direction === 'up' && this.upButtonDown && this.y > 5) {
            this.y -= 7;
            if(!audioMuted){stepOne.play()};
          } else if (direction === 'down' && this.downButtonDown && this.y < canvas.height - this.height - 5) {
            this.y += 7;
            if(!audioMuted){stepOne.play()};
          } else if (direction === 'left' && this.leftButtonDown && this.x > 15) {
            this.x -= 7;
            if(!audioMuted){stepOne.play()};
          } else if (direction === 'right' && this.rightButtonDown && this.x < canvas.width - this.width - 15) {
            this.x += 7;
            if(!audioMuted){stepOne.play()};
          }
          requestAnimationFrame(movePlayer);
        }
      };
      
      movePlayer();
    }
  
    stopMovingPlayer() {
      // Stop the player's movement when all buttons are released
      if (!this.upButtonDown && !this.downButtonDown && !this.leftButtonDown && !this.rightButtonDown) {
        cancelAnimationFrame(this.requestAnimationFrame);
      }
    }
  
    shootBullet() {
      if (!this.bulletFired) {
        let offsetX = 0;
        let offsetY = 0;
    
        // Adjust the offset based on the player's direction
        if (this.angle === (-Math.PI) / 4) {
           //up-right
           offsetX = 57;
           offsetY = 15;
        } else if (this.angle === (3 * Math.PI) / 4) {
          //down-left
          offsetY = 35
          offsetX = -8
        } else if (this.angle === Math.PI / 4) {
          //down-right
          offsetX = 40;
          offsetY = 60;
        } else if (this.angle === (-3 * Math.PI) / 4) {
          //up-left
          offsetX = 15
          offsetY = -8
        }
        else if (this.angle === 0) {
          // Player is pointing right
          offsetX = 60;
          offsetY = 40;
        } else if (this.angle === Math.PI / 2) {
          // Player is pointing down
          offsetX = 9;
          offsetY = 50;
        }  else if (this.angle === -Math.PI / 2) {
          // Player is pointing up
          offsetX = 40;
        }else if (this.angle = Math.PI) {
          //Player is pointing left
          offsetY = 9;
        }
    
        // Create the bullet with adjusted initial position
        const bullet = new Bullet(this.x + offsetX, this.y + offsetY, this.angle);
        currentGame.bullets.push(bullet);
        this.bulletFired = true; // Set the flag to true
        gunshot.currentTime = 0;
        if(!audioMuted){gunshot.play()};
      }
    } 
  
    shootShotgun() {
      if (!this.bulletFired) {
        const bulletOffsets = [
          { offsetX: 0, offsetY: 0, angle: 0 },       // Middle bullet
          { offsetX: 20, offsetY: -20, angle: -Math.PI / 16 },  // Left bullet 
          { offsetX: -20, offsetY: -20, angle: Math.PI / 16 }   // Right bullet
        ];
  
        bulletOffsets.forEach(offset => {
          const adjustedOffsetX = offset.offsetX;
          const adjustedOffsetY = offset.offsetY;
          const adjustedAngle = this.angle + offset.angle; // Adjust the angle
  
          // Create the bullet with adjusted initial position and angle
          const bullet = new Bullet(
            this.x + adjustedOffsetX,
            this.y + adjustedOffsetY,
            adjustedAngle
          );
  
          currentGame.bullets.push(bullet);
        });
  
        this.bulletFired = true; // Set the flag to true
        shotgun.currentTime = 0;
        if (!audioMuted) {
          shotgun.play();
        }
      }
    }
  
    acquireShotgun() {
      this.hasShotgun = true;
    }
  
    removeEventListeners() {
      document.removeEventListener('keydown', this.handleKeyDown);
      document.removeEventListener('keyup', this.handleKeyUp);
    }

    collidesWith(x, y, width, height) {
      return (
        this.x < x + width &&
        this.x + this.width > x &&
        this.y < y + height &&
        this.y + this.height > y
      );
    }
  }
  
  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 32 && gameOver===false) {
      // Spacebar key
      if(currentPlayer.hasPistol){
        currentPlayer.shootBullet();
        } else if(currentPlayer.hasShotgun){
        currentPlayer.shootShotgun();
        }
    }
  });
  