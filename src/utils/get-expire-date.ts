export default function getExpireDate(fileType: string, metadata: any) {
    if (!metadata.date) { return null }
    const [year, month, day] = metadata.date.split('T')[0].split('-')
    const date = new Date(`
              ${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00
              `.trim())
    let deadlineMonths;
    switch (fileType) {
        case "statement":
            deadlineMonths = 4
            break
        case "monthly-income":
            deadlineMonths = 7
            break
        case "registrato":
        case "pix":
            deadlineMonths = 3
            break;
        default:
            deadlineMonths = null
            break
    }
    if (deadlineMonths === null) { return null }
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + deadlineMonths, 1, 0, 0, 0, 0)
    const expiresAt = nextMonth
    console.log('FILE SENT', fileType, 'METADATAS:', metadata, 'DEADLINE', expiresAt)
    return expiresAt
}