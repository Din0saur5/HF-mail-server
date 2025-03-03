import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors({origin: "*"})); // Allows frontend to call API

const RESEND_API_KEY = process.env.RESEND_API_KEY; // Store in .env

app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "sales@higher-forms.com", // Change to your verified domain
        to: to,
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(3000, () => console.log("🔥 Server running on port 3000"));
