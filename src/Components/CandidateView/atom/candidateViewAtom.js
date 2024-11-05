import { recoilPersist } from "recoil-persist";

const { atom } = require("recoil");

const { persistAtom } = recoilPersist()
const candidateViewAtom = atom({
    key: 'candidateview',
    default: {
        currentApplication: null,
        currentCandidate: null
    },
    effects_UNSTABLE: [persistAtom]
})

export default candidateViewAtom