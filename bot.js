const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Initialize your Telegram bot with polling
const token = 'token'; // Replace with your bot's token
const bot = new TelegramBot(token, { polling: true });

const getReply = async (texts) => {
  if(texts){
  const url = `https://hercai.onrender.com/v3/hercai?question= Classify the following sentence into one of these categories: hate speech, offensive language, web link, advertisement, or normal speech. Provide only the category as the output. Sentence: ${encodeURIComponent(texts)}`;
  try {
    const response = await axios.get(url);
    return response.data.reply;
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
  }
  
  
  else{
    const reply = await getReply(text);
    bot.sendMessage(chatId,reply);

  }

  
});
