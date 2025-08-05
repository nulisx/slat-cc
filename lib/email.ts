import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
})

type MailerSendProps = {
  subject: string
  username: string
  recipient: string
  html: string
}

export async function sendEmail({ recipient, subject, username, html }: MailerSendProps) {
  const sender = new Sender('noreply@slat.cc', 'slat.cc')
  const recipients = [new Recipient(recipient, username)]

  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(recipients)
    .setReplyTo(sender)
    .setSubject(subject)
    .setHtml(html)

  await mailerSend.email.send(emailParams)
}
