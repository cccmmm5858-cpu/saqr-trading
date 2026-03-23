let balance = 10000;
let position = null;

function executeTrade(decision, price) {
    if (decision === "BUY" && !position) {
        position = {
            entry: price
        };
        return { action: "BUY", price };
    }

    if (decision === "SELL" && position) {
        const profit = price - position.entry;
        balance += profit;

        const result = {
            action: "SELL",
            price,
            profit,
            balance
        };

        position = null;
        return result;
    }

    return { action: "HOLD" };
}

module.exports = { executeTrade };

history.push({
    price,
    decision,
    time: new Date()
});
