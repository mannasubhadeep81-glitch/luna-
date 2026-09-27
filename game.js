// ======================================
// LUNA 3D RACING
// ======================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 35, 220);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

camera.position.set(0, 5, 11);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("game"),
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// ======================================
// LIGHT
// ======================================

const sun = new THREE.DirectionalLight(0xffffff, 2.2);

sun.position.set(30, 50, 20);
sun.castShadow = true;

scene.add(sun);

scene.add(
  new THREE.HemisphereLight(
    0xffffff,
    0x445566,
    1.2
  )
);

// ======================================
// GROUND
// ======================================

const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 500),
  new THREE.MeshStandardMaterial({
    color: 0x3d803d
  })
);

grass.rotation.x = -Math.PI / 2;
grass.position.set(0, -0.05, -200);

scene.add(grass);

// ======================================
// ROAD
// ======================================

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 500),
  new THREE.MeshStandardMaterial({
    color: 0x242424,
    roughness: 0.9
  })
);

road.rotation.x = -Math.PI / 2;
road.position.set(0, 0, -200);

scene.add(road);

// ======================================
// ROAD LINES
// ======================================

const roadLines = [];

for (let i = 0; i < 75; i++) {

  const line = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.04, 4),
    new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
  );

  line.position.set(
    0,
    0.03,
    -i * 7
  );

  scene.add(line);
  roadLines.push(line);
}

// ======================================
// PLAYER SUPERCAR
// ======================================

const car = new THREE.Group();

const blackMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x111318,
    metalness: 0.9,
    roughness: 0.18
  });

const glassMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x05080c,
    metalness: 0.7,
    roughness: 0.08
  });

// Main body

const body = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 0.6, 4.4),
  blackMaterial
);

body.position.y = 0.65;
body.castShadow = true;

car.add(body);

// Hood

const hood = new THREE.Mesh(
  new THREE.BoxGeometry(2.25, 0.2, 1.6),
  blackMaterial
);

hood.position.set(0, 0.92, -1.25);

car.add(hood);

// Cabin

const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(1.65, 0.7, 1.85),
  glassMaterial
);

cabin.position.set(0, 1.18, 0.2);

car.add(cabin);

// Front bumper

const bumper = new THREE.Mesh(
  new THREE.BoxGeometry(2.7, 0.15, 0.5),
  blackMaterial
);

bumper.position.set(0, 0.35, -2.5);

car.add(bumper);

// ======================================
// HEADLIGHTS
// ======================================

const lightMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 3
  });

function createHeadlight(x) {

  const light = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.55,
      0.12,
      0.65
    ),
    lightMaterial
  );

  light.position.set(
    x,
    0.8,
    -2.65
  );

  car.add(light);
}

createHeadlight(-0.75);
createHeadlight(0.75);

// ======================================
// WHEELS
// ======================================

const tireMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x050505,
    roughness: 0.8
  });

const rimMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x777777,
    metalness: 0.9,
    roughness: 0.15
  });

function createWheel(x, z) {

  const wheel = new THREE.Group();

  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.48,
      0.48,
      0.36,
      32
    ),
    tireMaterial
  );

  tire.rotation.z = Math.PI / 2;

  wheel.add(tire);

  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.27,
      0.27,
      0.37,
      24
    ),
    rimMaterial
  );

  rim.rotation.z = Math.PI / 2;

  wheel.add(rim);

  wheel.position.set(x, 0.48, z);

  car.add(wheel);
}

createWheel(-1.35, -1.45);
createWheel(1.35, -1.45);
createWheel(-1.35, 1.45);
createWheel(1.35, 1.45);

// ======================================
// REAR WING
// ======================================

const wing = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 0.12, 0.25),
  blackMaterial
);

wing.position.set(
  0,
  1.45,
  2.05
);

car.add(wing);

// Wing supports

function wingSupport(x) {

  const support = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.12,
      0.65,
      0.12
    ),
    blackMaterial
  );

  support.position.set(
    x,
    1.1,
    2.05
  );

  car.add(support);
}

wingSupport(-1);
wingSupport(1);

// ======================================
// PLAYER POSITION
// ======================================

car.position.set(0, 0, 5);

scene.add(car);

// ======================================
// CITY BUILDINGS
// ======================================

const buildings = [];

function createBuilding(x, z) {

  const height =
    5 + Math.random() * 12;

  const width =
    4 + Math.random() * 4;

  const building = new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      height,
      width
    ),
    new THREE.MeshStandardMaterial({
      color:
        Math.random() > 0.5
          ? 0x77818c
          : 0x56616d
    })
  );

  building.position.set(
    x,
    height / 2,
    z
  );

  building.castShadow = true;

  scene.add(building);

  buildings.push(building);
}

