const { atom } = require("recoil");

const monthAtom = atom({
    key: 'months',
    default: null
})

export default monthAtom