require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { getMarketData } = require('./services/market');
const { runStrategy } = require('./services/strategy');
const { executeTrade } = require('./services/trader');

const app = express();
app.use(cors());
app.use(express.json());

let lastTrade = null;

app.get('/', (req, res) => {
    res.send('Trading Bot Running 🚀');
});

app.get('/run', async (req, res) => {
    const data = await getMarketData();
    const decision = runStrategy(data);

    const trade = executeTrade(decision, data.price);

    lastTrade = trade;

    res.json({
        market: data,
        decision,
        trade
    });
});

app.get('/status', (req, res) => {
    res.json({
        lastTrade
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
});

