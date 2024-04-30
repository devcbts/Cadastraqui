const monthsArr = ({ length, initialDates = [] }) => {
    // aux array to store old dates
    const storeOldDates = initialDates;
    console.log('inicio', initialDates, length)

    return Array.from({ length }).map((_, index) => {
        const currentDate = new Date();
        currentDate.setDate(1)
        currentDate.setMonth(currentDate.getMonth() - (index + 1));
        return {
            date: currentDate.toLocaleDateString('en-us'),
            formatDate: currentDate.toLocaleString("pt-br", { month: "long", year: "numeric" })
        }
    })

}

export default monthsArr

