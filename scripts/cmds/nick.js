const axios = require('axios');
const fs = require('fs-extra'); // fs-extra ব্যবহার করা হচ্ছে

module.exports = {
  config: {
    name: "nick",
    credits: "Irfan", // ক্রেডিট হিসেবে Irfan যোগ করা হয়েছে
    category: "ai"
  },

  onStart: async function({ api, event, args }) {
    let { threadID, messageID } = event;

    // ইউজার ইনপুট পার্স করা হচ্ছে
    const input = args.join(" ");
    if (!input) return api.sendMessage("⚠️ Please provide a prompt and model number! Example: /nick A cat (1-16)", threadID, messageID);

    // প্রম্পট এবং মডেল নম্বর বের করা হচ্ছে
    const match = input.match(/^(.+?)\s+(\d+)$/);
    if (!match) return api.sendMessage("⚠️ Invalid format! Example: /nick A cat (1-16)", threadID, messageID);

    const query = match[1]; // প্রম্পট
    const model = parseInt(match[2]); // মডেল নম্বর

    // মডেল নম্বর চেক করা হচ্ছে
    if (model < 1 || model > 16) return api.sendMessage("⚠️ Model number must be between 1 and 16.", threadID, messageID);

    // প্রথমে ইউজারকে জানানো হবে যে ইমেজ জেনারেট করা হচ্ছে
    api.sendMessage(`⏳ Generating image using Model ${model}, please wait...`, threadID, async (err, info) => {
      if (err) return console.error(err);

      // ফোল্ডার পথ সেট করা হচ্ছে
      const cacheDir = __dirname + "/cache";
      const imagePath = `${cacheDir}/nick_${Date.now()}.png`;

      try {
        // চেক করুন যে ফোল্ডারটি আছে কি না, না থাকলে তৈরি করুন
        if (!fs.existsSync(cacheDir)) {
          await fs.mkdir(cacheDir, { recursive: true });
        }

        // API কল করা হচ্ছে
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/nuelink`, {
          params: { 
            prompt: query, // প্রম্পট
            model: model   // মডেল নম্বর
          },
          responseType: "arraybuffer", // ইমেজ ডেটা গ্রহণ করা হচ্ছে
        });

        // ইমেজ ফাইল হিসেবে সেভ করা হচ্ছে
        await fs.writeFile(imagePath, Buffer.from(response.data, "binary"));

        // ইউজারকে ইমেজ পাঠানো হচ্ছে
        api.sendMessage({
          body: `✅ Here's your generated image using Model ${model}!`,
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
