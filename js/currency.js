const apiKey = 'd18cd56d330726aee31bf6db5dca5898';

const apiUrl = `http://data.fixer.io/api/latest?access_key=${apiKey}`;

async function fetchExchangeRates() {

try {

const response = await fetch(apiUrl);

const data = await response.json();

if (data.success) {

const exchangeRates = data.rates;

const exchangeRatesDiv = document.getElementById('exchangeRates');

exchangeRatesDiv.innerHTML = '<h2>Exchange Rates:</h2><ul>';

for (const currency in exchangeRates) {

exchangeRatesDiv.innerHTML += `<li>${currency}: ${exchangeRates[currency]}</li>`;

}

exchangeRatesDiv.innerHTML += '</ul>';

} else {

console.error('Failed to fetch exchange rates:', 'http://data.error.info');

}

} catch (error) {

console.error('An error occurred while fetching exchange rates:', error);

}

}

fetchExchangeRates();

// Refresh rates every 1 minute (adjust as needed)

setInterval(fetchExchangeRates, 60000);