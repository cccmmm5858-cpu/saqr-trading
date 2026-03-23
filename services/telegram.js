const axios = require('axios');

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegram(message) {
    try {
        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

        const response = await axios.post(url, {
            chat_id: CHAT_ID,
            text: message,
        });

        console.log('Telegram sent:', response.data);
    } catch (error) {
        console.error('Telegram error:', error.response?.data || error.message);
    }
}

module.exports = { sendTelegram };
