let exercises = {};
const exerciseListElement = document.getElementById("exercise-list");
const currentDay = new Date().toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
document.getElementById("current-day").innerText = `Exercices du ${currentDay}`;

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

    const checkboxes = [];

    todayExercises.forEach((exercise) => {
        const listItem = document.createElement("li");
        listItem.draggable = true;
        listItem.classList.add("draggable");

        // Conteneur gauche (checkbox + texte)
        const leftContainer = document.createElement("div");
        leftContainer.style.display = "flex";
        leftContainer.style.alignItems = "center";

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

        // Emoji minuteur (si une durée est détectée)
        const timeMatch = exercise.match(/(\d+)\s*(s|min)/i);

        if (timeMatch) {
            const timerButton = document.createElement("span");
            timerButton.textContent = "⏱️";
            timerButton.style.cursor = "pointer";

            const timeValue = parseInt(timeMatch[1]);
            const timeUnit = timeMatch[2].toLowerCase();
            const totalTimeInSeconds = timeUnit === "min" ? timeValue * 60 : timeValue;

            timerButton.addEventListener("click", () => {
                remainingTime = totalTimeInSeconds;
                updateTimerDisplay();
                alert(`Minuteur configuré sur ${formatTime(remainingTime)} pour "${exercise}"`);
            });

            listItem.appendChild(leftContainer);
            listItem.appendChild(timerButton);
        } else {
            listItem.appendChild(leftContainer);
        }

        // Événement pour rayer les exercices cochés
        checkbox.addEventListener("change", () => {
            listItem.classList.toggle("checked", checkbox.checked);
            if (checkboxes.every((cb) => cb.checked)) showCelebration();
        });

        checkboxes.push(checkbox);
        exerciseListElement.appendChild(listItem);

        // Drag and drop
        listItem.addEventListener("dragstart", () => listItem.classList.add("dragging"));
        listItem.addEventListener("dragend", () => listItem.classList.remove("dragging"));
    });

    addDragAndDropFunctionality();
}

// Drag and drop
function addDragAndDropFunctionality() {
    exerciseListElement.addEventListener("dragover", (e) => {
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
    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// Minuteur
function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
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

// Animation de célébration 🎉
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
