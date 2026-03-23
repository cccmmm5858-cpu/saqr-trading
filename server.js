const express = require('express');
const app = express();

const { getMarketData } = require('./services/market');
const { runStrategy } = require('./services/strategy');
const { executeTrade } = require('./services/trader');
const { sendTelegram } = require('./services/telegram');

app.get('/', (req, res) => {
    res.send('بوت التداول يعمل 🚀');
});

app.get('/run', async (req, res) => {

    const stocks = await getMarketData();
    const result = runStrategy(stocks);

    let trade = null;

    if (result.bestStock) {
        trade = executeTrade(
            result.decision,
            result.bestStock.price,
            result.bestStock.rsi
        );
    }

    // إرسال تيليجرام
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

        if (trade && trade["الإجراء"] === "بيع (هدف)") {
            message += `

✅ تحقق الهدف
💰 الربح: ${trade["الربح"]}
            `;
        }

        if (trade && trade["الإجراء"] === "بيع (وقف خسارة)") {
            message += `

❌ وقف الخسارة
💸 الخسارة: ${trade["الخسارة"]}
            `;
        }

        await sendTelegram(message);
    }

    res.json({
        "أفضل_سهم": result.bestStock,
        "القرار": result.decision,
        "الصفقة": trade
    });
});

// مهم لـ Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
