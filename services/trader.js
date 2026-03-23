let balance = 10000;
let position = null;
let history = []; // سجل الصفقات

function executeTrade(decision, price) {
    if (decision === "BUY" && !position) {
        position = { entry: price };

        const trade = {
            action: "BUY",
            price,
            time: new Date()
        };

        history.push(trade);
        return trade;
    }

    if (decision === "SELL" && position) {
        const profit = price - position.entry;
        balance += profit;

        const trade = {
            action: "SELL",
            price,
            profit,
            balance,
            time: new Date()
        };

        history.push(trade);
        position = null;

        return trade;
    }

    return { action: "HOLD" };
}

module.exports = { executeTrade, history };
