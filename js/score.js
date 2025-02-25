let score = 0;
let scoreEnabled = true; // Para controlar a visibilidade
let scoreContainer = null; // Agora é global, pois precisamos de acesso para alternar a visibilidade
let scoreElement = null;

function createScorePanel(enable = true) {
  scoreEnabled = enable;

  if (scoreEnabled) {
    // Criação do painel de pontuação
    scoreContainer = document.createElement("div");
    scoreContainer.id = "score-container";
    scoreContainer.style.position = "absolute";
    scoreContainer.style.top = "55px";
    scoreContainer.style.right = "10px";
    scoreContainer.style.padding = "10px";
    scoreContainer.style.background = "rgba(0, 0, 0, 0.7)";
    scoreContainer.style.color = "white";
    scoreContainer.style.fontSize = "18px";
    scoreContainer.style.borderRadius = "5px";
    scoreContainer.style.fontFamily = "Arial, sans-serif";
    scoreContainer.style.zIndex = "1000";
    scoreContainer.innerHTML = `Pontuação: <span id="score">0</span>`;
    document.body.appendChild(scoreContainer);

    scoreElement = document.getElementById("score");

    // Controlando a visibilidade do scoreContainer conforme o estado de scoreEnabled
    toggleScoreVisibility(scoreEnabled);
  }
}

function updateScore(points) {
  if (scoreElement) {
    score += points;
    if (score < 0) {
      score = 0;
    }
    scoreElement.textContent = score;
  }
}

// Função para alternar a visibilidade do scoreContainer
function toggleScoreVisibility(enable) {
  if (scoreContainer) {
    scoreContainer.style.display = enable ? "block" : "none"; // Alterna a visibilidade do container inteiro
  }
}

function clearScore() {
  score = 0; 
  if (scoreElement) {
    scoreElement.textContent = score; 
  }
}

// Criando o botão para alternar a visibilidade da pontuação
function createToggleScoreButton() {
  let button = document.createElement("button");
  button.id = "btnScore";
  button.innerText = scoreEnabled ? "Hide score" : "Show score"; // Alterando o texto com base no estado
  button.style.position = "absolute";
  button.style.left = "79.5%";
  button.style.top = "90px";
  button.style.transform = "translateX(-50%)";
  button.style.padding = "10px 20px";
  button.style.fontSize = "16px";
  button.style.cursor = "pointer";
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    scoreEnabled = !scoreEnabled; // Alterna o estado de visibilidade
    toggleScoreVisibility(scoreEnabled); // Aplica a mudança

    // Atualiza o texto do botão com base no novo estado
    button.innerText = scoreEnabled ? "Esconder Score" : "Mostrar Score";
  });
}

export {
  createScorePanel,
  updateScore,
  toggleScoreVisibility,
  createToggleScoreButton,
  clearScore
};
