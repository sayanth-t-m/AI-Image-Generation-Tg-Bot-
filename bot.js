const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Initialize your Telegram bot with polling
const token = '8096815925:AAFLC_W_WKziB_DRmIZsm5pXyzsqykh27Q8'; // Replace with your bot's token
const bot = new TelegramBot(token, { polling: true });

const getReply = async (texts) => {
  if (texts) {
    const url = `https://hercai.onrender.com/v3/hercai?question=Classify the following sentence into one of these categories: hate speech, offensive language, web link, advertisement, or normal speech. Provide only the category as the output. Sentence: ${encodeURIComponent(texts)}`;
    try {
      const response = await axios.get(url);
      
      // Check if response data contains 'reply' field
      if (response.data && response.data.reply) {
        return response.data.reply;
      } else {
        return "Error: API response doesn't contain expected 'reply' field.";
      }
    } catch (error) {
      throw new Error("Error occurred: " + error.message);
    }
  }
};

// Listen for any kind of message
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Handle /start command
  if (/\/start/.test(text)) {
    bot.sendMessage(chatId, 'Welcome to the bot!');
    return;
  } else {
    try {
      const reply = await getReply(text);
      bot.sendMessage(chatId, reply);
    } catch (error) {
      bot.sendMessage(chatId, "An error occurred. Please try again later.");
    }
  }
});
