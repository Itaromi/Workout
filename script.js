// Variables pour le minuteur
let timerInterval;
let remainingTime = 0;

// Sélection des éléments du minuteur
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const resetButton = document.getElementById('reset-btn');

// Fonction pour formater le temps (mm:ss)
function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Met à jour l'affichage du minuteur
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingTime);
}

// Fonction pour démarrer le minuteur
function startTimer() {
    if (remainingTime > 0 && !timerInterval) {
        timerInterval = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Le temps est écoulé !");
            }
        }, 1000);
    }
}

// Fonction pour arrêter le minuteur
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Fonction pour réinitialiser le minuteur
function resetTimer() {
    stopTimer();
    remainingTime = 0;
    updateTimerDisplay();
}

// Charger les exercices
let exercises = {};
const currentDay = new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
document.getElementById("current-day").innerText = `Exercices du ${currentDay}`;

const exerciseListElement = document.getElementById("exercise-list");

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        exercises = data;
        displayExercises(exercises[currentDay] || []);
    })
    .catch(error => {
        console.error("Erreur de chargement JSON :", error);
        exerciseListElement.innerHTML = "<p>Impossible de charger les exercices.</p>";
    });

// Fonction pour afficher les exercices avec emoji minuteur
function displayExercises(todayExercises) {
    exerciseListElement.innerHTML = "";

    todayExercises.forEach((exercise) => {
        const listItem = document.createElement("li");
        listItem.style.display = "flex";
        listItem.style.alignItems = "center";
        listItem.style.justifyContent = "space-between"; // Aligne les éléments correctement

        // Conteneur pour la partie gauche (checkbox + texte)
        const leftContainer = document.createElement("div");
        leftContainer.style.display = "flex";
        leftContainer.style.alignItems = "center";
        leftContainer.style.flex = "1"; // Prend tout l'espace disponible

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.marginRight = "10px";

        // Texte de l'exercice
        const text = document.createElement("span");
        text.textContent = exercise;

        // Emoji minuteur si l'exercice contient du temps
        const timeMatch = exercise.match(/(\d+)\s*(s|min)/i);
        let timerButton = null;

        if (timeMatch) {
            timerButton = document.createElement("span");
            timerButton.textContent = "⏱️";
            timerButton.classList.add("timer-button");
            timerButton.style.cursor = "pointer";
            timerButton.style.marginLeft = "10px";

            const timeValue = parseInt(timeMatch[1]);
            const timeUnit = timeMatch[2].toLowerCase();
            const totalTimeInSeconds = timeUnit === "min" ? timeValue * 60 : timeValue;

            // Configure le minuteur lorsqu'on clique sur l'emoji
            timerButton.addEventListener("click", () => {
                remainingTime = totalTimeInSeconds;
                updateTimerDisplay();
                alert(`Minuteur configuré sur ${formatTime(remainingTime)} pour "${exercise}"`);
            });
        }

        // Ajout des éléments dans le conteneur gauche
        leftContainer.appendChild(checkbox);
        leftContainer.appendChild(text);

        // Ajout des éléments dans la liste principale
        listItem.appendChild(leftContainer); // Conteneur gauche
        if (timerButton) {
            listItem.appendChild(timerButton); // Emoji ⏱️ uniquement si un temps est trouvé
        }

        exerciseListElement.appendChild(listItem);
    });
}


// Initialise le minuteur à 00:00
updateTimerDisplay();

// Écouteurs pour les boutons de contrôle du minuteur
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);