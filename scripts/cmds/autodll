const axios = require("axios");
const fs = require("fs-extra");
const tinyurl = require("tinyurl");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/xnil6x404/Api-Zone/refs/heads/main/Api.json");
  return base.data.xnil2;
};

const config = {
  name: "autodl",
  version: "2.0",
  author: "xnil", // API by xnil
  credits: "Dipto",
  description: "Auto download video from Tiktok, Facebook, Instagram, YouTube, and more",
  category: "media",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  dependencies: {
    "tinyurl": "",
    "fs-extra": "",
  },
};

const onStart = () => {};

const onChat = async ({ api, event }) => {
  let dipto = event.body ? event.body : "",
    ex,
    cp;

  try {
    if (
      dipto.startsWith("https://vt.tiktok.com") ||
      dipto.startsWith("https://www.tiktok.com/") ||
      dipto.startsWith("https://www.facebook.com") ||
      dipto.startsWith("https://www.instagram.com/") ||
      dipto.startsWith("https://youtu.be/") ||
      dipto.startsWith("https://youtube.com/") ||
      dipto.startsWith("https://x.com/") ||
      dipto.startsWith("https://www.instagram.com/p/") ||
      dipto.startsWith("https://pin.it/") ||
      dipto.startsWith("https://twitter.com/") ||
      dipto.startsWith("https://vm.tiktok.com") ||
      dipto.startsWith("https://fb.watch")
    ) {
      const w = await api.sendMessage("Wait Bby <😘", event.threadID);

      const response = await axios.get(`${await baseApiUrl()}/alldl?url=${encodeURIComponent(dipto)}`);
      const d = response.data.content;

      if (d.result && d.result.includes(".jpg")) {
        ex = ".jpg";
        cp = "Here's your Photo <😘";
      } else if (d.result && d.result.includes(".png")) {
        ex = ".png";
        cp = "Here's your Photo <😘";
      } else if (d.result && d.result.includes(".jpeg")) {
        ex = ".jpeg";
        cp = "Here's your Photo <😘";
      } else {
        ex = ".mp4";
        cp = d.cp || "Here's your video";
      }

      const path = `${__dirname}/cache/video${ex}`;
      fs.ensureDirSync(`${__dirname}/cache`);
      fs.writeFileSync(path, Buffer.from((await axios.get(d.url, { responseType: "arraybuffer" })).data, "binary"));

      const shortUrl = await tinyurl.shorten(d.result || d.url);

      api.unsendMessage(w.messageID);

      await api.sendMessage(
        {
          body: `${cp}\n✅ | Link: ${shortUrl || "No link available"}`,
          attachment: fs.createReadStream(path),
        },
        event.threadID,
        () => fs.unlinkSync(path),
        event.messageID
      );
    }
  } catch (err) {
    api.setMessageReaction("❌", event.messageID, true);
    console.log(err);
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports = {
  config,
  onChat,
  onStart,
  run: onStart,
  handleEvent: onChat,
};
