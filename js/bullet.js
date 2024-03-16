class Bullet {
    constructor(x, y, angle) {
      this.x = x;
      this.y = y;
      this.width = 7;
      this.height = 14;
      this.angle = angle;
      this.speed = 10;
      this.radius = 2;
      this.isAlive = true;
      this.isPistolBullet = true;
  
      // Create an Image object for the bullet image
      this.img = new Image();
      this.img.src = './images/bullet.png';
  
      // Listen for the 'load' event to ensure the image is loaded
      this.img.onload = () => {
        this.isImageLoaded = true;
      };
    }
  
    update() {
      // Calculate the new x and y positions based on the angle
      const deltaX = this.speed * Math.cos(this.angle);
      const deltaY = this.speed * Math.sin(this.angle);
      this.x += deltaX;
      this.y += deltaY;
  
      // Check if the bullet is out of the canvas
      if (
        this.x < 0 ||
        this.x > canvas.width ||
        this.y < 0 ||
        this.y > canvas.height
      ) {
        this.isAlive = false;
      }
    }
  
    draw() {
      if (this.isPistolBullet) {
        // Render pistol bullet with image or fillRect as backup
        if (this.isImageLoaded && currentPlayer.hasPistol) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle + Math.PI / 2);
          ctx.drawImage(
            this.img,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
          );
          ctx.restore();
        } else {
          ctx.fillStyle = 'orange';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Render shotgun bullet with fillRect
        ctx.fillStyle = 'orange';
        ctx.fillRect(
          this.x - this.width / 2,
          this.y - this.height / 2,
          this.width,
          this.height
        );
      }
    }
  }
  
  function gunType() {
    if (currentPlayer.hasPistol) {
      return 'images/pistol.png';
    } else {
      return 'images/shotgun.png';
    }
  }
  