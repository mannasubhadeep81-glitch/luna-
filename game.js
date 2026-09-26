import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

let scene, camera, renderer;
let player;
let cars = [];

let running = false;
let speed = 0;
let score = 0;
let nitro = 100;

let left = false;
let right = false;
let brake = false;
let boost = false;

const lanes = [-4, 0, 4];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8999a5);
  scene.fog = new THREE.Fog(0x8999a5, 40, 180);

  camera = new THREE.PerspectiveCamera(
    60,
    innerWidth / innerHeight,
    0.1,
    500
  );

  camera.position.set(0, 5, 12);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(
    0xffffff,
    0x334433,
    2
  );

  scene.add(light);

  const sun = new THREE.DirectionalLight(
    0xffffff,
    4
  );

  sun.position.set(-30, 50, 20);
  sun.castShadow = true;

  scene.add(sun);

  createRoad();

  player = createCar(0x17191d);
  player.position.set(0, 0.6, 5);
  scene.add(player);

  for (let i = 0; i < 7; i++) {
    createTraffic(i);
  }

  addKeyboard();

  window.addEventListener("resize", resize);
}

function createRoad() {

  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(250, 600),
    new THREE.MeshStandardMaterial({
      color: 0x365238
    })
  );

  grass.rotation.x = -Math.PI / 2;
  grass.position.z = -250;

  scene.add(grass);

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 600),
    new THREE.MeshStandardMaterial({
      color: 0x252525
    })
  );

  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.02;
  road.position.z = -250;

  scene.add(road);

  for (let z = -400; z < 100; z += 12) {

    for (const x of [-2, 2]) {

      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.04, 5),
        new THREE.MeshStandardMaterial({
          color: 0xffffff
        })
      );

      line.position.set(x, 0.08, z);
      line.userData.roadLine = true;

      scene.add(line);
    }
  }

  for (let z = -350; z < 80; z += 20) {
    createTree(-15, z);
    createTree(15, z);
  }
}

function createTree(x, z) {

  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.3,
      0.45,
      3,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: 0x573723
    })
  );

  trunk.position.y = 1.5;
  tree.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 1),
    new THREE.MeshStandardMaterial({
      color: 0x1f542b
    })
  );

  leaves.position.y = 4;
  tree.add(leaves);

  tree.position.set(x, 0, z);

  scene.add(tree);
}

function createCar(color) {

  const car = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(3.7, 0.7, 7),
    new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1
    })
  );

  body.position.y = 0.8;
  car.add(body);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(3, 1, 2.7),
    new THREE.MeshPhysicalMaterial({
      color: 0x17232c,
      metalness: 0.2,
      roughness: 0.08,
      transparent: true,
      opacity: 0.9
    })
  );

  cabin.position.set(0, 1.4, 0.4);
  car.add(cabin);

  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.15, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0x050505
    })
  );

  spoiler.position.set(0, 2, 2.8);
  car.add(spoiler);

  for (const x of [-1.6, 1.6]) {

    for (const z of [-2.2, 2.2]) {

      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.58,
          0.58,
          0.4,
          24
        ),
        new THREE.MeshStandardMaterial({
          color: 0x080808
        })
      );

      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.55, z);

      car.add(wheel);
    }
  }

  const light = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.2, 0.12),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 5
    })
  );

  light.position.set(0, 1, -3.45);
  car.add(light);

  return car;
}

function createTraffic(i) {

  const colors = [
    0xffffff,
    0x1455a0,
    0xb21d1d,
    0x777777,
    0x111111
  ];

  const car = createCar(
    colors[i % colors.length]
  );

  car.scale.setScalar(0.7);

  car.position.set(
    lanes[Math.floor(Math.random() * 3)],
    0.5,
    -30 - i * 35
  );

  car.userData.speed =
    0.5 + Math.random() * 0.6;

  scene.add(car);
  cars.push(car);
}

function addKeyboard() {

  addEventListener("keydown", e => {

    if (e.key === "ArrowLeft" || e.key === "a")
      left = true;

    if (e.key === "ArrowRight" || e.key === "d")
      right = true;

    if (e.key === "ArrowUp" || e.key === "w")
      speed += 0.05;

    if (e.key === "ArrowDown" || e.key === "s")
      brake = true;

    if (e.code === "Space")
      boost = true;
  });

  addEventListener("keyup", e => {

    if (e.key === "ArrowLeft" || e.key === "a")
      left = false;

    if (e.key === "ArrowRight" || e.key === "d")
      right = false;

    if (e.key === "ArrowDown" || e.key === "s")
      brake = false;

    if (e.code === "Space")
      boost = false;
  });
}

