const DEFAULT_CANVAS_WIDTH = 420;
const DEFAULT_CANVAS_HEIGHT = 300;
const DEFAULT_CELL_SIZE = 32;
const MOBILE_CELL_SIZE = 20;
const DEFAULT_STATUE_SCALE = 0.8;
const MOBILE_STATUE_SCALE = 0.6;
const GRID_SIZE = 10;
const HALF_GRID_SIZE = GRID_SIZE / 2;
const NOISE_LEVEL = 32;
const NOISE_SCALE = 0.008;

let statue;
let cellSize;
let statueScale;
let camera;
let theta;
let eyeX;
let eyeY;
let eyeZ;
let depths;

function preload() {
  statue = loadModel('./assets/statue.obj', true);
}

function setup() {
  const isMobile = windowWidth <= 400;

  const canvasWidth = isMobile ? 0.7 * windowWidth : DEFAULT_CANVAS_WIDTH;
  const canvasHeight = isMobile ? 0.6 * windowWidth : DEFAULT_CANVAS_HEIGHT;
  const canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  canvas.parent("#sketch");
  
  cellSize = isMobile ? MOBILE_CELL_SIZE : DEFAULT_CELL_SIZE;
  statueScale = isMobile ? MOBILE_STATUE_SCALE : DEFAULT_STATUE_SCALE;

  camera = createCamera();
  camera.ortho();
  theta = 0.0;
  updateCamera();

  depths = [];
  for (let i = 0; i < GRID_SIZE + 1; i++) {
    depths.push(Array(GRID_SIZE + 1).fill(0));
  }
}

function updateTheta() {
  theta += 0.005;
  if (theta > TAU) {
    theta -= TAU;
  }
}

function updateCamera() {
  eyeX = 200 * sin(theta);
  eyeY = -100;
  eyeZ = 200 * cos(theta);
  camera.setPosition(eyeX, eyeY, eyeZ);
  camera.lookAt(0, 0, 0);
}

function updateGrid() {
  for (let i = 0; i < depths.length; i++) {
    for (let j = 0; j < depths[i].length; j++) {
      let nt = NOISE_SCALE * frameCount;
      depths[i][j] = NOISE_LEVEL * noise(i, j, nt);
    }
  }
}

function drawGrid() {
  strokeWeight(1);
  stroke("#66ff66");
  noFill();

  for (let i = -HALF_GRID_SIZE; i < HALF_GRID_SIZE - 1; i++) {
    for (let j = -HALF_GRID_SIZE; j < HALF_GRID_SIZE - 1; j++) {
      beginShape();
      vertex(i * cellSize + cellSize / 2,
             depths[i + HALF_GRID_SIZE][j + HALF_GRID_SIZE],
             j * cellSize + cellSize / 2);
      vertex((i + 1) * cellSize + cellSize / 2,
             depths[i + HALF_GRID_SIZE + 1][j + HALF_GRID_SIZE],
             j * cellSize + cellSize / 2);
      vertex((i + 1) * cellSize + cellSize / 2,
             depths[i + HALF_GRID_SIZE + 1][j + HALF_GRID_SIZE + 1],
             (j + 1) * cellSize + cellSize / 2);
      vertex(i * cellSize + cellSize / 2,
             depths[i + HALF_GRID_SIZE][j + HALF_GRID_SIZE + 1],
             (j + 1) * cellSize + cellSize / 2);
      vertex(i * cellSize + cellSize / 2,
             depths[i + HALF_GRID_SIZE][j + HALF_GRID_SIZE],
             j * cellSize + cellSize / 2);
      endShape();
    }
  }
}

function drawStatue() {
  strokeWeight(1);
  stroke("#444444");
  fill("#555555");

  scale(statueScale);
  rotate(-5 * PI / 6 + theta, [0, 1, 0])
  translate(0, -80 + 20 * sin(theta * 4), 0);
  rotate(-PI / 2 - 0.3, [1, 0, 0]);
  model(statue);
}

function draw() {
  updateTheta();
  updateCamera();
  updateGrid();

  background("#111111");
  push();
    translate(0, 40, 0);
    drawGrid();
    drawStatue();
  pop();
}
