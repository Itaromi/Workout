let exercises = {};
const exerciseListElement = document.getElementById("exercise-list");
const currentDay = new Date().toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
document.getElementById("current-day").innerText = `Exercices du ${currentDay}`;

let routineCounter = 0; // Compteur de routines réalisées
const maxRoutine = 3; // Maximum de routines à réaliser par jour

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
    exerciseListElement.innerHTML = ""; // Efface la liste précédente

    // Crée l'indicateur de routine
    const routineTracker = document.createElement("p");
    routineTracker.textContent = `Routine : ${routineCounter}/${maxRoutine}`;
    routineTracker.id = "routine-tracker";
    routineTracker.style.marginBottom = "10px";
    routineTracker.style.fontWeight = "bold";
    exerciseListElement.appendChild(routineTracker);

    const checkboxes = []; // Stocke toutes les cases pour vérification

    todayExercises.forEach((exercise) => {
        const listItem = document.createElement("li");
        listItem.style.display = "flex";
        listItem.style.alignItems = "center";
        listItem.style.justifyContent = "space-between";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.marginRight = "10px";

        // Texte de l'exercice
        const text = document.createElement("span");
        text.textContent = exercise;

        // Ajout dans le tableau pour vérification
        checkboxes.push(checkbox);

        // Écouteur pour changer le style lorsque coché
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                listItem.classList.add("checked");
            } else {
                listItem.classList.remove("checked");
            }

            // Vérifie si toutes les cases sont cochées
            checkCompletion(checkboxes, routineTracker, todayExercises);
        });

        // Organisation des éléments
        listItem.appendChild(checkbox);
        listItem.appendChild(text);
        exerciseListElement.appendChild(listItem);
    });
}

// Fonction pour vérifier si toutes les cases sont cochées
function checkCompletion(checkboxes, routineTracker, todayExercises) {
    if (checkboxes.every((checkbox) => checkbox.checked)) {
        if (routineCounter < maxRoutine) {
            routineCounter++;
            routineTracker.textContent = `Routine : ${routineCounter}/${maxRoutine}`;

            if (routineCounter < maxRoutine) {
                resetExercises(checkboxes); // Réinitialise les exercices
            } else {
                alert("Bravo ! Tu as complété toutes les routines pour aujourd'hui 🎉");
            }
        }
    }
}

// Fonction pour réinitialiser toutes les cases
function resetExercises(checkboxes) {
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.parentElement.classList.remove("checked"); // Retire le style vert et rayé
    });
}
