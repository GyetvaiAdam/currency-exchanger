const apiKey = 'd18cd56d330726aee31bf6db5dca5898';
const apiUrl = `http://data.fixer.io/api/latest?access_key=${apiKey}`;

//exchangable currencies
const currencies = [
    'HUF', 'EUR', 'USD', 'CHF', 'GBP', 'CZK', 
    'JPY', 'SEK', 'AUD', 'NOK', 'CAD', 'RON', 
    'PLN', 'RSD'
];

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

// fetch if button pressed
async function fetchExchangeRates() {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.success) {
            const exchangeRates = result.rates;
            // update fetched dataes
            data = currenciesToDisplay.reduce((filtered, currency) => {
                if (exchangeRates[currency] !== undefined) {
                    filtered[currency] = exchangeRates[currency];
                }
                return filtered;
            }, {});

            updateExchangeRatesUI(data);
        } else {
            console.error('Failed to fetch exchange rates:', result.error);
        }
    } catch (error) {
        console.error('An error occurred while fetching exchange rates:', error);
    }
}

// function for currencie show
function updateExchangeRatesUI(data) {
    const exchangeRatesDiv = document.getElementById('exchangeRates');
    exchangeRatesDiv.innerHTML = '<h2>Exchange Rates:</h2><ul>';
    for (const [currency, rate] of Object.entries(data)) {
        exchangeRatesDiv.innerHTML += `<li>${currency}: ${rate.toFixed(4)}</li>`;
    }
    exchangeRatesDiv.innerHTML += '</ul>';
}

//start fetch
document.getElementById('refreshButton').addEventListener('click', fetchExchangeRates);

//newest data show
updateExchangeRatesUI(data);
