let exercises = {};
const exerciseListElement = document.getElementById("exercise-list");
const currentDay = new Date().toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
document.getElementById("current-day").innerText = `Exercices du ${currentDay}`;

let routineCounter = 0;
const maxRoutine = 3;
let timerInterval;
let remainingTime = 0;

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        exercises = data;
        displayExercises(exercises[currentDay] || []);
    })
    .catch(error => console.error("Erreur de chargement JSON :", error));

// Fonction pour afficher les exercices avec drag and drop
function displayExercises(todayExercises) {
    exerciseListElement.innerHTML = "";

    const routineTracker = document.createElement("p");
    routineTracker.textContent = `Routine : ${routineCounter}/${maxRoutine}`;
    routineTracker.id = "routine-tracker";
    routineTracker.style.fontWeight = "bold";
    routineTracker.style.marginBottom = "10px";
    exerciseListElement.appendChild(routineTracker);

    todayExercises.forEach((exercise) => {
        const listItem = document.createElement("li");
        listItem.draggable = true; // Activation du drag and drop
        listItem.classList.add("draggable");

        // Conteneur gauche pour checkbox et texte
        const leftContainer = document.createElement("div");
        leftContainer.style.display = "flex";
        leftContainer.style.alignItems = "center";
        leftContainer.style.flex = "1";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.marginRight = "10px";

        // Texte de l'exercice
        const text = document.createElement("span");
        text.textContent = exercise;

        // Ajout au conteneur gauche
        leftContainer.appendChild(checkbox);
        leftContainer.appendChild(text);

        // Emoji minuteur si une durée est détectée
        const timeMatch = exercise.match(/(\d+)\s*(s|min)/i);
        let timerButton = null;

        if (timeMatch) {
            timerButton = document.createElement("span");
            timerButton.textContent = "⏱️";
            timerButton.style.marginLeft = "10px";
            timerButton.style.cursor = "pointer";

            const timeValue = parseInt(timeMatch[1]);
            const timeUnit = timeMatch[2].toLowerCase();
            const totalTimeInSeconds = timeUnit === "min" ? timeValue * 60 : timeValue;

            timerButton.addEventListener("click", () => {
                remainingTime = totalTimeInSeconds;
                updateTimerDisplay();
                alert(`Minuteur configuré sur ${formatTime(remainingTime)} pour "${exercise}"`);
            });
        }

        // Ajout des éléments au listItem
        listItem.appendChild(leftContainer); // Conteneur de gauche (checkbox + texte)
        if (timerButton) {
            listItem.appendChild(timerButton); // Emoji ⏱️ tout à droite
        }

        exerciseListElement.appendChild(listItem);

        // Drag and drop
        listItem.addEventListener("dragstart", () => listItem.classList.add("dragging"));
        listItem.addEventListener("dragend", () => listItem.classList.remove("dragging"));
    });

    addDragAndDropFunctionality();
}


// Vérifie la complétion de la routine
function checkCompletion() {
    const allChecked = [...document.querySelectorAll("li input[type=checkbox]")].every(input => input.checked);
    if (allChecked && routineCounter < maxRoutine) {
        routineCounter++;
        document.getElementById("routine-tracker").textContent = `Routine : ${routineCounter}/${maxRoutine}`;
        if (routineCounter < maxRoutine) resetExercises();
        else showCelebration();
    }
}

// Réinitialise toutes les cases
function resetExercises() {
    document.querySelectorAll("li input[type=checkbox]").forEach(input => {
        input.checked = false;
        input.parentElement.classList.remove("checked");
    });
}

// Drag and drop : Ajoute la logique
function addDragAndDropFunctionality() {
    exerciseListElement.addEventListener("dragover", e => {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(exerciseListElement, e.clientY);
        if (afterElement == null) {
            exerciseListElement.appendChild(draggingItem);
        } else {
            exerciseListElement.insertBefore(draggingItem, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Minuteur
function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
}

function updateTimerDisplay() {
    document.getElementById("timer").textContent = formatTime(remainingTime);
}

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

updateTimerDisplay();

// Fonction pour afficher les emojis 🎉🎊🎈
function showCelebration() {
    for (let i = 0; i < 50; i++) {
        const emoji = document.createElement("div");
        emoji.classList.add("celebration-emoji");
        emoji.textContent = ["🎉", "🎊", "🎈"][Math.floor(Math.random() * 3)];
        emoji.style.left = Math.random() * 100 + "vw";
        emoji.style.top = Math.random() * 100 + "vh";
        emoji.style.animationDuration = Math.random() * 2 + 3 + "s";
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 5000);
    }
}
