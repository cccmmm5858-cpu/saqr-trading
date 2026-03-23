const axios = require('axios');

async function sendTelegram(message) {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const res = await axios.post(url, {
            chat_id: chatId,
            text: message
        });

        console.log("Telegram sent ✅");
    } catch (err) {
        console.log("Telegram Error ❌");
        console.log(err.response?.data || err.message);
    }
}

module.exports = { sendTelegram };
