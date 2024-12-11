// async kérés
const apiKey = 'd18cd56d330726aee31bf6db5dca5898';
const apiUrl = `https://data.fixer.io/api/latest?access_key=${apiKey}`;

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

const currencies = Object.keys(currencyNames);

let data = {
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

async function fetchExchangeRates() {
    try {
        console.log('Fetching exchange rates...');
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.success) {
            const exchangeRates = Object.keys(result.rates)
                .filter((key) => currencies.includes(key))
            // Szűrjük az adatokat csak a szükséges valutákra
            exchangeRates = Object.keys(result.rates)
                .filter((key) => key in currencyNames)
                .reduce((obj, key) => {
                    obj[key] = result.rates[key];
                    return obj;
                }, {});

            data = exchangeRates;
            console.log('Updated data:', data);
            updateExchangeTable(data, currencyNames);
            // Frissítjük a táblázatot az új árfolyamokkal
            updateExchangeTable(exchangeRates);
        } else {
            console.error('Failed to fetch exchange rates:', result.error);
        }
    } catch (error) {
        console.error('An error occurred while fetching exchange rates:', error);
    }
}
// táblázat frissítése
function updateExchangeTable(data, currencyNames) {
    const tableBody = document.querySelector("#exchangeTable tbody");
    tableBody.innerHTML = "";

    const hufRate = data.HUF;

    for (const [currency, rate] of Object.entries(data)) {
        let rateInHUF = (hufRate / rate).toFixed(2);
        const name = currencyNames[currency] || "Ismeretlen valuta";

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
//gomb nyomásra eseményfigyelő => árfolyam frissítés
document.getElementById('refreshButton').addEventListener('click', fetchExchangeRates);
updateExchangeTable(data, currencyNames);

//sötét téma
document.querySelector(".container img").addEventListener("click", (e)=>{
    const source = e.target.src.split("/").at(-1)
    if(source === `dark.png`){
        e.target.src = `./img/theme/light.png`
        document.querySelector(".container").style.backgroundColor = "var(--dark)"
        document.querySelector(".calculator").style.backgroundColor = "var(--dark)"
        document.querySelector("body").style.backgroundColor = "var(--lighterdark)"
        document.querySelector("p").style.color = "var(--ligth-grey)"

    }else{
        e.target.src=`./img/theme/dark.png`
        document.querySelector(".container").style.backgroundColor = ""
        document.querySelector(".calculator").style.backgroundColor = ""
        document.querySelector("body").style.backgroundColor = ""
    }
})


// Gomb esemény - frissítés
document.getElementById('refreshButton').addEventListener('click', fetchExchangeRates);

updateExchangeTable(exchangeRates);


// Gomb eseménykezelő a valuták cseréléséhez
document.getElementById("change-currency-values").addEventListener("click", function() {
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const tempValue = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = tempValue;

    const fromLabel = document.querySelector('label[for="from-currency"]');
    const toLabel = document.querySelector('label[for="to-currency"]');
    
    if (fromLabel && toLabel) {
        const tempText = fromLabel.textContent;
        fromLabel.textContent = toLabel.textContent;
        toLabel.textContent = tempText;
    }
});

// Átváltás gomb eseménykezelő
document.getElementById("convert-button").addEventListener("click", function() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("from-currency").value;
    const toCurrency = document.getElementById("to-currency").value;

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
