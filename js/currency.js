// async kérés
const apiKey = 'd18cd56d330726aee31bf6db5dca5898';
const apiUrl = `https://data.fixer.io/api/latest?access_key=${apiKey}`;

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
                .reduce((obj, key) => {
                    obj[key] = result.rates[key];
                    return obj;
                }, {});

            data = exchangeRates;
            console.log('Updated data:', data);
            updateExchangeTable(data, currencyNames);
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

