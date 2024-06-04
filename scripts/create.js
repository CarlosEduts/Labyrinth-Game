const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const textarea = document.querySelector(".textarea");
const createContainer = document.querySelector(".createContainer");
const previewContainer = document.querySelector(".previewContainer");

const pixel = 18;
let level = "";
let height = 0;

const cores = {
  jogador: "#222d33",
  parede: "#000",
  fundo: "#899ba5",
  saida: "#f2e935",
};

const preview = () => {
  height = 0;
  let eixoX = 1;
  let eixoY = 0;

  for (item in level) {
    if (level[item] == "n") {
      eixoY += 1;
      eixoX = 0;
      height += 1;
    } else {
      eixoX += 1;
    }

    switch (level[item]) {
      case "#":
        ctx.fillStyle = cores.parede;
        break;
      case "s":
        ctx.fillStyle = cores.saida;
        break;
      case "@":
        ctx.fillStyle = cores.jogador;
        break;
      default:
        ctx.fillStyle = cores.fundo;
        break;
    }

    ctx.fillRect(eixoX * pixel, eixoY * pixel, pixel, pixel);
  }
};

const setHeight = () => {
  canvas.height = (height + 2) * pixel;
  level = textarea.value;
  preview();
};

const creationButton = () => {
  createContainer.style.display = "flex";
  canvas.style.display = "none";
};

const previewButton = () => {
  createContainer.style.display = "none";
  canvas.style.display = "flex";
  setHeight();
};

textarea.addEventListener("input", (e) => {
  setHeight();
});
