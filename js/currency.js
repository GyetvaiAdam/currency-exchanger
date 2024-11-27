const apiKey = 'd18cd56d330726aee31bf6db5dca5898';
const apiUrl = `http://data.fixer.io/api/latest?access_key=${apiKey}`;

// Alapértelmezett adatok (ha az API nem elérhető)
let data = {
    HUF: 410.28409,
    EUR: 1,
    USD: 1.048487,
    CHF: 0.927918,
    GBP: 0.833495,
    CZK: 25.201151,
    JPY: 159.426165,
    SEK: 11.50902,
    AUD: 1.617562,
    NOK: 11.687278,
    CAD: 1.474593,
    RON: 4.976962,
    PLN: 4.304133,
    RSD: 116.997561
};

// API-hívás gombnyomásra
async function fetchExchangeRates() {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.success) {
            // Szűrjük az adatokat csak a szükséges valutákra
            const exchangeRates = Object.keys(result.rates)
                .filter((key) => currencies.includes(key))
                .reduce((obj, key) => {
                    obj[key] = result.rates[key];
                    return obj;
                }, {});

            // Frissítjük a data objektumot
            data = exchangeRates;
            updateExchangeTable(data);
        } else {
            console.error('Failed to fetch exchange rates:', result.error);
        }
    } catch (error) {
        console.error('An error occurred while fetching exchange rates:', error);
    }
}

// Táblázat frissítése az aktuális adatokkal
function updateExchangeTable(data) {
    const tableBody = document.querySelector("#exchangeTable tbody");
    tableBody.innerHTML = ""; // Töröljük a meglévő tartalmat

    // Adatok hozzáadása
    for (const [currency, rate] of Object.entries(data)) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${currency}</td>
            <td>${currency}</td>
            <td>${rate.toFixed(4)}</td>
        `;
        tableBody.appendChild(row);
    }
}

// Gomb esemény
document.getElementById('refreshButton').addEventListener('click', fetchExchangeRates);

// Alapértelmezett adatok megjelenítése induláskor
updateExchangeTable(data);
