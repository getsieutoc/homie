import { Client } from 'postmark';

const postmarkClient = new Client(process.env.POSTMARK_API_KEY!);

type EmailParams = {
  to: string[];
  subject: string;
  content: string;
  from?: string;
};

export const sendEmail = async ({ to, subject, content, from }: EmailParams) => {
  try {
    const response = await postmarkClient.sendEmailBatch(
      to.map((email) => ({
        From: from || process.env.POSTMARK_FROM_EMAIL!,
        To: email,
        Subject: subject,
        HtmlBody: content,
        MessageStream: 'outbound',
      }))
    );

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
