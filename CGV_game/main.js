//todo: new things
import {Game} from "./game.js";
import Level1 from "./levels/level1.js";
import Level0 from "./levels/level0.js";
import Level2 from "./levels/level2.js";
import mock from "./levels/mock.js";

// Get a reference to the audio element
const audio = document.getElementById("myAudio");
audio.volume = 0.05;

const menu = document.getElementById("in-game-menu");
menu.style.display = "none";

window._APP = null;

window.gameState = {
    _currentLevel: 0,
    score: 0,
    lives: 3,
    currentCamera:0
}

window.real = false;
// sound effects
window.singletons={

    audio: audio,
    _footSteps: new Audio('./music/walkSound.mp3'),
    _run: new Audio('./music/runningSound.mp3'),
}



window.initGame = function (num){

   //clean up
      if (window._APP) {
   window._APP.cleanup(); // Call the cleanup method on the existing _APP
  }


       document.querySelectorAll('.submenu').forEach(function (submenu) {
                submenu.style.display = 'none';
            });
            const popup = document.getElementById('levelCompletionPopup');
            popup.style.display = 'none';

             document.getElementById("in-game-menu").style.display = "block"


   switch (num) {

         case 0:
            window._APP._Initialize(Level0,250);
            window.gameState._currentLevel = 0;
            break;
            case 1:
            window._APP._Initialize(Level1,350);
            window.gameState._currentLevel = 1;
            break;
            case 2:
            window._APP._Initialize(Level2, 550);
            window.gameState._currentLevel = 2;
            break;
   }

}
// restart button
window.restartGame = function (){
    window.stopGameTimer();
    let popup = document.getElementById('levelFailPopup');
    popup.style.display = 'none';
    popup = document.getElementById('levelCompletionPopup');
    popup.style.display = 'none';
     popup = document.getElementById('mainMenu');
    popup.style.display = 'none';
    switch (window.gameState._currentLevel) {
        case 0:
            window._APP._Initialize(Level0,250);
            break;
            case 1:
            window._APP._Initialize(Level1,350);
            break;
            case 2:
            window._APP._Initialize(Level2, 550);
            break;
    }

}

// third person camera

 window.switchCam = function (){ window._APP._thirdPersonCamera._switchCamera();}


window.addEventListener('DOMContentLoaded', () => {
    window._APP = new Game(mock,250, );

    // Add an event listener to the document
document.addEventListener('keydown', function(event) {
  // Check if the key pressed is the "1" key
  if (event.key === '1') {
    // Execute your code here
    console.log('The "1" key was pressed.');
    window.switchCam();
    // Replace the above line with your desired code to be executed.
  }
});

});

