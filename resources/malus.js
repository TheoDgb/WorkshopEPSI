// Appliquer un flou selon le seuil de tension atteint
function applyBlur(systolic, diastolic) {
const gameCanvas = document.getElementById('gameCanvas');
if (systolic >= 180 || diastolic >= 120) {
    gameCanvas.style.filter = 'blur(5px)';
}

if (systolic >= 140 || diastolic >= 90) {
    gameCanvas.style.filter = 'blur(2px)';
}
else {
    gameCanvas.style.filter = 'none';
}}


// Fonction pour ajouter un malus de précision aux mouvements du joueur
function applyMovementMalus(player,systolic,diastolic) {
    if (systolic >= 180 || diastolic >= 120) {
        // Hypertension de stade 2 - appliquer une imprécision modérée
        player.x += (Math.random() - 0.5) * 15;
        player.y += (Math.random() - 0.5) * 15;
    }
    // S'assurer que le joueur reste dans les limites du canvas
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
    player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
}

export { applyBlur, applyMovementMalus };