app.get('/run', async (req, res) => {
    try {
        await sendTelegram("🔥 بدأ تشغيل /run");

        let stocks;
        try {
            stocks = await getMarketData();
        } catch (e) {
            await sendTelegram("❌ خطأ في جلب البيانات: " + e.message);
            return res.json({ error: e.message });
        }

        if (!stocks || stocks.length === 0) {
            await sendTelegram("⚠️ ما فيه بيانات سوق");
            return res.json({ message: "ما فيه بيانات" });
        }

        let result;
        try {
            result = runStrategy(stocks);
        } catch (e) {
            await sendTelegram("❌ خطأ في الاستراتيجية: " + e.message);
            return res.json({ error: e.message });
        }

        let trade = null;

        if (result.bestStock) {
            try {
                trade = executeTrade(
                    result.decision,
                    result.bestStock.price,
                    result.bestStock.rsi
                );
            } catch (e) {
                await sendTelegram("❌ خطأ في تنفيذ الصفقة: " + e.message);
            }
        }

        await sendTelegram("✅ البوت اشتغل بدون كراش");

        res.json({ result, trade });

    } catch (error) {
        console.log(error);
        await sendTelegram("💥 خطأ عام: " + error.message);
        res.status(500).json({ error: error.message });
    }
});
