const { atom } = require("recoil");

const headerAtom = atom({
    key: 'header',
    default: {
        sidebar: true,
        type: null
    }
})

export default headerAtom