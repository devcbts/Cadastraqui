import { tutorialAtom } from "context/tutorialAtom";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export default function useTutorial(videoId) {
    const setValue = useSetRecoilState(tutorialAtom)
    useEffect(() => {
        setValue(videoId)
        return () => {
            setValue(null)
        }
    }, [videoId])
}