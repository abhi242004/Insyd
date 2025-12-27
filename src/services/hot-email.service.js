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
 * Generate AI email draft for HOT lead
 * @param {Object} leadData
 * @returns {Object} { subject, html }
 */
async function generateHotLeadEmail(leadData) {
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

Task:
Generate a personalized email draft for a HOT lead.
- Use leadData.message to understand their interest.
- Highlight relevant products and benefits.
- Include a persuasive call-to-action.
- Keep it friendly, professional, and persuasive.
- Return ONLY valid JSON: { "subject": "...", "html": "..." }
        `,
      },
      {
        role: "user",
        content: `Lead Data: ${JSON.stringify(leadData)}`,
      },
    ],
    temperature: 0.3,
  });

  const text = response.choices[0].message.content;
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

/**
 * Send email for human review before sending to HOT lead
 * @param {Object} leadData
 * @param {string} reviewerEmail - Sales owner/reviewer email
 */
export async function sendHotLeadEmailForReview(leadData, reviewerEmail) {
  try {
    const draft = await generateHotLeadEmail(leadData);

    // Send draft to reviewer
    await transporter.sendMail({
      from: `"AuraTech Solutions - AI Draft" <${process.env.EMAIL_USER}>`,
      to: reviewerEmail,
      subject: `Review Email Draft for Lead: ${leadData.email}`,
      html: `
        <h3>AI-generated email draft for review</h3>
        <p><strong>Lead Message:</strong> ${leadData.message}</p>
        <hr />
        <p><strong>Suggested Subject:</strong> ${draft.subject}</p>
        <p><strong>Suggested HTML:</strong></p>
        ${draft.html}
        <hr />
        <p>Reply to this email with 'APPROVE' in the subject to send to lead, or make edits in the body.</p>
      `,
    });

    console.log(`📧 Draft sent to reviewer: ${reviewerEmail}`);
  } catch (err) {
    console.error("❌ Failed to send draft:", err.message);
  }
}

/**
 * Send approved email to lead
 * @param {string} leadEmail
 * @param {Object} draft - { subject, html }
 */
export async function sendApprovedHotLeadEmail(leadEmail, draft) {
  try {
    await transporter.sendMail({
      from: `"AuraTech Solutions" <${process.env.EMAIL_USER}>`,
      to: leadEmail,
      subject: draft.subject,
      html: draft.html,
    });

    console.log(`✅ HOT lead email sent to ${leadEmail}`);
  } catch (err) {
    console.error("❌ Failed to send email to lead:", err.message);
  }
}