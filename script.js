let exercises = {};
const exerciseListElement = document.getElementById("exercise-list");
const timerDisplay = document.getElementById("timer");
let timerInterval;
let remainingTime = 0;

// Affichage du jour actuel
const currentDay = new Date().toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
document.getElementById("current-day").innerText = `Exercices du ${currentDay}`;

// Chargement des exercices depuis data.json
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        exercises = data;
        displayExercises(exercises[currentDay] || []);
    })
    .catch(error => {
        console.error("Erreur de chargement JSON :", error);
    });

// Fonction pour afficher les exercices
function displayExercises(todayExercises) {
    exerciseListElement.innerHTML = ""; // Efface les éléments précédents

    todayExercises.forEach((exercise) => {
        const listItem = document.createElement("li");
        listItem.style.display = "flex";
        listItem.style.justifyContent = "space-between";
        listItem.style.alignItems = "center";
        listItem.style.marginBottom = "10px";

        // Texte principal de l'exercice
        const exerciseText = document.createElement("span");
        exerciseText.textContent = exercise.nom;
        exerciseText.style.flex = "1";

        // Séries et répétitions/durée
        const seriesInfo = document.createElement("span");
        if (exercise.séries && exercise.répétitions) {
            seriesInfo.textContent = `${exercise.séries} séries de ${exercise.répétitions} répétitions`;
        } else if (exercise.séries && exercise.durée) {
            seriesInfo.textContent = `${exercise.séries} séries de ${exercise.durée}`;
        } else if (exercise.durée) {
            seriesInfo.textContent = `Durée : ${exercise.durée}`;
        }

        // Incrémentation des séries réalisées
        let seriesDone = 0;
        const seriesCounter = document.createElement("button");
        seriesCounter.textContent = `${seriesDone}/${exercise.séries || 1}`;
        seriesCounter.style.padding = "5px 10px";
        seriesCounter.style.marginLeft = "10px";
        seriesCounter.style.cursor = "pointer";
        seriesCounter.style.border = "none";
        seriesCounter.style.backgroundColor = "#007bff";
        seriesCounter.style.color = "white";
        seriesCounter.style.borderRadius = "5px";

        seriesCounter.addEventListener("click", () => {
            if (seriesDone < exercise.séries) {
                seriesDone++;
                seriesCounter.textContent = `${seriesDone}/${exercise.séries}`;
                if (seriesDone === exercise.séries) {
                    exerciseText.style.textDecoration = "line-through";
                    listItem.style.backgroundColor = "#d4edda";
                }
            }
        });

        // Emoji minuteur si une durée est définie
        if (exercise.durée) {
            const timerButton = document.createElement("span");
            timerButton.textContent = "⏱️";
            timerButton.style.marginLeft = "10px";
            timerButton.style.cursor = "pointer";
            timerButton.style.fontSize = "1.2rem";

            // Définir le timer lorsqu'on clique sur l'emoji
            const timeMatch = exercise.durée.match(/(\d+)\s*(s|min)/i);
            if (timeMatch) {
                const timeValue = parseInt(timeMatch[1]);
                const timeUnit = timeMatch[2].toLowerCase();
                const totalTimeInSeconds = timeUnit === "min" ? timeValue * 60 : timeValue;

                timerButton.addEventListener("click", () => {
                    remainingTime = totalTimeInSeconds;
                    updateTimerDisplay();
                    alert(`Minuteur configuré sur ${formatTime(remainingTime)} pour "${exercise.nom}"`);
                });
            }
            listItem.appendChild(timerButton);
        }

        // Organisation des éléments dans la liste
        listItem.appendChild(exerciseText);
        listItem.appendChild(seriesInfo);
        listItem.appendChild(seriesCounter);
        exerciseListElement.appendChild(listItem);
    });
}

// Fonction pour formater le timer (mm:ss)
function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
}

// Fonction pour mettre à jour l'affichage du timer
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingTime);
}

// Contrôle du minuteur
document.getElementById("start-btn").addEventListener("click", () => {
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
});

document.getElementById("stop-btn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById("reset-btn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingTime = 0;
    updateTimerDisplay();
});

// Initialiser le timer à 00:00
updateTimerDisplay();
