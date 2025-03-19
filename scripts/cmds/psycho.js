const axios = require('axios');

module.exports = {
  config: {
    name: "psycho",
    credits: "Irfan", // ক্রেডিট হিসেবে Irfan যোগ করা হয়েছে
    category: "ai"
  },

  onStart: async function({ api, event, args }) {
    let { threadID, messageID } = event;

    // ইউজারের মেসেজ থেকে প্রশ্ন বের করা হচ্ছে
    const query = args.join(" ");
    if (!query) return api.sendMessage("⚠️ Please provide a question or message for Psycho!", threadID, messageID);

    // ইউজারের ID ডায়নামিকভাবে নেওয়া হচ্ছে
    const uid = event.senderID; // ইউজারের আইডি (ফেসবুক বা প্ল্যাটফর্ম ভিত্তিক)

    // প্রথমে ইউজারকে জানানো হবে যে উত্তর খোঁজা হচ্ছে
    api.sendMessage("⏳ Psycho is thinking, please wait...", threadID, async (err, info) => {
      if (err) return console.error(err);

      try {
        // API কল করা হচ্ছে (webSearch=on)
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o`, {
          params: { 
            ask: query,       // ইউজারের প্রশ্ন
            uid: uid,         // ইউজারের আইডি
            webSearch: "on"   // ওয়েব সার্চ চালু রাখা হচ্ছে
          }
        });

        // API থেকে রেজাল্ট বের করা হচ্ছে
        const answer = response.data?.response || "❌ No response received from Psycho.";

        // ইউজারকে উত্তর পাঠানো হচ্ছে
        api.sendMessage(`✅ Psycho says: ${answer}`, threadID, messageID);

      } catch (error) {
        console.error("Error Details:", error.message);
        console.error("Full Error:", error);
        // কোনো ত্রুটি হলে কনসোলে লগ করা হবে কিন্তু ইউজারকে কোনো মেসেজ পাঠানো হবে না
      }
    });
  }
};
