const getThicknessMultiplier = (thickness) => {
    if (thickness >= 1 && thickness < 4) return 0.05;
    if (thickness >= 4 && thickness < 12) return 0.06;
    if (thickness >= 12 && thickness < 18) return 0.08;
    if (thickness >= 18 && thickness < 22) return 0.08;
    if (thickness >= 22 && thickness < 30) return 0.09;
    if (thickness >= 30 && thickness < 35) return 0.1;
    if (thickness >= 35 && thickness < 45) return 0.11;
    if (thickness >= 45 && thickness < 50) return 0.12;
    if (thickness >= 50 && thickness < 55) return 0.13;
    if (thickness >= 55 && thickness < 65) return 0.14;
    if (thickness >= 65 && thickness < 70) return 0.15;
    if (thickness >= 70 && thickness < 75) return 0.16;
    if (thickness >= 75 && thickness < 85) return 0.17;
    if (thickness >= 85 && thickness < 90) return 0.18;
    if (thickness >= 90 && thickness < 95) return 0.19;
    if (thickness >= 95 && thickness < 110) return 0.2;
    if (thickness >= 110 && thickness < 120) return 0.22;
    if (thickness >= 120 && thickness < 130) return 0.23;
    if (thickness >= 130 && thickness < 140) return 0.25;
    if (thickness >= 140 && thickness < 150) return 0.26;
    if (thickness >= 150 && thickness < 160) return 0.28;
    if (thickness >= 160 && thickness < 180) return 0.29;
    if (thickness >= 180 && thickness < 200) return 0.32;
    if (thickness >= 200 && thickness < 220) return 0.35;
    if (thickness >= 220 && thickness < 240) return 0.38;
    if (thickness >= 240 && thickness < 260) return 0.41;
    if (thickness >= 260 && thickness < 280) return 0.44;
    if (thickness >= 280 && thickness < 300) return 0.47;
    if (thickness >= 300 && thickness <= 400) return 0.5;
    return 0.5;
};

const updateLabels = () => {
    const shape = document.getElementById("shape").value;
    const lengthLabel = document.querySelector('label[for="length"]');
    const outerDiameterLabel = document.querySelector(
        'label[for="outerDiameter"]'
    );

    if (shape === "rectangle") {
        lengthLabel.textContent = "Długość boku (mm):";
        outerDiameterLabel.textContent = "Fi zewnętrzne (mm):";
    } else if (shape === "circle") {
        lengthLabel.textContent = "Fi zewnętrzne (mm):";
        outerDiameterLabel.textContent = "Fi wewnętrzne (mm, opcjonalnie):";
    }
};

const calculate = () => {
    const shape = document.getElementById("shape").value;
    const thickness = parseInt(document.getElementById("thickness").value);
    const multiplier = getThicknessMultiplier(thickness);
    let result;

    if (!multiplier) {
        document.getElementById("result").textContent =
            "Proszę podać prawidłową grubość blachy (4-35 mm).";
        return;
    }

    if (shape === "rectangle") {
        const length =
            parseFloat(document.getElementById("length").value) / 1000; // Przeliczenie na metry
        const width = parseFloat(document.getElementById("width").value) / 1000; // Przeliczenie na metry
        if (!isNaN(length) && !isNaN(width)) {
            result = (length + width) * 2 * multiplier; // Obliczenie czasu palenia w godzinach
        }
    } else if (shape === "circle") {
        const outerDiameter =
            parseFloat(document.getElementById("outerDiameter").value) / 1000; // Przeliczenie na metry
        const innerDiameter =
            parseFloat(document.getElementById("innerDiameter").value) / 1000; // Przeliczenie na metry

        if (!isNaN(outerDiameter)) {
            if (isNaN(innerDiameter)) {
                result = outerDiameter * Math.PI * multiplier; // Jeśli fi wewnętrzne nie jest podane
            } else {
                result = (outerDiameter + innerDiameter) * Math.PI * multiplier; // Obliczenie dla obu fi
            }
        }
    }

    document.getElementById("result").textContent = result
        ? `Czas palenia blachy: ${result.toFixed(2)} h`
        : "Proszę podać wszystkie dane.";
};

// Obsługa zmiany kształtu
document.getElementById("shape").addEventListener("change", updateLabels);

// Obsługa kliknięcia przycisku "Oblicz"
document.getElementById("calculate").addEventListener("click", calculate);

// Obsługa naciśnięcia klawisza Enter
document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        calculate();
    }
});

// Obsługa kliknięcia przycisku "Wyczyść"
document.getElementById("clear").addEventListener("click", function () {
    clearInputs();
});

// Funkcja czyszcząca
const clearInputs = () => {
    document.getElementById("thickness").value = "";
    document.getElementById("length").value = "";
    document.getElementById("width").value = "";
    document.getElementById("outerDiameter").value = "";
    document.getElementById("innerDiameter").value = "";
    document.getElementById("result").textContent = "";
};

// Obsługa naciśnięcia klawisza Delete
document.addEventListener("keydown", function (event) {
    if (event.key === "Delete") {
        clearInputs();
    }
});

// Inicjalizacja etykiet przy załadowaniu strony
updateLabels();
