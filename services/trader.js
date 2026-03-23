let balance = 10000;
let position = null;
let history = [];
let totalProfit = 0;

function executeTrade(decision, price) {

    // شراء
    if (decision === "شراء" && !position) {
        position = {
            entry: price
        };

        const trade = {
            "الإجراء": "شراء",
            "السعر": price,
            "الوقت": new Date()
        };

        history.push(trade);
        return trade;
    }

    // بيع
    if (decision === "بيع" && position) {
        const profit = price - position.entry;
        totalProfit += profit;
        balance += profit;

        const trade = {
            "الإجراء": "بيع",
            "سعر_الدخول": position.entry,
            "السعر": price,
            "الربح": profit,
            "إجمالي_الربح": totalProfit,
            "الرصيد": balance,
            "الوقت": new Date()
        };

        history.push(trade);
        position = null;

        return trade;
    }

    return { "الإجراء": "انتظار" };
}

module.exports = {
    executeTrade,
    history
};
