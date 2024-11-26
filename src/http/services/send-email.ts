import { prisma } from '@/lib/prisma';
import { HistoryRequester } from '@prisma/client';
import nodemailer from 'nodemailer';

const sendEmail = async ({
    subject,
    to,
    text,
    body,
    deadline,
    createdBy,
    user_id
}: { subject: string, to: string[] | string, text?: string, body: string,deadline?: Date, createdBy? : HistoryRequester, user_id?: string}) => {
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
    const newMail = await prisma.emailsSent.create({
        data: {
            subject,
            email: Array.isArray(to) ? to : [to],
            content: body,
            deadline,
            createdBy,
            user_id
        }
    }
    )
    // Envia o Email 
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