const { atom } = require("recoil");

const headerAtom = atom({
    key: 'header',
    default: {
        hiddenSidebar: false,
        type: null
    }
})

export default headerAtom