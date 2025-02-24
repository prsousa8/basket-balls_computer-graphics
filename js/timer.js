let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let timerElement;

function createTimer() {
  timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.style.position = "absolute";
  timerElement.style.bottom = "10px"; 
  timerElement.style.right = "10px"; 
  timerElement.style.padding = "10px";
  timerElement.style.background = "rgba(0, 0, 0, 0.7)";
  timerElement.style.color = "white";
  timerElement.style.fontSize = "18px";
  timerElement.style.borderRadius = "5px";
  timerElement.style.fontFamily = "Arial, sans-serif";
  timerElement.style.zIndex = "1000";
  timerElement.innerHTML = "Tempo: 00:00";
  document.body.appendChild(timerElement);
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  elapsedTime = Date.now() - startTime;
  let minutes = Math.floor(elapsedTime / 60000);
  let seconds = Math.floor((elapsedTime % 60000) / 1000);
  timerElement.innerHTML = `Tempo: ${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function clearTimer() {
  clearInterval(timerInterval); 
  timerElement.innerHTML = "Tempo: 00:00"; 
  elapsedTime = 0; 
  startTime = 0; 
}

export { createTimer, startTimer, stopTimer, clearTimer };
