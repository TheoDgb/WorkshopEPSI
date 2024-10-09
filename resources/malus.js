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