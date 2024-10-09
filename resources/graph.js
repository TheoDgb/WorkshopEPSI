import { player } from './game.js';
import { applyBlur, applyMovementMalus } from './malus.js';
// Variables de stockage
 let xData = [];
 let yData = [];
 let intervalID = null;
 let startTime = null;

 // Variables pour suivre le pic et la durée
 let currentSystolic = null;
 let currentDiastolic = null;
 let peakDuration = 0; // Durée restante du pic

 // Fonction pour simuler la pression artérielle (systolique et diastolique)
 function generateBloodPressure() {
     const baseSystolic = 120; // Valeur systolique de base
     const baseDiastolic = 80;  // Valeur diastolique de base

     // Vérifier si un pic est actif
     if (peakDuration > 0) {
         // On est en période de pic, oscillation autour de la pression actuelle (systolique et diastolique)
         const systolicFluctuation = (Math.random() - 0.5) * 10; // Fluctuation modérée autour du pic systolique
         const diastolicFluctuation = (Math.random() - 0.5) * 5; // Fluctuation modérée autour du pic diastolique
         const systolic = currentSystolic + systolicFluctuation; // Pression systolique
         const diastolic = currentDiastolic + diastolicFluctuation; // Pression diastolique

         // Décrémenter la durée restante du pic
         peakDuration -= 0.1; // Étant donné que cette fonction est appelée toutes les 100 ms (0.1 s)

         return {         systolic: Math.min(Math.max(systolic, 90), 200), diastolic: Math.min(Math.max(diastolic, 60), 120) };
     } else {
         // Pas de pic actif, générer normalement
         const systolicFluctuation = (Math.random() - 0.5) * 10; // Fluctuation modérée pour systolique
         const diastolicFluctuation = (Math.random() - 0.5) * 5; // Fluctuation modérée pour diastolique

         // Simuler des pics de stress : augmentation rapide de la pression
         if (Math.random() > 0.95) { // Pic de stress, très rare (5%)
             const stressSpike = Math.random() * 40; // Valeur de pic pour la systolique

             // La diastolique suit également le pic, mais avec une augmentation proportionnellement moindre
             const diastolicSpike = stressSpike * 0.5; // La diastolique augmente, mais de façon moins importante que la systolique

             currentSystolic = baseSystolic + systolicFluctuation + stressSpike; // Mémoriser la valeur du pic pour la systolique
             currentDiastolic = baseDiastolic + diastolicFluctuation + diastolicSpike; // Mémoriser la valeur du pic pour la diastolique

             peakDuration = Math.random() * 3 + 1; // Durée de 1 à 4 secondes
         } else {
             currentSystolic = baseSystolic + systolicFluctuation; // Pas de pic, juste fluctuation normale pour la systolique
             currentDiastolic = baseDiastolic + diastolicFluctuation; // Pas de pic, juste fluctuation normale pour la diastolique
         }

         // Ajustement pour garder les valeurs dans des limites physiologiques
         const adjustedSystolic = Math.min(Math.max(currentSystolic, 90), 200); // Limites pour systolique
         const adjustedDiastolic = Math.min(Math.max(currentDiastolic, 60), 120); // Limites pour diastolique

         return { systolic: adjustedSystolic, diastolic: adjustedDiastolic };
     }
 }

 // Fonction pour classifier l'état de la tension artérielle
 function classifyBloodPressure(systolic, diastolic) {
     if (systolic > 180 || diastolic > 120) {
         return 'Hypertensive Crise (Urgence Médicale)';
     } else if (systolic >= 140 || diastolic >= 90) {
         return 'Hypertension Stade 2';
     } else if (systolic >= 130 || diastolic >= 80) {
         return 'Hypertension Stade 1';
     } else if (systolic >= 120 && diastolic < 80) {
         return 'Pré-Hypertension (Tension Élevée)';
     } else {
         return 'Normale';
     }
 }

 // Initialisation du graphique avec Plotly
 Plotly.newPlot('graph', [{
     x: xData,
     y: yData.map(bp => bp.systolic), // Systolique
     mode: 'lines',
     name: 'Pression Systolique (mmHg)',
     line: { color: 'red' }
 }, {
     x: xData,
     y: yData.map(bp => bp.diastolic), // Diastolique
     mode: 'lines',
     name: 'Pression Diastolique (mmHg)',
     line: { color: 'blue' }
 }], {
     title: {
         text: 'Pression Artérielle en Temps Réel',
         font: {
             size: 25
         },
     },
     xaxis: { title: 'Temps (s)' },
     yaxis: { title: 'Pression (mmHg)', range: [50, 200] }, // Plage de valeurs réalistes
     showlegend: true, // Afficher la légende
     legend: {
         orientation: 'v', // Orientation horizontale
         yanchor: 'bottom', // Ancrage en bas
         y: 0.88, // Position verticale (au-dessus du graphique)
         xanchor: 'center', // Ancrage au centre
         x: 0.5 // Position horizontale (au centre)
     }
 });

 // Fonction pour démarrer la simulation
 function startSimulation() {
     if (intervalID) return;  // Si l'animation tourne déjà, ne rien faire

     startTime = Date.now();  // Temps de départ
     intervalID = setInterval(() => {
         let elapsedTime = (Date.now() - startTime) / 1000;  // Temps écoulé en secondes
         let bloodPressure = generateBloodPressure(elapsedTime);  // Générer la pression artérielle.

         // Ajouter les nouvelles données
         xData.push(elapsedTime);
         yData.push(bloodPressure);

         // Mettre à jour le graphique
         Plotly.update('graph', {
             x: [xData, xData],
             y: [yData.map(bp => bp.systolic), yData.map(bp => bp.diastolic)]
         });

         // Classifier l'état actuel de la tension artérielle
         const classification = classifyBloodPressure(bloodPressure.systolic, bloodPressure.diastolic);

         // Afficher l'état sous le graphique
         document.getElementById('classification').innerText = `État de la Tension : ${classification}`;

         // Ajoute un effet de flou selon le seuil de tension
         applyBlur(bloodPressure.systolic, bloodPressure.diastolic);

         // Ajoute du bruit (fluctuation aléatoire) aux déplacements du joueur s'il dépasse un certain seuil de
         applyMovementMalus(player,bloodPressure.systolic, bloodPressure.diastolic);

         // Limiter l'affichage à 20 secondes de données visibles
         if (elapsedTime > 20) {
             xData.shift();  // Retirer les anciennes valeurs
             yData.shift();
         }
     }, 100);  // Mise à jour toutes les 100 ms

 }

 // Ajouter un écouteur d'événements pour le bouton Start
 document.getElementById('startButton').addEventListener('click', startSimulation);