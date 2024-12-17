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

// Afficher les exercices avec emoji minuteur
function displayExercises(todayExercises) {
    exerciseListElement.innerHTML = "";

    todayExercises.forEach((exercise) => {
        const listItem = document.createElement("li");
        listItem.style.display = "flex"; // Utilise flexbox pour organiser les éléments
        listItem.style.justifyContent = "space-between"; // Espacement maximal entre les enfants
        listItem.style.alignItems = "center"; // Centre verticalement les éléments

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.marginRight = "10px";

        // Texte de l'exercice
        const text = document.createElement("span");
        text.textContent = exercise;
        text.style.flex = "1"; // Permet au texte de prendre tout l'espace disponible

        // Emoji minuteur si l'exercice contient du temps
        const timeMatch = exercise.match(/(\d+)\s*(s|min)/i);
        let timerButton; // Déclare l'emoji timer

        if (timeMatch) {
            timerButton = document.createElement("span");
            timerButton.textContent = "⏱️";
            timerButton.classList.add("timer-button"); // Ajoute une classe pour le style
            timerButton.style.cursor = "pointer";
            timerButton.style.marginLeft = "10px"; // Espace entre le texte et l'emoji

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

        // Événement de coche
        checkbox.addEventListener("change", () => {
            text.style.textDecoration = checkbox.checked ? "line-through" : "none";
        });

        // Organisation des éléments dans la liste
        listItem.appendChild(checkbox); // Ajoute la checkbox
        listItem.appendChild(text); // Ajoute le texte

        if (timeMatch) {
            listItem.appendChild(timerButton); // Ajoute l'emoji uniquement s'il y a du temps
        }

        exerciseListElement.appendChild(listItem);
    });
}

