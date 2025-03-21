import sendEmail from "@/http/services/send-email"
import { EntityDocuments, EntityDocumentType, LegalDocumentEmail } from "@prisma/client"
import { Job, scheduleJob } from "node-schedule"
import { prisma } from "../lib/prisma"
export const monthlyIntervalByDocumentType: Partial<Record<EntityDocumentType, number[]>> = {
    'CEBAS': [9, 6, 3],
}
const needToSendEmail = async (doc: Partial<EntityDocuments> & { EmailsSent: LegalDocumentEmail[] } & { User: { email: string } | null }) => {
    if (!doc.User) {
        return null
    }
    const monthlyInterval = monthlyIntervalByDocumentType[doc.type!] ?? [1]
    const lastCycle = doc.EmailsSent[0]?.cycle
    if (lastCycle === monthlyInterval.length) {
        return null
    }
    // check if current cycle hasn't been sent
    const today = new Date();
    const expireDate = new Date(doc.expireAt!);

    // months left to document expire
    const monthsLeft = (expireDate.getFullYear() - today.getFullYear()) * 12 + (expireDate.getMonth() - today.getMonth());
    // get the current cycle of emails sent
    // interval -  get the next email cycle based on current cycle (if there's one)
    // if doc email has already been sent, get the last email cycle (starts at 1)
    // if not, get the closest cycle possible
    const interval = !!doc.EmailsSent[0]
        ? monthlyInterval[doc.EmailsSent[0].cycle]
        : monthlyInterval.find(x => x === monthsLeft)
    if (interval !== monthsLeft) {
        return null
    }
    const cycle = monthlyInterval.indexOf(interval) + 1
    await prisma.legalDocumentEmail.create({
        data: {
            document_id: doc.id!,
            emails: [doc.User.email],
            cycle
        }
    })
    return interval
}
export async function checkExpiringEntityDocuments() {
    try {
        const minDeadline = new Date()
        minDeadline.setMonth(minDeadline.getMonth() + 1)
        const { singleDocuments, groupDocuments } = await prisma.$transaction(async tPrisma => {
            const singleDocuments = await tPrisma.entityDocuments.findMany({
                where: {
                    AND: [
                        {
                            expireAt: {
                                not: null,
                                gte: minDeadline
                            }
                        },
                        { group: null },
                        { User: { isNot: null } }
                    ]

                },
                select: {
                    id: true,
                    type: true,
                    expireAt: true,
                    User: { select: { email: true } },
                    EmailsSent: {
                        orderBy: { cycle: 'desc' }
                    }
                }
            });
            const maxExpirePerGroup = await tPrisma.entityDocuments.groupBy({
                by: 'group',
                _max: {
                    expireAt: true,
                },
                where: {
                    AND: [
                        {
                            expireAt: {
                                not: null,
                                gte: minDeadline
                            }
                        },
                        { User: { isNot: null } },
                        { group: { not: null } }
                    ]

                },
                orderBy: undefined
            })
            const groupDocuments = await Promise.all(maxExpirePerGroup.map(async (groupData) => {
                return await tPrisma.entityDocuments.findFirst({
                    where: {
                        AND: [
                            { group: groupData.group },
                            { expireAt: groupData._max!.expireAt },
                            { User: { isNot: null } }
                        ]
                    },
                    select: {
                        id: true,
                        type: true,
                        expireAt: true,
                        User: { select: { email: true } },
                        EmailsSent: {
                            orderBy: { cycle: 'desc' }
                        }
                    }
                })
            }
            ))
            return {
                singleDocuments,
                groupDocuments
            }
        })
        Promise.allSettled(singleDocuments
            .concat(groupDocuments.filter(x => !!x) as typeof singleDocuments)
            .map(async x => {

                const interval = await needToSendEmail(x)
                if (interval !== null) {
                    return await sendExpireEmail({
                        emails: [x.User?.email!],
                        expiresIn: interval
                    })
                }
            }))
    } catch (err) {
        console.log(err)
    }
}
const sendExpireEmail = async ({
    expiresIn,
    emails
}: { expiresIn: number, emails: string[] }) => {
    await sendEmail({
        subject: `Validade do documento`,
        body: createTemplate(expiresIn),
        to: emails,

    })
}

const createTemplate = (expiresIn: number) => {
    const displayMonths = expiresIn === 1
        ? `${expiresIn} mês`
        : `${expiresIn} meses`
    return `
      <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #1F4B73; border: 1px solid white; border-radius: 8px; padding: 16px;"
    >
      <tr>
        <td align="center">
          <h1
            style="color: white; font-size: 24px; font-family: Arial, sans-serif; margin: 0;"
          >
            Um documento está para vencer em
            <span style="color: #EF3E36;"
              >${displayMonths}!</span
            >
          </h1>
        </td>
      </tr>
      <tr>
        <td
          align="center"
          style="color: white; font-size: 16px; font-family: Arial, sans-serif; margin: 10px 0;"
        >
          <p>
            Um de seus documentos em <strong>Documentação legal</strong> está com
            vencimento previsto para ${displayMonths}.
          </p>
          <p>
            Lembre-se de realizar um novo envio para manter a documentação
            sempre atualizada.
          </p>
        </td>
      </tr>
      <tr>
        <td align="center">
          <a
            href="https://www.cadastraqui.com.br"
            target="_blank"
            style="color: #1F4B73; font-size: 14px; font-weight: bold; text-decoration: none; background-color: white;
             padding: 10px 15px; border-radius: 4px; display: inline-block; text-transform:Uppercase"
          >
            Acesse aqui
          </a>
        </td>
      </tr>
    </table>
        `
}
const CheckExpiringEntityDocuments: Job = scheduleJob("0 0 2 * * *", async () => {
    await checkExpiringEntityDocuments();
});


export default CheckExpiringEntityDocuments