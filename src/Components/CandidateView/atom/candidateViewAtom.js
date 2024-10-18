const { atom } = require("recoil");

const candidateViewAtom = atom({
    key: 'candidateview',
    default: {
        currentApplication: ''
    }
})

export default candidateViewAtom