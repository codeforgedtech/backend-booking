const twilio = require('twilio');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

module.exports = async (req, res) => {
  const { customerPhone, adminPhone, messageCustomer, messageAdmin } = req.body;

  try {
    // Skicka SMS till kunden
    await client.messages.create({
      body: messageCustomer,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: customerPhone,
    });

    // Skicka SMS till administratören
    await client.messages.create({
      body: messageAdmin,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: adminPhone,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('SMS-skickning misslyckades:', error);
    res.status(500).json({ success: false, error: 'SMS-skickning misslyckades' });
  }
};