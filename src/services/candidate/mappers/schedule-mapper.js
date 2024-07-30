import { getDate, getYear, getMonth, getHours, getMinutes, toDate } from "date-fns"
import { toZonedTime, } from "date-fns-tz";

class ScheduleMapper {
    toPersistence(data) { }
    fromPersistence(data) {
        const datesAndTimes = data?.reduce((acc, curr) => {
            const timezonedDate = toZonedTime(curr.date, 'America/Sao_Paulo')
            console.log(timezonedDate, curr.date)
            const [day, month, year, hour, minute] = [getDate(timezonedDate), getMonth(timezonedDate) + 1, getYear(timezonedDate), getHours(timezonedDate), getMinutes(timezonedDate)]
            let dateEntry = acc.find(entry => {
                const currDate = toDate(entry.date)
                const [c_d, c_m, c_y] = [getDate(currDate), getMonth(currDate) + 1, getYear(currDate)]
                return ((day === c_d) && (month === c_m) && (year === c_y))
            });
            const time = { id: curr.id, time: `${hour}:${minute.toString().padEnd(2, '0')}` }
            if (!dateEntry) {
                dateEntry = { date: timezonedDate, times: [] };
                acc.push(dateEntry);
            }

            dateEntry.times.push(time);
            return acc
        }, [])
        console.log(datesAndTimes)
        return datesAndTimes
    }
}

export default new ScheduleMapper()