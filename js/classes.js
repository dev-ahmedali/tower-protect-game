class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = 64;
    this.color = 'rgba(255, 255, 255, .15)';
    this.occupied = false;
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
      this.color = 'white';
    } else {
      this.color = 'rgba(255, 255, 255, .15)';
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

class ProjectTile {
  constructor({ position = { x: 0, y: 0 }, enemy }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy = enemy;
    this.radius = 10;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();
  }

  update() {
    this.draw();
    const angle = Math.atan2(
      this.enemy.center.y - this.position.y,
      this.enemy.center.x - this.position.x
    );
    const power = 5;
    this.velocity.x = Math.cos(angle) * power;
    this.velocity.y = Math.sin(angle) * power;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Building {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 64 * 2;
    this.height = 64;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.projectTiles = [
      new ProjectTile({
        position: {
          x: this.center.x,
          y: this.center.y,
        },
        enemy: enemies[0],
      }),
    ];
    this.radius = 250;
    this.target;
    this.frames = 0;
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.position.x, this.position.y, this.width, 64);
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    ctx.fill();
  }

  update() {
    this.draw();
    if (this.frames % 100 === 0 && this.target) {
      this.projectTiles.push(
        new ProjectTile({
          position: {
            x: this.center.x,
            y: this.center.y,
          },
          enemy: this.target,
        })
      );
      this.frames++;
    }
  }
}
