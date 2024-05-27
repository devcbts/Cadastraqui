const { atom } = require("recoil");

const headerAtom = atom({
    key: 'header',
    default: {
        sidebar: true,
    }
})

export default headerAtom