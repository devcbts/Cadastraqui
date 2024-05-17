const { atom } = require("recoil");

const incomeAtom = atom({
    key: 'incomes',
    default: null
})

export default incomeAtom