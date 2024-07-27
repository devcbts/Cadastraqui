import { getDate, getYear, getMonth, getHours, getMinutes, toDate } from "date-fns"

class ScheduleMapper {
    toPersistence(data) { }
    fromPersistence(data) {
        const datesAndTimes = data?.reduce((acc, curr) => {
            const [day, month, year, hour, minute] = [getDate(curr.date), getMonth(curr.date) + 1, getYear(curr.date), getHours(curr.date), getMinutes(curr.date)]
            let dateEntry = acc.find(entry => {
                const currDate = toDate(entry.date)
                const [c_d, c_m, c_y] = [getDate(currDate), getMonth(currDate) + 1, getYear(currDate)]
                return ((day === c_d) && (month === c_m) && (year === c_y))
            });
            const time = { id: curr.id, time: `${hour}:${minute.toString().padEnd(2, '0')}` }
            if (!dateEntry) {
                dateEntry = { date: new Date(`${year}-${month}-${day}T00:00:00`), times: [] };
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