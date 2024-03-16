class Medikit {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.img = './images/medikit.png'
    }
  
    drawMedikit() {
        const mediImg = new Image();
        mediImg.src = './images/medikit.png'
        ctx.drawImage(mediImg, this.x, this.y, this.width, this.height);
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
  
