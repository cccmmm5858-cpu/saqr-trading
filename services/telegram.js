const axios = require('axios');

async function sendTelegram(message) {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message
        });
    } catch (err) {
        console.log("Telegram Error");
    }
}

module.exports = { sendTelegram };
