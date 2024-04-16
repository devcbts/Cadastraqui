const monthsArr = ({ length, initialMonth, initialYear }) => Array.from({ length }).map((_, index) => {
    // get current date and subtract the amount of months needed
    const initialDate = initialMonth ? new Date(`${initialMonth}/01/${initialYear}`) : Date.now()
    const currentDate = new Date(initialDate)
    currentDate.setMonth(currentDate.getMonth() - (index + 1))
    return {
        month: (currentDate.getMonth() + 1).toString(),
        year: currentDate.getFullYear().toString(),
        formatDate: currentDate.toLocaleString("pt-br", { month: "long", year: "numeric" })
    }
})

export default monthsArr