const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const placementTilesData2d = [];

for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2d.push(placementTilesData.slice(i, i + 20));
}

const placementTiles = [];

placementTilesData2d.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol) {
      // add building placement tile here
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 64,
            y: y * 64,
          },
        })
      );
    }
  });
});
console.log(placementTiles);

const image = new Image();

image.onload = () => {
  animate();
};
image.src = 'img/game-map.png';

const enemies = [];

for (let i = 0; i < 10; i++) {
  const xOffset = i * 150;
  enemies.push(
    new Enemy({
      position: { x: wayPoints[0].x - xOffset, y: wayPoints[0].y },
    })
  );
  // console.log(wayPoints[0].x - xOffset);
}

const buildings = [];
let activedTile = undefined;

function animate() {
  window.requestAnimationFrame(animate);
  ctx.drawImage(image, 0, 0);
  enemies.forEach((enemy) => {
    enemy.update();
  });

  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });

  buildings.forEach((building) => {
    building.draw();
    building.projectTiles.forEach((projectTile) => {
      projectTile.update();
    });
  });
}

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener('click', (event) => {
  if (activedTile && !activedTile.isOccupied) {
    buildings.push(
      new Building({
        position: {
          x: activedTile.position.x,
          y: activedTile.position.y,
        },
      })
    );
    activedTile.isOccupied = true;
  }
  console.log(buildings);
});
window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  activedTile = null;
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activedTile = tile;
      break;
    }
  }
});
