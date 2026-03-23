const https = require('https');

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

function sendTelegram(message) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
        });

        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log('Telegram response:', body);
                resolve(body);
            });
        });

        req.on('error', (error) => {
            console.error('Telegram error:', error);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

module.exports = { sendTelegram };
