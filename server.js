const express = require('express');
const app = express();

const { getMarketData } = require('./services/market');
const { runStrategy } = require('./services/strategy');
const { executeTrade } = require('./services/trade');
const { sendTelegram } = require('./services/telegram');

const PORT = process.env.PORT || 3000;

let history = [];

app.get('/', (req, res) => {
    res.send('بوت التداول يعمل 🚀');
});

app.get('/run', async (req, res) => {
    try {
        const stocks = await getMarketData();

        if (!stocks || stocks.length === 0) {
            return res.json({ message: "ما فيه بيانات سوق الآن" });
        }

        const result = runStrategy(stocks);

        let trade = null;

        if (result.bestStock) {
            trade = executeTrade(
                result.decision,
                result.bestStock.price,
                result.bestStock.rsi
            );
        }

        if (result.bestStock) {
            let message = `
📊 أفضل سهم:
${result.bestStock.name} (${result.bestStock.symbol})

💰 السعر: ${result.bestStock.price}
📉 RSI: ${result.bestStock.rsi.toFixed(2)}

🤖 القرار: ${result.decision}
            `;

            if (trade && trade["الإجراء"] === "شراء") {
                message += `

💰 الدخول: ${trade["سعر_الدخول"]}
🎯 الهدف: ${trade["الهدف"]}
🛑 الوقف: ${trade["وقف_الخسارة"]}
                `;
            }

            await sendTelegram(message);

            history.push({
                stock: result.bestStock.name,
                decision: result.decision,
                price: result.bestStock.price,
                time: new Date()
            });
        }

        res.json({
            result,
            trade,
            history
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/profit', (req, res) => {
    res.json({ history });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
