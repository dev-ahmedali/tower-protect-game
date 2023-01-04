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