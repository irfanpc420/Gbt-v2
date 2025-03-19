const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "info",
        version: "1.0",
        author: "NTKhang",
        countDown: 20,
        role: 0,
        shortDescription: { vi: "", en: "" },
        longDescription: { vi: "", en: "" },
        category: "owner",
        guide: { en: "" },
        envConfig: {}
    },

    onStart: async function ({ message }) {
        // Author Information
        const authorInfo = {
            name: "⩸𝙸𝚛𝚏𝚊𝚗 𝙰𝚑𝚖𝚎𝚍⩸",
            age: "『 ⩸__21+__⩸ 』",
            relationshipStatus: "⩸__🆂🅸🅽🅶🅻🅴__⩸",
            messenger: "https://m.me/xxxx",
            facebook: "https://www.facebook.com/psychopath.irfan.io",
            whatsapp: "+6585062351",
            telegram: "https://t.me/irfan420x",
            instagram: "https://www.instagram.com/toxic_4_2_0?igsh=MWNweXg0OGJuMDJxYw=="
        };

        // Random Image URL
        const urls = [
            "https://i.postimg.cc/J7c2d0KG/images-8.jpg",
            "https://i.postimg.cc/J7c2d0KG/images-8.jpg",
            "https://i.postimg.cc/J7c2d0KG/images-8.jpg",
            "https://i.postimg.cc/J7c2d0KG/images-8.jpg"
        ];
        const randomImage = urls[Math.floor(Math.random() * urls.length)];

        // Date and Time
        const now = moment().tz('Asia/Dhaka');
        const date = now.format('MMMM Do YYYY');
        const time = now.format('h:mm:ss A');

        // Bot Uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / (60 * 60 * 24));
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const minutes = Math.floor((uptime / 60) % 60);
        const seconds = Math.floor(uptime % 60);
        const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

        // Construct Message Body
        const response = `
💫《 ⩸__𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧__⩸ 》💫

💙 **OWNER NAME**: ${authorInfo.name}

💥 **Telegram**: ${authorInfo.telegram}

✅ **Instagram**: ${authorInfo.instagram}

📝 **AGE**: ${authorInfo.age}

💕 **RELATIONSHIP STATUS**: ${authorInfo.relationshipStatus}

🌐 **WhatsApp**: ${authorInfo.whatsapp}

🌍 **Facebook**: ${authorInfo.facebook}

🔰 **Any Help Contact**: ${authorInfo.messenger}


💫《 ⩸__𝐁𝐨𝐭 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧__⩸ 》💫

🤖 **BOT NAME**: ⩸__${global.GoatBot.config.nickNameBot}__⩸

👾 **BOT SYSTEM PREFIX**: ${global.GoatBot.config.prefix}

🗓 **DATE**: ${date}

⏰ **CURRENT TIME**: ${time}

📛 **BOT UPTIME**: ${uptimeString}
        `;

        // Send Reply with Image
        message.reply({
            body: response,
            attachment: await global.utils.getStreamFromURL(randomImage)
        });
    },

    onChat: async function ({ event, message }) {
        if (event.body && event.body.toLowerCase() === "info") {
            this.onStart({ message });
        }
    }
};
