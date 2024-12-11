const apiKey = 'd18cd56d330726aee31bf6db5dca5898';
const apiUrl = `http://data.fixer.io/api/latest?access_key=${apiKey}`;

// Árfolyamok teljes nevének listája
const currencyNames = {
    HUF: "Magyar Forint",
    EUR: "Euró",
    USD: "Amerikai Dollár",
    CHF: "Svájci Frank",
    GBP: "Brit Font",
    CZK: "Cseh Korona",
    JPY: "Japán Jen",
    SEK: "Svéd Korona",
    AUD: "Ausztrál Dollár",
    NOK: "Norvég Korona",
    CAD: "Kanadai Dollár",
    RON: "Román Lej",
    PLN: "Lengyel Zloty",
    RSD: "Szerb Dínár"
};

// Alapértelmezett adatok (ha az API nem elérhető)
let exchangeRates = {
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
            exchangeRates = Object.keys(result.rates)
                .filter((key) => key in currencyNames)
                .reduce((obj, key) => {
                    obj[key] = result.rates[key];
                    return obj;
                }, {});

            // Frissítjük a táblázatot az új árfolyamokkal
            updateExchangeTable(exchangeRates);
        } else {
            console.error('Failed to fetch exchange rates:', result.error);
        }
    } catch (error) {
        console.error('An error occurred while fetching exchange rates:', error);
    }
}

// Árfolyam táblázat frissítése
function updateExchangeTable(exchangeRates) {
    const tableBody = document.querySelector("#exchangeTable tbody");
    tableBody.innerHTML = "";

    const hufRate = exchangeRates.HUF; // HUF árfolyam

    // Adatok hozzáadása
    for (const [currency, rate] of Object.entries(exchangeRates)) {
        let rateInHUF = (hufRate / rate).toFixed(2);
        const name = currencyNames[currency] || "Ismeretlen valuta"; // Ha nincs név, alapértelmezett szöveg
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${name}</td>
            <td>${currency}</td>
            <td>1 ${currency} = ${rateInHUF} Ft</td>
        `;
        tableBody.appendChild(row);
    }
}

// Gomb esemény - frissítés
document.getElementById('refreshButton').addEventListener('click', fetchExchangeRates);

updateExchangeTable(exchangeRates);

// Convert gomb eseménykezelése
// Átváltás gomb eseménykezelő
document.getElementById("convert-button").addEventListener("click", function() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("from-currency").value; // Kiválasztott valuta
    const toCurrency = document.getElementById("to-currency").value; // Kiválasztott cél valuta

    // Ellenőrizzük, hogy az összeg érvényes szám
    if (isNaN(amount) || amount <= 0) {
        alert("Kérjük, adjon meg egy érvényes összeget!");
        return;
    }

    // Ellenőrizzük, hogy a választott valuták benne vannak az exchangeRates objektumban
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        alert("A valuták nem elérhetők az árfolyamok között.");
        return;
    }

    // Átváltási arány kiszámítása
    const conversionRate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const convertedAmount = (amount * conversionRate).toFixed(2);

    // Eredmény popup megjelenítése
    const popup = document.getElementById("popup");
    document.getElementById("popup-content").innerHTML = `
        <p>${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}</p>
    `;
    popup.style.display = "flex";

    // Popup bezárása
    document.getElementById("close-popup").addEventListener("click", function() {
        popup.style.display = "none";
    });
});
