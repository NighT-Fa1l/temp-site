// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get the start and restart buttons
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let spaceship;
let missiles = [];
let enemies = [];
let keys = {};
let gameOver = false;

// Spaceship class
class Spaceship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;  // Spaceship size
        this.height = 50;
        this.speed = 5;
        this.color = 'white';
    }

    // Move the spaceship based on key input
    move() {
        if (keys['a'] && this.x > 0) this.x -= this.speed;  // Move left
        if (keys['d'] && this.x < canvas.width - this.width) this.x += this.speed;  // Move right
        if (keys['w'] && this.y > 0) this.y -= this.speed;  // Move up
        if (keys['s'] && this.y < canvas.height - this.height) this.y += this.speed;  // Move down
    }

    // Draw the spaceship
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Fire a missile (small box projectile)
    fire() {
        const missileSize = Math.round(this.width * 0.05); // 5% of spaceship width
        missiles.push(new Missile(this.x + this.width / 2 - missileSize / 2, this.y, missileSize));
    }
}

// Missile class (small box projectile)
class Missile {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.width = size;  // 5% of spaceship width
        this.height = size; // Assuming square missile
        this.speed = 7;
        this.color = 'white'; // White box for the missile
    }

    // Move the missile upwards
    move() {
        this.y -= this.speed;
    }

    // Draw the missile (box shape)
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);  // Draw as a small box
    }
}

// Enemy spaceship class
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 2;
        this.color = 'green';
    }

    // Move the enemy downward
    move() {
        this.y += this.speed;
    }

    // Draw the enemy spaceship
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Generate enemies periodically
function createEnemy() {
    let x = Math.random() * (canvas.width - 50);
    let y = -50; // Start above the screen
    enemies.push(new Enemy(x, y));
}

// Handle key down/up events
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Check for collisions between missiles and enemies
function checkCollisions() {
    for (let i = 0; i < missiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            // Check if missile (box) hits enemy
            if (
                missiles[i].x < enemies[j].x + enemies[j].width &&
                missiles[i].x + missiles[i].width > enemies[j].x &&
                missiles[i].y < enemies[j].y + enemies[j].height &&
                missiles[i].y + missiles[i].height > enemies[j].y
            ) {
                // Missile hit the enemy, remove both
                missiles.splice(i, 1);
                enemies.splice(j, 1);
                i--;
                j--;
                break;
            }
        }
    }

    // Check if any enemy touches the spaceship
    for (let i = 0; i < enemies.length; i++) {
        if (
            enemies[i].x < spaceship.x + spaceship.width &&
            enemies[i].x + enemies[i].width > spaceship.x &&
            enemies[i].y < spaceship.y + spaceship.height &&
            enemies[i].y + enemies[i].height > spaceship.y
        ) {
            // Enemy touches spaceship, destroy the spaceship
            gameOver = true;
        }
    }
}

// Game loop function
function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 140, canvas.height / 2);
        
        // Show the restart button
        restartButton.style.display = 'block';
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move and draw spaceship
    spaceship.move();
    spaceship.draw();

    // Move and draw missiles
    for (let i = 0; i < missiles.length; i++) {
        missiles[i].move();
        missiles[i].draw();

        // Remove missiles that go off the screen
        if (missiles[i].y < 0) {
            missiles.splice(i, 1);
            i--;
        }
    }

    // Move and draw enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();

        // Remove enemies that go off the screen
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // Check for collisions
    checkCollisions();

    // Generate new enemies every 1.5 seconds
    if (Math.random() < 0.02) {
        createEnemy();
    }

    // Repeat the game loop
    requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
    // Hide the start button
    startButton.style.display = 'none';
    
    // Initialize the spaceship
    spaceship = new Spaceship(canvas.width / 2 - 25, canvas.height - 60);
    missiles = [];
    enemies = [];
    gameOver = false;

    // Hide the restart button
    restartButton.style.display = 'none';

    // Start the game loop
    gameLoop();

    // Fire a missile every 200ms
    setInterval(() => {
        if (!gameOver) {
            spaceship.fire();  // Fire a missile every 200ms
        }
    }, 200);
}

// Restart button functionality
restartButton.addEventListener('click', () => {
    // Reset game variables
    spaceship = new Spaceship(canvas.width / 2 - 25, canvas.height - 60);
    missiles = [];
    enemies = [];
    gameOver = false;
    restartButton.style.display = 'none'; // Hide the restart button
    startGame();  // Restart the game loop
});

// Start button functionality
startButton.addEventListener('click', startGame);
