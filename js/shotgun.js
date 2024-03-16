class Shotgun {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.img = './images/shotgun.png'
    }
  
    drawShotgun() {
        const shotgunImg = new Image();
        shotgunImg.src = './images/shotgun.png'
        ctx.drawImage(shotgunImg, this.x, this.y, this.width, this.height);
    }
  
    collidesWith(playerX, playerY, playerWidth, playerHeight) {
      return (
        this.x < playerX + playerWidth &&
        this.x + this.width > playerX &&
        this.y < playerY + playerHeight &&
        this.y + this.height > playerY
      );
    }
  }
  
