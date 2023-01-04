class Enemy {
    constructor({ position = { x: 0, y: 0 } }) {
      this.position = position;
      (this.width = 100), (this.height = 100), (this.wayPointIndex = 0);
      this.center = {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      };
      this.radius = 50;
      this.health = 100;
      this.velocity = {
        x: 0,
        y: 0,
      };
    }
    draw() {
      ctx.fillStyle = 'red';
      // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
  
      // health bar
      ctx.fillStyle = 'red';
      ctx.fillRect(this.position.x, this.position.y - 15, this.width, 10);
      ctx.fillStyle = 'green';
      ctx.fillRect(
        this.position.x,
        this.position.y - 15,
        (this.width * this.health) / 100,
        10
      );
    }
  
    update() {
      this.draw();
  
      const wayPoint = wayPoints[this.wayPointIndex];
      const distanceY = wayPoint.y - this.center.y;
      const distanceX = wayPoint.x - this.center.x;
      const angle = Math.atan2(distanceY, distanceX);
      const speed = 3
      this.velocity.x = Math.cos(angle) * speed;
      this.velocity.y = Math.sin(angle) * speed;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.center = {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      };
  
      if (
        Math.abs(Math.round(this.center.x) - Math.round(wayPoint.x)) < Math.abs(this.velocity.x) &&
        Math.abs(Math.round(this.center.y)) - Math.round(wayPoint.y) < Math.abs(this.velocity.y) &&
        this.wayPointIndex < wayPoints.length - 1
      ) {
        this.wayPointIndex++;
      }
    }
  }