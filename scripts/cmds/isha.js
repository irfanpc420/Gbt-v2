const axios = require('axios');

module.exports = {
  config: {
    name: "isha",
    credits: "Irfan", // ক্রেডিট হিসেবে Irfan যোগ করা হয়েছে
    category: "ai"
  },

  onStart: async function({ api, event, args }) {
    let { threadID, messageID } = event;

    // ইউজারের মেসেজ থেকে প্রশ্ন বের করা হচ্ছে
    const query = args.join(" ");
    if (!query) return api.sendMessage("⚠️ Please provide a question or message for Isha!", threadID, messageID);

    // ইউজারের ID ডায়নামিকভাবে নেওয়া হচ্ছে
    const uid = event.senderID; // ইউজারের আইডি (ফেসবুক বা প্ল্যাটফর্ম ভিত্তিক)

    // প্রথমে ইউজারকে জানানো হবে যে উত্তর খোঁজা হচ্ছে
    api.sendMessage("⏳ Isha is thinking, please wait...", threadID, async (err, info) => {
      if (err) return console.error(err);

      try {
        // API কল করা হচ্ছে
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/catgpt`, {
          params: { 
            ask: query, // ইউজারের প্রশ্ন
            uid: uid   // ইউজারের আইডি
          }
        });

        // API থেকে রেজাল্ট বের করা হচ্ছে
        const answer = response.data?.response || null;

        // যদি উত্তর থাকে, তাহলে ইউজারকে উত্তর পাঠানো হবে
        if (answer) {
          api.sendMessage(`✅ Isha says: ${answer}`, threadID, messageID);
        } else {
          // উত্তর না থাকলে এই মেসেজ পাঠানো হবে
          api.sendMessage("❌ Failed to get a response from Isha. Please try again later.", threadID, messageID);
        }

      } catch (error) {
        console.error("Error Details:", error.message);
        console.error("Full Error:", error);
        // এখানে আমরা ব্যর্থ রেস্পন্স মেসেজটি বাদ দিয়েছি
      }
    });
  }
};
