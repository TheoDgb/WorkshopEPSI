const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensions du jeu
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Joueur
const player = {
    x: canvasWidth / 2,
    y: canvasHeight - 50,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue'
};

// Projectiles
const projectiles = [];

// Mouvement du joueur
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    }
    if (event.key === 'ArrowRight' && player.x + player.width < canvasWidth) {
        player.x += player.speed;
    }
    if (event.key === 'ArrowUp' && player.y > 0) {
        player.y -= player.speed;
    }
    if (event.key === 'ArrowDown' && player.y + player.height < canvasHeight) {
        player.y += player.speed;
    }
});

// Boucle d'animation
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Dessiner le joueur
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Dessiner les projectiles
    projectiles.forEach((projectile, index) => {
        projectile.y += projectile.speed;
        ctx.fillStyle = 'red';
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);

        // Supprimer les projectiles hors du canvas
        if (projectile.y > canvasHeight) {
            projectiles.splice(index, 1);
        }
    });

    // Générer des projectiles à intervalles réguliers
    if (Math.random() < 0.05) {
        const projectile = {
            x: Math.random() * canvasWidth,
            y: -10,
            width: 10,
            height: 10,
            speed: 4
        };
        projectiles.push(projectile);
    }

    requestAnimationFrame(gameLoop);
}

// Démarrer le jeu
gameLoop();
