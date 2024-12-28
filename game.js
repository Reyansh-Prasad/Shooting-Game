const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables
let player = { x: 50, y: canvas.height / 2, width: 20, height: 20, color: "green" };
let bullets = [];
let enemies = [];
let score = 0;

// Handle Input
document.addEventListener("keydown", (e) => {
    if (e.key === " ") {  // Space to shoot
        bullets.push({ x: player.x + player.width, y: player.y + player.height / 2, width: 10, height: 5, color: "red", speed: 5 });
    }
    if (e.key === "ArrowUp") player.y -= 10;
    if (e.key === "ArrowDown") player.y += 10;
});

// Create Enemies
setInterval(() => {
    enemies.push({ x: canvas.width, y: Math.random() * canvas.height, width: 20, height: 20, color: "purple", speed: 2 });
}, 1000);

// Update Game
function update() {
    // Move bullets
    bullets.forEach(bullet => bullet.x += bullet.speed);

    // Move enemies
    enemies.forEach(enemy => enemy.x -= enemy.speed);

    // Check collisions
    bullets = bullets.filter(bullet => {
        return !enemies.some(enemy => {
            const hit = bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y;
            if (hit) score++;
            return hit;
        });
    });

    // Remove off-screen bullets and enemies
    bullets = bullets.filter(bullet => bullet.x < canvas.width);
    enemies = enemies.filter(enemy => enemy.x > 0);

    // End game if enemies reach player
    enemies.forEach(enemy => {
        if (enemy.x <= player.x + player.width && 
            enemy.y <= player.y + player.height && 
            enemy.y + enemy.height >= player.y) {
            alert("Game Over! Your score: " + score);
            resetGame();
        }
    });
}

// Reset Game
function resetGame() {
    bullets = [];
    enemies = [];
    score = 0;
    player.y = canvas.height / 2;
}

// Draw Game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
