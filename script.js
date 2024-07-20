const backgroundMusic = new Audio('assets/music.mp3');
const startSound = new Audio('assets/start.mp3');
const welcomeScreen = document.getElementById('welcomeScreen');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('startButton');
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 150;
const cellSize = 3;
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;
// )   /\__/\
// ( =/ • •  \=
// x--=-U-U-=--=--=--=--=--=x
// |  change stepInterval   |
// |  to change game speed  |
// x--=--=--=--=--=--=--=--=x
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
let history = [];
let historyIndex = 0;
let isPlaying = false;
let intervalId;
let stepInterval = 100;
let randomnessPercentage = 50;
let gameOverTimeout;

// Code by Krikoset_2 my github (https://github.com/Krikoset2)
// ⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣠⣤⣤⣼⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀
// ⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
// ⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
// ⠀⠀⠀⠘⣿⣿⣿⣿⠟⠁⠀⠀⠀⠹⣿⣿⣿⣿⣿⠟⠁⠀⠀⠹⣿⣿⡿⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⣿⣿⣿⡇⠀⠀⠀⢼⣿⠀⢿⣿⣿⣿⣿⠀⣾⣷⠀⠀⢿⣿⣷⠀⠀⠀⠀⠀
// ⠀⠀⠀⢠⣿⣿⣿⣷⡀⠀⠀⠈⠋⢀⣿⣿⣿⣿⣿⡀⠙⠋⠀⢀⣾⣿⣿⠀⠀⠀⠀⠀
// ⢀⣀⣀⣀⣿⣿⣿⣿⣿⣶⣶⣶⣶⣿⣿⣿⣿⣾⣿⣷⣦⣤⣴⣿⣿⣿⣿⣤⠤⢤⣤⡄
// ⠈⠉⠉⢉⣙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⣀⣀⣀⡀⠀
// ⠐⠚⠋⠉⢀⣬⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣥⣀⡀⠈⠀⠈⠛
// ⠀⠀⠴⠚⠉⠀⠀⠀⠉⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠋⠁⠀⠀⠀⠉⠛⠢⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀

const GREEN = 1;
const INVASIVE_BLUE = 2;
const DEAD = 0;

const cellSound = new Audio('assets/cell.mp3');
const winSound = new Audio('assets/win.mp3');
let isCellSoundEnabled = true;

function startGame() {
    welcomeScreen.style.display = 'none';

    gameContainer.style.display = 'block';

    backgroundMusic.loop = true;
    backgroundMusic.play();

    initializeHistory();
    drawGrid();
}

function initializeHistory() {
    history = [JSON.parse(JSON.stringify(grid))];
    historyIndex = 0;
    updateSlider();
    updateFrameCounter();
    updateFrameIndicators();
}

function updateSlider() {
    const historySlider = document.getElementById('historySlider');
    historySlider.max = history.length - 1;
    historySlider.value = historyIndex;
}

function updateFrameCounter() {
    document.getElementById('frameCounter').textContent = `Frame: ${historyIndex}`;
}

