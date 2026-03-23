require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { getMarketData } = require('./services/market');
const { runStrategy } = require('./services/strategy');
const { executeTrade, history } = require('./services/trader');

const app = express();
app.use(cors());
app.use(express.json());

let lastTrade = null;

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send('Trading Bot Running 🚀');
});

// تشغيل البوت يدوي
app.get('/run', async (req, res) => {
    const data = await getMarketData();
    const decision = runStrategy(data);
    const trade = executeTrade(decision, data.price);

    lastTrade = trade;

    res.json({
    "السوق": {
        "السعر": data.price,
        "RSI": data.rsi,
        "الاتجاه": data.trend
    },
    "القرار": decision,
    "الصفقة": trade
});
});

// آخر صفقة
app.get('/status', (req, res) => {
    res.json({
        lastTrade
    });
});

// سجل الصفقات
app.get('/history', (req, res) => {
    res.json(history);
});

// الأرباح
app.get('/profit', (req, res) => {
    res.json({
        history,
    });
});

// تشغيل تلقائي كل دقيقة 🤖
setInterval(async () => {
    const data = await getMarketData();
    const decision = runStrategy(data);
    const trade = executeTrade(decision, data.price);

    console.log("AUTO:", { data, decision, trade });
}, 60000);

// PORT مهم لـ Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
});
