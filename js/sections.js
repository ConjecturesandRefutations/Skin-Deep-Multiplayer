//Opening Section
const openingSection = document.querySelector('.opening-section');

//Info Section
const info = document.querySelector('.info');
info.style.display = 'none';
const scoreValue = document.getElementById('score-value');
const healthValue = document.getElementById('health-value');

//Info-Two Section
const infoTwo = document.querySelector('.info-two');
infoTwo.style.display = 'none';
const scoreValueTwo = document.getElementById('score-value-two');
const healthValueTwo = document.getElementById('health-value-two');

const winner = document.getElementById('winner');

//Instructions Section
const instructionSection = document.querySelector('.instruction-section');
instructionSection.style.display = 'none';
//Instruction Button
const instructionButton = document.querySelector('.instruction-wrapper');
  instructionButton.onclick = () => {
    openingSection.style.display = 'none';
    instructionSection.style.display = '';
}


//Credits Section
const creditsSection = document.querySelector('.credits-section');
creditsSection.style.display = 'none';
//Credits Button
const creditsButton = document.querySelector('.credits');
  creditsButton.onclick = () => {
    openingSection.style.display = 'none';
    creditsSection.style.display = '';
}

// Back Button
const backButtonList = document.querySelectorAll('.back');
backButtonList.forEach(backButton => {
  backButton.onclick = () => {
    openingSection.style.display = '';
    instructionSection.style.display = 'none';
    creditsSection.style.display = 'none';
  };
});

//Home Button
const homeButton = document.getElementById('home-icon');
homeButton.style.display = 'none';

  homeButton.onclick = () => {
  console.log("Home button clicked");
  gameOver = true;
  resetScore();
  homeButton.style.display = 'none';
  muteButton.style.display = 'none'
  openingAudioPlaying = false;
  opening.currentTime = 0;
  info.style.display = 'none';
  infoTwo.style.display = 'none';
  GameOver.style.display = 'none';
  volumeIcon.classList.remove('fa', 'fa-volume-up');
  volumeIcon.classList.add('fa', 'fa-volume-mute');
  openingSection.style.display = '';
  canvas.style.display = 'none';
}

//Mute button

const muteButton = document.getElementById('mute-icon');
muteButton.style.display = 'none';

// Start Button
window.onload = () => {
  const startButton = document.getElementById('start-button');
  startButton.onclick = () => { 
    canvas.style.display = '';
    openingSection.style.display = 'none';
    info.style.display = '';
    infoTwo.style.display = '';
    homeButton.style.display = '';
    muteButton.style.display = '';
    pauseOpeningAudio();
    startGame();
  };
};

//Game Over Section
const GameOver = document.querySelector('.game-over');
GameOver.style.display = 'none';

// Restart Button
const restartButton = document.getElementById('restart-button');
  restartButton.onclick = () => {
  resetScore();
  gameOver = false;
  GameOver.style.display = 'none';
  canvas.style.display = '';
  info.style.display = '';
  infoTwo.style.display = '';
  muteButton.style.display = '';
  startGame();
}

