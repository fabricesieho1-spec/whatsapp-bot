const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;
    const text = message.text?.body?.toLowerCase();
    let reply = "Bonjour ! Comment puis-je vous aider ?";

    if (text.includes('commande')) {
      reply = "📦 Envoyez votre commande, je vous traite ça !";
    }

    await require('axios').post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      { messaging_product: "whatsapp", to: from, text: { body: reply } },
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log('Bot démarré !'));
