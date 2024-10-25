import nodeSchedule from 'node-schedule';
import sendEmail from '../http/services/send-email';
import { prisma } from "../lib/prisma";

const sendStudentUpdateEmail = async () => {
    try {
        const interval = new Date()
        interval.setDate(interval.getDate() - 15)
        const students = await prisma.student.findMany({
            where: {
                AND: [
                    {
                        candidate: {
                            OR: [
                                {
                                    responsible: {
                                        FinishedRegistration: {
                                            OR: [
                                                { cadastrante: false },
                                                { saude: false },
                                                { rendaMensal: false },
                                                { veiculos: false },
                                                { despesas: false },
                                                { grupoFamiliar: false },
                                                { moradia: false },
                                                { declaracoes: false },
                                            ]
                                        }
                                    }
                                },
                                {
                                    FinishedRegistration: {
                                        OR: [
                                            { cadastrante: false },
                                            { saude: false },
                                            { rendaMensal: false },
                                            { veiculos: false },
                                            { despesas: false },
                                            { grupoFamiliar: false },
                                            { moradia: false },
                                            { declaracoes: false },
                                        ]
                                    }
                                }
                            ]
                        },
                    },
                    {
                        EmailsSent: {
                            none: {
                                AND: [
                                    { createdAt: { gte: interval } },
                                    { type: "RegisterUpdate" }
                                ]
                            }
                        }
                    }
                ]
            },
            include: { candidate: true }
        })
        console.log('ENVIANDO EMAIL PARA ', students, 'ALUNOS')
        for (const student of students) {
            if (!student.candidate.email) { continue }
            prisma.$transaction(async (tPrisma) => {
                await tPrisma.studentEmail.create({
                    data: {
                        type: "RegisterUpdate",
                        student_id: student.id,
                    }
                })
                sendEmail({
                    subject: 'Atualize seus dados',
                    to: student.candidate.email!,
                    body: `
                    <h1>Atualize seus dados</h1>
                    <h2>Atenção ${student.name}, seu cadastro ainda não foi atualizado!</h2>
                    <p>
                    <a href="https://www.cadastraqui.com.br/">Clique aqui</a> e faça login para poder completar suas informações!
                    </p>
                    `
                }).then(v => console.log('Email enviado', v))
            })
        }
    } catch (err) {

    }
}

const sendStudentUpdateEmailJob: nodeSchedule.Job = nodeSchedule.scheduleJob("* * * * * 1", async () => {
    sendStudentUpdateEmail();
});

export default sendStudentUpdateEmailJob