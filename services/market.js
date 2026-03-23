const axios = require('axios');

const symbols = [
  "2222.SR","1120.SR","2010.SR","7010.SR","7020.SR",
  "7030.SR","1211.SR","2020.SR","1180.SR","1050.SR"
];

// حساب RSI
function calculateRSI(closes, period = 14) {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

async function getMarketData() {
    let results = [];

    for (let symbol of symbols) {
        try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=5m`;
            const response = await axios.get(url);

            const result = response.data.chart.result[0];
            const closes = result.indicators.quote[0].close;

            const cleanCloses = closes.filter(c => c !== null);

            if (cleanCloses.length < 15) continue;

            const price = cleanCloses[cleanCloses.length - 1];
            const rsi = calculateRSI(cleanCloses);

            results.push({
                symbol,
                price,
                rsi,
                trend: rsi < 50 ? "صعود" : "هبوط"
            });

        } catch (err) {
            console.log("Error:", symbol);
        }
    }

    return results;
}

module.exports = { getMarketData };
