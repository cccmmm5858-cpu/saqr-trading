const { sendTelegram } = require('./services/telegram');

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

    // رسالة تيليجرام
    if (result.bestStock && trade) {

        let message = `
📊 أفضل سهم:
${result.bestStock.name} (${result.bestStock.symbol})

📉 RSI: ${result.bestStock.rsi.toFixed(2)}
🤖 القرار: ${result.decision}
        `;

        // شراء
        if (trade["الإجراء"] === "شراء") {
            message += `

💰 سعر الدخول: ${trade["سعر_الدخول"]}
🎯 الهدف: ${trade["الهدف"]}
🛑 وقف الخسارة: ${trade["وقف_الخسارة"]}
            `;
        }

        // بيع هدف
        if (trade["الإجراء"] === "بيع (هدف)") {
            message += `

✅ تم تحقيق الهدف
💰 الربح: ${trade["الربح"]}
            `;
        }

        // وقف خسارة
        if (trade["الإجراء"] === "بيع (وقف خسارة)") {
            message += `

❌ تم ضرب وقف الخسارة
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
