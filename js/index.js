const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const placementTilesData2d = []

for(let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2d.push(placementTilesData.slice(i, i + 20))
}

class PlacementTile {
  constructor({position= {x: 0, y: 0}}) {
    this.position = position
    this.size = 64
  }
  draw() {
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size)
  }
}

const placementTiles = []

placementTilesData2d.forEach(row => {
  row.forEach(symbol => {
    if(symbol === 14) {
      // add building placement tile here
      placementTiles.push(new PlacementTile({
        position: {
          x: 0,
          y: 0
        }
      }))
    }
  })
})

console.log(placementTilesData2d);


const image = new Image();

image.onload = () => {
  animate();
};
image.src = 'img/game-map.png';

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

const enemies = [];

for(let i = 0; i < 10; i++) {
  const xOffset = i * 150;
  enemies.push(
    new Enemy({
      position: { x: wayPoints[0].x - xOffset, y: wayPoints[0].y },
    })
  );
  // console.log(wayPoints[0].x - xOffset);
}

function animate() {
  window.requestAnimationFrame(animate);
  ctx.drawImage(image, 0, 0);
  enemies.forEach((enemy) => {
    enemy.update();
  });
}
