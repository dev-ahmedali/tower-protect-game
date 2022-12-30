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

const image = new Image();

image.onload = () => {
  animate();
};
image.src = 'img/game-map.png';

const enemies = [];

function spawnEnemies(spawnCount) {
  for (let i = 1; i < spawnCount + 1; i++) {
    const xOffset = i * 150;
    enemies.push(
      new Enemy({
        position: { x: wayPoints[0].x - xOffset, y: wayPoints[0].y },
      })
    );
    // console.log(wayPoints[0].x - xOffset);
  }
}

const buildings = [];
let activedTile = undefined;
let enemyCount = 3;
let hearts= 10
spawnEnemies(enemyCount);

function animate() {
  const animationId = requestAnimationFrame(animate);
  ctx.drawImage(image, 0, 0);
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();

    if(enemy.position.x > canvas.width) {
      hearts -= 1
      console.log(hearts);
      enemies.splice(i, 1)
    if(hearts === 0) {

      console.log("Game over")
      cancelAnimationFrame(animationId)
    };
    }
  }

   // tracking total amount of enemy
   if (enemies.length === 0) {
    enemyCount += 2;
    spawnEnemies(enemyCount);
  }


  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });

  buildings.forEach((building) => {
    building.update();
    building.target = null;
    const validEnemies = enemies.filter((enemy) => {
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;
      const distance = Math.hypot(xDifference, yDifference);
      return distance < enemy.radius + building.radius;
    });
    building.target = validEnemies[0];

    for (let i = building.projectTiles.length - 1; i >= 0; i--) {
      const projectTile = building.projectTiles[i];

      projectTile.update();

      const xDifference = projectTile.enemy.center.x - projectTile.position.x;
      const yDifference = projectTile.enemy.center.y - projectTile.position.y;
      const distance = Math.hypot(xDifference, yDifference);
      // this is when project tile hits an enemy

      if (distance < projectTile.enemy.radius + projectTile.radius) {
        // enemy health and enemy removal
        projectTile.enemy.health -= 20;

        if (projectTile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectTile.enemy === enemy;
          });
          if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
        }

       
        building.projectTiles.splice(i, 1);
      }
    }
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
