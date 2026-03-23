app.get('/run', async (req, res) => {
    try {
        const stocks = await getMarketData();

        if (!stocks || stocks.length === 0) {
            return res.status(200).json({
                message: "ما قدرت أجلب بيانات السوق الآن"
            });
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
        }

        return res.json({
            "أفضل_سهم": result.bestStock || null,
            "القرار": result.decision || "انتظار",
            "الصفقة": trade
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});
