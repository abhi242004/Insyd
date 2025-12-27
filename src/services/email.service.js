import nodemailer from "nodemailer";
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
});

/**
 * Send a personalized AI-generated email to a lead.
 * @param {string} to - Lead's email address
 * @param {Object} leadData - Data about the lead, e.g., message, company, interests
 */
export async function sendEmail(to, leadData) {
  try {
    // Generate email content using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an expert sales email copywriter for AuraTech Solutions, a demo company offering innovative tech products.
Products:
- AuraDesk: AI-powered smart desk for productivity.
- AuraLight: Smart lighting system for home and office.
- AuraFlow: Workflow automation software for small businesses.

Your task: 
Generate a personalized email for a potential lead.
- Use the lead's message or interest from leadData.message.
- Highlight relevant products and features.
- Include a clear call-to-action to engage the lead.
- Keep it friendly, professional, and persuasive.
- Return ONLY valid JSON in this format: { "subject": "...", "html": "..." }
          `,
        },
        {
          role: "user",
          content: `Lead Data: ${JSON.stringify(leadData)}`
        },
      ],
      temperature: 0.3,
    });

    const text = response.choices[0].message.content;
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    // Send email
    await transporter.sendMail({
      from: `"AuraTech Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject: parsed.subject,
      html: parsed.html,
    });

    console.log(`📧 AI Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
}