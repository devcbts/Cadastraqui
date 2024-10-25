const { atom } = require("recoil");

const candidateViewAtom = atom({
    key: 'candidateview',
    default: {
        currentApplication: '',
        currentCandidate: ''
    }
})

export default candidateViewAtom