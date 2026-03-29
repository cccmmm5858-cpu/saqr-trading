function executeTrader(decision, price, rsi) {
    if (decision !== "شراء") {
        return {
            "الإجراء": "انتظار"
        };
    }

    const entry = price;
    const target = price * 1.01;    // هدف ربح 1%
    const stopLoss = price * 0.995; // وقف خسارة 0.5%

    return {
        "الإجراء": "شراء",
        "سعر_الدخول": entry.toFixed(2),
        "الهدف": target.toFixed(2),
        "وقف_الخسارة": stopLoss.toFixed(2)
    };
}

// التأكد من أن الاسم هنا يطابق اسم الدالة أعلاه (تم إضافة حرف r)
module.exports = { executeTrader };
