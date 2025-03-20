const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "2.0", // Updated version
        author: "NTKhang (Enhanced by Irfan)", // Updated credits
        category: "events"
    },

    langs: {
        vi: {
            session1: "sáng",
            session2: "trưa",
            session3: "chiều",
            session4: "tối",
            welcomeMessage: "✨ Cảm ơn bạn đã mời tôi vào nhóm!\n📝 Prefix bot: %1\n📖 Để xem danh sách lệnh hãy nhập: %1help",
            multiple1: "bạn",
            multiple2: "các bạn",
            defaultWelcomeMessage: "🌟 Xin chào {userName}.\n🎉 Chào mừng bạn đến với {boxName}.\n🌈 Chúc bạn có buổi {session} thật tuyệt vời và hạnh phúc! 🌞"
        },
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "✨ Thank you for inviting me to the group!\n📝 Bot prefix: %1\n📖 To view the list of commands, please enter: %1help",
            multiple1: "you",
            multiple2: "you all",
            defaultWelcomeMessage: `🌟 Hello {userName}.\n🎉 Welcome {multiple} to the chat group: {boxName}\n🌈 Have a wonderful {session}, filled with joy and positivity! 🌞`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType == "log:subscribe")
            return async function () {
                const hours = getTime("HH");
                const { threadID } = event;
                const { nickNameBot } = global.GoatBot.config;
                const prefix = global.utils.getPrefix(threadID);
                const dataAddedParticipants = event.logMessageData.addedParticipants;

                // If new member is bot
                if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
                    if (nickNameBot)
                        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                    let welcomeMsg = getLang("welcomeMessage", prefix);
                    welcomeMsg = wrapMessageInBoxWithFonts(welcomeMsg); // Wrap the message in a box with fonts
                    return message.send(welcomeMsg);
                }

                // If new member:
                if (!global.temp.welcomeEvent[threadID])
                    global.temp.welcomeEvent[threadID] = {
                        joinTimeout: null,
                        dataAddedParticipants: []
                    };

                // Push new member to array
                global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);

                // Clear previous timeout if exists
                clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

                // Set new timeout
                global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
                    const threadData = await threadsData.get(threadID);
                    if (threadData.settings.sendWelcomeMessage == false)
                        return;

                    const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                    const dataBanned = threadData.data.banned_ban || [];
                    const threadName = threadData.threadName;
                    const userName = [],
                        mentions = [];
                    let multiple = false;

                    if (dataAddedParticipants.length > 1)
                        multiple = true;

                    for (const user of dataAddedParticipants) {
                        if (dataBanned.some((item) => item.id == user.userFbId))
                            continue;
                        userName.push(user.fullName);
                        mentions.push({
                            tag: user.fullName,
                            id: user.userFbId
                        });
                    }

                    // Replace placeholders in welcome message
                    if (userName.length == 0) return;
                    let { welcomeMessage = getLang("defaultWelcomeMessage") } =
                        threadData.data;
                    const form = {
                        mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
                    };
                    welcomeMessage = welcomeMessage
                        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                        .replace(/\{boxName\}|\{threadName\}/g, threadName)
                        .replace(
                            /\{multiple\}/g,
                            multiple ? getLang("multiple2") : getLang("multiple1")
                        )
                        .replace(
                            /\{session\}/g,
                            hours <= 10
                                ? getLang("session1")
                                : hours <= 12
                                    ? getLang("session2")
                                    : hours <= 18
                                        ? getLang("session3")
                                        : getLang("session4")
                        );

                    form.body = wrapMessageInBoxWithFonts(welcomeMessage.replace(/%1/g, prefix)); // Wrap the message in a box with fonts

                    // Handle attachments
                    if (threadData.data.welcomeAttachment) {
                        const files = threadData.data.welcomeAttachment;
                        const attachments = files.reduce((acc, file) => {
                            acc.push(drive.getFile(file, "stream"));
                            return acc;
                        }, []);
                        form.attachment = (await Promise.allSettled(attachments))
                            .filter(({ status }) => status == "fulfilled")
                            .map(({ value }) => value);
                    }

                    // Send the welcome message
                    message.send(form);
                    delete global.temp.welcomeEvent[threadID];
                }, 1500);
            };
    }
};

// Function to wrap message in a box with different font styles
function wrapMessageInBoxWithFonts(message) {
    const lines = message.split("\n");
    const styledLines = lines.map((line, index) => {
        // Apply different font styles to each line
        if (index % 3 === 0) {
            // Normal text
            return `| ${line} |`;
        } else if (index % 3 === 1) {
            // Italic text
            return `| 𝑬𝒕𝒂 ${line} |`;
        } else {
            // Bold text
            return `| 𝑬𝘵𝘢 ${line} |`;
        }
    });

    const maxLength = Math.max(...styledLines.map(line => line.length));
    const topBottomBorder = "_".repeat(maxLength); // Top and bottom border
    const wrappedLines = styledLines.map(line => line.padEnd(maxLength, " ")); // Add padding
    return `${topBottomBorder}\n${wrappedLines.join("\n")}\n${topBottomBorder}`;
							 }
