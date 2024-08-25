

const TelegramBot = require('node-telegram-bot-api');
const { Hercai } = require('hercai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Initialize your Telegram bot with polling
const token = '7467223675:AAHyUsuPM-VI51MODMUBeVQ4fy0UGHfJUsw'; // Replace with your bot's token// Replace with your bot's token
const bot = new TelegramBot(token, { polling: true });

// Initialize Hercai
const herc = new Hercai(); // You can optionally pass your API key here

// Listen for any kind of message. There are different kinds of messages.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Handle specific commands first
  if (/\/start/.test(text)) {
    bot.sendMessage(chatId, 'Welcome to the bot!');
    return; // Exit early if command is handled
  }

  // Send a "processing..." message
  const processingMessage = await bot.sendMessage(chatId, 'Processing your request, please wait...');

  try {
    // Call Hercai to generate an image based on the user's text
    const response = await herc.drawImage({
      model: "v3", // Replace with the desired model if needed
      prompt: text,
      negative_prompt: ""
    });

    // Check if the response has a URL
    if (response && response.url) {
      // Download the image from the URL
      const imagePath = path.resolve(__dirname, 'downloaded_image.jpg');
      const writer = fs.createWriteStream(imagePath);

      const imageResponse = await axios({
        url: response.url,
        method: 'GET',
        responseType: 'stream'
      });

      imageResponse.data.pipe(writer);

      // Wait for the download to finish
      writer.on('finish', async () => {
        try {
          // Send the downloaded image to the user
          await bot.sendPhoto(chatId, imagePath);

          // Edit the "processing..." message to inform the user that the image is ready
          await bot.editMessageText('Your image is ready!', {
            chat_id: chatId,
            message_id: processingMessage.message_id
          });

          // Optionally, delete the downloaded image file after sending
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error('Error sending photo:', error);
          bot.sendMessage(chatId, 'Sorry, there was an error sending your image.');
        }
      });

      writer.on('error', (error) => {
        console.error('Error downloading the image:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error downloading the image.');
      });

    } else {
      await bot.editMessageText('Sorry, I could not generate an image.', {
        chat_id: chatId,
        message_id: processingMessage.message_id
      });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    await bot.editMessageText('There was an error generating your image. Please try again.', {
      chat_id: chatId,
      message_id: processingMessage.message_id
    });
  }
});

// Example of handling specific commands (optional)
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the bot!');
});
