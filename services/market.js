const axios = require('axios');

const symbols = [
  "2222.SR","1120.SR","2010.SR","7010.SR","7020.SR",
  "7030.SR","1211.SR","2020.SR","1180.SR","1050.SR"
];

const names = {
  "2222.SR": "أرامكو",
  "1120.SR": "الراجحي",
  "2010.SR": "سابك",
  "7010.SR": "STC",
  "7020.SR": "موبايلي",
  "7030.SR": "زين",
  "1211.SR": "معادن",
  "2020.SR": "سافكو",
  "1180.SR": "الأهلي",
  "1050.SR": "الإنماء"
};

function calculateRSI(closes, period = 14) {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

async function getMarketData() {
    const results = [];

    for (const symbol of symbols) {
        try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=5m`;
            const response = await axios.get(url, { timeout: 8000 });

            const result = response.data?.chart?.result?.[0];
            const closes = result?.indicators?.quote?.[0]?.close || [];
            const cleanCloses = closes.filter(c => c !== null);

            if (cleanCloses.length < 15) continue;

            const price = cleanCloses[cleanCloses.length - 1];
            const rsi = calculateRSI(cleanCloses);

            results.push({
                symbol,
                name: names[symbol] || symbol,
                price,
                rsi,
                trend: rsi < 50 ? "صعود" : "هبوط"
            });
        } catch (err) {
            console.log("Market fetch error:", symbol, err.message);
        }
    }

    return results;
}

module.exports = { getMarketData };
