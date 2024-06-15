const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const time = document.querySelectorAll(".time");
const victoryPage = document.querySelector(".victory");
const buttonsControl = document.querySelector(".buttonsControl");
const redirect = document.querySelector(".redirect");
const currentURL = window.location.href;
const gameLevel = currentURL.substring(currentURL.indexOf("game") + 12);
const canvasWidth = 380;

const colors = {
  player: "#0903A6",
  wall: "#000",
  background: "#899ba5",
  exit: "#f2e935",
};

let player = {
  x: 0,
  y: 0,
  movX: 0,
  movY: 0,
};

let collisions = {
  wallX: [],
  wallY: [],
  exit: [],
};

let timeElapsed = 0;
let canvasHeight = 0;

// Verificar tamanho dos Pixel a partir do valor passado (Valor no início da URL)
function tileSize(size) {
  // Labirinto pequeno "#p"
  if (size == "p") {
    return 18;
  }

  // Labirinto médio "#m"
  if (size == "m") {
    return 14;
  }

  // Labirinto grande "#g"
  if (size == "g") {
    return 12;
  }

  // Labirinto Extra grande "#e"
  if (size == "e") {
    return 8;
  }
}
let size = tileSize(currentURL.substring(currentURL.indexOf("game") + 11)[0]);

// Função do Temporizador do Jogo
function timer() {
  setInterval(() => {
    timeElapsed += 1;
    time[1].innerText = `Tempo: ${timeElapsed} s`;
  }, 1000);
}

// Fução a execultar se o jogador vencer
function victory() {
  buttonsControl.style.display = "none";
  victoryPage.style.display = "flex";
  time[0].innerText = `Tempo de Jogo: ${timeElapsed}s`;
  let timer = 10;

  setInterval(() => {
    redirect.innerText = `Aguarde, você será redirecionado para a home em ${timer} segundos.`;
    timer--;
  }, 1000);

  setTimeout(() => {
    window.location.href = "https://carloseduts.github.io/Labyrinth-Game/";
  }, 10000);
}

// Captura as colisões das Paredes, Saída e Jogador
function captureCollisions() {
  let xAxis = 0;
  let yAxis = 0;

  for (const item of gameLevel) {
    if (item === "n") {
      yAxis += 1;
      xAxis = 0;
      canvasHeight += 1;
    } else if (item === "#") {
      collisions.wallX.push(xAxis);
      collisions.wallY.push(yAxis);
    } else if (item === "s") {
      collisions.exit.push(xAxis, yAxis);
    } else if (item == "@") {
      player.x = xAxis;
      player.y = yAxis;
    }

    xAxis += 1;
  }
}

// Função que verifica a cor do Pixel a partir de um valor
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

// Função renderizadora do cenário
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
    context.fillRect(xAxis * size, yAxis * size, size, size);
  }
}

// Função que verifica Colisões e renderizo o player
function renderPlayer() {
  // Limpa o canvas e Renderiza o cenário
  context.clearRect(
    0,
    0,
    canvasWidth * size,
    (gameLevel.length / canvasWidth + 2) * size
  );
  renderScene(size);

  // Verifica se o jogador alcançou a saída
  if (
    collisions.exit[0] === player.x + player.movX &&
    collisions.exit[1] === player.y + player.movY
  ) {
    victory();
  }

  // Define a cor do jogador
  context.fillStyle = colors.player;

  // Verifica colisões
  for (let i = 0; i < collisions.wallY.length; i++) {
    if (
      collisions.wallY[i] === player.y + player.movY &&
      collisions.wallX[i] === player.x + player.movX
    ) {
      player.movX = 0;
      player.movY = 0;
    }
  }
  context.fillRect(
    (player.x + player.movX) * size,
    (player.y + player.movY) * size,
    size,
    size
  );
}

// Capturar Click do Jogador
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      player.movX += 1;
      break;
    case "ArrowLeft":
      player.movX -= 1;
      break;
    case "ArrowUp":
      player.movY -= 1;
      break;
    case "ArrowDown":
      player.movY += 1;
      break;
    default:
      break;
  }
  renderPlayer();
});

// Função de iniciar Jogo
function initialize() {
  timer();
  captureCollisions();
  canvas.height = (canvasHeight + 2) * size;
  renderPlayer(size);
}

// Iniciar Jogo
initialize();