for (let i = 0; i < 35; i++) {

  const z = -i * 14;

  createBuilding(
    -14 - Math.random() * 7,
    z
  );

  createBuilding(
    14 + Math.random() * 7,
    z - 5
  );
}

// ======================================
// TREES
// ======================================

function createTree(x, z) {

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.25,
      0.35,
      3,
      10
    ),
    new THREE.MeshStandardMaterial({
      color: 0x704214
    })
  );

  trunk.position.set(
    x,
    1.5,
    z
  );

  scene.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(
      1.5,
      12,
      12
    ),
    new THREE.MeshStandardMaterial({
      color: 0x176b35
    })
  );

  leaves.position.set(
    x,
    3.3,
    z
  );

  scene.add(leaves);
}

for (let i = 0; i < 50; i++) {

  const z = -i * 9;

  createTree(
    -10 - Math.random() * 4,
    z
  );

  createTree(
    10 + Math.random() * 4,
    z - 3
  );
}

// ======================================
// TRAFFIC
// ======================================

const traffic = [];

function createTrafficCar(x, z) {

  const enemy = new THREE.Mesh(
    new THREE.BoxGeometry(
      2,
      0.7,
      4
    ),
    new THREE.MeshStandardMaterial({
      color:
        Math.random() > 0.5
          ? 0xffffff
          : 0x2244aa,
      metalness: 0.5,
      roughness: 0.3
    })
  );

  enemy.position.set(
    x,
    0.6,
    z
  );

  enemy.castShadow = true;

  scene.add(enemy);

  traffic.push(enemy);
}

for (let i = 0; i < 10; i++) {

  createTrafficCar(
    Math.random() > 0.5
      ? -3.5
      : 3.5,
    -30 - i * 35
  );
}

// ======================================
// GAME VARIABLES
// ======================================

let targetX = 0;

let speed = 0.8;

let nitro = 100;

let gameOver = false;

// ======================================
// STEERING
// ======================================

function moveLeft() {

  if (gameOver) return;

  targetX -= 1.5;

  if (targetX < -4.5)
    targetX = -4.5;
}

function moveRight() {

  if (gameOver) return;

  targetX += 1.5;

  if (targetX > 4.5)
    targetX = 4.5;
}

// Keyboard

window.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "ArrowLeft" ||
      event.key === "a"
    ) {
      moveLeft();
    }

    if (
      event.key === "ArrowRight" ||
      event.key === "d"
    ) {
      moveRight();
    }

    if (event.key === " ") {
      activateNitro();
    }
  }
);

// ======================================
// MOBILE CONTROLS
// ======================================

const leftButton =
  document.getElementById("left");

const rightButton =
  document.getElementById("right");

if (leftButton) {

  leftButton.addEventListener(
    "click",
    moveLeft
  );
}

if (rightButton) {

  rightButton.addEventListener(
    "click",
    moveRight
  );
}

// ======================================
// NITRO
// ======================================

function activateNitro() {

  if (
    nitro <= 0 ||
    gameOver
  ) {
    return;
  }

  speed = 2.5;

  nitro -= 10;

  setTimeout(
    function () {
      speed = 0.8;
    },
    900
  );
}

// ======================================
// COLLISION
// ======================================

function checkCollision() {

  const playerBox =
    new THREE.Box3().setFromObject(car);

  for (const enemy of traffic) {

    const enemyBox =
      new THREE.Box3().setFromObject(enemy);

    if (
      playerBox.intersectsBox(enemyBox)
    ) {

      gameOver = true;

      alert("GAME OVER");

      location.reload();
    }
  }
}

// ======================================
// GAME LOOP
// ======================================

function animate() {

  requestAnimationFrame(animate);

  if (!gameOver) {

    // Smooth steering

    car.position.x +=
      (targetX - car.position.x)
      * 0.12;

    // Road movement

    roadLines.forEach(
      function (line) {

        line.position.z += speed;

        if (line.position.z > 10) {

          line.position.z -= 490;
        }
      }
    );

    // Traffic movement

    traffic.forEach(
      function (enemy) {

        enemy.position.z += speed;

        if (enemy.position.z > 15) {

          enemy.position.z =
            -250 -
            Math.random() * 100;

          enemy.position.x =
            Math.random() > 0.5
              ? -3.5
              : 3.5;
        }
      }
    );

    // Camera

    camera.position.x +=
      (
        car.position.x -
        camera.position.x
      ) * 0.05;

    camera.lookAt(
      car.position.x,
      1,
      car.position.z - 15
    );

    checkCollision();
  }

  renderer.render(
    scene,
    camera
  );
}

animate();

// ======================================
// RESIZE
// ======================================

window.addEventListener(
  "resize",
  function () {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);