function updateFrameIndicators() {
    const frameIndicators = document.getElementById('frameIndicators');
    frameIndicators.innerHTML = '';
    for (let i = 0; i < history.length; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'frameIndicator' + (i === historyIndex ? ' active' : '');
        frameIndicators.appendChild(indicator);
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (grid[x][y] === GREEN) {
                ctx.fillStyle = '#66BB6A';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else if (grid[x][y] === INVASIVE_BLUE) {
                ctx.fillStyle = '#2196F3';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

// me after 5h of coding this s**t
//           ／＞　 フ
//          | 　_　_| 
//        ／` ミ＿xノ 
//       /　　　　 |
//      /　 ヽ　　 ﾉ
//     │　　|　|　|
// ／￣|　　 |　|　|
// (￣ヽ＿_ヽ_)__)
// ＼二)

function step() {
    const newGrid = grid.map((row, x) => row.map((cell, y) => {
        const neighbors = [
            [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
        ].reduce((count, [dx, dy]) => {
            const nx = (x + dx + gridSize) % gridSize;
            const ny = (y + dy + gridSize) % gridSize;
            return {
                total: count.total + (grid[nx][ny] !== DEAD ? 1 : 0),
                invasive: count.invasive + (grid[nx][ny] === INVASIVE_BLUE ? 1 : 0)
            };
        }, { total: 0, invasive: 0 });

        if (cell === GREEN) {
            if (neighbors.total === 2 || neighbors.total === 3) {
                return Math.random() < 0.00001 ? INVASIVE_BLUE : GREEN; //% of blue
            } else if (neighbors.total === 6) {
                return GREEN;
            } else {
                return DEAD;
            }
        } else if (cell === INVASIVE_BLUE) {
            if (neighbors.total === 2 || neighbors.total === 3) {
                return INVASIVE_BLUE;
            } else {
                return DEAD;
            }
        } else {
            if (neighbors.total === 3) {
                return neighbors.invasive > 0 ? INVASIVE_BLUE : GREEN;
            } else {
                return DEAD;
            }
        }
    }));

    grid.forEach((row, x) => row.forEach((cell, y) => {
        if (cell === INVASIVE_BLUE) {
            const hasGreenNeighbor = [
                [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
            ].some(([dx, dy]) => {
                const nx = (x + dx + gridSize) % gridSize;
                const ny = (y + dy + gridSize) % gridSize;
                return grid[nx][ny] === GREEN;
            });
        }
    }));

    grid = newGrid;

    history = history.slice(0, historyIndex + 1);
    history.push(JSON.parse(JSON.stringify(grid)));
    historyIndex = history.length - 1;
    updateSlider();
    updateFrameCounter();
    updateFrameIndicators();
    drawGrid();

    const greenCells = grid.flat().filter(cell => cell === GREEN).length;
    const blueCells = grid.flat().filter(cell => cell === INVASIVE_BLUE).length;
    const totalCells = gridSize * gridSize;

    if (greenCells <= 20) { 
        showGameOverScreen('Very good!');
        clearInterval(intervalId);
        return;
    }

    if (isCellSoundEnabled && document.getElementById('playStopSwitch').checked) {
        cellSound.play();
    }
}

// hi!  /\_/\
//     = •.• =
//      /   \     

function showGameOverScreen(message) {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const frameNumber = historyIndex;

    const displayMessage = `${message} Points: <span style="color: #66BB6A; font-size: 28px;">${frameNumber}</span>`;
    showConfetti();
    gameOverScreen.innerHTML = displayMessage;
    gameOverScreen.style.display = 'block';

    winSound.play();

    clearTimeout(gameOverTimeout);
    gameOverTimeout = setTimeout(() => {
        gameOverScreen.style.display = 'none';
    }, 5000);
}

function showConfetti() {
    confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#66BB6A', '#78cf7c', '#76c9de', '#55bed9']
    });
}

function generateRandomGrid() {
    grid = grid.map(row => row.map(() => Math.random() < randomnessPercentage / 100 ? GREEN : DEAD));
    initializeHistory();
    startSound.play();
    drawGrid();
}

function importImage() {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const imgSize = Math.min(canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, imgSize, imgSize);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            grid = Array.from({ length: gridSize }, (_, x) =>
                Array.from({ length: gridSize }, (_, y) => {
                    const idx = ((x * cellSize) + (y * cellSize) * canvas.width) * 4;
                    const avgColor = (imgData[idx] + imgData[idx + 1] + imgData[idx + 2]) / 3;
                    return avgColor > 90 ? DEAD : GREEN;
                })
            );
            initializeHistory();
            drawGrid();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleKeyboardEvent(event) {
    switch (event.key) {
        case 'ArrowLeft':
            if (historyIndex > 0) {
                historyIndex--;
                grid = JSON.parse(JSON.stringify(history[historyIndex]));
                startSound.play();
                drawGrid();
                updateFrameCounter();
                updateFrameIndicators();
                document.getElementById('historySlider').value = historyIndex;
            }
            break;
        case 'ArrowRight':
            if (historyIndex < history.length - 1) {
                historyIndex++;
                grid = JSON.parse(JSON.stringify(history[historyIndex]));
                startSound.play();
                drawGrid();
                updateFrameCounter();
                updateFrameIndicators();
                document.getElementById('historySlider').value = historyIndex;
            }
            break;
        case 'ArrowUp':
            const playStopSwitch = document.getElementById('playStopSwitch');
            if (playStopSwitch.checked) {
                clearInterval(intervalId);
                startSound.play();
                playStopSwitch.checked = false;
            } else {
                intervalId = setInterval(step, stepInterval);
                startSound.play();
                playStopSwitch.checked = true;
            }
            break;
    }
}

startButton.addEventListener('click', startGame);

document.getElementById('randomButton').addEventListener('click', generateRandomGrid, () => {
    startSound.play();
});

document.getElementById('clearButton').addEventListener('click', () => {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(DEAD));
    startSound.play();
    initializeHistory();
    drawGrid();
});

document.getElementById('playStopSwitch').addEventListener('change', () => {
    if (document.getElementById('playStopSwitch').checked) {
        startSound.play();
        intervalId = setInterval(step, stepInterval);
    } else {
        startSound.play();
        clearInterval(intervalId);
    }
});

document.getElementById('historySlider').addEventListener('input', (e) => {
    historyIndex = parseInt(e.target.value);
    grid = JSON.parse(JSON.stringify(history[historyIndex]));
    drawGrid();
    updateFrameCounter();
    updateFrameIndicators();
});
// Its Just a shrek
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⢀⣴⠟⠉⠀⠀⠀⠈⠻⣦⡀⠀⠀⠀⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣀⢀⣾⠿⠻⢶⣄⠀⠀⣠⣶⡿⠶⣄⣠⣾⣿⠗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⢻⣿⣿⡿⣿⠿⣿⡿⢼⣿⣿⡿⣿⣎⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡟⠉⠛⢛⣛⡉⠀⠀⠙⠛⠻⠛⠑⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣧⣤⣴⠿⠿⣷⣤⡤⠴⠖⠳⣄⣀⣹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣀⣟⠻⢦⣀⡀⠀⠀⠀⠀⣀⡈⠻⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡿⠉⡇⠀⠀⠛⠛⠛⠋⠉⠉⠀⠀⠀⠹⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠈⠑⠪⠷⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⣿⣦⣼⠛⢦⣤⣄⡀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠑⠢⡀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠲⠖⠛⠻⣿⡿⠛⠉⠉⠻⠷⣦⣽⠿⠿⠒⠚⠋⠉⠁⡞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢦⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⢀⣾⠛⠁⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⠒⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢣⠀⠀⠀
// ⠀⠀⠀⠀⣰⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀
// ⠀⠀⠀⣰⣿⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣧⣄⠀⠀⠀⠀⠀⠀⢳⡀⠀
// ⠀⠀⠀⣿⡾⢿⣀⢀⣀⣦⣾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⣫⣿⡿⠟⠻⠶⠀⠀⠀⠀⠀⢳⠀
// ⠀⠀⢀⣿⣧⡾⣿⣿⣿⣿⣿⡷⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⢀⡴⢿⣿⣧⠀⡀⠀⢀⣀⣀⢒⣤⣶⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
// ⠀⠀⡾⠁⠙⣿⡈⠉⠙⣿⣿⣷⣬⡛⢿⣶⣶⣴⣶⣶⣶⣤⣤⠤⠾⣿⣿⣿⡿⠿⣿⠿⢿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
// ⠀⣸⠃⠀⠀⢸⠃⠀⠀⢸⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⠟⡉⠀⠀⠀⠈⠙⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
// ⠀⣿⠀⠀⢀⡏⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⠛⠉⠁⠀⠀⠀⠀⠀⠉⠠⠿⠟⠻⠟⠋⠉⢿⣿⣦⡀⢰⡀⠀⠀⠀⠀⠀⠀⠁
// ⢀⣿⡆⢀⡾⠀⠀⠀⠀⣾⠏⢿⣿⣿⣿⣯⣙⢷⡄⠀⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣿⣻⢿⣷⣀⣷⣄⠀⠀⠀⠀⢸⠀
// ⢸⠃⠠⣼⠃⠀⠀⣠⣾⡟⠀⠈⢿⣿⡿⠿⣿⣿⡿⠿⠿⠿⠷⣄⠈⠿⠛⠻⠶⢶⣄⣀⣀⡠⠈⢛⡿⠃⠈⢿⣿⣿⡿⠀⠀⠀⠀⠀⡀
// ⠟⠀⠀⢻⣶⣶⣾⣿⡟⠁⠀⠀⢸⣿⢅⠀⠈⣿⡇⠀⠀⠀⠀⠀⣷⠂⠀⠀⠀⠀⠐⠋⠉⠉⠀⢸⠁⠀⠀⠀⢻⣿⠛⠀⠀⠀⠀⢀⠇
// ⠀⠀⠀⠀⠹⣿⣿⠋⠀⠀⠀⠀⢸⣧⠀⠰⡀⢸⣷⣤⣤⡄⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡆⠀⠀⠀⠀⡾⠀⠀⠀⠀⠀⠀⢼⡇
// ⠀⠀⠀⠀⠀⠙⢻⠄⠀⠀⠀⠀⣿⠉⠀⠀⠈⠓⢯⡉⠉⠉⢱⣶⠏⠙⠛⠚⠁⠀⠀⠀⠀⠀⣼⠇⠀⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀⡇
// ⠀⠀⠀⠀⠀⠀⠻⠄⠀⠀⠀⢀⣿⠀⢠⡄⠀⠀⠀⣁⠁⡀⠀⢠⠀⠀⠀⠀⠀⠀⠀⠀⢀⣐⡟⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⢠⡇
document.getElementById('imageButton').addEventListener('click',importImage);

document.getElementById('imageInput').addEventListener('change', handleImageUpload);

document.getElementById('musicButton').addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        startSound.play();
        document.getElementById('musicButton').classList.remove('paused');
    } else {
        backgroundMusic.pause();
        startSound.play();
        document.getElementById('musicButton').classList.add('paused');
    }
});

document.getElementById('cellSoundButton').addEventListener('click', () => {
    isCellSoundEnabled = !isCellSoundEnabled;
    startSound.play();
    document.getElementById('cellSoundButton').classList.toggle('muted', !isCellSoundEnabled);
});

document.getElementById('randomnessSlider').addEventListener('input', (e) => {
    randomnessPercentage = parseInt(e.target.value);
    document.getElementById('randomnessValue').textContent = randomnessPercentage;
    generateRandomGrid();
});

document.addEventListener('keydown', handleKeyboardEvent);

document.getElementById('prevFrameButton').addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        grid = JSON.parse(JSON.stringify(history[historyIndex]));
        startSound.play();
        drawGrid();
        updateFrameCounter();
        updateFrameIndicators();
        document.getElementById('historySlider').value = historyIndex;
    }
});
// >^•-•^<
document.getElementById('nextFrameButton').addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        grid = JSON.parse(JSON.stringify(history[historyIndex]));
        startSound.play();
        drawGrid();
        updateFrameCounter();
        updateFrameIndicators();
        document.getElementById('historySlider').value = historyIndex;
    }
});

startButton.addEventListener('click', () => {
    startSound.play();
    startGame();
});
//by Krikoset_2 >_<