function runStrategy(data) {
    if (data.rsi < 30 && data.trend === "up") {
        return "BUY";
    }

    if (data.rsi > 70) {
        return "SELL";
    }

    return "HOLD";
}

module.exports = { runStrategy };
