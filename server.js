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

    // 🔥 نرسل دايم (حتى لو انتظار)
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
