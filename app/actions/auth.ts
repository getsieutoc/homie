import { createTransport } from 'nodemailer';
import * as postmark from 'postmark';

const postmarkClient = new postmark.ServerClient(
  process.env.POSTMARK_API_TOKEN || ''
);

export async function sendVerificationRequest({
  identifier,
  url,
  provider
}: {
  identifier: string;
  url: string;
  provider: { from: string };
}) {
  const { host } = new URL(url);

  try {
    await postmarkClient.sendEmail({
      From: provider.from,
      To: identifier,
      Subject: `Sign in to ${host}`,
      HtmlBody: `
        <body style="background: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #333; margin-bottom: 20px;">Sign in to ${host}</h1>
            <p style="color: #666; margin-bottom: 20px;">Click the button below to sign in to your account:</p>
            <a href="${url}" 
               style="display: inline-block; padding: 12px 24px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">
              Sign in
            </a>
            <p style="color: #999; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
          </div>
        </body>
      `,
      TextBody: `Sign in to ${host}\n${url}\n\n`,
      MessageStream: 'outbound'
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
