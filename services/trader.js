let balance = 10000;
let position = null;
let history = [];
let totalProfit = 0;

function executeTrade(decision, price) {

    // شراء
    if (decision === "BUY" && !position) {
        position = {
            entry: price
        };

        const trade = {
            action: "BUY",
            price,
            time: new Date()
        };

        history.push(trade);
        return trade;
    }

    // بيع
    if (decision === "SELL" && position) {
        const profit = price - position.entry;
        totalProfit += profit;
        balance += profit;

        const trade = {
            action: "SELL",
            entry: position.entry,
            price,
            profit,
            totalProfit,
            balance,
            time: new Date()
        };

        history.push(trade);
        position = null;

        return trade;
    }

    return { action: "HOLD" };
}

module.exports = {
    executeTrade,
    history
};
