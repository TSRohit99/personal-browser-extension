const express = require("express");
const app = express();
const cors = require("cors");
const run = require("./integrateGemini");
require('dotenv').config();


const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend of personal extention");
});


app.get("/generate", async (req, res) => {
    const topic = req.query.topic; 
    
    try {
      const result = await run(topic);
      res.status(200).json(result); // Send JSON response
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({ error: "Issues in query or backend" }); // Send JSON error response
    }
  });

app.listen(port, async () => {
    console.log(`Running on port ${port}`);
    
  });