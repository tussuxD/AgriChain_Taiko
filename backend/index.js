// const connectToMongo = require("./db");
// const express = require('express')
// const cors = require('cors')

// const app = express()
// const port = 8000
// app.use(express.json());
// app.use(cors())
// //MonogDb Connection
// connectToMongo() ;

// //Available Routes
// app.get("/",(req,res)=>{
//     res.send("Hello")
// })
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/notes', require('./routes/notes'));

// app.listen(port,()=>{
//     console.log(`App listening on http://localhost:${port}`)
// })

const connectToMongo = require("./db");
const express = require('express');
const cors = require('cors');
const twilio = require('twilio'); // Import Twilio

const app = express();
const port = 8000;

// Use middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
connectToMongo();

// Twilio credentials (Replace with your actual credentials)
const accountSid = 'AC022707a9f062a7e07a245e8b52b8ff67';
const authToken = '7d6e4644fdad155c4ed860fe70717278';
const twilioPhoneNumber = '+19562783738';

const client = new twilio(accountSid, authToken);

// Available Routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// New route to send SMS using Twilio
app.post('/api/sendMessage', (req, res) => {
  const { phone } = req.body; // Get the phone number from the request body

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Send the SMS using Twilio
  client.messages
    .create({
      body: 'Hello, someone is interested in your listing!',
      to: phone,  // The recipient phone number
      from: twilioPhoneNumber,  // Your Twilio phone number
    })
    .then((message) => {
      console.log(`Message sent with SID: ${message.sid}`);
      res.status(200).json({ message: 'Message sent successfully' });
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
