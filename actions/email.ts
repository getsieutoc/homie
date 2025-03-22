'use server';

import * as postmark from 'postmark';

const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

type EmailParams = {
  to: string[];
  subject: string;
  content: string;
  from?: string;
};

export const sendEmail = async ({ to, subject, content, from }: EmailParams) => {
  try {
    // Convert newlines to HTML line breaks
    const htmlContent = content.replace(/\n/g, '<br>');

    const response = await postmarkClient.sendEmailBatch(
      to.map((email) => ({
        From: from || process.env.POSTMARK_FROM_EMAIL!,
        To: email,
        Subject: subject,
        HtmlBody: htmlContent,
        MessageStream: 'outbound',
      }))
    );

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
