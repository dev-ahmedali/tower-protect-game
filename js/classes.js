class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = 64;
    this.color = 'rgba(255, 255, 255, .15)';
    this.occupied = false
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  update(mouse) {
    this.draw();

    if (
      mouse.x > this.position.x &&
      mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.size
    ) {
      console.log('colliding');
      this.color = 'white'
    }
    else {
        this.color = 'rgba(255, 255, 255, .15)'
    }
  }
}

class Enemy {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    (this.width = 100), (this.height = 100), (this.wayPointIndex = 0);
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    const wayPoint = wayPoints[this.wayPointIndex];
    const distanceY = wayPoint.y - this.center.y;
    const distanceX = wayPoint.x - this.center.x;
    const angle = Math.atan2(distanceY, distanceX);
    this.position.x += Math.cos(angle);
    this.position.y += Math.sin(angle);
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    if (
      Math.round(this.center.x) === Math.round(wayPoint.x) &&
      Math.round(this.center.y) === Math.round(wayPoint.y) &&
      this.wayPointIndex < wayPoints.length - 1
    ) {
      this.wayPointIndex++;
    }
  }
}

class Building {
    constructor({position = {x: 0, y: 0}}) {
        this.position = position
        this.width = 64 * 2
    }

    draw() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.position.x, this.position.y, this.width, 64)
    }
}
