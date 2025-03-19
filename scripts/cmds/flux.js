const axios = require('axios');
const fs = require('fs-extra'); // fs-extra ব্যবহার করা হচ্ছে

module.exports = {
  config: {
    name: "flux",
    credits: "Irfan", // ক্রেডিট হিসেবে Irfan যোগ করা হয়েছে
    category: "ai"
  },

  onStart: async function({ api, event, args }) {
    let { threadID, messageID } = event;
    let query = args.join(" ");
    if (!query) return api.sendMessage("⚠️ Please provide a text/query!", threadID, messageID);

    // প্রথমে ইউজারকে জানানো হবে যে ইমেজ জেনারেট করা হচ্ছে
    api.sendMessage("⏳ Generating image, please wait...", threadID, async (err, info) => {
      if (err) return console.error(err);

      // ফোল্ডার পথ সেট করা হচ্ছে
      const cacheDir = __dirname + "/cache";
      const imagePath = `${cacheDir}/flux_${Date.now()}.png`;

      try {
        // চেক করুন যে ফোল্ডারটি আছে কি না, না থাকলে তৈরি করুন
        if (!fs.existsSync(cacheDir)) {
          await fs.mkdir(cacheDir, { recursive: true });
        }

        // API কল করা হচ্ছে
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/flux`, {
          params: { prompt: query }, // প্রম্পট পাঠানো হচ্ছে
          responseType: "arraybuffer", // ইমেজ ডেটা গ্রহণ করা হচ্ছে
        });

        // ইমেজ ফাইল হিসেবে সেভ করা হচ্ছে
        await fs.writeFile(imagePath, Buffer.from(response.data, "binary"));

        // ইউজারকে ইমেজ পাঠানো হচ্ছে
        api.sendMessage({
          body: "✅ Here's your generated image!",
          attachment: fs.createReadStream(imagePath)
        }, threadID, () => {
          fs.unlinkSync(imagePath); // ইমেজ পাঠানোর পর ফাইল ডিলিট করে দেওয়া হবে
        }, messageID);

      } catch (error) {
        console.error("Error Details:", error.message);
        api.sendMessage("❌ Failed to generate image. Please try again later.", threadID, messageID);
      }
    });
  }
};
