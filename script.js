    
        document.addEventListener('DOMContentLoaded', function() {
            const audioFiles = {
                click: "sounds/click.mp3",
                correct: "sounds/correct.mp3",
                wrong: "sounds/wrong.mp3",
                levelup: "sounds/levelup.mp3"
            };
            
            const clickSound = createAudioWithFallback(audioFiles.click);
            const correctSound = createAudioWithFallback(audioFiles.correct);
            const wrongSound = createAudioWithFallback(audioFiles.wrong);
            const levelupSound = createAudioWithFallback(audioFiles.levelup);
            
            function createAudioWithFallback(src) {
                const audio = new Audio();
                audio.src = src;
                audio.preload = "auto";
                
                audio.addEventListener('error', function() {
                });
                
                return audio;
            }
            
            function safePlay(audio) {
                try {
                    audio.currentTime = 0;
                    const playPromise = audio.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                        });
                    }
                } catch (error) {
                }
            }

            let gameseq = [];
            let userseq = [];
            let btns = ["yellow", "red", "green", "purple"];

            let started = false;
            let level = 0;
            let canClick = false;
            let highScore = localStorage.getItem('simonHighScore') || 0;
            let gameOver = false;

            const h2 = document.getElementById('label');
            const highScoreElement = document.getElementById('highScore');
            const currentLevelElement = document.getElementById('currentLevel');
            const startBtn = document.getElementById('startBtn');
            const resetBtn = document.getElementById('resetBtn');
            const winningModal = document.getElementById('winningModal');
            const newHighScoreElement = document.getElementById('newHighScore');
            const continueBtn = document.getElementById('continueBtn');
            const closeModalBtn = document.getElementById('closeModalBtn');
            const gameWrapper = document.querySelector('.game-wrapper');

            highScoreElement.textContent = highScore;

            startBtn.addEventListener('click', function () {
                try {
                    if (!started) {
                        started = true;
                        gameOver = false;
                        startBtn.disabled = true;
                        h2.textContent = "Game in progress...";
                        nextLevel();
                    }
                } catch (error) {
                    h2.textContent = "Error starting game. Please refresh and try again.";
                }
            });

            resetBtn.addEventListener('click', function () {
                try {
                    resetgame();
                    startBtn.disabled = false;
                } catch (error) {
                }
            });

            continueBtn.addEventListener('click', function () {
                try {
                    winningModal.classList.remove('show');
                    gameOver = false;
                    h2.textContent = "Game in progress...";
                    nextLevel();
                } catch (error) {
                }
            });

            closeModalBtn.addEventListener('click', function () {
                try {
                    winningModal.classList.remove('show');
                    resetgame();
                    startBtn.disabled = false;
                } catch (error) {
                }
            });

            function Gameflash(btn) {
                try {
                    if (!btn) return;
                    btn.classList.add('flash');
                    setTimeout(() => btn.classList.remove('flash'), 400);
                } catch (error) {
                }
            }

            function userflash(btn) {
                try {
                    if (!btn) return;
                    btn.classList.add('userflash');
                    setTimeout(() => btn.classList.remove('userflash'), 400);
                } catch (error) {
                }
            }

            function nextLevel() {
                try {
                    userseq = [];
                    level++;
                    canClick = false;
                    currentLevelElement.textContent = level;

                    safePlay(levelupSound);

                    let randIdx = Math.floor(Math.random() * btns.length);
                    let randColor = btns[randIdx];
                    gameseq.push(randColor);

                    playSequence();
                } catch (error) {
                    h2.textContent = "Error starting level. Please refresh and try again.";
                    resetgame();
                    startBtn.disabled = false;
                }
            }

            function playSequence() {
                try {
                    let delay = Math.max(300, 700 - level * 40);

                    gameseq.forEach((color, index) => {
                        let btn = document.querySelector(`.${color}`);
                        
                        if (!btn) {
                            return;
                        }

                        setTimeout(() => {
                            safePlay(clickSound);
                            Gameflash(btn);
                        }, delay * (index + 1));
                    });

                    setTimeout(() => {
                        canClick = true;
                    }, delay * (gameseq.length + 1));
                } catch (error) {
                    h2.textContent = "Error playing sequence. Please refresh and try again.";
                    resetgame();
                    startBtn.disabled = false;
                }
            }

            function checklevel(idx) {
                try {
                    if (userseq[idx] === gameseq[idx]) {
                        safePlay(correctSound);

                        if (userseq.length === gameseq.length) {
                            setTimeout(() => {
                                if (level > highScore) {
                                    highScore = level;
                                    localStorage.setItem('simonHighScore', highScore);
                                    highScoreElement.textContent = highScore;
                                }
                                nextLevel();
                            }, 800);
                        }
                    } else {
                        safePlay(wrongSound);

                        gameWrapper.classList.add('game-over-flash');
                        setTimeout(() => gameWrapper.classList.remove('game-over-flash'), 500);

                        gameOver = true;
                        canClick = false;
                        
                        const finalScore = level;
                        h2.style.color = "#ff7575";
                        h2.style.textAlign = "center";
                        h2.innerHTML = `Game Over! Your score was ${finalScore}. Press Start to play again`;
                        h2.classList.add('game-over-text');
                        setTimeout(() => {
                            h2.style.color = "";
                            h2.style.textAlign = "center";
                            h2.classList.remove('game-over-text');
                        }, 4000);
                        
                        const storedHighScore = parseInt(localStorage.getItem('simonHighScore') || 0);
                        if (finalScore > storedHighScore) {
                            highScore = finalScore;
                            localStorage.setItem('simonHighScore', highScore);
                            highScoreElement.textContent = highScore;
                            
                            setTimeout(() => {
                                newHighScoreElement.textContent = highScore;
                                winningModal.classList.add('show');
                                
                                for (let i = 0; i < 50; i++) {
                                    setTimeout(() => {
                                        createConfetti();
                                    }, i * 30);
                                }
                            }, 1000);
                        }
                        
                        started = false;
                        gameseq = [];
                        userseq = [];
                        level = 0;
                        currentLevelElement.textContent = level;
                        startBtn.disabled = false;
                    }
                } catch (error) {
                    h2.textContent = "Error checking level. Please refresh and try again.";
                    resetgame();
                    startBtn.disabled = false;
                }
            }

            function btnpres() {
                try {
                    if (!canClick || gameOver) return;

                    let btn = this;
                    userflash(btn);

                    safePlay(clickSound);

                    let userColor = btn.id;
                    userseq.push(userColor);

                    checklevel(userseq.length - 1);
                } catch (error) {
                }
            }

            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', btnpres);
            });

            function resetgame() {
                try {
                    started = false;
                    gameseq = [];
                    userseq = [];
                    level = 0;
                    canClick = false;
                    gameOver = false;
                    currentLevelElement.textContent = level;
                    h2.textContent = "Press Start to begin";
                } catch (error) {
                }
            }

            function createConfetti() {
                try {
                    const confetti = document.createElement('div');
                    confetti.classList.add('confetti');
                    
                    const left = Math.random() * 100;
                    const animationDuration = Math.random() * 3 + 2;
                    const size = Math.random() * 10 + 5;
                    
                    const colors = ['#ff5252', '#ffeb3b', '#4caf50', '#9c27b0', '#2196f3', '#ff9800'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    
                    confetti.style.left = `${left}%`;
                    confetti.style.backgroundColor = color;
                    confetti.style.width = `${size}px`;
                    confetti.style.height = `${size}px`;
                    confetti.style.animationDuration = `${animationDuration}s`;
                    
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, animationDuration * 1000);
                } catch (error) {
                }
            }
        });
    