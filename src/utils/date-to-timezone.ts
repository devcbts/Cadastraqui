import { format, fromZonedTime } from "date-fns-tz";

export default function dateToTimezone(date: Date) {
    const valueStr = format(date, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Sao_Paulo' })
    console.log('formatted', valueStr)
    const currentDate = fromZonedTime(valueStr, 'America/Sao_Paulo')
    console.log('current data', currentDate)
    return currentDate
}