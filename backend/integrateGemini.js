const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run(topic) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  // Generate title
  const titlePrompt = `Create me a small blog title of 10 words length on this topic "${topic}" no bold lines or highlighting only plain text`;
  let response = await model.generateContent(titlePrompt);
  const title = response.response.text();

  // Generate picture URLs
  const picturePrompt = `Suggest 3 image descriptions (not URL) based on this blog title "${title}" no bold lines or highlighting only plain text`;
  response = await model.generateContent(picturePrompt);
  const pictureDescriptions = response.response.text();

  // Generate content
  const contentPrompt = `Create me content of 100 words length based on this title "${title}" no bold lines or highlighting only plain text`;
  response = await model.generateContent(contentPrompt);
  const content = response.response.text();

  return {
    title,
    pictureDescriptions,
    content
  };
}

module.exports = run;