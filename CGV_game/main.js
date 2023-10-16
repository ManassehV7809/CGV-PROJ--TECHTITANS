//todo: new things
import {Game} from "./game.js";
import Level1 from "./levels/level1.js";
import Level0 from "./levels/level0.js";
import Level2 from "./levels/level2.js";

// Get a reference to the audio element
const audio = document.getElementById("myAudio");
audio.volume = 0.00;

const menu = document.getElementById("in-game-menu");
menu.style.display = "none";

window._APP = null;



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
            window._APP._Initialize(Level0);
            break;
            case 1:
            window._APP._Initialize(Level1);
            break;
            case 2:
            window._APP._Initialize(Level2);
            break;
   }

}


window.addEventListener('DOMContentLoaded', () => {
   window._APP = new Game(Level0);
});
  
