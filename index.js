const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "mon_secret_123";
const ACCESS_TOKEN = EAAX0yRex7xgBRrECHlJXn6Ve9EhqO1JJNqSYIaVUD6RPnF2Y3FQ8GJPnA4ZAdhkgp5O6wQF1E2z5cpyX0CKVeGiu0FwGJD07MYbapiOE761LjbtakHQuQOQY8pXpVJG5sOJdqFJL4HfhUdmUzVflFJtsjihtN95tU4zIvOHF9yoIROCd70nq5676nR0B1rTa2vCh2nlZCQp08NxfpeZBSYYvsHbcheBE1ll8UL7JSWAnms5LwZDZD";
const PHONE_NUMBER_ID = "1198715203314692";

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
      res.send(req.query['hub.challenge']);
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
                                  if (text.includes('commande')) reply = "📦 Envoyez le nom du produit et la quantité.";
                                      else if (text.includes('livraison')) reply = "🚚 Livraison 24-48h après confirmation.";
                                          else if (text.includes('prix')) reply = "💰 Envoyez le nom du produit pour le prix.";
                                              else if (text.includes('annuler')) reply = "❌ Donnez votre numéro de commande.";
                                                  await sendMessage(from, reply);
                                                    }
                                                      res.sendStatus(200);
                                                      });

                                                      async function sendMessage(to, text) {
                                                        await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
                                                            method: 'POST',
                                                                headers: {
                                                                      'Authorization': `Bearer ${ACCESS_TOKEN}`,
                                                                            'Content-Type': 'application/json'
                                                                                },
                                                                                    body: JSON.stringify({
                                                                                          messaging_product: 'whatsapp',
                                                                                                to, type: 'text',
                                                                                                      text: { body: text }
                                                                                                          })
                                                                                                            });
                                                                                                            }

                                                                                                            app.listen(3000, () => console.log('Bot démarré !'));