const express = require('express');
const app = express();

require('dotenv').config();

const { getMarketData } = require('./services/market');
const { runStrategy } = require('./services/strategy');
const { executeTrade } = require('./services/trader'); // ← مهم: trader مو trade
const { sendTelegram } = require('./services/telegram');

const PORT = process.env.PORT || 3000;

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send('Bot is running 🚀');
});

// تشغيل البوت
app.get('/run', async (req, res) => {
    try {
        const stocks = await getMarketData();

        if (!stocks || stocks.length === 0) {
            return res.json({ message: "No market data" });
        }

        const result = runStrategy(stocks);

        let trade = null;

        if (result.bestStock) {
            trade = executeTrade(
                result.decision,
                result.bestStock.price,
                result.bestStock.rsi
            );

            await sendTelegram(`🔥 اشتغل البوت
${result.bestStock.name}
قرار: ${result.decision}`);
        }

        res.json({
            result,
            trade
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
