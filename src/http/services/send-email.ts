import nodemailer from 'nodemailer';

const sendEmail = async ({
    subject,
    to,
    text,
    body
}: { subject: string, to: string[] | string, text?: string, body: string }) => {
    const transport = nodemailer.createTransport({
        // service: "godaddy",
        host: "smtpout.secureserver.net",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        },
    })

    // Envia o Email de redefinição de senha
    const info = await transport.sendMail({
        from: process.env.SMTP_EMAIL,
        to: to,
        subject,
        text,
        html: body,
    })
    const messageId = info.messageId

    return { messageId }
}

export default sendEmail