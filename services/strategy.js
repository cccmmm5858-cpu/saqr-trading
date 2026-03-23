function runStrategy(data) {

    if (data.rsi < 35) {
        return "شراء";
    }

    if (data.rsi > 60) {
        return "بيع";
    }

    return "انتظار";
}

module.exports = { runStrategy };
