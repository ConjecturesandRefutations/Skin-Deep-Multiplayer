class PlayerTwo {
    constructor() {
      this.x = canvas.width / 3;
      this.y = canvas.height / 3;
      this.width = 50;
      this.height = 50;
      this.angle = 0;
      this.img = './images/Player2.png';
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
      this.throttledUpStart = this.throttle(() => this.startMovingPlayerTwo('up'), this.throttleDelay);
      this.throttledDownStart = this.throttle(() => this.startMovingPlayerTwo('down'), this.throttleDelay);
      this.throttledLeftStart = this.throttle(() => this.startMovingPlayerTwo('left'), this.throttleDelay);
      this.throttledRightStart = this.throttle(() => this.startMovingPlayerTwo('right'), this.throttleDelay);
    }
  
    drawPlayer() {
      const playertwoImg = new Image();
      if (this.isWounded && this.hasShotgun) {
        playertwoImg.src = './images/player-shotgun-wounded.png'; // Wounded with shotgun
      } else if (this.isWounded && this.hasPistol) {
        playertwoImg.src = './images/player-wounded.png'; // Wounded without shotgun
      } else if (!this.isWounded && this.hasShotgun) {
        playertwoImg.src = './images/player2-shotgun.png'; // Not wounded with shotgun
      } else if(this.isHit){
        playertwoImg.src = './images/blood.png' // Hit by bullet
      } else {
        playertwoImg.src = './images/player2.png'; // Not wounded without shotgun (default)
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
      ctx.drawImage(playertwoImg, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
  
      // Update the player's current direction
      this.angle = angle;
    }
  
    handleKeyDown(event) {
      if (event.key === 'w' && !this.upButtonDown) {
        this.upButtonDown = true;
        this.throttledUpStart();
      } else if (event.key === 's' && !this.downButtonDown) {
        this.downButtonDown = true;
        this.throttledDownStart();
      } else if (event.key === 'a' && !this.leftButtonDown) {
        this.leftButtonDown = true;
        this.throttledLeftStart();
      } else if (event.key === 'd' && !this.rightButtonDown) {
        this.rightButtonDown = true;
        this.throttledRightStart();
      } 
    }
  
    handleKeyUp(event) {
      if (event.key === 'w') {
        this.upButtonDown = false;
        this.stopMovingPlayerTwo();
      } else if (event.key === 's') {
        this.downButtonDown = false;
        this.stopMovingPlayerTwo();
      } else if (event.key === 'a') {
        this.leftButtonDown = false;
        this.stopMovingPlayerTwo();
      } else if (event.key === 'd') {
        this.rightButtonDown = false;
        this.stopMovingPlayerTwo();
      }
     else if (event.key === 'x') {
      // x key
      this.bulletTwoFired = false;
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
  
    startMovingPlayerTwo(direction) {
      const movePlayerTwo = () => {
        if ((this.upButtonDown || this.downButtonDown || this.leftButtonDown || this.rightButtonDown) && !gameOver) {
          if (direction === 'up' && this.upButtonDown && this.y > 5) {
            this.y -= 7;
            if (!audioMuted) {
              stepOne.play();
            }
          } else if (direction === 'down' && this.downButtonDown && this.y < canvas.height - this.height - 5) {
            this.y += 7;
            if (!audioMuted) {
              stepOne.play();
            }
          } else if (direction === 'left' && this.leftButtonDown && this.x > 15) {
            this.x -= 7;
            if (!audioMuted) {
              stepOne.play();
            }
          } else if (direction === 'right' && this.rightButtonDown && this.x < canvas.width - this.width - 15) {
            this.x += 7;
            if (!audioMuted) {
              stepOne.play();
            }
          }
          requestAnimationFrame(movePlayerTwo);
        }
      };
  
      movePlayerTwo();
    }
  
    stopMovingPlayerTwo() {
      if (!this.upButtonDown && !this.downButtonDown && !this.leftButtonDown && !this.rightButtonDown) {
        cancelAnimationFrame(this.requestAnimationFrame);
      }
    }
  
    shootBullet() {
      if (!this.bulletTwoFired) {
        let offsetX = 0;
        let offsetY = 0;
  
        if (this.angle === (-Math.PI) / 4) {
          offsetX = 57;
          offsetY = 15;
        } else if (this.angle === (3 * Math.PI) / 4) {
          offsetY = 35;
          offsetX = -8;
        } else if (this.angle === Math.PI / 4) {
          offsetX = 40;
          offsetY = 60;
        } else if (this.angle === (-3 * Math.PI) / 4) {
          offsetX = 15;
          offsetY = -8;
        } else if (this.angle === 0) {
          offsetX = 60;
          offsetY = 40;
        } else if (this.angle === Math.PI / 2) {
          offsetX = 9;
          offsetY = 50;
        } else if (this.angle === -Math.PI / 2) {
          offsetX = 40;
        } else if (this.angle === Math.PI) {
          offsetY = 9;
        }
  
        const bulletTwo = new BulletTwo(this.x + offsetX, this.y + offsetY, this.angle);
        currentGame.bulletsTwo.push(bulletTwo);
        this.bulletTwoFired = true;
        gunshot.currentTime = 0;
        if (!audioMuted) {
          gunshot.play();
        }
      }

    }
  
    shootShotgun() {
      if (!this.bulletTwoFired) {
        this.bulletTwoFired = true;
        const bulletTwoOffsets = [
          { offsetX: 0, offsetY: 0, angle: 0 }, // Middle bullet
          { offsetX: 20, offsetY: -20, angle: -Math.PI / 16 }, // Left bullet
          { offsetX: -20, offsetY: -20, angle: Math.PI / 16 }, // Right bullet
        ];
  
        bulletTwoOffsets.forEach((offset) => {
          const adjustedOffsetX = offset.offsetX;
          const adjustedOffsetY = offset.offsetY;
          const adjustedAngle = this.angle + offset.angle;
  
          const bulletTwo = new BulletTwo(this.x + adjustedOffsetX, this.y + adjustedOffsetY, adjustedAngle);
  
          currentGame.bulletsTwo.push(bulletTwo);
        });
  
        this.bulletTwoFired = true;
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
    if (event.key === 'x' && !gameOver) {
      if (currentPlayerTwo.hasPistol) {
        currentPlayerTwo.shootBullet();
      } else if (currentPlayerTwo.hasShotgun) {
        currentPlayerTwo.shootShotgun();
      }
    }
  });
  