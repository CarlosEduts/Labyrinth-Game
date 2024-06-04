const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const currentURL = window.location.href;
const tileSize = 18;
const canvasWidth = 380;
const gameLevel = `
#######n
#@....#n
#####s#`;

//currentURL.substring(currentURL.indexOf("game") + 12);

const colors = {
  player: "#222d33",
  wall: "#000",
  background: "#899ba5",
  exit: "#f2e935",
};

let timeElapsed = 0;
let canvasHeight = 0;

let player = {
  x: 0,
  y: 0,
};

let collisions = {
  x: [],
  y: [],
  exit: [],
  check: false,
};

function captureCollisions() {
  let xAxis = 0;
  let yAxis = 0;

  for (const item of gameLevel) {
    if (item === "n") {
      yAxis += 1;
      xAxis = 0;
      canvasHeight += 1;
    } else if (item === "#") {
      collisions.x.push(xAxis);
      collisions.y.push(yAxis);
    } else if (item === "s") {
      collisions.exit.push(xAxis, yAxis);
    }
    xAxis += 1;
  }
}

function setColor(item) {
  switch (item) {
    case "#":
      context.fillStyle = colors.wall;
      break;
    case "s":
      context.fillStyle = colors.exit;
      break;
    default:
      context.fillStyle = colors.background;
      break;
  }
}

function renderScene() {
  let xAxis = 0;
  let yAxis = 0;

  for (const item of gameLevel) {
    if (item === "n") {
      yAxis++;
      xAxis = 0;
      canvasHeight++;
    } else {
      xAxis++;
    }

    setColor(item);
    context.fillRect(xAxis * tileSize, yAxis * tileSize, tileSize, tileSize);
  }
}

function renderPlayer(playerX, playerY) {
  // Limpa o canvas e Renderiza o cenário
  context.clearRect(
    0,
    0,
    canvasWidth * tileSize,
    (gameLevel.length / canvasWidth + 2) * tileSize
  );
  renderScene();

  let xAxis = 0;
  let yAxis = 0;

  // Encontra a posição do jogador no nível do jogo
  for (const item of gameLevel) {
    if (item === "n") {
      yAxis += 1;
      xAxis = 0;
    } else {
      xAxis += 1;
    }

    if (item === "@") {
      // Define a cor do jogador
      context.fillStyle = colors.player;
      break;
    }
  }

  // Verifica colisões
  for (let i = 0; i < collisions.y.length; i++) {
    if (
      collisions.y[i] === yAxis + playerY &&
      collisions.x[i] === xAxis + playerX
    ) {
      collisions.check = true;
      break;
    }
  }

  // Verifica se o jogador alcançou a saída
  if (
    collisions.exit[0] === xAxis + playerX &&
    collisions.exit[1] === yAxis + playerY
  ) {
    alert(`Você Venceu!, Tempo: ${timeElapsed} Seg`);
  }

  // Renderiza o jogador e trata colisões
  if (collisions.check) {
    context.fillRect(xAxis * tileSize, yAxis * tileSize, tileSize, tileSize);
    collisions.check = false;
    player.x = 0;
    player.y = 0;
  } else {
    context.fillRect(
      (xAxis + playerX) * tileSize,
      (yAxis + playerY) * tileSize,
      tileSize,
      tileSize
    );
  }
}

// Capturar coordenadas de Jogador
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      player.x += 1;
      break;
    case "ArrowLeft":
      player.x -= 1;
      break;
    case "ArrowUp":
      player.y -= 1;
      break;
    case "ArrowDown":
      player.y += 1;
      break;
    default:
      break;
  }
  renderPlayer(player.x, player.y);
});

function initializeGame() {

  // Iniciar Timer
  setInterval(() => {
    timeElapsed += 1;
  }, 1000);

  captureCollisions();
  canvas.height = (canvasHeight + 2) * tileSize;
  renderPlayer(player.x, player.y);
}

initializeGame();