function update(dt) {

  if (!running)
    return;

  if (brake)
    speed -= 2 * dt;
  else
    speed += 0.8 * dt;

  if (boost && nitro > 0) {

    speed += 2.5 * dt;
    nitro -= 25 * dt;

  } else {

    nitro += 8 * dt;
  }

  speed = THREE.MathUtils.clamp(
    speed,
    0,
    4
  );

  nitro = THREE.MathUtils.clamp(
    nitro,
    0,
    100
  );

  if (left)
    player.position.x -= 5 * dt;

  if (right)
    player.position.x += 5 * dt;

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -5,
      5
    );

  player.rotation.z =
    THREE.MathUtils.lerp(
      player.rotation.z,
      (left ? 0.08 : 0) +
      (right ? -0.08 : 0),
      0.1
    );

  const movement = speed * 18 * dt;

  score += speed * dt * 10;

  cars.forEach(car => {

    car.position.z +=
      movement *
      (1 - car.userData.speed * 0.1);

    if (car.position.z > 15) {

      car.position.z =
        -180 - Math.random() * 100;

      car.position.x =
        lanes[Math.floor(Math.random() * 3)];

      score += 50;
    }

    const dx = Math.abs(
      car.position.x -
      player.position.x
    );

    const dz = Math.abs(
      car.position.z -
      player.position.z
    );

    if (dx < 2 && dz < 3.5)
      gameOver();
  });

  scene.traverse(object => {

    if (object.userData.roadLine) {

      object.position.z += movement;

      if (object.position.z > 20)
        object.position.z -= 500;
    }
  });

  camera.position.x =
    THREE.MathUtils.lerp(
      camera.position.x,
      player.position.x * 0.3,
      0.08
    );

  camera.lookAt(
    player.position.x * 0.2,
    1,
    -10
  );

  document.getElementById("speed")
    .textContent =
    Math.round(speed * 80);

  document.getElementById("score")
    .textContent =
    Math.floor(score);

  document.getElementById("nitro")
    .textContent =
    Math.floor(nitro);
}

function startGame() {

  running = true;
  speed = 0.5;
  score = 0;
  nitro = 100;

  document.getElementById(
    "startScreen"
  ).style.display = "none";
}

function gameOver() {

  running = false;

  document.getElementById(
    "startScreen"
  ).style.display = "flex";

  document.querySelector(
    "#startScreen h1"
  ).textContent = "RACE OVER";

  document.querySelector(
    "#startScreen p"
  ).textContent =
    "Score: " + Math.floor(score);
}

function animate() {

  requestAnimationFrame(animate);

  update(0.016);

  renderer.render(
    scene,
    camera
  );
}

function resize() {

  camera.aspect =
    innerWidth / innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    innerWidth,
    innerHeight
  );
}import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

let scene, camera, renderer;
let player;
let cars = [];

let running = false;
let speed = 0;
let score = 0;
let nitro = 100;

let left = false;
let right = false;
let brake = false;
let boost = false;

const lanes = [-4, 0, 4];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8999a5);
  scene.fog = new THREE.Fog(0x8999a5, 40, 180);

  camera = new THREE.PerspectiveCamera(
    60,
    innerWidth / innerHeight,
    0.1,
    500
  );

  camera.position.set(0, 5, 12);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(
    0xffffff,
    0x334433,
    2
  );

  scene.add(light);

  const sun = new THREE.DirectionalLight(
    0xffffff,
    4
  );

  sun.position.set(-30, 50, 20);
  sun.castShadow = true;

  scene.add(sun);

  createRoad();

  player = createCar(0x17191d);
  player.position.set(0, 0.6, 5);
  scene.add(player);

  for (let i = 0; i < 7; i++) {
    createTraffic(i);
  }

  addKeyboard();

  window.addEventListener("resize", resize);
}

function createRoad() {

  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(250, 600),
    new THREE.MeshStandardMaterial({
      color: 0x365238
    })
  );

  grass.rotation.x = -Math.PI / 2;
  grass.position.z = -250;

  scene.add(grass);

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 600),
    new THREE.MeshStandardMaterial({
      color: 0x252525
    })
  );

  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.02;
  road.position.z = -250;

  scene.add(road);

  for (let z = -400; z < 100; z += 12) {

    for (const x of [-2, 2]) {

      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.04, 5),
        new THREE.MeshStandardMaterial({
          color: 0xffffff
        })
      );

      line.position.set(x, 0.08, z);
      line.userData.roadLine = true;

      scene.add(line);
    }
  }

  for (let z = -350; z < 80; z += 20) {
    createTree(-15, z);
    createTree(15, z);
  }
}

function createTree(x, z) {

  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.3,
      0.45,
      3,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: 0x573723
    })
  );

  trunk.position.y = 1.5;
  tree.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 1),
    new THREE.MeshStandardMaterial({
      color: 0x1f542b
    })
  );

  leaves.position.y = 4;
  tree.add(leaves);

  tree.position.set(x, 0, z);

  scene.add(tree);
}

