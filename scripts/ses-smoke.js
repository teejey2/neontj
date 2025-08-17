// scripts/ses-smoke.js
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

(async () => {
  try {
    const client = new SESClient({ region: process.env.AWS_REGION });
    const FROM = process.env.SES_FROM;
    const TO = process.env.SES_TO.split(",").map(s => s.trim());
    const out = await client.send(new SendEmailCommand({
      Destination: { ToAddresses: TO },
      Source: FROM,
      Message: { Subject: { Data: "SES Smoke Test" }, Body: { Text: { Data: "If you got this, creds + region are correct." } } }
    }));
    console.log("SES OK:", out.MessageId);
  } catch (e) {
    console.error("SES FAIL:", { name: e.name, message: e.message, code: e.Code || e.code, meta: e.$metadata });
    process.exit(1);
  }
})();
