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
    speed: 0,
    maxSpeed: 5,
    acceleration: 0.1,
    deceleration: 0.1,
    color: 'blue'
};

// Projectiles
const projectiles = [];

// Garder une trace des touches pressées
const keys = {};

// Ajouter des écouteurs pour gérer les touches pressées et relâchées
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Boucle d'animation
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Accélération et décélération du joueur
    if (keys['ArrowLeft'] && player.x > 0) {
        player.speed = Math.min(player.maxSpeed, player.speed + player.acceleration);
        player.x -= player.speed;
    } else if (keys['ArrowRight'] && player.x + player.width < canvasWidth) {
        player.speed = Math.min(player.maxSpeed, player.speed + player.acceleration);
        player.x += player.speed;
    } else if (keys['ArrowUp'] && player.y > 0) {
        player.speed = Math.min(player.maxSpeed, player.speed + player.acceleration);
        player.y -= player.speed;
    } else if (keys['ArrowDown'] && player.y + player.height < canvasHeight) {
        player.speed = Math.min(player.maxSpeed, player.speed + player.acceleration);
        player.y += player.speed;
    } else {
        // Décélération quand aucune touche n'est pressée
        player.speed = Math.max(0, player.speed - player.deceleration);
    }

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
