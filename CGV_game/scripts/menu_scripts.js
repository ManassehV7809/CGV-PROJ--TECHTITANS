
        // JavaScript functions to control the menu and submenus

        function openSubMenu(submenuId) {
            // Hide the main menu and show the specified submenu
            document.getElementById('mainMenu').style.display = 'none';
            document.getElementById(submenuId).style.display = 'flex';
        }

       window.goBackToMainMenu= function (){

            window.stopGameTimer();

            // Hide all submenus and show the main menu
            document.querySelectorAll('.submenu').forEach(function (submenu) {
                submenu.style.display = 'none';
            });
            let popup = document.getElementById('levelCompletionPopup');
            popup.style.display = 'none';
            popup = document.getElementById('levelFailPopup');
            popup.style.display = 'none';
            popup = document.getElementById('in-game-menu');
            popup.style.display = 'none';
            document.getElementById('mainMenu').style.display = 'flex';

        }

         window.startGame = function() {
            const menu = document.getElementById("in-game-menu");
            menu.style.display = "block";
            // Add your code to start the game here
            console.log('Starting the game...');
        // hide the menu and show the game
             document.getElementById('mainMenu').style.display = 'none';
              window.stopGameTimer();
             window.initGame(0);

        }
        function pauseGame() {
        // Add your code to pause the game later
            console.log('Pausing the game...');
        //  hide the "Pause" button and show the "Resume" button.
        //     document.querySelector('.heading:contains("Pause")').style.display = 'none';
        //     document.querySelector('.heading:contains("Resume")').style.display = 'block';
        }


        function resumeGame() {
        // Add your code to resume the game later
            console.log('Resuming the game...');

        }
        function quitGame() {
            // Add your code to quit the game here
            // close the game window or return to the main menu.
            console.log('Quitting the game...');
        }
        
        // Countdown timer logic
        window.totalGameTime = null;
        window.remainingTime = window.totalGameTime;

        function updateRemainingTime() {
            window.remainingTime--;
            if (window.remainingTime < 0) {
                window.remainingTime = 0;
            }

            // Update the timer display
            const minutes = Math.floor(window.remainingTime / 60);
            const seconds = window.remainingTime % 60;
            document.getElementById('timer').textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (window.remainingTime <= 0) {
                //implementing game over
                 window.stopGameTimer();
                 const popup = document.getElementById('levelFailPopup');
                popup.style.display = 'block';
            }
        }

        window.isGamePlaying = false;
        window.gameTimer = null;

        window.startGameTimer = function () {
            window.isGamePlaying = true;
            window.gameTimer = setInterval(updateRemainingTime, 1000);
        }

        window.stopGameTimer = function () {
            window.isGamePlaying = false;
            clearInterval(window.gameTimer);
        }

        window.resetGameTimer = function () {
            window.remainingTime = window.totalGameTime;
            updateRemainingTime();
        }

        // Function to show the pause menu
        function showPauseMenu() {
            const popup = document.getElementById('pauseMenu');
            popup.style.display = 'block';
        }


        // Function to show the level completion pop-up
        function showLevelCompletionPopup() {
            const popup = document.getElementById('levelCompletionPopup');
            const losingSound = document.getElementById('losingSound');
            losingSound.volume = 1.0;
            losingSound.play();
            popup.style.display = 'block';
        }
        
        // Function to hide the level completion pop-up
        // function hideLevelCompletionPopup() {
        //     const popup = document.getElementById('levelCompletionPopup');
        //     popup.style.display = 'none';
        // }
        
        // Handle button clicks
        document.getElementById('exitButton').addEventListener('click', () => {
            // Implement code to exit the game or return to the main menu.
            //example: window.location.href = 'main-menu.html';
        });
        
        document.getElementById('nextLevelButton').addEventListener('click', () => {
            // Implement code to continue to the next level.
        });
        
        // Simulate level completion (call this when the user completes a level)
        function simulateLevelCompletion() {
            showLevelCompletionPopup();
        }

document.addEventListener("keydown", function(event) {
          if (event.key === "p" || event.key === "P") {
            // Your code to execute when the "P" key is pressed on the keyboard
            alert("P key was pressed on the keyboard!");
          }
        });




       
        
