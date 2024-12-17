const axios = require('axios');

// Replace this with your question
const question = "Classify the following sentence into one of these categories: hate speech, offensive language, web link, advertisement, or normal speech. Provide only the category as the output. Sentence: you cant do this go and die";

// Construct the URL
const url = `https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(question)}`;

// Make the Axios GET request
axios.get(url)
  .then(response => {
    // Check if response data contains 'reply' field
    if (response.data && response.data.reply) {
      console.log("Category: " + response.data.reply);
    } else {
      console.log("Error: API response doesn't contain expected 'reply' field.");
    }
  })
  .catch(error => {
    // Log the error message
    console.error("Error occurred:", error.message);
  });
