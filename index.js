const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "mon_secret_123";
const ACCESS_TOKEN = "EAAX0yRex7xgBRrECHlJXn6Ve9EhqO1JJNqSYIaVUD6RPnF2Y3FQ8GJPnA4ZAdhkgp5O6wQF1E2z5cpyX0CKVeGiu0FwGJD07MYbapiOE761LjbtakHQuQOQY8pXpVJG5sOJdqFJL4HfhUdmUzVflFJtsjihtN95tU4zIvOHF9yoIROCd70nq5676nR0B1rTa2vCh2nlZCQp08NxfpeZBSYYvsHbcheBE1ll8UL7JSWAnms5LwZDZD";
const PHONE_NUMBER_ID = "11987152033314692";

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

    if (text.includes('commande')) reply = "📦 Envoyez le nom du produit.";

    await require('axios').post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      { messaging_product: "whatsapp", to: from, text: { body: reply } },
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
  }
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Bot démarré !'));
