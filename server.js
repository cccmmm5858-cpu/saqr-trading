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
        await sendTelegram("🔥 اختبار مباشر شغال");

        const stocks = await getMarketData();

        // 🧠 جلب البيانات مع timeout (عشان ما يعلق)
        const stocks = await Promise.race([
            getMarketData(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout من API")), 5000)
            )
        ]);

        await sendTelegram("📊 تم جلب البيانات");

        // ❌ إذا ما فيه بيانات
        if (!stocks || stocks.length === 0) {
            await sendTelegram("❌ ما فيه بيانات سوق");
            return res.json({ message: "ما فيه بيانات سوق الآن" });
        }

        // 🤖 تحليل الاستراتيجية
        const result = runStrategy(stocks);

        await sendTelegram("🤖 تم التحليل");

        let trade = null;

        if (result.bestStock) {
            trade = executeTrade(
                result.decision,
                result.bestStock.price,
                result.bestStock.rsi
            );
        }

        // 📨 تجهيز الرسالة
        let message = "🚀 تشغيل البوت\n";

        if (result.bestStock) {
            message += `
📊 أفضل سهم:
${result.bestStock.name} (${result.bestStock.symbol})

💰 السعر: ${result.bestStock.price}
📉 RSI: ${result.bestStock.rsi.toFixed(2)}

🤖 القرار: ${result.decision}
`;

            if (trade) {
                message += `
💰 الدخول: ${trade.entry}
🎯 الهدف: ${trade.target}
🛑 الوقف: ${trade.stopLoss}
`;
            }
        } else {
            message += "\n❌ لا يوجد فرصة تداول الآن";
        }

        // 📤 إرسال تيليجرام
        await sendTelegram(message);

        // 💾 حفظ التاريخ
        history.push({
            stock: result.bestStock ? result.bestStock.name : "none",
            decision: result.decision,
            price: result.bestStock ? result.bestStock.price : 0,
            time: new Date()
        });

        // ✅ الرد للمتصفح
        res.json({
            result,
            trade,
            history
        });

    } catch (error) {
        console.log(error);

        await sendTelegram("❌ خطأ: " + error.message);

        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/profit', (req, res) => {
    res.json({ history });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
