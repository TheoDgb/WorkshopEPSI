const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensions du jeu
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Joueur
export const player = {   // export permet l'utilisation des coordonnées du joueur par d'autres fichiers
    x: canvasWidth / 2,
    y: canvasHeight - 50,
    width: 50,
    height: 50,
    speed: 0,
    maxSpeed: 5,
    acceleration: 0.1,
    deceleration: 0.1,
    color: 'blue',
    health: 100 // Ajout des points de vie du joueur
};

// Liste d'images comme projectiles
const projectileImages = [
    './croissant.png',
    './burger.png',
    './haribo.png'
];

// Charger chaque image dans un tableau d'objets Image
const loadedImages = projectileImages.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
});

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

// Fonction pour détecter les collisions
function checkCollision(player, projectile) {
    return (
        player.x < projectile.x + projectile.width &&
        player.x + player.width > projectile.x &&
        player.y < projectile.y + projectile.height &&
        player.y + player.height > projectile.y
    );
}

// Fonction pour réinitialiser la position du joueur
function resetPlayerPosition() {
    player.x = canvasWidth / 2
    player.y = canvasHeight - 50,
        player.speed = 0;
    for (let key in keys) {
        keys[key] = false;
    }
}

// Dessiner la barre de vie
function drawHealthBar() {
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthBarX = 20;
    const healthBarY = 20;

    // Dessiner l'arrière-plan de la barre de vie
    ctx.fillStyle = 'red';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Dessiner la vie restante (vert)
    const currentHealthWidth = (player.health / 100) * healthBarWidth;
    ctx.fillStyle = 'green';
    ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);

    // Ajouter un contour à la barre de vie
    ctx.strokeStyle = 'black';
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
}

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




    // Fonction de dessin des projectiles:
    function drawProjectile(projectile) {
        ctx.drawImage(projectile.image, projectile.x, projectile.y, projectile.width, projectile.height);
    }

    // Dessiner les projectiles
    projectiles.forEach((projectile, index) => {
        projectile.y += projectile.speedY;  // Vitesse verticale
        projectile.x += projectile.speedX;  // Vitesse horizontale

        // Appelle la fonction pour dessiner le projectile avec une image
        drawProjectile(projectile);

        // Vérifier les collisions
        if (checkCollision(player, projectile)) {
            player.health -= 10; // Le joueur perd 10 points de vie
            projectiles.splice(index, 1); // Retirer le projectile après collision

            // Fin de partie si la vie est épuisée
            if (player.health <= 0) {
                alert("Game Over!");
                player.health = 100; // Remettre la santé à 100 pour recommencer
                projectiles.length = 0; // Réinitialiser les projectiles
                resetPlayerPosition();
            }
        }

        // Supprimer les projectiles hors du canvas
        if (projectile.y > canvasHeight || projectile.x < 0 || projectile.x > canvasWidth) {
            projectiles.splice(index, 1);
        }
    });

    // Générer des projectiles à intervalles réguliers
    if (Math.random() < 0.05) {
        const randomImageIndex = Math.floor(Math.random() * loadedImages.length);  // Sélectionner un index aléatoire
        const selectedImage = loadedImages[randomImageIndex];  // Choisir l'image aléatoire
        const projectileHeight = 60;  // Hauteur redimensionnée du projectile
        const aspectRatio = selectedImage.width / selectedImage.height;
        const projectileWidth = projectileHeight * aspectRatio;  // Ajuster la largeur en fonction de la hauteur pour maintenir le ratio
        const projectile = {
            x: Math.random() * canvasWidth,  // Position aléatoire sur l'axe X
            y: -10,
            width: projectileWidth,
            height: projectileHeight,
            image: selectedImage,
            speedY: 2 + Math.random() * 3,  // Vitesse verticale aléatoire entre 2 et 5
            speedX: (Math.random() - 0.5) * 4  // Vitesse horizontale aléatoire (vers la gauche ou la droite)
        };
        projectiles.push(projectile);
    }

    // Dessiner la barre de vie
    drawHealthBar();

    requestAnimationFrame(gameLoop);
}

function gameStop() {
    alert("Partie arrêtée");
    player.health = 100;
    projectiles.length = 0;
    resetPlayerPosition();
}
export { gameLoop, gameStop };
