
        // JavaScript functions to control the menu and submenus
        function openSubMenu(submenuId) {
            // Hide the main menu and show the specified submenu
            document.getElementById('mainMenu').style.display = 'none';
            document.getElementById(submenuId).style.display = 'flex';
        }

        function goBackToMainMenu() {
            // Hide all submenus and show the main menu
            document.querySelectorAll('.submenu').forEach(function (submenu) {
                submenu.style.display = 'none';
            });
            document.getElementById('mainMenu').style.display = 'flex';
        }

        function startGame() {
            const menu = document.getElementById("in-game-menu");
            menu.style.display = "block";
            // Add your code to start the game here
            console.log('Starting the game...');
        // hide the menu and show the game
             document.getElementById('mainMenu').style.display = 'none';
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
        // hide the "Resume" button and show the "Pause" button.
        //     document.querySelector('.heading:contains("Pause")').style.display = 'block';
        //     document.querySelector('.heading:contains("Resume")').style.display = 'none';
        }
        function quitGame() {
            // Add your code to quit the game here
            // close the game window or return to the main menu.
            console.log('Quitting the game...');
        }
        
        // Countdown timer logic
        let totalGameTime = 300; // 5 minutes (300 seconds)
        let remainingTime = totalGameTime;

        function updateRemainingTime() {
            remainingTime--;
            if (remainingTime < 0) {
                remainingTime = 0;
            }

            // Update the timer display
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            document.getElementById('timer').textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (remainingTime <= 0) {
                // gameOver(); // Implement your game over logic
            }
        }


        setInterval(updateRemainingTime, 1000); // Update every second

        // Function to show the level completion pop-up
        function showLevelCompletionPopup() {
            const popup = document.getElementById('levelCompletionPopup');
            popup.style.display = 'block';
        }
        
        // Function to hide the level completion pop-up
        function hideLevelCompletionPopup() {
            const popup = document.getElementById('levelCompletionPopup');
            popup.style.display = 'none';
        }
        
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

        simulateLevelCompletion();
        
       
        