function createCar(color) {

  const car = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(3.7, 0.7, 7),
    new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1
    })
  );

  body.position.y = 0.8;
  car.add(body);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(3, 1, 2.7),
    new THREE.MeshPhysicalMaterial({
      color: 0x17232c,
      metalness: 0.2,
      roughness: 0.08,
      transparent: true,
      opacity: 0.9
    })
  );

  cabin.position.set(0, 1.4, 0.4);
  car.add(cabin);

  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.15, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0x050505
    })
  );

  spoiler.position.set(0, 2, 2.8);
  car.add(spoiler);

  for (const x of [-1.6, 1.6]) {

    for (const z of [-2.2, 2.2]) {

      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.58,
          0.58,
          0.4,
          24
        ),
        new THREE.MeshStandardMaterial({
          color: 0x080808
        })
      );

      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.55, z);

      car.add(wheel);
    }
  }

  const light = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.2, 0.12),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 5
    })
  );

  light.position.set(0, 1, -3.45);
  car.add(light);

  return car;
}

function createTraffic(i) {

  const colors = [
    0xffffff,
    0x1455a0,
    0xb21d1d,
    0x777777,
    0x111111
  ];

  const car = createCar(
    colors[i % colors.length]
  );

  car.scale.setScalar(0.7);

  car.position.set(
    lanes[Math.floor(Math.random() * 3)],
    0.5,
    -30 - i * 35
  );

  car.userData.speed =
    0.5 + Math.random() * 0.6;

  scene.add(car);
  cars.push(car);
}

function addKeyboard() {

  addEventListener("keydown", e => {

    if (e.key === "ArrowLeft" || e.key === "a")
      left = true;

    if (e.key === "ArrowRight" || e.key === "d")
      right = true;

    if (e.key === "ArrowUp" || e.key === "w")
      speed += 0.05;

    if (e.key === "ArrowDown" || e.key === "s")
      brake = true;

    if (e.code === "Space")
      boost = true;
  });

  addEventListener("keyup", e => {

    if (e.key === "ArrowLeft" || e.key === "a")
      left = false;

    if (e.key === "ArrowRight" || e.key === "d")
      right = false;

    if (e.key === "ArrowDown" || e.key === "s")
      brake = false;

    if (e.code === "Space")
      boost = false;
  });
}

function update(dt) {

  if (!running)
    return;

  if (brake)
    speed -= 2 * dt;
  else
    speed += 0.8 * dt;

  if (boost && nitro > 0) {

    speed += 2.5 * dt;
    nitro -= 25 * dt;

  } else {

    nitro += 8 * dt;
  }

  speed = THREE.MathUtils.clamp(
    speed,
    0,
    4
  );

  nitro = THREE.MathUtils.clamp(
    nitro,
    0,
    100
  );

  if (left)
    player.position.x -= 5 * dt;

  if (right)
    player.position.x += 5 * dt;

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -5,
      5
    );

  player.rotation.z =
    THREE.MathUtils.lerp(
      player.rotation.z,
      (left ? 0.08 : 0) +
      (right ? -0.08 : 0),
      0.1
    );

  const movement = speed * 18 * dt;

  score += speed * dt * 10;

  cars.forEach(car => {

    car.position.z +=
      movement *
      (1 - car.userData.speed * 0.1);

    if (car.position.z > 15) {

      car.position.z =
        -180 - Math.random() * 100;

      car.position.x =
        lanes[Math.floor(Math.random() * 3)];

      score += 50;
    }

    const dx = Math.abs(
      car.position.x -
      player.position.x
    );

    const dz = Math.abs(
      car.position.z -
      player.position.z
    );

    if (dx < 2 && dz < 3.5)
      gameOver();
  });

  scene.traverse(object => {

    if (object.userData.roadLine) {

      object.position.z += movement;

      if (object.position.z > 20)
        object.position.z -= 500;
    }
  });

  camera.position.x =
    THREE.MathUtils.lerp(
      camera.position.x,
      player.position.x * 0.3,
      0.08
    );

  camera.lookAt(
    player.position.x * 0.2,
    1,
    -10
  );

  document.getElementById("speed")
    .textContent =
    Math.round(speed * 80);

  document.getElementById("score")
    .textContent =
    Math.floor(score);

  document.getElementById("nitro")
    .textContent =
    Math.floor(nitro);
}

function startGame() {

  running = true;
  speed = 0.5;
  score = 0;
  nitro = 100;

  document.getElementById(
    "startScreen"
  ).style.display = "none";
}

function gameOver() {

  running = false;

  document.getElementById(
    "startScreen"
  ).style.display = "flex";

  document.querySelector(
    "#startScreen h1"
  ).textContent = "RACE OVER";

  document.querySelector(
    "#startScreen p"
  ).textContent =
    "Score: " + Math.floor(score);
}

function animate() {

  requestAnimationFrame(animate);

  update(0.016);

  renderer.render(
    scene,
    camera
  );
}

function resize() {

  camera.aspect =
    innerWidth / innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    innerWidth,
    innerHeight
  );
}