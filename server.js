const express = require('express');
const app = express();

const { getMarketData } = require('./services/market');
const { runStrategy } = require('./services/strategy');
const { executeTrade } = require('./services/trader');
const { sendTelegram } = require('./services/telegram');

let history = [];

app.get('/', (req, res) => {
    res.send('بوت التداول يعمل 🚀');
});

app.get('/run', async (req, res) => {
    try {
        const stocks = await getMarketData();
        const result = runStrategy(stocks);

        let trade = null;

        if (result.bestStock) {
            trade = executeTrade(
                result.decision,
                result.bestStock.price,
                result.bestStock.rsi
            );

            history.push(trade);
        }

        if (result.bestStock) {
            let message = `
📊 السهم: ${result.bestStock.name || "غير معروف"}
💰 السعر: ${result.bestStock.price}
📉 RSI: ${result.bestStock.rsi}

🤖 القرار: ${result.decision}

🎯 الهدف: ${trade?.target || "-"}
🛑 وقف الخسارة: ${trade?.stopLoss || "-"}
            `;

            await sendTelegram(message);
        }

        res.json({
            stock: result.bestStock,
            decision: result.decision,
            trade,
        });

    } catch (error) {
        res.json({ error: error.message });
    }
});

app.get('/profit', (req, res) => {
    res.json({ history });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
